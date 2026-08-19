import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { CheckCircle2 } from "lucide-react";

function sanitizeNext(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : undefined,
    confirmed: typeof s.confirmed === "string" ? s.confirmed : undefined,
    type: typeof s.type === "string" ? s.type : undefined,
  }),
  head: () => {
    const title = "Sign in — Code Compass";
    const description =
      "Sign in to Code Compass to sync your course progress, quiz scores, and NEC edition across devices.";
    const url = "https://codecompass-beta.lovable.app/auth";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: AuthPage,
});

function AuthPage() {
  const { user, loading, signInEmail } = useAuth();
  const nav = useNavigate();
  const search = Route.useSearch();
  const next = sanitizeNext(search.next);
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const isConfirmed =
    search.confirmed === "true" ||
    search.type === "signup" ||
    search.type === "email_confirmation" ||
    (typeof window !== "undefined" &&
      (window.location.hash.includes("type=signup") ||
        window.location.hash.includes("type=email_confirmation") ||
        sessionStorage.getItem("cc_email_verified") === "true"));

  useEffect(() => {
    if (!loading && user) {
      if (next) window.location.replace(next);
      else nav({ to: "/profile" });
    }
  }, [loading, user, nav, next]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await signInEmail(email, password);
        if (error) setErr(error.message);
      } else if (mode === "up") {
        const emailRedirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}/?confirmed=true${next ? `&next=${encodeURIComponent(next)}` : ""}`
            : undefined;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo,
            data: displayName ? { full_name: displayName } : undefined,
          },
        });
        if (error) setErr(error.message);
        else if (!data.session)
          setNotice("Check your email to confirm your account, then sign in.");
      } else if (mode === "forgot") {
        const redirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/reset`
            : undefined;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo,
        });
        if (error) {
          setErr(error.message);
        } else {
          setNotice("Password reset link sent! Check your email inbox.");
        }
      }
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setErr(null);
    setBusy(true);
    const redirect_uri =
      typeof window !== "undefined"
        ? `${window.location.origin}${next ? `/auth?next=${encodeURIComponent(next)}` : ""}`
        : undefined;
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri });
    if (res.error) setErr(res.error.message ?? "Google sign-in failed.");
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        {isConfirmed && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-sm text-emerald-300">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">Your email is verified!</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Sign in below to access your courses, tools, and subscription.
              </div>
            </div>
          </div>
        )}

        <div className="text-[10px] uppercase tracking-[0.18em] text-primary">
          {mode === "in"
            ? "Welcome back"
            : mode === "up"
              ? "Create your account"
              : "Account recovery"}
        </div>
        <h1 className="mt-1 font-display text-3xl font-semibold">
          {mode === "in"
            ? "Sign in to Code Compass"
            : mode === "up"
              ? "Save your progress"
              : "Reset password"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "in"
            ? "Your lesson and quiz progress syncs across every device you use."
            : mode === "up"
              ? "Any progress you've made as a guest on this device will be moved into your account automatically."
              : "Enter your email address and we'll send you a link to reset your password."}
        </p>

        {mode !== "forgot" && (
          <>
            <button
              onClick={google}
              disabled={busy}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium hover:border-primary/60 disabled:opacity-50 transition"
            >
              <span className="text-lg">🔑</span> Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              or with email
              <div className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={submit} className={`space-y-3 ${mode === "forgot" ? "mt-6" : ""}`}>
          {mode === "up" && (
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name (optional)"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {mode !== "forgot" && (
            <div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {mode === "in" && (
                <div className="mt-1.5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setErr(null);
                      setNotice(null);
                    }}
                    className="text-xs text-muted-foreground hover:text-primary transition"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>
          )}
          {err && <div className="text-sm text-red-500">{err}</div>}
          {notice && <div className="text-sm text-emerald-400">{notice}</div>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90 disabled:opacity-50 transition"
          >
            {busy
              ? "…"
              : mode === "in"
                ? "Sign in"
                : mode === "up"
                  ? "Create account"
                  : "Send reset link"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "in" ? (
            <>
              New here?{" "}
              <button
                className="text-primary hover:underline font-medium"
                onClick={() => {
                  setMode("up");
                  setErr(null);
                  setNotice(null);
                }}
              >
                Create an account
              </button>
            </>
          ) : mode === "up" ? (
            <>
              Already have one?{" "}
              <button
                className="text-primary hover:underline font-medium"
                onClick={() => {
                  setMode("in");
                  setErr(null);
                  setNotice(null);
                }}
              >
                Sign in
              </button>
            </>
          ) : (
            <button
              className="text-primary hover:underline font-medium"
              onClick={() => {
                setMode("in");
                setErr(null);
                setNotice(null);
              }}
            >
              ← Back to sign in
            </button>
          )}
        </div>
      </div>
      <div className="mt-6 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          ← Keep browsing as a guest
        </Link>
      </div>
    </main>
  );
}
