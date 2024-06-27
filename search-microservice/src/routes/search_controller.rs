use crate::models::event::{Event, PaginationParams, PaginatedResponse};
use crate::AppState;

use actix_web::{post, get, put, web, HttpResponse, Responder};

use sqlx::{query, query_as};
use uuid::Uuid;

#[get("/events")]
async fn get_paginated_events(
    data: web::Data<AppState>,
    params: web::Query<PaginationParams>,
) -> HttpResponse {
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(5);
    let offset = (page - 1) * limit;

    // Fetch the total number of events
    let total_items = match query!(
        r#"
        SELECT COUNT(*) as count FROM events
        "#
    )
    .fetch_one(&data.db)
    .await
    {
        Ok(record) => record.count.unwrap_or(0),
        Err(err) => {
            println!("Failed to fetch total number of events: {:?}", err);
            return HttpResponse::InternalServerError().finish();
        }
    };

    // Fetch the paginated events
    let events = match query_as!(
        Event,
        r#"
        SELECT id, name, begins, event_type, capacity_rows, capacity_columns, capacity, location_longitude, location_latitude, location_address, organizator_id, organizator_name, canceled, image_path
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

    // Calculate the total number of pages
    let total_pages = (total_items as f64 / limit as f64).ceil() as i64;

    // Create the response struct
    let response = PaginatedResponse {
        items: events,
        total_items,
        total_pages,
    };

    HttpResponse::Ok().json(response)
}