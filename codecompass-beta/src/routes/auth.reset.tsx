import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, KeyRound, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth/reset")({
  head: () => {
    const title = "Set New Password — Code Compass";
    return {
      meta: [
        { title },
        { name: "description", content: "Set a new password for your Code Compass account." },
        { property: "og:title", content: title },
      ],
    };
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Listen for auth state change to capture password recovery token
    const { data: sub } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        setNotice("Recovery session active. Enter your new password below.");
      }
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setNotice(null);

    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setErr(error.message);
      } else {
        setIsSuccess(true);
        setNotice("Your password has been updated successfully!");
        setTimeout(() => {
          nav({ to: "/profile" });
        }, 2000);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to update password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
          <KeyRound className="h-5 w-5" />
        </div>

        <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-medium">
          Account Security
        </div>
        <h1 className="mt-1 font-display text-3xl font-semibold">Set new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter a new password for your Code Compass account below.
        </p>

        {isSuccess ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-4 text-sm text-emerald-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-foreground">Password updated!</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Redirecting you to your account...
                </div>
              </div>
            </div>
            <Link
              to="/profile"
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90 transition"
            >
              Continue to Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (min 6 characters)"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {err && <div className="text-sm text-red-500">{err}</div>}
            {notice && !isSuccess && <div className="text-sm text-primary">{notice}</div>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90 disabled:opacity-50 transition"
            >
              {busy ? "Updating..." : "Update password"}
            </button>

            <div className="text-center text-xs text-muted-foreground pt-2">
              <Link to="/auth" search={{ next: undefined }} className="text-primary hover:underline">
                ← Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
