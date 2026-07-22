
-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  nec_edition TEXT CHECK (nec_edition IN ('2017','2020','2023')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile read" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Own profile upsert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- lesson_completions
CREATE TABLE public.lesson_completions (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  lesson_key TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, course_id, lesson_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_completions TO authenticated;
GRANT ALL ON public.lesson_completions TO service_role;
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own lessons read" ON public.lesson_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Own lessons write" ON public.lesson_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own lessons delete" ON public.lesson_completions FOR DELETE USING (auth.uid() = user_id);

-- quiz_results
CREATE TABLE public.quiz_results (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  best_score_pct INT NOT NULL DEFAULT 0,
  best_correct INT NOT NULL DEFAULT 0,
  best_total INT NOT NULL DEFAULT 0,
  best_passed BOOLEAN NOT NULL DEFAULT false,
  best_at TIMESTAMPTZ,
  last_score_pct INT NOT NULL DEFAULT 0,
  last_correct INT NOT NULL DEFAULT 0,
  last_total INT NOT NULL DEFAULT 0,
  last_passed BOOLEAN NOT NULL DEFAULT false,
  last_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, course_id, module_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_results TO authenticated;
GRANT ALL ON public.quiz_results TO service_role;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own quiz read" ON public.quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Own quiz insert" ON public.quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own quiz update" ON public.quiz_results FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- share_links
CREATE TABLE public.share_links (
  token TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.share_links TO authenticated;
GRANT SELECT ON public.share_links TO anon;
GRANT ALL ON public.share_links TO service_role;
ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own share list" ON public.share_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Own share create" ON public.share_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own share update" ON public.share_links FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own share delete" ON public.share_links FOR DELETE USING (auth.uid() = user_id);
-- Public read of unrevoked share metadata (token-based)
CREATE POLICY "Public share lookup unrevoked" ON public.share_links
  FOR SELECT TO anon USING (revoked_at IS NULL);

-- Function to look up shared progress by token, bypassing RLS on referenced tables.
CREATE OR REPLACE FUNCTION public.get_shared_progress(share_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID;
  v_label TEXT;
  v_profile JSONB;
  v_lessons JSONB;
  v_quizzes JSONB;
BEGIN
  SELECT user_id, label INTO v_user, v_label
  FROM public.share_links
  WHERE token = share_token AND revoked_at IS NULL;

  IF v_user IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT jsonb_build_object(
    'display_name', display_name,
    'nec_edition', nec_edition
  ) INTO v_profile FROM public.profiles WHERE id = v_user;

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'course_id', course_id,
    'lesson_key', lesson_key,
    'completed_at', completed_at
  )), '[]'::jsonb) INTO v_lessons
  FROM public.lesson_completions WHERE user_id = v_user;

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'course_id', course_id,
    'module_id', module_id,
    'attempts', attempts,
    'best_score_pct', best_score_pct,
    'best_passed', best_passed,
    'best_at', best_at,
    'last_score_pct', last_score_pct,
    'last_passed', last_passed,
    'last_at', last_at
  )), '[]'::jsonb) INTO v_quizzes
  FROM public.quiz_results WHERE user_id = v_user;

  RETURN jsonb_build_object(
    'label', v_label,
    'profile', COALESCE(v_profile, '{}'::jsonb),
    'lessons', v_lessons,
    'quizzes', v_quizzes
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_shared_progress(TEXT) TO anon, authenticated;

-- Auto-create profile row on new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
