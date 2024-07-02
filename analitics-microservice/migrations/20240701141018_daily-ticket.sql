-- Add migration script here
CREATE TABLE tickets (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL,
    user_id UUID NOT NULL,
    quantity INT,
    created_at TIMESTAMPTZ NOT NULL
);