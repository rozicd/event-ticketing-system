use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use sqlx::{Postgres, Pool, postgres::PgPoolOptions};
use dotenv::dotenv;
use std::env;
use futures_lite::stream::StreamExt;
use lapin::{
    options::*, publisher_confirm::Confirmation, types::FieldTable, BasicProperties, Connection,
    ConnectionProperties, Result,
};
// use routes::config::config;


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

// mod models;
// mod routes;


pub struct AppState {
    db: Pool<Postgres>,
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
    let mut consumer = amqp_channel
            .basic_consume(
                "event_queue",
                "my_consumer",
                BasicConsumeOptions::default(),
                FieldTable::default(),
            )
            .await.expect("Failed to consume message");
    tokio::spawn(async move {
        while let Some(delivery) = consumer.next().await {
        
            let delivery = delivery.expect("error in consumer");
            let event_json = String::from_utf8_lossy(&delivery.data);
            println!("Received message: {}", event_json);
            delivery
                .ack(BasicAckOptions::default())
                .await
                .expect("ack");
        }
    });
    
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            // .configure(config)
            .service(hello)
            .service(echo)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind(("127.0.0.1", 8082))?
    .run()
    .await
}
