use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Review {
    pub id: Uuid,
    pub event_id: Uuid,
    pub user_id: Uuid,
    pub rating: f64,
    pub comment: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateReview {
    pub event_id: Uuid,
    pub user_id: Uuid,
    pub rating: f64,
    pub comment: String,
}