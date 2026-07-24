import {
  c as lazyRouteComponent,
  h as notFound,
  l as createFileRoute,
} from "../_libs/@tanstack/react-router+[...].mjs";
import { i as courseById, n as TRADES } from "./curriculum-BoKKyowv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/course._courseId-DrjxAaiN.js
var $$splitNotFoundComponentImporter = () => import("./course._courseId-DLWmwhrv.mjs");
var $$splitComponentImporter = () => import("./course._courseId-CpV9MbB2.mjs");
var Route = createFileRoute("/course/$courseId")({
  head: ({ params }) => {
    const c = courseById(params.courseId);
    const title = c ? `${c.title} — Code Compass` : "Course — Code Compass";
    const description = c?.tagline ?? "Trade course.";
    const url = `https://codecompass-beta.lovable.app/course/${params.courseId}`;
    const trade = c ? TRADES.find((t) => t.id === c.trade) : void 0;
    const tradeUrl = trade ? `https://codecompass-beta.lovable.app/courses/${trade.id}` : void 0;
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
        {
          property: "og:type",
          content: "article",
        },
      ],
      links: [
        {
          rel: "canonical",
          href: url,
        },
      ],
      scripts: c
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Course",
                name: c.title,
                description: c.tagline,
                url,
                provider: {
                  "@type": "Organization",
                  name: "Code Compass",
                  sameAs: "https://codecompass-beta.lovable.app",
                },
              }),
            },
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
                  ...(trade && tradeUrl
                    ? [
                        {
                          "@type": "ListItem",
                          position: 2,
                          name: trade.name,
                          item: tradeUrl,
                        },
                      ]
                    : []),
                  {
                    "@type": "ListItem",
                    position: trade ? 3 : 2,
                    name: c.title,
                    item: url,
                  },
                ],
              }),
            },
          ]
        : [],
    };
  },
  validateSearch: (search) => ({ focus: typeof search.focus === "string" ? search.focus : void 0 }),
  loader: ({ params }) => {
    const c = courseById(params.courseId);
    if (!c) throw notFound();
    return { course: c };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
});
//#endregion
export { Route as t };
