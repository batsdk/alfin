-- migrate:up
ALTER TABLE categories
ADD COLUMN user_id text
REFERENCES "user"(id) ON DELETE CASCADE;
-- migrate:down
ALTER TABLE categories DROP COLUMN user_id;
