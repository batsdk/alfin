-- migrate:up
alter table subscriptions
    add column color text not null default '#0fcadb',
    add column icon text,
    add column cycle int check (cycle > 0)


-- migrate:down
ALTER TABLE subscriptions
  DROP COLUMN color,
  DROP COLUMN icon,
  DROP COLUMN cycle;

