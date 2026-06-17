import { useEffect, useState } from "react";

export type InAppBrowser =
  | "messenger"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "twitter"
  | "linkedin"
  | "snapchat"
  | "line"
  | "other"
  | null;

/**
 * Detects social/in-app browsers (Messenger, Instagram, Facebook, TikTok, etc.).
 * Google Sign-In throws "Error 403: disallowed_useragent" inside these embedded
 * webviews, so we detect them and prompt the user to open in a real browser.
 */
export function detectInAppBrowser(ua?: string): InAppBrowser {
  if (typeof navigator === "undefined" && !ua) return null;
  const agent = (ua ?? navigator.userAgent ?? "").toLowerCase();

  // Facebook family (Messenger reports FBAN/FBAV/MessengerForiOS)
  if (/\bfban\b|\bfbav\b|\bfb_iab\b|messenger/.test(agent)) {
    if (/messenger/.test(agent)) return "messenger";
    return "facebook";
  }
  if (/instagram/.test(agent)) return "instagram";
  // TikTok webview markers
  if (/bytedance|musical_ly|tiktok|trill|aweme/.test(agent)) return "tiktok";
  if (/twitter/.test(agent)) return "twitter";
  if (/linkedin/.test(agent)) return "linkedin";
  if (/snapchat/.test(agent)) return "snapchat";
  if (/\bline\//.test(agent)) return "line";

  return null;
}

export function getInAppBrowserLabel(b: InAppBrowser): string {
  switch (b) {
    case "messenger":
      return "Messenger";
    case "facebook":
      return "Facebook";
    case "instagram":
      return "Instagram";
    case "tiktok":
      return "TikTok";
    case "twitter":
      return "X / Twitter";
    case "linkedin":
      return "LinkedIn";
    case "snapchat":
      return "Snapchat";
    case "line":
      return "LINE";
    default:
      return "this app";
  }
}

/** True when running on an iOS device (Safari is the escape browser). */
export function isIOS(ua?: string): boolean {
  const agent = (ua ?? (typeof navigator !== "undefined" ? navigator.userAgent : "")).toLowerCase();
  return /iphone|ipad|ipod/.test(agent) || (/macintosh/.test(agent) && typeof navigator !== "undefined" && navigator.maxTouchPoints > 1);
}

export function useInAppBrowser(): { browser: InAppBrowser; isInApp: boolean; ios: boolean } {
  const [browser, setBrowser] = useState<InAppBrowser>(null);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setBrowser(detectInAppBrowser());
    setIos(isIOS());
  }, []);

  return { browser, isInApp: browser !== null, ios };
}
