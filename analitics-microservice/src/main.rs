use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use models::ticket::Ticket;
use sqlx::{Postgres, Pool, postgres::PgPoolOptions};
use dotenv::dotenv;
use std::env;
use futures_lite::stream::StreamExt;
use serde_json::from_str;
use sqlx::PgConnection;
use sqlx::types::Uuid;
use sqlx::query;
use sqlx::query_as;
use lapin::{
    options::*, publisher_confirm::Confirmation, types::FieldTable, BasicProperties, Connection,
    ConnectionProperties, Result,
};
use routes::config::config;


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
}

async fn consume_messages(mut consumer: lapin::Consumer, db: &Pool<Postgres>) {
    while let Some(delivery) = consumer.next().await {
        let delivery = delivery.expect("error in consumer");
        let event_json = String::from_utf8_lossy(&delivery.data);
        println!("Received message: {}", event_json);
        if let Err(err) = process_tickets(&event_json, &db).await {
            println!("Failed to process event: {:?}", err);
        }

        delivery
            .ack(BasicAckOptions::default())
            .await
            .expect("ack");
    }
}

async fn process_tickets(event_json: &str, db: &Pool<Postgres>) -> std::result::Result<(), sqlx::Error> {
    // Deserialize the JSON message into a Ticket struct
    let ticket: Ticket = match serde_json::from_str(event_json) {
        Ok(t) => t,
        Err(err) => {
            println!("Failed to deserialize JSON: {:?}", err);
            return Err(sqlx::Error::Decode(err.into()));
        }
    };

    // Insert the ticket into the tickets table
    let query_result = query_as!(
        Ticket,
        "INSERT INTO tickets (id, event_id, user_id, quantity, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        ticket.id,
        ticket.event_id,
        ticket.user_id,
        ticket.quantity,
        ticket.created_at
    )
    .fetch_one(db)
    .await;

    match query_result {
        Ok(_) => {
            println!("Ticket stored successfully: {:?}", ticket);
            Ok(())
        }
        Err(err) => {
            println!("Failed to store ticket: {:?}", err);
            Err(err)
        }
    }
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
                "tickets_queue",
                "my_consumer",
                BasicConsumeOptions::default(),
                FieldTable::default(),
            )
            .await.expect("Failed to consume message");
    let cloned_pool = pool.clone();
    tokio::spawn(async move {
        consume_messages(consumer, &cloned_pool).await;
    });
    
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(config)
            .service(hello)
            .service(echo)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind(("127.0.0.1", 8084))?
    .run()
    .await
}
