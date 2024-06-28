-- Add migration script here
DROP TABLE IF EXISTS events;

CREATE TABLE events (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    begins TIMESTAMPTZ NOT NULL,
    event_type TEXT NOT NULL,
    capacity_rows INT NOT NULL,
    capacity_columns INT NOT NULL,
    capacity INT NOT NULL,
    location_longitude DOUBLE PRECISION NOT NULL,
    location_latitude DOUBLE PRECISION NOT NULL,
    location_address TEXT NOT NULL,
    organizator_id UUID NOT NULL,
    organizator_name TEXT NOT NULL,
    canceled BOOLEAN NOT NULL DEFAULT FALSE,
    image_path TEXT NOT NULL
);
