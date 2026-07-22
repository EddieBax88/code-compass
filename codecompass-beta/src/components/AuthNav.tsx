import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function AuthNav() {
  const { user, loading, signOut } = useAuth();
  if (loading) return <div className="w-16" />;
  if (!user) {
    return (
      <Link
        to="/auth"
        search={{ next: undefined }}
        className="rounded-md border border-primary/60 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition"
      >
        Sign in
      </Link>
    );
  }
  const initial = (user.email ?? "?").slice(0, 1).toUpperCase();
  return (
    <div className="flex items-center gap-2">
      <Link
        to="/profile"
        aria-label={`Open profile for ${user.email ?? "your account"}`}
        className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1 text-sm hover:border-primary/60"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground text-[11px] font-semibold">
          {initial}
        </span>
        <span className="hidden md:inline max-w-[10rem] truncate">{user.email}</span>
      </Link>
      <button
        onClick={() => signOut()}
        className="hidden sm:inline text-xs text-muted-foreground hover:text-foreground px-2 py-1"
      >
        Sign out
      </button>
    </div>
  );
}

export function SignInPrompt() {
  const { user, loading } = useAuth();
  if (loading || user) return null;
  return (
    <div className="border-b border-border/60 bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-2 text-xs">
        <span className="text-muted-foreground">
          You're using Code Compass as a guest — your progress is saved on this device only.
        </span>
        <Link
          to="/auth"
          search={{ next: undefined }}
          className="ml-auto rounded-md bg-primary px-3 py-1 font-medium text-primary-foreground hover:opacity-90"
        >
          Save progress across devices →
        </Link>
      </div>
    </div>
  );
}
