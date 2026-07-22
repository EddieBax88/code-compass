import { useEffect, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInEmail = useCallback(async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  }, []);

  const signUpEmail = useCallback(async (email: string, password: string, displayName?: string) => {
    const emailRedirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/` : undefined;
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: displayName ? { full_name: displayName } : undefined,
      },
    });
  }, []);

  const signInGoogle = useCallback(async () => {
    const redirect_uri = typeof window !== "undefined" ? window.location.origin : undefined;
    return lovable.auth.signInWithOAuth("google", { redirect_uri });
  }, []);

  const signOut = useCallback(async () => {
    return supabase.auth.signOut();
  }, []);

  return { user, loading, signInEmail, signUpEmail, signInGoogle, signOut };
}
