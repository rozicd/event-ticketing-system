use crate::models::event::{Event, EventFilters, PaginatedResponse};
use crate::AppState;

use actix_web::{post, get, put, web, HttpResponse, Responder};

use sqlx::{query, query_as};
use uuid::Uuid;

#[get("/events")]
async fn get_paginated_events(
    data: web::Data<AppState>,
    params: web::Query<EventFilters>,
) -> HttpResponse {
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(5);
    let offset = (page - 1) * limit;
    let search_term = params.search_term.clone().unwrap_or("".to_string());
    let search_term = format!("{}%", search_term);
    let category = params.category.clone().unwrap_or("".to_string());
    let event_type = params.event_type.clone().unwrap_or("".to_string());
    let sort_order = params.sort_order.clone().unwrap_or("begins DESC".to_string());

    let search_field = match category.as_str() {
        "Name" => "name",
        "Organizator" => "organizator_name",
        _ => "name",
    };

    let order_clause = if !sort_order.is_empty() {
        format!("ORDER BY {}", sort_order)
    } else {
        "".to_string()
    };

    // Construct the SQL query
    let sql = format!(r#"
        SELECT id, name, begins, event_type, capacity_rows, capacity_columns, capacity,
               location_longitude, location_latitude, location_address,
               organizator_id, organizator_name, canceled, image_path
        FROM events
        WHERE {} ILIKE $1
        {}
        {}
        LIMIT $2 OFFSET $3
    "#, search_field, if !event_type.is_empty() { "AND event_type = $4" } else { "" }, order_clause);

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
    let events = match query_as::<_, Event>(&sql)
        .bind(search_term)
        .bind(limit as i64)
        .bind(offset as i64)
        .bind(event_type)
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