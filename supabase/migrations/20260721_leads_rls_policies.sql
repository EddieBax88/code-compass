-- Enable RLS on leads table (blocks all anonymous access by default)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically — no policy needed for server-side scripts.
-- The outreach scripts and Express API routes use service_role, so they work unimpeded.

-- Authenticated users can SELECT all leads (admin dashboard access)
CREATE POLICY "leads_select_authenticated"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can INSERT new leads
CREATE POLICY "leads_insert_authenticated"
  ON public.leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can UPDATE leads (status transitions, notes, contact dates)
CREATE POLICY "leads_update_authenticated"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- No DELETE policy — only service role can delete leads (defense-in-depth)

-- updated_at trigger for automatic timestamp on every UPDATE
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_updated_at ON public.leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_segment ON public.leads(segment);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
