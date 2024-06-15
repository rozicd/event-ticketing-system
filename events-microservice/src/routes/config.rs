use actix_web::web;

use super::events_controller::create_event;

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(create_event);
    
    conf.service(scope);
}
