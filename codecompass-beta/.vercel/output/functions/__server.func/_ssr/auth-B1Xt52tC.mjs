import {
  c as lazyRouteComponent,
  l as createFileRoute,
} from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-B1Xt52tC.js
var $$splitComponentImporter = () => import("./auth-C8FJYLkB.mjs");
var Route = createFileRoute("/auth")({
  validateSearch: (s) => ({ next: typeof s.next === "string" ? s.next : void 0 }),
  head: () => {
    const title = "Sign in — Code Compass";
    const description =
      "Sign in to Code Compass to sync your course progress, quiz scores, and NEC edition across devices.";
    const url = "https://codecompass-beta.lovable.app/auth";
    return {
      meta: [
        { title },
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: description,
        },
        {
          property: "og:url",
          content: url,
        },
      ],
      links: [
        {
          rel: "canonical",
          href: url,
        },
      ],
    };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component"),
});
//#endregion
export { Route as t };
