use actix_web::web;
use super::analitics_controller::{get_ticket_sums};

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(get_ticket_sums);
    
    conf.service(scope);
}
