use crate::models::ticket::{Ticket, DailyTicketSum, FilterParams};
use crate::AppState;

use actix_web::{post, get, put, web, HttpResponse, Responder};

use sqlx::{query, query_as};

use sqlx::{PgPool, Result};
use uuid::Uuid;


#[get("/tickets/{interval}")]
async fn get_ticket_sums(
    app_state: web::Data<AppState>,
    path: web::Path<String>,
    query: web::Query<FilterParams>,
) -> impl Responder {
    let interval = path.into_inner();
    let default_uuid = Uuid::nil();
    let event_id = query.event_id.as_ref().unwrap_or(&default_uuid);

    let interval_filter = match interval.as_str() {
        "weekly" => "7 days",
        "monthly" => "30 days",
        "yearly" => "1 year",
        _ => return HttpResponse::BadRequest().body("Invalid interval"),
    };

    let sql_query = format!(
        "SELECT DATE_TRUNC('day', created_at) AS date, SUM(quantity) AS total_quantity
        FROM tickets
        WHERE created_at >= NOW() - INTERVAL '{}' AND event_id = $1
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date",
        interval_filter
    );

    let pool = &app_state.db;
    let ticket_sums = sqlx::query_as::<_, DailyTicketSum>(&sql_query)
        .bind(event_id)
        .fetch_all(pool)
        .await;

    match ticket_sums {
        Ok(sums) => HttpResponse::Ok().json(sums),
        Err(_) => HttpResponse::InternalServerError().body("Internal Server Error"),
    }
}
