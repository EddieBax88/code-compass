-- Create subscriptions table for Founding Members and Stripe subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email TEXT,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  price_id TEXT,
  plan TEXT DEFAULT 'founding_member',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on user_id, customer_email, and stripe_customer_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_email ON public.subscriptions(customer_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Service role full access
GRANT ALL ON public.subscriptions TO service_role;
GRANT SELECT ON public.subscriptions TO authenticated;

-- Policy for users to read their own subscriptions
DROP POLICY IF EXISTS "Own subscription read" ON public.subscriptions;
CREATE POLICY "Own subscription read" ON public.subscriptions FOR SELECT USING (
  auth.uid() = user_id
);
