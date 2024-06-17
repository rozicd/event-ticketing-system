use crate::models::review::{Review, CreateReview};
use crate::AppState;

use actix_web::{post, get, put, web, HttpResponse, Responder};

use uuid::Uuid;
#[post("/reviews")]
async fn create_review(body: web::Json<CreateReview>, data: web::Data<AppState>) -> impl Responder {

    let query_result = sqlx::query_as!(
        Review,
        "INSERT INTO reviews (id, event_id, user_id, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        Uuid::new_v4(),
        body.event_id,
        body.user_id,
        body.rating,
        body.comment.clone()
    ).fetch_one(&data.db)
    .await;
    match query_result {
        Ok(review) => {
            let review_response = serde_json::json!({"status": "success", "data": serde_json::json!({
                "review": review
            })});
            return HttpResponse::Ok().json(review_response);
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

#[get("/reviews/{id}")]
async fn get_event_reviews(path: web::Path<Uuid>, data: web::Data<AppState>) -> impl Responder {
    let id = path.into_inner();
    let reviews = sqlx::query_as!(
        Review,
        "SELECT * FROM reviews WHERE event_id = $1",
        id
    )
    .fetch_all(&data.db)
    .await;
    match reviews {
        Ok(reviews) => {
            let reviews_response = serde_json::json!({"status": "success", "data": serde_json::json!({
                "reviews": reviews
            })});
            return HttpResponse::Ok().json(reviews_response);
        }
        Err(e) => {
            return HttpResponse::InternalServerError()
                .json(serde_json::json!({"status": "error", "message": format!("{:?}", e)}));
        }
    }
}