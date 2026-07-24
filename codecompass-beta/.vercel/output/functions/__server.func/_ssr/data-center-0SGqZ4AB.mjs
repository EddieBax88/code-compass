import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ShieldCheck, d as ArrowLeft } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-center-0SGqZ4AB.js
var import_jsx_runtime = require_jsx_runtime();
function DataCenterPage() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
    className: "mx-auto max-w-3xl px-5 py-14",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
        to: "/",
        className:
          "inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }),
          " Back to dashboard",
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "mt-6 flex items-center gap-3",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
            className:
              "grid h-11 w-11 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-ember",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
              className: "h-5 w-5",
            }),
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
            className: "text-[10px] uppercase tracking-[0.2em] text-accent",
            children: "Module 03",
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
        className: "mt-3 font-display text-4xl font-semibold",
        children: "Data Center Compliance",
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
        className: "mt-2 text-muted-foreground max-w-xl",
        children:
          "Arc-flash boundary calcs and EMS compliance workflows for hyperscale and colo environments. Built to NFPA 70E and NEC Article 645.",
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className:
          "mt-10 rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
            className: "text-[10px] uppercase tracking-[0.18em] text-primary",
            children: "In active development",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
            className: "mt-2 font-display text-xl font-semibold",
            children: "Compliance engine online next release",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
            className: "mt-2 text-sm text-muted-foreground max-w-md mx-auto",
            children:
              "Incident-energy tables, working-boundary calculators, and EMS audit checklists are being wired to the predictive training engine.",
          }),
        ],
      }),
    ],
  });
}
//#endregion
export { DataCenterPage as component };
