import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { NecBanner, NecPill } from "@/components/NecBanner";
import { AuthNav, SignInPrompt } from "@/components/AuthNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold ember-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Off the blueprint</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page isn't in the manual. Head back to the shop floor.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something tripped a breaker. Try again or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Code Compass — NFPA 70 National Electrical Code (NEC) 2026 Edition" },
      {
        name: "description",
        content:
          "Code Compass — NFPA 70 National Electrical Code (NEC) 2026 Edition. The AI-driven predictive training engine for the NEC 2026 Edition, built for electricians, plumbers, and HVAC techs.",
      },
      { property: "og:site_name", content: "Code Compass" },
      {
        property: "og:title",
        content: "Code Compass — NFPA 70 National Electrical Code (NEC) 2026 Edition",
      },
      {
        property: "og:description",
        content:
          "NFPA 70 National Electrical Code (NEC) 2026 Edition — electrician-first learning app for NEC navigation, exam prep, and motor calculations. Short lessons, quizzes, and skill-building for apprentices and journeymen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Code Compass — NFPA 70 National Electrical Code (NEC) 2026 Edition",
      },
      {
        name: "twitter:description",
        content:
          "NFPA 70 National Electrical Code (NEC) 2026 Edition — electrician-first learning app for NEC navigation, exam prep, and motor calculations. Short lessons, quizzes, and skill-building for apprentices and journeymen.",
      },
      {
        property: "og:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/54157fe2-25d4-46ec-8be2-38f1a128b607",
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/54157fe2-25d4-46ec-8be2-38f1a128b607",
      },
      { name: "google-site-verification", content: "p8VivCTzdYiu7Di46MKJNpR6kdFgY39-O8ByvxFiD9I" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Code Compass",
          url: "https://codecompass.com",
          description:
            "NFPA 70 National Electrical Code (NEC) 2026 Edition — teaching tool for electricians, plumbers, and HVAC techs. NEC navigation, exam prep, and motor calculations.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Code Compass",
          url: "https://codecompass.com",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        {/* Anti-FOUC: apply saved theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){var t=localStorage.getItem("theme");document.documentElement.classList.toggle("dark",t!=="light")}()`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function SiteHeader() {
  const navCls =
    "px-3 py-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground";
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground font-black shadow-ember">
            C
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">Code Compass</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Electrical · PLC · Compliance
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link to="/study-tools" className={navCls}>
            NEC Lookup
          </Link>
          <Link to="/plc" className={navCls}>
            PLC Parsing
          </Link>
          <Link to="/data-center" className={navCls}>
            Data Center
          </Link>
          <Link to="/exam-prep" className={navCls}>
            Exam Prep
          </Link>
          <Link to="/practice-test" className={navCls}>
            Practice Test
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NecPill />
          <AuthNav />
        </div>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      <NecBanner />
      <SignInPrompt />
      <Outlet />
      <footer className="mx-auto max-w-6xl px-5 py-10 text-xs text-muted-foreground/70">
        Code Compass — NFPA 70 National Electrical Code (NEC) 2026 Edition. The AI-driven predictive
        training engine for the NEC, PLC systems, and data center compliance.
      </footer>
    </QueryClientProvider>
  );
}
