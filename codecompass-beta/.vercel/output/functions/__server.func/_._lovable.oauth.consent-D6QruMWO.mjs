import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_._lovable.oauth.consent-D6QruMWO.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error }) =>
  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
    className: "mx-auto max-w-md px-5 py-16",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
        className: "font-display text-2xl font-semibold",
        children: "Authorization error",
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
        className: "mt-2 text-sm text-muted-foreground",
        children: [
          "We couldn't load this authorization request: ",
          String(error?.message ?? error),
        ],
      }),
    ],
  });
//#endregion
export { SplitErrorComponent as errorComponent };
