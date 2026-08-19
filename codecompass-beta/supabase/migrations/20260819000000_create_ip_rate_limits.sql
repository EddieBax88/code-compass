-- Create ip_rate_limits table for per-IP rate limiting anti-abuse backstop
CREATE TABLE IF NOT EXISTS public.ip_rate_limits (
  ip TEXT PRIMARY KEY,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on window_start for performance/cleanup
CREATE INDEX IF NOT EXISTS idx_ip_rate_limits_window_start ON public.ip_rate_limits(window_start);

-- Enable RLS
ALTER TABLE public.ip_rate_limits ENABLE ROW LEVEL SECURITY;

-- Service role full access
GRANT ALL ON public.ip_rate_limits TO service_role;
