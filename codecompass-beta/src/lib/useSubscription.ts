import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SubscriptionStatus {
  isFoundingMember: boolean;
  guestUsage: {
    used: number;
    limit: number;
    remaining: number;
  };
  user: { id: string; email?: string } | null;
}

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isFoundingMember: false,
    guestUsage: { used: 0, limit: 1, remaining: 1 },
    user: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = "Bearer " + token;
      }

      const res = await fetch("/api/subscription-status", {
        headers,
      });

      if (res.ok) {
        const data: SubscriptionStatus = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.warn("[useSubscription] Failed to fetch subscription status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    const { data: authSub } = supabase.auth.onAuthStateChange(() => {
      fetchStatus();
    });

    return () => {
      authSub.subscription.unsubscribe();
    };
  }, [fetchStatus]);

  return {
    isFoundingMember: status.isFoundingMember,
    guestUsage: status.guestUsage,
    user: status.user,
    loading,
    refetch: fetchStatus,
  };
}
