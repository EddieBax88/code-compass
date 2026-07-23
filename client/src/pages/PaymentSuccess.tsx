import { useEffect } from "react";
import { useLocation } from "wouter";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import { trpc } from "@/lib/trpc";

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  useEffect(() => {
    // Refresh subscription status after successful checkout
    utils.stripe.subscriptionStatus.invalidate();
  }, [utils]);

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-primary" />
          </div>
          <div>
            <p className="stencil-label mb-2">PAYMENT CONFIRMED</p>
            <h1 className="text-2xl font-bold text-foreground mb-3">
              You're in.
            </h1>
            <p className="text-muted-foreground">
              Your Pro access is active. All 65+ NEC training cards and Exam
              Mode are unlocked.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full font-mono text-xs tracking-wider bg-primary text-primary-foreground"
              onClick={() => navigate("/exam")}
            >
              START EXAM MODE
            </Button>
            <Button
              variant="outline"
              className="w-full font-mono text-xs tracking-wider"
              onClick={() => navigate("/")}
            >
              GO TO DASHBOARD
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
