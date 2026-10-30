-- migrate:up
DELETE FROM subscriptions;  -- dev only: existing rows have no owner
ALTER TABLE subscriptions DROP COLUMN IF EXISTS user_id;
ALTER TABLE subscriptions
  ADD COLUMN user_id text REFERENCES "user"(id) ON DELETE CASCADE;
CREATE INDEX subscriptions_user_id_idx ON subscriptions (user_id);

-- migrate:down
DROP INDEX subscriptions_user_id_idx;
ALTER TABLE subscriptions DROP COLUMN user_id;