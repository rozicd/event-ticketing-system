use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Ticket {
    pub id: Uuid,
    pub event_id: Uuid,
    pub user_id: Uuid,
    pub quantity: Option<i32>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateTicket {
    pub event_id: Uuid,
    pub user_id: Uuid,
    pub quantity: Option<i32>,
}