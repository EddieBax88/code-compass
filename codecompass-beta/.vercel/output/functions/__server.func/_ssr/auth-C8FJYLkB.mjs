import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-B1jDr4fN.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as Link, f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useAuth, t as lovable } from "./auth-Cfg3CyA2.mjs";
import { t as Route } from "./auth-B1Xt52tC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-C8FJYLkB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function sanitizeNext(raw) {
  if (typeof raw !== "string") return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}
function AuthPage() {
  const { user, loading, signInEmail } = useAuth();
  const nav = useNavigate();
  const next = sanitizeNext(Route.useSearch().next);
  const [mode, setMode] = (0, import_react.useState)("in");
  const [email, setEmail] = (0, import_react.useState)("");
  const [password, setPassword] = (0, import_react.useState)("");
  const [displayName, setDisplayName] = (0, import_react.useState)("");
  const [err, setErr] = (0, import_react.useState)(null);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [notice, setNotice] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    if (!loading && user)
      if (next) window.location.replace(next);
      else nav({ to: "/profile" });
  }, [loading, user, nav, next]);
  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await signInEmail(email, password);
        if (error) setErr(error.message);
      } else {
        const emailRedirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}${next ? `/auth?next=${encodeURIComponent(next)}` : "/"}`
            : void 0;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo,
            data: displayName ? { full_name: displayName } : void 0,
          },
        });
        if (error) setErr(error.message);
        else if (!data.session)
          setNotice("Check your email to confirm your account, then sign in.");
      }
    } finally {
      setBusy(false);
    }
  }
  async function google() {
    setErr(null);
    setBusy(true);
    const redirect_uri =
      typeof window !== "undefined"
        ? `${window.location.origin}${next ? `/auth?next=${encodeURIComponent(next)}` : ""}`
        : void 0;
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri });
    if (res.error) setErr(res.error.message ?? "Google sign-in failed.");
    setBusy(false);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
    className: "mx-auto max-w-md px-5 py-16",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "rounded-2xl border border-border bg-card p-8",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
            className: "text-[10px] uppercase tracking-[0.18em] text-primary",
            children: mode === "in" ? "Welcome back" : "Create your account",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
            className: "mt-1 font-display text-3xl font-semibold",
            children: mode === "in" ? "Sign in to Code Compass" : "Save your progress",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
            className: "mt-2 text-sm text-muted-foreground",
            children:
              mode === "in"
                ? "Your lesson and quiz progress syncs across every device you use."
                : "Any progress you've made as a guest on this device will be moved into your account automatically.",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
            onClick: google,
            disabled: busy,
            className:
              "mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium hover:border-primary/60 disabled:opacity-50",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                className: "text-lg",
                children: "🔑",
              }),
              " Continue with Google",
            ],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "my-5 flex items-center gap-3 text-xs text-muted-foreground",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                className: "h-px flex-1 bg-border",
              }),
              "or with email",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                className: "h-px flex-1 bg-border",
              }),
            ],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
            onSubmit: submit,
            className: "space-y-3",
            children: [
              mode === "up" &&
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
                  value: displayName,
                  onChange: (e) => setDisplayName(e.target.value),
                  placeholder: "Display name (optional)",
                  className:
                    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm",
                }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
                type: "email",
                required: true,
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "you@example.com",
                className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
                type: "password",
                required: true,
                minLength: 6,
                value: password,
                onChange: (e) => setPassword(e.target.value),
                placeholder: "Password (min 6 characters)",
                className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm",
              }),
              err &&
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  className: "text-sm text-red-500",
                  children: err,
                }),
              notice &&
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  className: "text-sm text-primary",
                  children: notice,
                }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                type: "submit",
                disabled: busy,
                className:
                  "w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90 disabled:opacity-50",
                children: busy ? "…" : mode === "in" ? "Sign in" : "Create account",
              }),
            ],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
            className: "mt-6 text-center text-sm text-muted-foreground",
            children:
              mode === "in"
                ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
                    children: [
                      "New here?",
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                        className: "text-primary hover:underline",
                        onClick: () => setMode("up"),
                        children: "Create an account",
                      }),
                    ],
                  })
                : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
                    children: [
                      "Already have one?",
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                        className: "text-primary hover:underline",
                        onClick: () => setMode("in"),
                        children: "Sign in",
                      }),
                    ],
                  }),
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
        className: "mt-6 text-center text-xs text-muted-foreground",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
          to: "/",
          className: "hover:text-foreground",
          children: "← Keep browsing as a guest",
        }),
      }),
    ],
  });
}
//#endregion
export { AuthPage as component };
