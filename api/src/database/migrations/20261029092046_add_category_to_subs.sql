-- migrate:up
ALTER TABLE subscriptions
ADD COLUMN category_id UUID
REFERENCES categories(id);

-- migrate:down
ALTER TABLE subscriptions
DROP COLUMN category_id;

