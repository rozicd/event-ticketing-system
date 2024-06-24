use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use sqlx::{Postgres, Pool, postgres::PgPoolOptions};
use dotenv::dotenv;
use std::env;
use routes::config::config;
use lapin::{options::*, types::FieldTable, Connection, ConnectionProperties, Channel};



#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}

mod models;
mod routes;


pub struct AppState {
    db: Pool<Postgres>,
    amqp_channel: Channel,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool: Pool<Postgres> = match PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await
    {
        Ok(pool) => {
            println!("✅ Connection to the db is successful!");
            pool
        }
        Err(err) => {
            println!("🔥 Failed to connect to the database {:?}", err);
            std::process::exit(1);
        }
    };
    let amqp_url = env::var("AMQP_URL").expect("AMQP_URL must be set");
    let amqp_connection = Connection::connect(&amqp_url, ConnectionProperties::default()).await.expect("Failed to connect to RabbitMQ");
    let amqp_channel = amqp_connection.create_channel().await.expect("Failed to create RabbitMQ channel");

    let _ = amqp_channel.queue_declare(
        "event_queue",
        QueueDeclareOptions::default(),
        FieldTable::default()
    ).await.expect("Failed to declare RabbitMQ queue");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone(), amqp_channel: amqp_channel.clone() }))
            .configure(config)
            .service(hello)
            .service(echo)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
