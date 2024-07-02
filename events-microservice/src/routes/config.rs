use actix_web::web;

use super::events_controller::{create_event, update_event, get_events,get_event_by_id, create_ticket, get_users_tickets};

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(create_event)
        .service(update_event)
        .service(get_events)
        .service(get_event_by_id)
        .service(create_ticket)
        .service(get_users_tickets);
    
    conf.service(scope);
}
