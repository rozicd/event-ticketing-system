-- Add migration script here
ALTER TABLE events
ADD COLUMN canceled BOOLEAN DEFAULT FALSE NOT NULL;