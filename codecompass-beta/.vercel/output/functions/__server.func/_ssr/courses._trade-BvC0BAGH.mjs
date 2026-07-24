import {
  c as lazyRouteComponent,
  h as notFound,
  l as createFileRoute,
} from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TRADES } from "./curriculum-BoKKyowv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses._trade-BvC0BAGH.js
var $$splitNotFoundComponentImporter = () => import("./courses._trade-D-RXH5gi.mjs");
var $$splitComponentImporter = () => import("./courses._trade-BxHS3-ZT.mjs");
var Route = createFileRoute("/courses/$trade")({
  head: ({ params }) => {
    const t = TRADES.find((x) => x.id === params.trade);
    const title = t ? `${t.name} courses — Code Compass` : "Courses — Code Compass";
    const description = t
      ? `${t.name} courses for working tradesmen: ${t.blurb.toLowerCase()}.`
      : "Browse trade courses.";
    const url = `https://codecompass-beta.lovable.app/courses/${params.trade}`;
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
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://codecompass-beta.lovable.app/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t?.name ?? "Courses",
                item: url,
              },
            ],
          }),
        },
      ],
    };
  },
  loader: ({ params }) => {
    const t = TRADES.find((x) => x.id === params.trade);
    if (!t) throw notFound();
    return { trade: t };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
});
//#endregion
export { Route as t };
