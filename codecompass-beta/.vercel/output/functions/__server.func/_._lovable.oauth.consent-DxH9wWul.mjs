import { o as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as oauth, t as Route } from "./_._lovable.oauth.consent-DlpxAaLc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_._lovable.oauth.consent-DxH9wWul.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)(null);
  const clientName = details?.client?.client_name ?? details?.client?.name ?? "an external app";
  async function decide(approve) {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
    className: "mx-auto max-w-md px-5 py-16",
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
      className: "rounded-2xl border border-border bg-card p-8",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
          className: "text-[10px] uppercase tracking-[0.18em] text-primary",
          children: "Authorize connection",
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
          className: "mt-1 font-display text-2xl font-semibold",
          children: ["Connect ", clientName, " to your account"],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
          className: "mt-3 text-sm text-muted-foreground",
          children: [
            clientName,
            " will be able to call Code Compass tools while you are signed in — reading your progress, quiz results, and course list, and updating your active NEC edition.",
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
          className: "mt-2 text-xs text-muted-foreground",
          children:
            "This does not bypass Code Compass permissions. You can revoke access at any time.",
        }),
        error &&
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
            role: "alert",
            className:
              "mt-4 rounded-md border border-red-500/40 bg-red-500/5 p-3 text-sm text-red-400",
            children: error,
          }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
          className: "mt-6 flex gap-2",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
              disabled: busy,
              onClick: () => decide(true),
              className:
                "flex-1 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90 disabled:opacity-50",
              children: busy ? "…" : "Approve",
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
              disabled: busy,
              onClick: () => decide(false),
              className:
                "flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium hover:border-primary/60 disabled:opacity-50",
              children: "Cancel",
            }),
          ],
        }),
      ],
    }),
  });
}
//#endregion
export { Consent as component };
