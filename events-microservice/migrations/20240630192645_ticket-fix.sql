-- Add migration script here
ALTER TABLE tickets
ADD COLUMN created_at TIMESTAMPTZ NOT NULL;