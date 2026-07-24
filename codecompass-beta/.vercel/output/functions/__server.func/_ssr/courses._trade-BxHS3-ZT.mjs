import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as coursesByTrade } from "./curriculum-BoKKyowv.mjs";
import { i as useProgress, t as courseProgress } from "./progress-DY0V9J-M.mjs";
import { t as Route } from "./courses._trade-BvC0BAGH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses._trade-BxHS3-ZT.js
var import_jsx_runtime = require_jsx_runtime();
function TradePage() {
  const { trade } = Route.useLoaderData();
  const { state } = useProgress();
  const courses = coursesByTrade(trade.id);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
    className: "mx-auto max-w-5xl px-5 pb-20 pt-10",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "flex items-center gap-2 text-xs text-muted-foreground",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
            to: "/",
            className: "hover:text-foreground",
            children: "Home",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: trade.name }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "mt-6 flex items-end gap-5",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
            className: "text-6xl",
            children: trade.icon,
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                className: "text-xs uppercase tracking-[0.2em] text-primary",
                children: "Trade track",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
                className: "font-display text-5xl font-semibold",
                children: trade.name,
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                className: "text-muted-foreground mt-1",
                children: trade.blurb,
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
        className: "mt-10 grid gap-4",
        children: courses.map((c) => {
          const lessons = c.modules.reduce((n, m) => n + m.lessons.length, 0);
          const quizzes = c.modules.length;
          const pct = courseProgress(state, c.id, lessons, quizzes);
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            Link,
            {
              to: "/course/$courseId",
              params: { courseId: c.id },
              search: { focus: void 0 },
              className:
                "block rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: "flex items-start justify-between gap-4",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                      className: "min-w-0",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                          className: "text-[10px] uppercase tracking-[0.16em] text-accent",
                          children: c.level,
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
                          className: "mt-1.5 font-display text-2xl font-semibold",
                          children: c.title,
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                          className: "text-sm text-muted-foreground mt-1",
                          children: c.tagline,
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                          className: "mt-3 text-sm",
                          children: c.why,
                        }),
                      ],
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                      className:
                        "shrink-0 grid place-items-center h-16 w-16 rounded-full border border-border text-sm font-semibold",
                      children: [pct, "%"],
                    }),
                  ],
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  className: "mt-5 h-1.5 w-full rounded-full bg-secondary overflow-hidden",
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                    className: "h-full bg-gradient-to-r from-primary to-accent",
                    style: { width: `${pct}%` },
                  }),
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: "mt-3 flex justify-between text-xs text-muted-foreground",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
                      children: [c.modules.length, " modules · ", lessons, " lessons"],
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                      className: "text-primary",
                      children: "Open course →",
                    }),
                  ],
                }),
              ],
            },
            c.id,
          );
        }),
      }),
    ],
  });
}
//#endregion
export { TradePage as component };
