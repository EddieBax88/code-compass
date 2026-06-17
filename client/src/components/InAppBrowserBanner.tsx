import { useState } from "react";
import { Copy, ExternalLink, X } from "lucide-react";
import {
  getInAppBrowserLabel,
  useInAppBrowser,
} from "@/hooks/useInAppBrowser";

/**
 * Shown when the app is opened inside a social in-app browser
 * (Messenger, Instagram, Facebook, TikTok, etc.). Google Sign-In is blocked
 * in those webviews ("Error 403: disallowed_useragent"), so we tell the user
 * how to open the site in a real browser where login works.
 */
export function InAppBrowserBanner() {
  const { browser, isInApp, ios } = useInAppBrowser();
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isInApp || dismissed) return null;

  const appName = getInAppBrowserLabel(browser);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select-and-prompt is overkill; ignore silently.
    }
  };

  const instruction = ios
    ? `Tap the ••• menu (top-right), then "Open in Safari".`
    : `Tap the ⋮ menu (top-right), then "Open in Chrome" / "Open in browser".`;

  return (
    <div className="sticky top-0 z-[60] w-full border-b border-amber-500/40 bg-amber-500/10 backdrop-blur">
      <div className="container flex items-start gap-3 py-3">
        <ExternalLink className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div className="flex-1 text-sm leading-relaxed">
          <p className="font-semibold text-amber-500">
            Sign-in won't work inside {appName}.
          </p>
          <p className="text-foreground/80">
            {appName}'s built-in browser blocks Google login. To create your
            account or sign in: <span className="font-medium">{instruction}</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={copyUrl}
              className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-500 transition hover:bg-amber-500/20"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? "Link copied" : "Copy link"}
            </button>
            <span className="text-xs text-foreground/60">
              Paste it into Safari or Chrome.
            </span>
          </div>
        </div>
        <button
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
          className="rounded-md p-1 text-foreground/50 transition hover:bg-foreground/10 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
