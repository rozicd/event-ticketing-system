use actix_web::web;

use super::review_controller::{create_review, get_event_reviews};

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(create_review)
        .service(get_event_reviews);
    
    conf.service(scope);
}