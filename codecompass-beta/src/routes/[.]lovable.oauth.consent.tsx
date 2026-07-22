import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Minimal typed shim for the beta auth.oauth namespace on the Supabase client.
type AuthorizationDetails = {
  client?: { name?: string; client_name?: string; redirect_uris?: string[] };
  scope?: string;
  scopes?: string[];
  redirect_url?: string;
  redirect_to?: string;
};
type OAuthResult<T> = { data: T | null; error: { message: string } | null };
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult<AuthorizationDetails>>;
  approveAuthorization: (id: string) => Promise<OAuthResult<AuthorizationDetails>>;
  denyAuthorization: (id: string) => Promise<OAuthResult<AuthorizationDetails>>;
};
function oauth(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) {
      if (typeof window !== "undefined") window.location.href = immediate;
      return data;
    }
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-display text-2xl font-semibold">Authorization error</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We couldn't load this authorization request: {String((error as Error)?.message ?? error)}
      </p>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientName = details?.client?.client_name ?? details?.client?.name ?? "an external app";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="text-[10px] uppercase tracking-[0.18em] text-primary">
          Authorize connection
        </div>
        <h1 className="mt-1 font-display text-2xl font-semibold">
          Connect {clientName} to your account
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {clientName} will be able to call Code Compass tools while you are signed in — reading
          your progress, quiz results, and course list, and updating your active NEC edition.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          This does not bypass Code Compass permissions. You can revoke access at any time.
        </p>
        {error && (
          <div
            role="alert"
            className="mt-4 rounded-md border border-red-500/40 bg-red-500/5 p-3 text-sm text-red-400"
          >
            {error}
          </div>
        )}
        <div className="mt-6 flex gap-2">
          <button
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "…" : "Approve"}
          </button>
          <button
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium hover:border-primary/60 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
