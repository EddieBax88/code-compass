import React from "react";
import { Zap, X, ShieldCheck, CheckCircle2 } from "lucide-react";

interface FoundingMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function FoundingMemberModal({
  isOpen,
  onClose,
  title = "You've reached your free limit",
  description = "You've used your 1 free AI question. Become a Founding Member for unlimited Gemini-powered NEC searches, practice test drills, and PLC tools.",
}: FoundingMemberModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div className="relative max-w-md w-full rounded-2xl border border-amber-500/40 bg-card p-6 shadow-2xl text-center space-y-4">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 font-bold text-xl">
          <Zap className="h-6 w-6 fill-amber-500 text-amber-500" />
        </div>

        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h2>

        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

        <div className="space-y-2 text-left bg-secondary/40 rounded-xl p-3.5 text-xs text-foreground/90">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Unlimited 4-Step Code Compass Method lookups across all NEC editions</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Full 25-question timed state licensing practice drills</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Rockwell L5X industrial PLC parsing & ladder logic rendering</span>
          </div>
        </div>

        <div className="pt-2">
          <a
            href="https://buy.stripe.com/7sYeVd6waag23eygKZ3sI02"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-6 py-3.5 text-base font-bold text-black shadow-lg transition"
          >
            Founding Member - $1.99
          </a>
        </div>

        <p className="text-[11px] text-muted-foreground">
          No contracts. Cancel anytime. Instant server-backed access.
        </p>

        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground pt-1 transition"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
