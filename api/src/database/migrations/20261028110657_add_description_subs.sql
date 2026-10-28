-- migrate:up
alter table subscriptions
    add column description text

-- migrate:down
ALTER TABLE subscriptions
  DROP COLUMN description

