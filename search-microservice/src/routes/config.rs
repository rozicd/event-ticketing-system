use actix_web::web;

use super::search_controller::{get_paginated_events};

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(get_paginated_events);
    
    conf.service(scope);
}
