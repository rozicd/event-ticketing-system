-- Add migration script here
ALTER TABLE events
ADD COLUMN organizator_name VARCHAR,
ADD COLUMN image_path VARCHAR;