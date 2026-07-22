
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_shared_progress(TEXT) FROM PUBLIC;
-- get_shared_progress MUST remain callable by anon (that's the whole point of a
-- public share token). The security-definer body only exposes non-sensitive
-- lesson/quiz aggregates and never reveals emails or auth data.
GRANT EXECUTE ON FUNCTION public.get_shared_progress(TEXT) TO anon, authenticated;
