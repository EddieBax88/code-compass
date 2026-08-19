import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, X } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function EmailConfirmationBanner() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem("cc_verified_dismissed") === "true") {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash || "";

    const isConfirmed =
      searchParams.get("confirmed") === "true" ||
      searchParams.get("type") === "signup" ||
      searchParams.get("type") === "email_confirmation" ||
      hash.includes("type=signup") ||
      hash.includes("type=email_confirmation") ||
      sessionStorage.getItem("cc_email_verified") === "true";

    if (isConfirmed) {
      sessionStorage.setItem("cc_email_verified", "true");
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cc_verified_dismissed", "true");
    }
  };

  if (!show) return null;

  return (
    <div className="border-b border-emerald-500/30 bg-emerald-950/40 text-emerald-300 px-4 py-3 text-sm shadow-sm backdrop-blur-sm animate-in fade-in duration-300">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          {user ? (
            <div>
              <span className="font-semibold text-foreground">Your email is verified!</span>{" "}
              <span className="text-muted-foreground">
                You're signed in as <strong className="text-foreground">{user.email}</strong>.
              </span>
            </div>
          ) : (
            <div>
              <span className="font-semibold text-foreground">Your email is verified</span>{" "}
              <span className="text-muted-foreground">— sign in to get started.</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          {user ? (
            <Link
              to="/study-tools"
              className="rounded-md bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-ember hover:opacity-90 transition"
            >
              Go to NEC Lookup →
            </Link>
          ) : (
            <Link
              to="/auth"
              search={{ next: undefined }}
              className="rounded-md bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-ember hover:opacity-90 transition"
            >
              Sign in to get started →
            </Link>
          )}
          <button
            onClick={dismiss}
            aria-label="Dismiss banner"
            className="rounded p-1 text-muted-foreground hover:bg-emerald-900/30 hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
