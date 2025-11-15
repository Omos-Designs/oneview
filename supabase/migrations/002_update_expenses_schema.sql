-- Update expenses table to use proper date type and ensure type field is used correctly

-- 1. Change due_date from integer to date type
ALTER TABLE public.expenses
ALTER COLUMN due_date TYPE date USING
  CASE
    -- If it's already a valid date string, cast it
    WHEN due_date::text ~ '^\d{4}-\d{2}-\d{2}$' THEN due_date::text::date
    -- If it's a day number (1-31), convert to date in current month
    ELSE make_date(EXTRACT(YEAR FROM CURRENT_DATE)::int, EXTRACT(MONTH FROM CURRENT_DATE)::int, due_date)
  END;

-- 2. Update existing rows to set proper expense type based on category
-- (This fixes any existing data that might have wrong type)
UPDATE public.expenses
SET type = CASE
  WHEN category IN ('Subscriptions', 'Subscriptions & Memberships', 'Entertainment', 'Software', 'Media', 'Fitness') THEN 'subscription'
  ELSE 'expense'
END
WHERE type IS NULL OR type = '';

-- 3. Ensure type column cannot be null
ALTER TABLE public.expenses
ALTER COLUMN type SET NOT NULL;
