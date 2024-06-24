use crate::models::event::{Event, PaginationParams};
use crate::AppState;

use actix_web::{post, get, put, web, HttpResponse, Responder};

use sqlx::query_as;
use uuid::Uuid;

#[get("/events")]
async fn get_paginated_events(
    data: web::Data<AppState>,
    params: web::Query<PaginationParams>,
) -> HttpResponse {
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(5);
    let offset = (page - 1) * limit;

    let events = match query_as!(
        Event,
        r#"
        SELECT id, name, begins, event_type, capacity_rows, capacity_columns, capacity, location_longitude, location_latitude, location_address, organizator_id, canceled
        FROM events
        ORDER BY begins DESC
        LIMIT $1 OFFSET $2
        "#,
        limit as i64,
        offset as i64
    )
    .fetch_all(&data.db)
    .await
    {
        Ok(events) => events,
        Err(err) => {
            println!("Failed to fetch events: {:?}", err);
            return HttpResponse::InternalServerError().finish();
        }
    };

    HttpResponse::Ok().json(events)
}