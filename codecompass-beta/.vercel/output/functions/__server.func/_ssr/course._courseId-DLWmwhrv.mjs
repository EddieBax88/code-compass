import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/course._courseId-DLWmwhrv.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () =>
  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
    className: "mx-auto max-w-3xl px-5 py-20 text-center",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
        className: "font-display text-4xl",
        children: "Course not found",
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
        to: "/",
        className: "mt-6 inline-block text-primary",
        children: "← Back home",
      }),
    ],
  });
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
