-- Add migration script here
CREATE TABLE tickets (
    id UUID PRIMARY KEY,
    event_id UUID,
    user_id UUID,
    quantity INT,
    CONSTRAINT fk_event
        FOREIGN KEY (event_id)
        REFERENCES events (id)
);