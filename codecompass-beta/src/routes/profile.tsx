import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useProgress, courseProgress, quizPassed } from "@/lib/progress";
import { useNecEdition, NEC_EDITIONS } from "@/lib/nec-edition";
import { COURSES, TRADES } from "@/lib/curriculum";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your progress — Code Compass" },
      {
        name: "description",
        content: "Your Code Compass course progress, quiz scores, and instructor share links.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: "https://codecompass-beta.lovable.app/profile" }],
  }),
  component: ProfilePage,
});

type Share = { token: string; label: string | null; created_at: string; revoked_at: string | null };

function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { state, loading } = useProgress();
  const { edition, setEdition } = useNecEdition();
  const nav = useNavigate();
  const [shares, setShares] = useState<Share[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) nav({ to: "/auth", search: { next: undefined } });
  }, [authLoading, user, nav]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setDisplayName(data?.display_name ?? ""));
    void refreshShares(user.id);
  }, [user]);

  async function refreshShares(uid: string) {
    const { data } = await supabase
      .from("share_links")
      .select("token, label, created_at, revoked_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    setShares((data as Share[]) ?? []);
  }

  async function saveName() {
    if (!user) return;
    await supabase
      .from("profiles")
      .upsert({ id: user.id, display_name: displayName }, { onConflict: "id" });
  }

  async function createShare() {
    if (!user) return;
    const token = crypto.randomUUID().replace(/-/g, "");
    await supabase.from("share_links").insert({ token, user_id: user.id, label: newLabel || null });
    setNewLabel("");
    await refreshShares(user.id);
  }

  async function revokeShare(token: string) {
    if (!user) return;
    await supabase
      .from("share_links")
      .update({ revoked_at: new Date().toISOString() })
      .eq("token", token);
    await refreshShares(user.id);
  }

  if (authLoading || !user) return null;

  const totalCourses = COURSES.length;
  const totalLessons = COURSES.reduce(
    (n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0),
    0,
  );
  const totalQuizzes = COURSES.reduce((n, c) => n + c.modules.length, 0);
  const completedLessons = Object.values(state.lessons).reduce((n, a) => n + a.length, 0);
  const passedQuizzes = Object.values(state.quizResults).reduce(
    (n, byMod) => n + Object.values(byMod).filter((r) => r.best.passed).length,
    0,
  );
  const coursesDone = COURSES.filter((c) => {
    const totals = { l: c.modules.reduce((s, m) => s + m.lessons.length, 0), q: c.modules.length };
    return courseProgress(state, c.id, totals.l, totals.q) === 100;
  }).length;

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-primary">Your account</div>
          <h1 className="mt-1 font-display text-4xl font-semibold">{displayName || user.email}</h1>
          <div className="mt-1 text-sm text-muted-foreground">{user.email}</div>
        </div>
        <button
          onClick={() => signOut()}
          className="text-sm text-muted-foreground hover:text-foreground rounded-md border border-border bg-card px-3 py-1.5"
        >
          Sign out
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <Stat label="Courses complete" value={`${coursesDone}/${totalCourses}`} />
        <Stat label="Lessons finished" value={`${completedLessons}/${totalLessons}`} accent />
        <Stat label="Quizzes passed" value={`${passedQuizzes}/${totalQuizzes}`} />
        <Stat label="NEC edition" value={edition ? `NEC ${edition}` : "—"} />
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Display name</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Shown to anyone you share a read-only progress link with.
          </p>
          <div className="mt-4 flex gap-2">
            <label htmlFor="profile-display-name" className="sr-only">
              Display name
            </label>
            <input
              id="profile-display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Jamie Rivera"
              aria-label="Display name"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={saveName}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Save
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">NEC edition</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All code citations across the app render with this edition.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {NEC_EDITIONS.map((e) => (
              <button
                key={e}
                onClick={() => setEdition(e)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  edition === e
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/60"
                }`}
              >
                NEC {e}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Foreman / instructor view</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a read-only share link. Anyone with the URL can see which lessons and quizzes
              you've completed — nothing else. Revoke anytime.
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <label htmlFor="share-link-label" className="sr-only">
            Share link label
          </label>
          <input
            id="share-link-label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Label (e.g. 'Foreman Ramirez')"
            aria-label="Share link label"
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            onClick={createShare}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Create link
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {shares.length === 0 && (
            <div className="text-sm text-muted-foreground">No share links yet.</div>
          )}
          {shares.map((s) => {
            const url = `${origin}/share/${s.token}`;
            const revoked = !!s.revoked_at;
            return (
              <div
                key={s.token}
                className={`flex flex-wrap items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm ${
                  revoked ? "opacity-60" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">
                    {s.label || "Untitled link"}{" "}
                    {revoked && <span className="text-xs text-muted-foreground">(revoked)</span>}
                  </div>
                  <div className="text-xs text-muted-foreground truncate font-mono">{url}</div>
                </div>
                {!revoked && (
                  <>
                    <button
                      onClick={() => navigator.clipboard.writeText(url)}
                      className="text-xs rounded-md border border-border px-2 py-1 hover:border-primary/60"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => revokeShare(s.token)}
                      className="text-xs rounded-md border border-border px-2 py-1 hover:border-primary/60 text-muted-foreground"
                    >
                      Revoke
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">Your courses</h2>
        {loading && <div className="mt-4 text-sm text-muted-foreground">Loading…</div>}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {COURSES.map((c) => {
            const l = c.modules.reduce((n, m) => n + m.lessons.length, 0);
            const q = c.modules.length;
            const pct = courseProgress(state, c.id, l, q);
            const passed = c.modules.filter((m) => quizPassed(state, c.id, m.id)).length;
            return (
              <Link
                key={c.id}
                to="/course/$courseId"
                params={{ courseId: c.id }}
                search={{ focus: undefined }}
                className="rounded-xl border border-border bg-card p-4 hover:border-primary/60 transition"
              >
                <div className="text-[10px] uppercase tracking-[0.16em] text-accent">
                  {TRADES.find((t) => t.id === c.trade)?.name} · {c.level}
                </div>
                <div className="mt-1 font-display text-lg font-semibold">{c.title}</div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{pct}% complete</span>
                  <span>
                    {passed}/{q} quizzes passed
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className={`font-display text-2xl font-semibold ${accent ? "ember-text" : ""}`}>
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
