import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B1jDr4fN.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Cfg3CyA2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var lovableAuth = createLovableAuth();
var lovable = {
  auth: {
    signInWithOAuth: async (provider, opts) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        redirect_uri: opts?.redirect_uri,
        extraParams: { ...opts?.extraParams },
      });
      if (result.redirected) return result;
      if (result.error) return result;
      try {
        await supabase.auth.setSession(result.tokens);
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    },
  },
};
function useAuth() {
  const [user, setUser] = (0, import_react.useState)(null);
  const [loading, setLoading] = (0, import_react.useState)(true);
  (0, import_react.useEffect)(() => {
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
  return {
    user,
    loading,
    signInEmail: (0, import_react.useCallback)(async (email, password) => {
      return supabase.auth.signInWithPassword({
        email,
        password,
      });
    }, []),
    signUpEmail: (0, import_react.useCallback)(async (email, password, displayName) => {
      const emailRedirectTo = typeof window !== "undefined" ? `${window.location.origin}/` : void 0;
      return supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: displayName ? { full_name: displayName } : void 0,
        },
      });
    }, []),
    signInGoogle: (0, import_react.useCallback)(async () => {
      const redirect_uri = typeof window !== "undefined" ? window.location.origin : void 0;
      return lovable.auth.signInWithOAuth("google", { redirect_uri });
    }, []),
    signOut: (0, import_react.useCallback)(async () => {
      return supabase.auth.signOut();
    }, []),
  };
}
//#endregion
export { useAuth as n, lovable as t };
