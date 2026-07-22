
DROP FUNCTION IF EXISTS public.get_shared_progress(TEXT);
-- Drop the anon SELECT on share_links; the server route resolves tokens via
-- the admin client instead of letting the browser query the table directly.
DROP POLICY IF EXISTS "Public share lookup unrevoked" ON public.share_links;
REVOKE SELECT ON public.share_links FROM anon;
