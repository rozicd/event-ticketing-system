use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Event {
    pub id: Uuid,
    pub name: String,
    pub begins: Option<chrono::DateTime<chrono::Utc>>,
    pub event_type: String,
    pub capacity_rows: i32,
    pub capacity_columns: i32,
    pub capacity: i32,
    pub location_longitude: f64,
    pub location_latitude: f64,
    pub location_address: String,
    pub organizator_id: Uuid,
    pub organizator_name: String,
    pub canceled: bool,
    pub image_path: Option<String>
}
#[derive(Debug, Deserialize)]
pub struct CreateEvent {
    pub name: String,
    pub begins: DateTime<Utc>,
    pub event_type: String,
    pub capacity_rows: i32,
    pub capacity_columns: i32,
    pub capacity: i32,
    pub location_longitude: f64,
    pub location_latitude: f64,
    pub location_address: String,
    pub organizator_id: Uuid,
    pub organizator_name: String,
    pub image_path: String
}


#[derive(Debug, Deserialize)]
pub struct UpdateEvent{
    pub user_id: Uuid
}