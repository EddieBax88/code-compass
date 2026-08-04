/**
 * PaywallGate — wraps any paid-only page.
 * Shows a conversion screen if the user is not authenticated or has no active entitlement.
 * Passes children through if the user has paid access.
 */
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { Lock, ArrowRight, Bot } from "lucide-react";
import { Purchases } from "@revenuecat/purchases-js";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const REVENUECAT_PUBLIC_KEY = "test_GxfiIfTxtuMnoNoeWuQanSUTCGI";

interface PaywallGateProps {
  children: ReactNode;
  /** Label shown in the gate (e.g. "Exam Mode") */
  featureName: string;
}

export function PaywallGate({ children, featureName }: PaywallGateProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [hasPaidAccess, setHasPaidAccess] = useState(false);
  const [accessLoading, setAccessLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setHasPaidAccess(false);
      setAccessLoading(false);
      return;
    }

    let active = true;

    Purchases.configure({ apiKey: REVENUECAT_PUBLIC_KEY });

    const loadAccess = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        if (!active) return;

        const activeEntitlements = customerInfo.entitlements?.active ?? {};
        setHasPaidAccess(Object.keys(activeEntitlements).length > 0);
      } catch (error) {
        console.error("Failed to resolve RevenueCat access:", error);
        if (active) setHasPaidAccess(false);
      } finally {
        if (active) setAccessLoading(false);
      }
    };

    void loadAccess();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  // Still loading — render nothing (AppLayout header stays visible)
  if (authLoading || accessLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (hasPaidAccess) return <>{children}</>;

  // ── Gate screen ──
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
        <Lock className="w-8 h-8 text-amber-500" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        {featureName} is a paid feature
      </h1>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        Unlock <strong>Exam Mode, Quick Drill, and Code Lookup</strong> with a
        one-time Lifetime Access purchase — no subscription, no recurring fees.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href="/pricing">
          <Button
            size="lg"
            className="h-12 px-8 bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-[0_0_24px_rgba(245,158,11,0.25)]"
          >
            Get Lifetime Access — $39.99
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>

        <Link href="/copilot">
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-7 border-border"
          >
            <Bot className="w-4 h-4 mr-2" />
            Try 3 free Co-Pilot questions
          </Button>
        </Link>
      </div>

      {!isAuthenticated && (
        <p className="mt-6 text-sm text-muted-foreground">
          Already purchased?{" "}
          <a
            href={getLoginUrl()}
            className="text-amber-600 underline underline-offset-2"
          >
            Sign in
          </a>
        </p>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        One-time payment · Instant access · All 4 NEC versions
        (2017/2020/2023/2026)
      </p>
    </div>
  );
}
