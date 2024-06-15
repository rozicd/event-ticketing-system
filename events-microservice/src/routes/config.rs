use actix_web::web;

use super::events_controller::{create_event, update_event, get_events};

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(create_event)
        .service(update_event)
        .service(get_events);
    
    conf.service(scope);
}
