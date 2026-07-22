import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export type NecEdition = "2017" | "2020" | "2023" | "2026";
export const NEC_EDITIONS: NecEdition[] = ["2026", "2023", "2020", "2017"];
export const DEFAULT_NEC_EDITION: NecEdition = "2026";

const KEY = "tradesmith.nec.edition";

function readLocal(): NecEdition | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(KEY);
  if (v === "2017" || v === "2020" || v === "2023" || v === "2026") return v;
  return null;
}

function writeLocal(v: NecEdition) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, v);
  window.dispatchEvent(new CustomEvent("tradesmith:nec"));
}

export function useNecEdition() {
  const { user, loading: authLoading } = useAuth();
  const [edition, setEditionState] = useState<NecEdition | null>(DEFAULT_NEC_EDITION);
  const [hydrated, setHydrated] = useState(false);

  // Guest mode: read localStorage
  useEffect(() => {
    if (authLoading) return;
    if (user) return;
    setEditionState(readLocal() ?? DEFAULT_NEC_EDITION);
    setHydrated(true);
    const on = () => setEditionState(readLocal() ?? DEFAULT_NEC_EDITION);
    window.addEventListener("tradesmith:nec", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("tradesmith:nec", on);
      window.removeEventListener("storage", on);
    };
  }, [user, authLoading]);

  // Signed-in: read profile.nec_edition, upserting a local choice if the cloud
  // profile hasn't set one yet.
  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("nec_edition")
        .eq("id", user.id)
        .maybeSingle();
      const cloud = (data?.nec_edition ?? null) as NecEdition | null;
      const local = readLocal();
      const chosen = cloud ?? local ?? DEFAULT_NEC_EDITION;
      if (!cancelled) {
        setEditionState(chosen);
        setHydrated(true);
      }
      if (!cloud && local) {
        await supabase
          .from("profiles")
          .upsert({ id: user.id, nec_edition: local }, { onConflict: "id" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const setEdition = useCallback(
    (v: NecEdition) => {
      writeLocal(v);
      setEditionState(v);
      if (user) {
        supabase
          .from("profiles")
          .upsert({ id: user.id, nec_edition: v }, { onConflict: "id" })
          .then(({ error }) => {
            if (error) console.error(error);
          });
      }
    },
    [user],
  );

  return { edition, setEdition, hydrated };
}

export function citeLabel(edition: NecEdition | null, ref: string) {
  return `NEC ${edition ?? "—"} · ${ref}`;
}
