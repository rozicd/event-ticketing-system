use uuid;
use chrono;


use uuid::Uuid;
use chrono::{DateTime, Utc};

struct Event {
    id: Uuid,
    name: String,
    begins: DateTime<Utc>,
    event_type: EventType,
    capacity: Capacity,
    location: Location,
}

enum EventType {
    Koncert,
    Predstava,
    Festival,
}

struct Capacity {
    rows: i32,
    columns: i32,
    capacity: i32,
}

struct Location {
    longitude: f64,
    latitude: f64,
    address: String,
}

