-- migrate:up
CREATE TABLE categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL UNIQUE,
    icon  text,
    color text
);

INSERT INTO categories (title, icon, color) VALUES
  ('Entertainment',      'clapperboard',   '#E11D48'),
  ('Music',              'music',          '#DB2777'),
  ('Gaming',             'gamepad-2',      '#7C3AED'),
  ('Software & Apps',    'app-window',     '#2563EB'),
  ('Cloud Storage',      'cloud',          '#0EA5E9'),
  ('News & Magazines',   'newspaper',      '#64748B'),
  ('Education',          'graduation-cap', '#F59E0B'),
  ('Health & Fitness',   'dumbbell',       '#16A34A'),
  ('Internet & Phone',   'wifi',           '#0891B2'),
  ('Utilities',          'zap',            '#CA8A04'),
  ('Insurance',          'shield-check',   '#4F46E5'),
  ('Food & Delivery',    'utensils',       '#EA580C'),
  ('Shopping',           'shopping-bag',   '#C026D3'),
  ('Transport',          'car',            '#0D9488'),
  ('Finance',            'landmark',       '#15803D'),
  ('Other',              'ellipsis',       '#6B7280')
ON CONFLICT (title) DO NOTHING;

-- migrate:down
DROP TABLE categories;