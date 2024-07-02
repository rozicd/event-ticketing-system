-- Add migration script here
DROP TABLE IF EXISTS tickets;

CREATE TABLE tickets (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL,
    user_id UUID NOT NULL,
    quantity INT,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_event
        FOREIGN KEY (event_id)
        REFERENCES events (id)
);