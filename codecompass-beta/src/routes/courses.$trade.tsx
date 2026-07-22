import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TRADES, coursesByTrade, type Trade } from "@/lib/curriculum";
import { useProgress, courseProgress } from "@/lib/progress";

export const Route = createFileRoute("/courses/$trade")({
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
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
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
              { "@type": "ListItem", position: 2, name: t?.name ?? "Courses", item: url },
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
  component: TradePage,
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-5 py-20 text-center">
      <h1 className="font-display text-4xl">Trade not found</h1>
      <Link to="/" className="mt-6 inline-block text-primary">
        ← Back home
      </Link>
    </main>
  ),
});

function TradePage() {
  const { trade } = Route.useLoaderData();
  const { state } = useProgress();
  const courses = coursesByTrade(trade.id as Trade);

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-10">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span>{trade.name}</span>
      </div>

      <div className="mt-6 flex items-end gap-5">
        <div className="text-6xl">{trade.icon}</div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-primary">Trade track</div>
          <h1 className="font-display text-5xl font-semibold">{trade.name}</h1>
          <p className="text-muted-foreground mt-1">{trade.blurb}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-4">
        {courses.map((c) => {
          const lessons = c.modules.reduce((n, m) => n + m.lessons.length, 0);
          const quizzes = c.modules.length;
          const pct = courseProgress(state, c.id, lessons, quizzes);
          return (
            <Link
              key={c.id}
              to="/course/$courseId"
              params={{ courseId: c.id }}
              search={{ focus: undefined }}
              className="block rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-accent">
                    {c.level}
                  </div>
                  <h2 className="mt-1.5 font-display text-2xl font-semibold">{c.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{c.tagline}</p>
                  <p className="mt-3 text-sm">{c.why}</p>
                </div>
                <div className="shrink-0 grid place-items-center h-16 w-16 rounded-full border border-border text-sm font-semibold">
                  {pct}%
                </div>
              </div>
              <div className="mt-5 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span>
                  {c.modules.length} modules · {lessons} lessons
                </span>
                <span className="text-primary">Open course →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
