use crate::models::event::{Event, CreateEvent, UpdateEvent};
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

