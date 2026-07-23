import { useLocation } from "wouter";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";

export default function PaymentCancel() {
  const [, navigate] = useLocation();

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <XCircle className="w-16 h-16 text-muted-foreground" />
          </div>
          <div>
            <p className="stencil-label mb-2">CHECKOUT CANCELED</p>
            <h1 className="text-2xl font-bold text-foreground mb-3">
              No charge made.
            </h1>
            <p className="text-muted-foreground">
              You can upgrade anytime. Your free access is still active.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full font-mono text-xs tracking-wider bg-primary text-primary-foreground"
              onClick={() => navigate("/pricing")}
            >
              VIEW PLANS
            </Button>
            <Button
              variant="outline"
              className="w-full font-mono text-xs tracking-wider"
              onClick={() => navigate("/")}
            >
              BACK TO DASHBOARD
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
