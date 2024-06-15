use crate::models::event::{Event, CreateEvent};
use crate::AppState;

use actix_web::{post, get, put, web, HttpResponse, Responder, delete};
use chrono::Utc;
use serde_json::json;
use uuid::Uuid;

#[post("/events")]
async fn create_event(body: web::Json<CreateEvent>, data: web::Data<AppState>) -> impl Responder {

    let query_result = sqlx::query_as!(
        Event,
        "INSERT INTO events (id, name, begins, event_type, capacity_rows, capacity_columns, capacity, location_longitude, location_latitude, location_address, organizator_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
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
        body.organizator_id
    ).fetch_one(&data.db)
    .await;
    match query_result {
        Ok(event) => {
            let event_response = serde_json::json!({"status": "success", "data": serde_json::json!({
                "event": event
            })});
            return HttpResponse::Ok().json(event_response);
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





// #[post("/games/game")]
// async fn create_game(body: web::Json<CreateGameSchema>, data: web::Data<AppState>) -> impl Responder {
//     let query_result = sqlx::query_as!(
//         GameModel,
//         "INSERT into games (field_name, address, day) values ($1, $2, $3) returning *",
//         body.field_name.to_string(),
//         body.address.to_string(),
//         body.day.to_string()
//     ).fetch_one(&data.db)
//     .await;

//     match query_result {
//         Ok(game) => {
//             let game_response = serde_json::json!({"status": "success", "data": serde_json::json!({
//                 "game": game
//             })});
//             return HttpResponse::Ok().json(game_response);
//         }
//         Err(e) => {
//             if e.to_string().contains("duplicate key value violates unique constraint") {
//                 return HttpResponse::BadRequest()
//                 .json(serde_json::json!({"status": "fail", "message": "Duplicate Key"}))
//             }
//             return HttpResponse::InternalServerError()
//                 .json(serde_json::json!({"status": "error", "message": format!("{:?}", e)}));
//         }
//     }
// }
