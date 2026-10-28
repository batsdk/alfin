-- migrate:up
CREATE TABLE subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    price bigint NOT NULL CHECK (price > 0),
    currency char(3) NOT NULL,
    billing_interval text NOT NULL CHECK (
        billing_interval IN ('weekly', 'monthly', 'yearly')
    ),
    start_date timestamptz NOT NULL,
    end_date timestamptz,
    timezone text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
-- migrate:down
DROP TABLE subscriptions;