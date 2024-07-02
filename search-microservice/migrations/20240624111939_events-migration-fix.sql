-- Add migration script here
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
    canceled BOOLEAN DEFAULT FALSE NOT NULL

);