use crate::models::event::{Event, CreateEvent, UpdateEvent};
use crate::models::ticket::{Ticket, CreateTicket};
use crate::AppState;

use actix_web::{post, get, put, web, HttpResponse, Responder};

use chrono::{DateTime, Utc};
use lapin::options::BasicPublishOptions;
use lapin::BasicProperties;
use uuid::Uuid;


#[post("/events")]
async fn create_event(body: web::Json<CreateEvent>, data: web::Data<AppState>) -> impl Responder {

    let query_result = sqlx::query_as!(
        Event,
        "INSERT INTO events (id, name, begins, event_type, capacity_rows, capacity_columns, capacity, location_longitude, location_latitude, location_address, organizator_id, organizator_name, canceled, image_path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
        Uuid::new_v4(),
        body.name.clone(),
        Some(body.begins),
        body.event_type.clone(),
        body.capacity_rows,
        body.capacity_columns,
        body.capacity,
        body.location_longitude,
        body.location_latitude,
        body.location_address,
        body.organizator_id,
        body.organizator_name.clone(),
        false,
        body.image_path.clone()
    ).fetch_one(&data.db)
    .await;
    match query_result {
        Ok(event) => {
            let event_json = serde_json::to_string(&event).unwrap();
            let publish_result = data.amqp_channel.basic_publish(
                "",
                "event_queue",
                BasicPublishOptions::default(),
                event_json.as_bytes(),
                BasicProperties::default(),
            )
            .await;

            match publish_result {
                Ok(_) => {
                    let event_response = serde_json::json!({"status": "success", "data": serde_json::json!({
                        "event": event
                    })});
                    HttpResponse::Ok().json(event_response)
                }
                Err(e) => {
                    HttpResponse::InternalServerError().json(serde_json::json!({"status": "error", "message": format!("Failed to publish event: {:?}", e)}))
                }
            }
        }
        Err(e) => {
            if e.to_string().contains("duplicate key value violates unique constraint") {
                return HttpResponse::BadRequest()
                .json(serde_json::json!({"status": "fail", "message": "Duplicate Key"}))
            }
            return HttpResponse::InternalServerError()
                .json(serde_json::json!({"status": "error", "message": format!("{:?}", e)}));
        }
}


}
#[put("/events/{id}")]
async fn update_event(
    path: web::Path<Uuid>,
    body: web::Json<UpdateEvent>,
    data: web::Data<AppState>,
) -> impl Responder {
    let id = path.into_inner();
    let event = sqlx::query_as!(
        Event,
        "SELECT * FROM events WHERE id = $1",
        id
    )
    .fetch_optional(&data.db)
    .await;

    match event {
        Ok(Some(event)) => {
            let current_time = chrono::Utc::now();
            if let Some(event_time) = event.begins {
                let time_difference = event_time - current_time;
                let time_difference_hours = time_difference.num_hours();
                println!("Time difference in hours: {}", time_difference_hours);
                if event.organizator_id == body.user_id && time_difference >= chrono::Duration::hours(48) {
                    let query_result = sqlx::query!(
                        "UPDATE events SET canceled = true WHERE id = $1",
                        id
                    )
                    .execute(&data.db)
                    .await;

                    match query_result {
                        Ok(_) => {
                            let response = serde_json::json!({
                                "status": "success",
                                "message": "Event canceled successfully"
                            });
                            return HttpResponse::Ok().json(response);
                        }
                        Err(e) => {
                            return HttpResponse::InternalServerError()
                                .json(serde_json::json!({
                                    "status": "error",
                                    "message": format!("{:?}", e)
                                }));
                        }
                    }
                } else {
                    return HttpResponse::BadRequest()
                        .json(serde_json::json!({
                            "status": "fail",
                            "message": "Too late to cancel event or user is not organizator"
                        }));
                }
            } else {
                return HttpResponse::BadRequest()
                    .json(serde_json::json!({
                        "status": "fail",
                        "message": "Invalid reguest"
                    }));
            }
        }
        Ok(None) => {
            return HttpResponse::NotFound()
                .json(serde_json::json!({
                    "status": "fail",
                    "message": "Event not found"
                }));
        }
        Err(e) => {
            return HttpResponse::InternalServerError()
                .json(serde_json::json!({
                    "status": "error",
                    "message": format!("{:?}", e)
                }));
        }
    }
}

#[get("/events/{id}")]
async fn get_event_by_id(
    path: web::Path<Uuid>,
    data: web::Data<AppState>,
) -> impl Responder {
    let id = path.into_inner();
    let event = sqlx::query_as!(
        Event,
        "SELECT * FROM events WHERE id = $1",
        id
    )
    .fetch_optional(&data.db)
    .await;
    match event {
        Ok(Some(event)) => {
            let event_response = serde_json::json!({"status": "success", "data": serde_json::json!({
                "event": event
            })});
            HttpResponse::Ok().json(event_response)
        }
        Ok(None) => {
            HttpResponse::NotFound()
                .json(serde_json::json!({"status": "fail", "message": "Event not found"}))
        }
        Err(e) => {
            HttpResponse::InternalServerError()
                .json(serde_json::json!({"status": "error", "message": format!("{:?}", e)}))
        }
    }
}

#[get("/events")]
async fn get_events(data: web::Data<AppState>) -> impl Responder {
    let query_result = sqlx::query_as!(
        Event,
        "SELECT * FROM events WHERE canceled = false"
    )
    .fetch_all(&data.db)
    .await;
    match query_result {
        Ok(events) => {
            let events_response = serde_json::json!({"status": "success", "data": serde_json::json!({
                "events": events
            })});
            return HttpResponse::Ok().json(events_response);
        }
        Err(e) => {
            return HttpResponse::InternalServerError()
                .json(serde_json::json!({"status": "error", "message": format!("{:?}", e)}));
        }
    }
}

#[post("/tickets")]
async fn create_ticket(
    body: web::Json<CreateTicket>,
    data: web::Data<AppState>,
) -> impl Responder {
    // Start a transaction
    let mut transaction = match data.db.begin().await {
        Ok(tx) => tx,
        Err(e) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "status": "error",
                "message": format!("Failed to start transaction: {:?}", e)
            }));
        }
    };

    // Check if the event_id exists in the events table
    let event_result = sqlx::query!(
        "SELECT id, capacity FROM events WHERE id = $1 FOR UPDATE",
        &body.event_id
    )
    .fetch_optional(&mut *transaction) // Dereference the transaction
    .await;

    match event_result {
        Ok(Some(event)) => {
            let available_capacity = event.capacity - body.quantity.unwrap_or(0);
            if available_capacity >= 0 {
                // Proceed with ticket creation
                let query_result = sqlx::query_as!(
                    Ticket,
                    "INSERT INTO tickets (id, event_id, user_id, quantity, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                    Uuid::new_v4(),
                    body.event_id,
                    body.user_id,
                    body.quantity,
                    Utc::now()
                )
                .fetch_one(&mut *transaction) // Dereference the transaction
                .await;

                match query_result {
                    Ok(ticket) => {
                        // Update event capacity in the database and return the updated event
                        let update_result = sqlx::query_as!(
                            Event,
                            "UPDATE events SET capacity = $1 WHERE id = $2 RETURNING *",
                            available_capacity,
                            event.id
                        )
                        .fetch_one(&mut *transaction) // Dereference the transaction
                        .await;

                        match update_result {
                            Ok(updated_event) => {
                                // Commit the transaction
                                if let Err(e) = transaction.commit().await {
                                    return HttpResponse::InternalServerError().json(serde_json::json!({
                                        "status": "error",
                                        "message": format!("Failed to commit transaction: {:?}", e)
                                    }));
                                }

                                // Send the updated event to the event queue
                                let event_json = serde_json::to_string(&updated_event).unwrap();
                                let publish_event_result = data.amqp_channel.basic_publish(
                                    "",
                                    "event_queue",
                                    BasicPublishOptions::default(),
                                    event_json.as_bytes(),
                                    BasicProperties::default(),
                                )
                                .await;

                                // Send the created ticket to the tickets queue
                                let ticket_json = serde_json::to_string(&ticket).unwrap();
                                let publish_ticket_result = data.amqp_channel.basic_publish(
                                    "",
                                    "tickets_queue",
                                    BasicPublishOptions::default(),
                                    ticket_json.as_bytes(),
                                    BasicProperties::default(),
                                )
                                .await;

                                match (publish_event_result, publish_ticket_result) {
                                    (Ok(_), Ok(_)) => {
                                        let ticket_response = serde_json::json!({
                                            "status": "success",
                                            "data": {
                                                "ticket": ticket
                                            }
                                        });
                                        HttpResponse::Ok().json(ticket_response)
                                    }
                                    _ => {
                                        HttpResponse::InternalServerError().json(serde_json::json!({
                                            "status": "error",
                                            "message": "Failed to publish event or ticket"
                                        }))
                                    }
                                }
                            }
                            Err(e) => {
                                // Rollback transaction on update failure
                                let _ = transaction.rollback().await;
                                HttpResponse::InternalServerError().json(serde_json::json!({
                                    "status": "error",
                                    "message": format!("Failed to update event capacity: {:?}", e)
                                }))
                            }
                        }
                    }
                    Err(e) => {
                        // Rollback transaction on ticket creation failure
                        let _ = transaction.rollback().await;
                        if e.to_string().contains("duplicate key value violates unique constraint") {
                            HttpResponse::BadRequest().json(serde_json::json!({
                                "status": "fail",
                                "message": "Duplicate Key"
                            }))
                        } else {
                            HttpResponse::InternalServerError().json(serde_json::json!({
                                "status": "error",
                                "message": format!("{:?}", e)
                            }))
                        }
                    }
                }
            } else {
                // Insufficient capacity
                let _ = transaction.rollback().await;
                HttpResponse::BadRequest().json(serde_json::json!({
                    "status": "fail",
                    "message": "Insufficient capacity for this event"
                }))
            }
        }
        Ok(None) => {
            // Event not found
            let _ = transaction.rollback().await;
            HttpResponse::BadRequest().json(serde_json::json!({
                "status": "fail",
                "message": "Event with the provided event_id does not exist"
            }))
        }
        Err(e) => {
            // Database query error
            let _ = transaction.rollback().await;
            HttpResponse::InternalServerError().json(serde_json::json!({
                "status": "error",
                "message": format!("{:?}", e)
            }))
        }
    }
}
