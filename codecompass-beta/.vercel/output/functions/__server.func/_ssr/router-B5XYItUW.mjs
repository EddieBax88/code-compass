import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as lazyRouteComponent, d as Link, i as HeadContent, l as createFileRoute, o as createRouter, p as useRouter, r as Scripts, s as Outlet, u as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$19 } from "../_._lovable.oauth.consent-DlpxAaLc.mjs";
import { n as useAuth } from "./auth-Cfg3CyA2.mjs";
import { t as Route$20 } from "./auth-B1Xt52tC.mjs";
import { r as useNecEdition, t as NEC_EDITIONS } from "./nec-edition-7h2QGTQt.mjs";
import { t as COURSES } from "./curriculum-BoKKyowv.mjs";
import { t as Route$21 } from "./course._courseId-DrjxAaiN.mjs";
import { t as Route$22 } from "./courses._trade-BvC0BAGH.mjs";
import { i as Sun, o as Moon } from "../_libs/lucide-react.mjs";
import { t as Route$23 } from "./share._token-BsQZfGql.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as createTanStackListToolsHandler, c as _enum, i as createTanStackInvokeToolHandler, l as string, n as defineMcp, o as createTanStackMcpHandler, r as defineTool, s as createTanStackOAuthProtectedResourceMetadataHandler, t as auth } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
import { t as XMLParser } from "../_libs/fast-xml-parser+[...].mjs";
import { createHash } from "crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B5XYItUW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-5Me4Rbd7.css";
function NecBanner() {
	const { edition, setEdition, hydrated } = useNecEdition();
	if (!hydrated) return null;
	if (!edition) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-primary/40 bg-primary/10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-3 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold",
					children: "Pick your NEC edition:"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "Every code reference in the app adjusts to match your jurisdiction."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ml-auto flex gap-2",
					children: NEC_EDITIONS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setEdition(e),
						className: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/70",
						children: ["NEC ", e]
					}, e))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/study-tools",
					className: "w-full text-xs text-muted-foreground sm:w-auto",
					children: "Unsure? Check with your local AHJ or your electrical inspector — cities and states adopt different NEC editions. Learn more →"
				})
			]
		})
	});
	return null;
}
function NecPill() {
	const { edition, hydrated } = useNecEdition();
	if (!hydrated || !edition) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/study-tools",
		className: "hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/60",
		title: "Change NEC edition",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-accent" }),
			"NEC ",
			edition
		]
	});
}
function AuthNav() {
	const { user, loading, signOut } = useAuth();
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-16" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/auth",
		search: { next: void 0 },
		className: "rounded-md border border-primary/60 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition",
		children: "Sign in"
	});
	const initial = (user.email ?? "?").slice(0, 1).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/profile",
			"aria-label": `Open profile for ${user.email ?? "your account"}`,
			className: "flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1 text-sm hover:border-primary/60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground text-[11px] font-semibold",
				children: initial
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden md:inline max-w-[10rem] truncate",
				children: user.email
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => signOut(),
			className: "hidden sm:inline text-xs text-muted-foreground hover:text-foreground px-2 py-1",
			children: "Sign out"
		})]
	});
}
function SignInPrompt() {
	const { user, loading } = useAuth();
	if (loading || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border/60 bg-secondary/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-2 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: "You're using Code Compass as a guest — your progress is saved on this device only."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/auth",
				search: { next: void 0 },
				className: "ml-auto rounded-md bg-primary px-3 py-1 font-medium text-primary-foreground hover:opacity-90",
				children: "Save progress across devices →"
			})]
		})
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function ThemeToggle() {
	const [theme, setTheme] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") return localStorage.getItem("theme") === "light" ? "light" : "dark";
		return "dark";
	});
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);
	const toggle = () => {
		const next = theme === "light" ? "dark" : "light";
		setTheme(next);
		localStorage.setItem("theme", next);
		document.documentElement.classList.toggle("dark", next === "dark");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "ghost",
		size: "icon",
		onClick: toggle,
		"aria-label": "Toggle theme",
		className: "h-9 w-9",
		children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
	});
}
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold ember-text",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Off the blueprint"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "That page isn't in the manual. Head back to the shop floor."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something tripped a breaker. Try again or head home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$18 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Code Compass — NFPA 70 National Electrical Code (NEC) 2026 Edition" },
			{
				name: "description",
				content: "Code Compass — NFPA 70 National Electrical Code (NEC) 2026 Edition. The AI-driven predictive training engine for the NEC 2026 Edition, built for electricians, plumbers, and HVAC techs."
			},
			{
				property: "og:site_name",
				content: "Code Compass"
			},
			{
				property: "og:title",
				content: "Code Compass — NFPA 70 National Electrical Code (NEC) 2026 Edition"
			},
			{
				property: "og:description",
				content: "NFPA 70 National Electrical Code (NEC) 2026 Edition — electrician-first learning app for NEC navigation, exam prep, and motor calculations. Short lessons, quizzes, and skill-building for apprentices and journeymen."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Code Compass — NFPA 70 National Electrical Code (NEC) 2026 Edition"
			},
			{
				name: "twitter:description",
				content: "NFPA 70 National Electrical Code (NEC) 2026 Edition — electrician-first learning app for NEC navigation, exam prep, and motor calculations. Short lessons, quizzes, and skill-building for apprentices and journeymen."
			},
			{
				property: "og:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/54157fe2-25d4-46ec-8be2-38f1a128b607"
			},
			{
				name: "twitter:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/54157fe2-25d4-46ec-8be2-38f1a128b607"
			},
			{
				name: "google-site-verification",
				content: "p8VivCTzdYiu7Di46MKJNpR6kdFgY39-O8ByvxFiD9I"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			type: "image/svg+xml",
			href: "/favicon.svg"
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "WebSite",
				name: "Code Compass",
				url: "https://codecompass.com",
				description: "NFPA 70 National Electrical Code (NEC) 2026 Edition — teaching tool for electricians, plumbers, and HVAC techs. NEC navigation, exam prep, and motor calculations."
			})
		}, {
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Organization",
				name: "Code Compass",
				url: "https://codecompass.com"
			})
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `!function(){var t=localStorage.getItem("theme");document.documentElement.classList.toggle("dark",t!=="light")}()` } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function SiteHeader() {
	const navCls = "px-3 py-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2.5 group shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground font-black shadow-ember",
						children: "C"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-lg font-semibold",
							children: "Code Compass"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground",
							children: "Electrical · PLC · Compliance"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden md:flex items-center gap-1 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/study-tools",
							className: navCls,
							children: "NEC Lookup"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/plc",
							className: navCls,
							children: "PLC Parsing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/data-center",
							className: navCls,
							children: "Data Center"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/exam-prep",
							className: navCls,
							children: "Exam Prep"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/practice-test",
							className: navCls,
							children: "Practice Test"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NecPill, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthNav, {})
					]
				})
			]
		})
	});
}
function RootComponent() {
	const { queryClient } = Route$18.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NecBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInPrompt, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mx-auto max-w-6xl px-5 py-10 text-xs text-muted-foreground/70",
				children: "Code Compass — NFPA 70 National Electrical Code (NEC) 2026 Edition. The AI-driven predictive training engine for the NEC, PLC systems, and data center compliance."
			})
		]
	});
}
var $$splitComponentImporter$7 = () => import("./study-tools-MeKe3IzX.mjs");
var Route$17 = createFileRoute("/study-tools")({
	head: () => {
		const title = "AI Co-Pilot — Code Compass";
		const description = "Ask the Code Compass AI Co-Pilot any NEC exam question and get a fast, cited answer.";
		const url = "https://codecompass-beta.lovable.app/study-tools";
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var BASE_URL = "https://codecompass-beta.lovable.app";
var Route$16 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[
			{
				path: "/",
				changefreq: "weekly",
				priority: "1.0"
			},
			{
				path: "/study-tools",
				changefreq: "weekly",
				priority: "0.9"
			},
			{
				path: "/plc",
				changefreq: "weekly",
				priority: "0.9"
			},
			{
				path: "/data-center",
				changefreq: "weekly",
				priority: "0.9"
			},
			{
				path: "/courses/electrical",
				changefreq: "weekly",
				priority: "0.8"
			},
			{
				path: "/exam-prep",
				changefreq: "weekly",
				priority: "0.8"
			},
			{
				path: "/practice-test",
				changefreq: "weekly",
				priority: "0.9"
			},
			{
				path: "/auth",
				changefreq: "monthly",
				priority: "0.4"
			}
		].map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$6 = () => import("./profile-CjezTaqa.mjs");
var Route$15 = createFileRoute("/profile")({
	head: () => ({
		meta: [
			{ title: "Your progress — Code Compass" },
			{
				name: "description",
				content: "Your Code Compass course progress, quiz scores, and instructor share links."
			},
			{
				name: "robots",
				content: "noindex, nofollow"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://codecompass-beta.lovable.app/profile"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./practice-test-5EOdRs0i.mjs");
var Route$14 = createFileRoute("/practice-test")({
	head: () => {
		const title = "Journeyman Electrician Practice Test — Code Compass";
		const description = "Free 25-question journeyman electrician practice test. NEC-based multiple choice with instant feedback, timer, and explanations for the 2017, 2020, and 2023 editions.";
		const url = "https://codecompass-beta.lovable.app/practice-test";
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				},
				{
					property: "og:type",
					content: "article"
				},
				{
					name: "twitter:title",
					content: title
				},
				{
					name: "twitter:description",
					content: description
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}],
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Quiz",
					name: "Journeyman Electrician Practice Test",
					about: "National Electrical Code (NEC)",
					educationalLevel: "Journeyman electrician",
					url,
					provider: {
						"@type": "Organization",
						name: "Code Compass",
						url: "https://codecompass-beta.lovable.app"
					}
				})
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./plc-CFpvc9SB.mjs");
var Route$13 = createFileRoute("/plc")({
	head: () => {
		const title = "Industrial PLC Parsing (L5X) — NFPA 70 NEC 2026 Edition | Code Compass";
		const description = "NFPA 70 National Electrical Code (NEC) 2026 Edition — upload Rockwell L5X exports and parse tags, routines, and rung logic with SHA-256 verification for NEC-compliant controls-engineer troubleshooting.";
		const url = "https://codecompass.com/plc";
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
function supabaseForUser$2(ctx) {
	return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
		global: { headers: { Authorization: "Bearer " + ctx.getToken() } },
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
var get_my_progress_default = defineTool({
	name: "get_my_progress",
	title: "Get my Code Compass progress",
	description: "Return an overall summary of the signed-in user's Code Compass progress: lessons completed, quizzes attempted, quizzes passed (>=80%), and per-course completion percentages.",
	inputSchema: {},
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async (_input, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Not authenticated"
			}],
			isError: true
		};
		const supa = supabaseForUser$2(ctx);
		const userId = ctx.getUserId();
		const [{ data: lessons, error: le }, { data: quizzes, error: qe }, { data: profile }] = await Promise.all([
			supa.from("lesson_completions").select("course_id, lesson_key").eq("user_id", userId),
			supa.from("quiz_results").select("course_id, module_id, best_score_pct, best_passed, attempts").eq("user_id", userId),
			supa.from("profiles").select("nec_edition, display_name").eq("id", userId).maybeSingle()
		]);
		if (le || qe) return {
			content: [{
				type: "text",
				text: (le ?? qe).message
			}],
			isError: true
		};
		const lessonsByCourse = /* @__PURE__ */ new Map();
		for (const r of lessons ?? []) {
			if (!lessonsByCourse.has(r.course_id)) lessonsByCourse.set(r.course_id, /* @__PURE__ */ new Set());
			lessonsByCourse.get(r.course_id).add(r.lesson_key);
		}
		const quizzesByCourse = /* @__PURE__ */ new Map();
		for (const q of quizzes ?? []) {
			if (!quizzesByCourse.has(q.course_id)) quizzesByCourse.set(q.course_id, /* @__PURE__ */ new Map());
			quizzesByCourse.get(q.course_id).set(q.module_id, {
				pct: q.best_score_pct,
				passed: q.best_passed
			});
		}
		let totalLessons = 0, completedLessons = 0, totalQuizzes = 0, passedQuizzes = 0;
		const perCourse = COURSES.map((c) => {
			const doneL = lessonsByCourse.get(c.id) ?? /* @__PURE__ */ new Set();
			const cQ = quizzesByCourse.get(c.id) ?? /* @__PURE__ */ new Map();
			let lc = 0, qc = 0, pc = 0;
			for (const m of c.modules) {
				for (const l of m.lessons) {
					totalLessons++;
					lc++;
					if (doneL.has(l.id)) completedLessons++;
				}
				if (m.quiz && m.quiz.questions.length > 0) {
					totalQuizzes++;
					qc++;
					if (cQ.get(m.id)?.passed) {
						passedQuizzes++;
						pc++;
					}
				}
			}
			const done = [...doneL].filter((k) => c.modules.some((m) => m.lessons.some((l) => l.id === k))).length;
			const totalItems = lc + qc;
			const doneItems = done + pc;
			return {
				course_id: c.id,
				title: c.title,
				trade: c.trade,
				completion_pct: totalItems ? Math.round(doneItems / totalItems * 100) : 0,
				lessons_completed: done,
				lessons_total: lc,
				quizzes_passed: pc,
				quizzes_total: qc
			};
		});
		const summary = {
			user_id: userId,
			display_name: profile?.display_name ?? null,
			nec_edition: profile?.nec_edition ?? null,
			totals: {
				lessons_completed: completedLessons,
				lessons_total: totalLessons,
				quizzes_passed: passedQuizzes,
				quizzes_total: totalQuizzes,
				courses_completed: perCourse.filter((c) => c.completion_pct === 100).length
			},
			courses: perCourse
		};
		return {
			content: [{
				type: "text",
				text: JSON.stringify(summary, null, 2)
			}],
			structuredContent: summary
		};
	}
});
function supabaseForUser$1(ctx) {
	return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
		global: { headers: { Authorization: "Bearer " + ctx.getToken() } },
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
var list_my_quiz_results_default = defineTool({
	name: "list_my_quiz_results",
	title: "List my quiz results",
	description: "List the signed-in user's quiz results across Code Compass modules, including best score, attempts, and pass status. Optionally filter by course_id.",
	inputSchema: { course_id: string().optional().describe("Optional Code Compass course id to filter by.") },
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ course_id }, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Not authenticated"
			}],
			isError: true
		};
		let q = supabaseForUser$1(ctx).from("quiz_results").select("course_id, module_id, attempts, best_score_pct, best_correct, best_total, best_passed, last_score_pct, last_passed, last_at").eq("user_id", ctx.getUserId()).order("last_at", { ascending: false });
		if (course_id) q = q.eq("course_id", course_id);
		const { data, error } = await q;
		if (error) return {
			content: [{
				type: "text",
				text: error.message
			}],
			isError: true
		};
		return {
			content: [{
				type: "text",
				text: JSON.stringify(data ?? [], null, 2)
			}],
			structuredContent: { results: data ?? [] }
		};
	}
});
var list_courses_default = defineTool({
	name: "list_courses",
	title: "List Code Compass courses",
	description: "List Code Compass courses and their modules with lesson and quiz counts. Optionally filter by trade.",
	inputSchema: { trade: _enum([
		"electrical",
		"plumbing",
		"hvac"
	]).optional().describe("Optional trade filter.") },
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: ({ trade }) => {
		const shape = (trade ? COURSES.filter((c) => c.trade === trade) : COURSES).map((c) => ({
			id: c.id,
			title: c.title,
			trade: c.trade,
			level: c.level,
			modules: c.modules.map((m) => ({
				id: m.id,
				title: m.title,
				lessons: m.lessons.length,
				quiz_questions: m.quiz?.questions.length ?? 0
			}))
		}));
		return {
			content: [{
				type: "text",
				text: JSON.stringify(shape, null, 2)
			}],
			structuredContent: { courses: shape }
		};
	}
});
function supabaseForUser(ctx) {
	return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
		global: { headers: { Authorization: "Bearer " + ctx.getToken() } },
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
var set_nec_edition_default = defineTool({
	name: "set_nec_edition",
	title: "Set my NEC edition",
	description: "Update the signed-in user's active NEC edition (2017, 2020, or 2023). This edition is used for citations across Code Compass lessons and quizzes.",
	inputSchema: { edition: _enum([
		"2017",
		"2020",
		"2023"
	]).describe("NEC edition to make active.") },
	annotations: {
		readOnlyHint: false,
		destructiveHint: false,
		idempotentHint: true
	},
	handler: async ({ edition }, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Not authenticated"
			}],
			isError: true
		};
		const { error } = await supabaseForUser(ctx).from("profiles").update({ nec_edition: edition }).eq("id", ctx.getUserId());
		if (error) return {
			content: [{
				type: "text",
				text: error.message
			}],
			isError: true
		};
		return {
			content: [{
				type: "text",
				text: `NEC edition set to ${edition}.`
			}],
			structuredContent: { nec_edition: edition }
		};
	}
});
var mcp_default = defineMcp({
	name: "code-compass-mcp",
	title: "Code Compass",
	version: "0.1.0",
	instructions: "Tools for a signed-in Code Compass user. Use these to check their NEC learning progress, list courses, review quiz results, and set the active NEC edition used for code citations.",
	auth: auth.oauth.issuer({
		issuer: `https://project-ref-unset.supabase.co/auth/v1`,
		acceptedAudiences: "authenticated"
	}),
	tools: [
		get_my_progress_default,
		list_my_quiz_results_default,
		list_courses_default,
		set_nec_edition_default
	]
});
var Route$12 = createFileRoute("/mcp")({ server: { handlers: { ANY: createTanStackMcpHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var $$splitComponentImporter$3 = () => import("./exam-prep-BFiCMyD0.mjs");
var Route$11 = createFileRoute("/exam-prep")({
	head: () => {
		const title = "Exam Prep — Code Compass";
		const description = "Timed NEC drills: Speed-Find lookups, motor calculations, and Code Hunt article recall to sharpen your journeyman and master exam skills.";
		const url = "https://codecompass-beta.lovable.app/exam-prep";
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./data-center-0SGqZ4AB.mjs");
var Route$10 = createFileRoute("/data-center")({
	head: () => {
		const title = "Data Center Compliance (Arc Flash / EMS) — Code Compass";
		const description = "Arc-flash boundary calculations and EMS compliance workflows for hyperscale and colo facilities. Built to NFPA 70E and NEC Article 645.";
		const url = "https://codecompass-beta.lovable.app/data-center";
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./routes-Cq925E4C.mjs");
var Route$9 = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "Code Compass - NEC Exam Prep" },
			{
				name: "description",
				content: "Automating NEC Compliance and PLC Logic Translation for Active Data Centers. Elite training for electrical professionals."
			},
			{
				property: "og:title",
				content: "Code Compass - NEC Exam Prep"
			},
			{
				property: "og:description",
				content: "Elite training weapon for electrical apprentices. NEC 2026 rapid lookup, PLC parsing, and data-center compliance."
			},
			{
				property: "og:url",
				content: "https://codecompass-beta.lovable.app/"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://codecompass-beta.lovable.app/"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./dev.motor-calcs-BXBED-uY.mjs");
var Route$8 = createFileRoute("/dev/motor-calcs")({
	head: () => ({ meta: [{ title: "Motor-Calc Diagnostics (Internal) — Code Compass" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
/**
* Stripe Webhook — receives payment events and updates user entitlements.
* Ported from root server/stripeWebhook.ts.
*
* Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
* Register this URL in Stripe Dashboard: https://codecompass.work/api/stripe-webhook
*/
var Route$7 = createFileRoute("/api/stripe-webhook")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const stripeKey = process.env.STRIPE_SECRET_KEY;
		const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
		if (!stripeKey || !webhookSecret) {
			console.error("[Webhook] Stripe keys not configured");
			return new Response("Stripe not configured", { status: 500 });
		}
		const rawBody = await request.text();
		const sig = request.headers.get("stripe-signature");
		if (!sig) return new Response("Missing stripe-signature", { status: 400 });
		const crypto = await import("crypto");
		crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
		const timestamp = sig.split(",")[0]?.replace("t=", "");
		const sigValues = sig.split(",").filter((s) => s.startsWith("v1=")).map((s) => s.replace("v1=", ""));
		const payload = `${timestamp}.${rawBody}`;
		const computed = crypto.createHmac("sha256", webhookSecret).update(payload).digest("hex");
		if (!sigValues.some((v) => crypto.timingSafeEqual(Buffer.from(v), Buffer.from(computed)))) {
			console.error("[Webhook] Signature verification failed");
			return new Response("Webhook signature verification failed", { status: 400 });
		}
		const event = JSON.parse(rawBody);
		if (event.id?.startsWith("evt_test_")) return new Response(JSON.stringify({ verified: true }), { headers: { "content-type": "application/json" } });
		console.log(`[Webhook] Event: ${event.type} | ID: ${event.id}`);
		if (event.type === "checkout.session.completed") {
			const session = event.data.object;
			const userId = session.metadata?.user_id;
			if (userId && session.payment_status === "paid") {
				const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
				const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
				if (supabaseUrl && serviceKey) {
					await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}`, {
						method: "PATCH",
						headers: {
							apikey: serviceKey,
							Authorization: `Bearer ${serviceKey}`,
							"Content-Type": "application/json",
							Prefer: "return=minimal"
						},
						body: JSON.stringify({
							subscription_status: "active",
							subscription_plan: "lifetime",
							stripe_customer_id: session.customer
						})
					});
					console.log(`[Webhook] Granted lifetime access to user ${userId}`);
				}
			}
		}
		return new Response(JSON.stringify({ received: true }), { headers: { "content-type": "application/json" } });
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : "Unknown error";
		console.error("[Webhook] Processing error:", errMsg);
		return new Response(JSON.stringify({ error: "Webhook processing error" }), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
} } } });
/**
* Stripe Checkout — creates a one-time payment session for Lifetime Access ($39.99).
* Ported from root server/routers.ts stripe.createCheckoutSession.
*
* Env: STRIPE_SECRET_KEY, STRIPE_LIFETIME_PRICE_ID (optional, defaults to test price)
*/
var LIFETIME_PRICE_ID = process.env.STRIPE_LIFETIME_PRICE_ID ?? "price_1Ten4FRjzbxMHVlJikIz0EJR";
var Route$6 = createFileRoute("/api/stripe-checkout")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const stripeKey = process.env.STRIPE_SECRET_KEY;
		if (!stripeKey) return new Response(JSON.stringify({ error: "Stripe not configured" }), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
		const body = await request.json().catch(() => ({}));
		const origin = body.origin || new URL(request.url).origin;
		const customerEmail = body.customerEmail || void 0;
		const sessionRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${stripeKey}`,
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: new URLSearchParams({
				mode: "payment",
				"payment_method_types[]": "card",
				"line_items[0][price]": LIFETIME_PRICE_ID,
				"line_items[0][quantity]": "1",
				allow_promotion_codes: "true",
				success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${origin}/payment-cancel`,
				...customerEmail ? { customer_email: customerEmail } : {},
				"metadata[plan_id]": "lifetime"
			})
		});
		if (!sessionRes.ok) {
			const err = await sessionRes.text();
			console.error("[Stripe Checkout] API error:", err);
			return new Response(JSON.stringify({
				error: "Stripe API error",
				detail: err
			}), {
				status: 502,
				headers: { "content-type": "application/json" }
			});
		}
		const session = await sessionRes.json();
		return new Response(JSON.stringify({
			url: session.url,
			id: session.id
		}), {
			status: 200,
			headers: { "content-type": "application/json" }
		});
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : "Unknown error";
		console.error("[Stripe Checkout] Error:", errMsg);
		return new Response(JSON.stringify({
			error: "Failed to create checkout session",
			message: errMsg
		}), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
} } } });
var VALID_CONTACTS = /* @__PURE__ */ new Set([
	"XIC",
	"XIO",
	"EQU",
	"NEQ",
	"LES",
	"GRT",
	"LEQ",
	"GEQ",
	"LIM",
	"MEQ",
	"FSC",
	"FSO",
	"FSU",
	"AFI",
	"ONS",
	"OSF",
	"OSR"
]);
var VALID_OUTPUTS = /* @__PURE__ */ new Set([
	"OTE",
	"OTL",
	"OTU"
]);
var VALID_FUNCTION_BLOCKS = /* @__PURE__ */ new Set([
	"TON",
	"TOF",
	"RTO",
	"CTU",
	"CTD",
	"RES",
	"MOV",
	"MVM",
	"ADD",
	"SUB",
	"MUL",
	"DIV",
	"MOD",
	"CPT",
	"FSC",
	"JSR",
	"SBR",
	"RET",
	"FOR",
	"NXT",
	"BRK",
	"MSG",
	"GSV",
	"SSV",
	"SCL",
	"FAL",
	"FLL",
	"BTD",
	"CPS",
	"COP",
	"SWP",
	"PID",
	"AOI"
]);
var BRANCH_KEYWORDS = /* @__PURE__ */ new Set([
	"BST",
	"NXB",
	"BND"
]);
var ALL_VALID = /* @__PURE__ */ new Set([
	...VALID_CONTACTS,
	...VALID_OUTPUTS,
	...VALID_FUNCTION_BLOCKS,
	...BRANCH_KEYWORDS
]);
function tokenizeRungText(text) {
	if (!text) return [];
	const tokens = [];
	const cleaned = text.replace(/;+\s*$/, "").trim();
	const pattern = /([A-Z_][A-Z_0-9]*)\s*(?:\(([^)]*)\))?/g;
	let match;
	while ((match = pattern.exec(cleaned)) !== null) {
		const instr = match[1];
		const args = match[2] ? match[2].split(",").map((s) => s.trim()).filter(Boolean) : [];
		if (ALL_VALID.has(instr)) tokens.push({
			instruction: instr,
			args
		});
	}
	return tokens;
}
function extractTags(controller) {
	const tags = /* @__PURE__ */ new Set();
	const tagList = controller?.Tags?.Tag;
	if (tagList) {
		const arr = Array.isArray(tagList) ? tagList : [tagList];
		for (const tag of arr) {
			const name = tag.attributes?.Name;
			if (name) tags.add(name);
		}
	}
	const programs = controller?.Programs?.Program;
	if (programs) {
		const progArr = Array.isArray(programs) ? programs : [programs];
		for (const prog of progArr) {
			const progTags = prog?.Tags?.Tag;
			if (progTags) {
				const pArr = Array.isArray(progTags) ? progTags : [progTags];
				for (const tag of pArr) {
					const name = tag.attributes?.Name;
					if (name) tags.add(name);
				}
			}
		}
	}
	return tags;
}
function validateTokens(tokens, knownTags) {
	const warnings = [];
	for (const token of tokens) {
		const tag = token.args[0];
		if (tag && knownTags.size > 0 && !knownTags.has(tag)) {
			if (!tag.includes(":") && !tag.includes(".")) warnings.push({
				type: "TAG_NOT_FOUND",
				instruction: token.instruction,
				tag,
				message: `Tag '${tag}' referenced by ${token.instruction} not found in <Tags> collection`
			});
		}
	}
	return warnings;
}
function computeHash(content) {
	return createHash("sha256").update(content).digest("hex");
}
function assignCoordinates(tokens, baseX = 10, spacing = 40) {
	let cursorX = baseX;
	return tokens.map((token, i) => {
		const id = `t${i + 1}`;
		const x = cursorX;
		if (BRANCH_KEYWORDS.has(token.instruction)) cursorX += 30;
		else if (VALID_OUTPUTS.has(token.instruction)) cursorX += 40;
		else if (VALID_CONTACTS.has(token.instruction)) cursorX += 50;
		else cursorX += spacing;
		cursorX += 10;
		return {
			type: token.instruction,
			tag: token.args[0] || null,
			args: token.args.length > 1 ? token.args.slice(1) : void 0,
			id,
			x,
			y: 0
		};
	});
}
function parseL5X(fileBuffer) {
	if (fileBuffer.length > 10 * 1024 * 1024) throw new Error(`L5X file too large: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB exceeds 10 MB limit`);
	const xmlString = fileBuffer.toString("utf-8");
	const l5xHash = computeHash(xmlString);
	const parsed = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "",
		attributesGroupName: "attributes",
		textNodeName: "text",
		parseAttributeValue: true,
		trimValues: true,
		numberParseOptions: {
			leadingZeros: false,
			hex: true,
			skipLike: /\.[0-9]+$/
		}
	}).parse(xmlString);
	const controller = parsed.RSLogix5000Content?.Controller;
	const metadata = {
		project_name: controller?.attributes?.Name || "Unknown",
		version: parsed.RSLogix5000Content?.attributes?.TargetType ? `v${parsed.RSLogix5000Content.attributes.MajorRev || "?"}.${parsed.RSLogix5000Content.attributes.MinorRev || "?"}` : "unknown",
		l5x_hash: `sha256_${l5xHash}`,
		controller: controller ? {
			name: controller.attributes?.Name || null,
			processorType: controller.attributes?.ProcessorType || null,
			majorRev: controller.attributes?.MajorRev || null,
			minorRev: controller.attributes?.MinorRev || null
		} : null,
		programs: [],
		generated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	const programs = controller?.Programs?.Program;
	if (programs) metadata.programs = (Array.isArray(programs) ? programs : [programs]).map((p) => ({
		name: p.attributes?.Name || null,
		mainRoutineName: p.attributes?.MainRoutineName || null
	}));
	const knownTags = extractTags(controller);
	const routines = [];
	const routineList = controller?.Routines?.Routine;
	if (routineList) {
		const routineArr = Array.isArray(routineList) ? routineList : [routineList];
		for (const routine of routineArr) {
			const routineName = routine.attributes?.Name || "Unknown";
			const routineType = routine.attributes?.Type || "LadderLogic";
			const rungs = [];
			const rungList = routine.Rung;
			if (rungList) {
				const rungArr = Array.isArray(rungList) ? rungList : [rungList];
				for (let i = 0; i < rungArr.length; i++) {
					const rung = rungArr[i];
					const logicText = typeof rung.Text === "string" ? rung.Text : rung.Text?.text || null;
					const comment = typeof rung.Comment === "string" ? rung.Comment : rung.Comment?.text || null;
					const tokens = tokenizeRungText(logicText);
					const warnings = validateTokens(tokens, knownTags);
					const coordTokens = assignCoordinates(tokens);
					rungs.push({
						index: rung.attributes?.Number !== void 0 ? rung.attributes.Number : i,
						comment,
						logic_text: logicText,
						tokens: coordTokens,
						warnings: warnings.length > 0 ? warnings : void 0,
						rung_sha256: logicText ? `sha256_${computeHash(logicText)}` : null
					});
				}
			}
			routines.push({
				name: routineName,
				type: routineType,
				rungs,
				rung_count: rungs.length
			});
		}
	}
	return {
		metadata,
		routines,
		routine: routines.length > 0 ? routines[0] : {
			name: "No routines found",
			type: "empty",
			rungs: [],
			rung_count: 0
		},
		tag_inventory: [...knownTags],
		validation_summary: {
			total_rungs: routines.reduce((s, r) => s + r.rung_count, 0),
			total_warnings: routines.reduce((s, r) => s + r.rungs.reduce((ws, rn) => ws + (rn.warnings?.length || 0), 0), 0),
			tags_defined: knownTags.size
		}
	};
}
var SVG_WIDTH = 860;
var RAIL_X_LEFT = 50;
var RAIL_X_RIGHT = SVG_WIDTH - 50;
var RAIL_WIDTH = RAIL_X_RIGHT - RAIL_X_LEFT;
var RUNG_HEIGHT = 80;
var TOP_PADDING = 60;
var BOTTOM_PADDING = 40;
var CONTACT_W = 60;
var COIL_W = 50;
var BOX_W = 90;
var BOX_H = 44;
var NODE_GAP = 12;
var RAIL_STROKE = 3;
var WIRE_STROKE = 2;
var FONT = "'JetBrains Mono', 'Fira Code', monospace";
var FONT_SIZE = 10;
var TAG_FONT_SIZE = 9;
var RUNG_NUM_FONT = 11;
var COMMENT_FONT = 10;
var COLOR_RAIL = "#f97316";
var COLOR_WIRE = "#a1a1aa";
var COLOR_CONTACT = "#e4e4e7";
var COLOR_COIL = "#e4e4e7";
var COLOR_BOX = "#27272a";
var COLOR_BOX_STROKE = "#f97316";
var COLOR_TEXT = "#fafafa";
var COLOR_TAG = "#d4d4d8";
var COLOR_COMMENT = "#71717a";
var COLOR_BG = "#09090b";
var COLOR_RUNG_NUM = "#f97316";
var COLOR_TRUE = "#22c55e";
var CONTACTS = /* @__PURE__ */ new Set([
	"XIC",
	"XIO",
	"EQU",
	"NEQ",
	"LES",
	"GRT",
	"LEQ",
	"GEQ",
	"LIM",
	"MEQ",
	"FSC",
	"FSO",
	"FSU",
	"AFI",
	"ONS",
	"OSF",
	"OSR"
]);
var COILS = /* @__PURE__ */ new Set([
	"OTE",
	"OTL",
	"OTU",
	"ONS",
	"OSR",
	"OSF"
]);
var BOX_INSTRUCTIONS = /* @__PURE__ */ new Set([
	"TON",
	"TOF",
	"RTO",
	"CTU",
	"CTD",
	"RES",
	"MOV",
	"MVM",
	"ADD",
	"SUB",
	"MUL",
	"DIV",
	"MOD",
	"CPT",
	"FSC",
	"JSR",
	"SBR",
	"RET",
	"FOR",
	"NXT",
	"BRK",
	"MSG",
	"GSV",
	"SSV",
	"SCL",
	"FAL",
	"FLL",
	"BTD",
	"CPS",
	"COP",
	"SWP",
	"DINT_TO_REAL",
	"PID",
	"AOI",
	"PCCC",
	"CIP"
]);
function escapeXml(str) {
	if (!str) return "";
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function nodeWidth(instruction) {
	if (instruction === "BST" || instruction === "NXB" || instruction === "BND") return 40;
	if (CONTACTS.has(instruction) && !BOX_INSTRUCTIONS.has(instruction)) return CONTACT_W;
	if (COILS.has(instruction)) return COIL_W;
	return BOX_W;
}
function svgContact(x, y, instruction, tag, isLive) {
	const cy = y;
	const midX = x + CONTACT_W / 2;
	const slash = instruction === "XIO" ? `<line x1="${midX - 8}" y1="${cy + 14}" x2="${midX + 8}" y2="${cy - 14}" stroke="${COLOR_CONTACT}" stroke-width="2"/>` : "";
	return `
    <g${isLive ? " class=\"live-pulse\"" : ""}>
      <line x1="${x}" y1="${cy}" x2="${midX - 12}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
      <line x1="${midX - 12}" y1="${cy - 14}" x2="${midX - 12}" y2="${cy + 14}" stroke="${COLOR_CONTACT}" stroke-width="2.5"/>
      <line x1="${midX + 12}" y1="${cy - 14}" x2="${midX + 12}" y2="${cy + 14}" stroke="${COLOR_CONTACT}" stroke-width="2.5"/>
      ${slash}
      <line x1="${midX + 12}" y1="${cy}" x2="${x + CONTACT_W}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
      <text x="${midX}" y="${cy - 20}" text-anchor="middle" fill="${COLOR_TEXT}" font-family="${FONT}" font-size="${FONT_SIZE}" font-weight="700">${escapeXml(instruction)}</text>
      <text x="${midX}" y="${cy + 28}" text-anchor="middle" fill="${COLOR_TAG}" font-family="${FONT}" font-size="${TAG_FONT_SIZE}">${escapeXml(tag || "")}</text>
    </g>`;
}
function svgCoil(x, y, instruction, tag, isLive) {
	const cy = y;
	const midX = x + COIL_W / 2;
	const r = 14;
	const leftArc = `M ${midX - 2} ${cy - r} A ${r} ${r} 0 0 0 ${midX - 2} ${cy + r}`;
	const rightArc = `M ${midX + 2} ${cy - r} A ${r} ${r} 0 0 1 ${midX + 2} ${cy + r}`;
	let latchIndicator = "";
	if (instruction === "OTL") latchIndicator = `<text x="${midX}" y="${cy + 4}" text-anchor="middle" fill="${COLOR_TEXT}" font-family="${FONT}" font-size="10" font-weight="700">L</text>`;
	else if (instruction === "OTU") latchIndicator = `<text x="${midX}" y="${cy + 4}" text-anchor="middle" fill="${COLOR_TEXT}" font-family="${FONT}" font-size="10" font-weight="700">U</text>`;
	return `
    <g${isLive ? " class=\"live-pulse\"" : ""}>
      <line x1="${x}" y1="${cy}" x2="${midX - r - 2}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
      <path d="${leftArc}" fill="none" stroke="${COLOR_COIL}" stroke-width="2.5"/>
      <path d="${rightArc}" fill="none" stroke="${COLOR_COIL}" stroke-width="2.5"/>
      ${latchIndicator}
      <line x1="${midX + r + 2}" y1="${cy}" x2="${x + COIL_W}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
      <text x="${midX}" y="${cy - 20}" text-anchor="middle" fill="${COLOR_TEXT}" font-family="${FONT}" font-size="${FONT_SIZE}" font-weight="700">${escapeXml(instruction)}</text>
      <text x="${midX}" y="${cy + 28}" text-anchor="middle" fill="${COLOR_TAG}" font-family="${FONT}" font-size="${TAG_FONT_SIZE}">${escapeXml(tag || "")}</text>
    </g>`;
}
function svgBox(x, y, instruction, args, isLive) {
	const cy = y;
	const bx = x;
	const by = cy - BOX_H / 2;
	const midX = bx + BOX_W / 2;
	const argLines = [];
	if (args.length > 0) {
		const line1 = args.slice(0, 2).join(", ");
		argLines.push(line1);
		if (args.length > 2) argLines.push(args.slice(2, 4).join(", "));
	}
	const argsText = argLines.map((line, i) => `<text x="${midX}" y="${cy + 2 + (i - (argLines.length - 1) / 2) * 12}" text-anchor="middle" fill="${COLOR_TAG}" font-family="${FONT}" font-size="${TAG_FONT_SIZE}">${escapeXml(line)}</text>`).join("\n");
	return `
    <g${isLive ? " class=\"live-pulse\"" : ""}>
      <line x1="${x}" y1="${cy}" x2="${bx}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
      <rect x="${bx}" y="${by}" width="${BOX_W}" height="${BOX_H}" rx="4" fill="${COLOR_BOX}" stroke="${COLOR_BOX_STROKE}" stroke-width="1.5"/>
      <text x="${midX}" y="${by + 13}" text-anchor="middle" fill="${COLOR_TEXT}" font-family="${FONT}" font-size="${FONT_SIZE}" font-weight="700">${escapeXml(instruction)}</text>
      ${argsText}
      <line x1="${bx + BOX_W}" y1="${cy}" x2="${bx + BOX_W}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
    </g>`;
}
function svgBranchKeyword(x, y, keyword) {
	const cy = y;
	const midX = x + 20;
	return `
    <g>
      <line x1="${x}" y1="${cy}" x2="${midX - 8}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
      <rect x="${midX - 8}" y="${cy - 10}" width="16" height="20" rx="2" fill="none" stroke="${COLOR_COMMENT}" stroke-width="1" stroke-dasharray="3,2"/>
      <text x="${midX}" y="${cy + 3}" text-anchor="middle" fill="${COLOR_COMMENT}" font-family="${FONT}" font-size="7">${escapeXml(keyword)}</text>
      <line x1="${midX + 8}" y1="${cy}" x2="${midX + 28}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
    </g>`;
}
var LIVE_PULSE_CSS = `
  <style>
    @keyframes pulse-glow {
      0%, 100% { filter: drop-shadow(0 0 2px rgba(34, 197, 94, 0.4)); }
      50% { filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.8)); }
    }
    .live-pulse line, .live-pulse path, .live-pulse rect {
      stroke: ${COLOR_TRUE} !important;
      animation: pulse-glow 2s ease-in-out infinite;
    }
  </style>`;
function renderLadderSVG(rungs, options = {}) {
	const title = options.title || "Ladder Logic";
	const maxRungs = options.maxRungs || 100;
	const liveTags = options.liveTags || /* @__PURE__ */ new Set();
	const metadata = options.metadata || null;
	const MAX_RUNGS = 500;
	const effectiveMaxRungs = Math.min(maxRungs, MAX_RUNGS);
	const renderRungs = effectiveMaxRungs > 0 ? rungs.slice(0, effectiveMaxRungs) : rungs.slice(0, MAX_RUNGS);
	const numRungs = renderRungs.length;
	if (numRungs === 0) return `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="120" viewBox="0 0 ${SVG_WIDTH} 120">
  <rect width="100%" height="100%" fill="${COLOR_BG}"/>
  <text x="${SVG_WIDTH / 2}" y="60" text-anchor="middle" fill="${COLOR_COMMENT}" font-family="${FONT}" font-size="14">No rungs to render</text>
</svg>`;
	const svgHeight = TOP_PADDING + numRungs * RUNG_HEIGHT + BOTTOM_PADDING;
	const railTop = TOP_PADDING;
	const railBottom = TOP_PADDING + numRungs * RUNG_HEIGHT;
	const usableWidth = RAIL_WIDTH - 20;
	let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="${svgHeight}" viewBox="0 0 ${SVG_WIDTH} ${svgHeight}" font-family="${FONT}">
  ${LIVE_PULSE_CSS}
  <rect width="100%" height="100%" fill="${COLOR_BG}"/>
  <text x="${SVG_WIDTH / 2}" y="22" text-anchor="middle" fill="${COLOR_TEXT}" font-family="${FONT}" font-size="14" font-weight="700" letter-spacing="1">${escapeXml(title)}</text>
  <text x="${SVG_WIDTH / 2}" y="38" text-anchor="middle" fill="${COLOR_COMMENT}" font-family="${FONT}" font-size="9">${numRungs} rung${numRungs === 1 ? "" : "s"}${metadata ? " — " + escapeXml(metadata) : ""}</text>
  <line x1="${RAIL_X_LEFT}" y1="${railTop}" x2="${RAIL_X_LEFT}" y2="${railBottom}" stroke="${COLOR_RAIL}" stroke-width="${RAIL_STROKE}"/>
  <text x="${RAIL_X_LEFT}" y="${railTop - 8}" text-anchor="middle" fill="${COLOR_RAIL}" font-family="${FONT}" font-size="10" font-weight="700">L1</text>
  <line x1="${RAIL_X_RIGHT}" y1="${railTop}" x2="${RAIL_X_RIGHT}" y2="${railBottom}" stroke="${COLOR_RAIL}" stroke-width="${RAIL_STROKE}"/>
  <text x="${RAIL_X_RIGHT}" y="${railTop - 8}" text-anchor="middle" fill="${COLOR_RAIL}" font-family="${FONT}" font-size="10" font-weight="700">L2</text>
`;
	for (let i = 0; i < numRungs; i++) {
		const rung = renderRungs[i];
		const rungY = TOP_PADDING + i * RUNG_HEIGHT + RUNG_HEIGHT / 2;
		const rungNum = rung.index;
		svg += `
  <text x="${RAIL_X_LEFT - 22}" y="${rungY + 4}" text-anchor="middle" fill="${COLOR_RUNG_NUM}" font-family="${FONT}" font-size="${RUNG_NUM_FONT}" font-weight="700">${rungNum}</text>`;
		if (rung.comment) svg += `
  <text x="64" y="${rungY - 26}" fill="${COLOR_COMMENT}" font-family="${FONT}" font-size="${COMMENT_FONT}" font-style="italic">// ${escapeXml(rung.comment)}</text>`;
		svg += `
  <line x1="${RAIL_X_LEFT}" y1="${rungY}" x2="${RAIL_X_RIGHT}" y2="${rungY}" stroke="${COLOR_WIRE}" stroke-width="1" stroke-dasharray="2,4" opacity="0.3"/>`;
		const tokens = rung.tokens;
		if (tokens.length === 0) svg += `
  <text x="${SVG_WIDTH / 2}" y="${rungY + 4}" text-anchor="middle" fill="${COLOR_COMMENT}" font-family="${FONT}" font-size="9">(empty rung)</text>`;
		else {
			const totalNodeWidth = tokens.reduce((sum, t) => sum + nodeWidth(t.type) + NODE_GAP, 0) - NODE_GAP;
			const startX = 60;
			const availableSpace = usableWidth - totalNodeWidth;
			const gap = tokens.length > 1 ? Math.max(NODE_GAP, availableSpace / (tokens.length + 1)) : 0;
			let cursorX = startX + (tokens.length > 1 ? gap / 2 : (usableWidth - totalNodeWidth) / 2);
			for (let t = 0; t < tokens.length; t++) {
				const token = tokens[t];
				const instr = token.type;
				const tag = token.tag || "";
				const isLive = liveTags.has(tag);
				const args = token.args || [];
				if (instr === "BST" || instr === "NXB" || instr === "BND") {
					svg += svgBranchKeyword(cursorX, rungY, instr);
					cursorX += 40 + (t < tokens.length - 1 ? gap : 0);
				} else if (CONTACTS.has(instr) && !BOX_INSTRUCTIONS.has(instr) && !COILS.has(instr)) {
					svg += svgContact(cursorX, rungY, instr, tag, isLive);
					cursorX += CONTACT_W + (t < tokens.length - 1 ? gap : 0);
				} else if (COILS.has(instr) && !BOX_INSTRUCTIONS.has(instr)) {
					svg += svgCoil(cursorX, rungY, instr, tag, isLive);
					cursorX += COIL_W + (t < tokens.length - 1 ? gap : 0);
				} else {
					svg += svgBox(cursorX, rungY, instr, args.length > 0 ? args : tag ? [tag] : [], isLive);
					cursorX += BOX_W + (t < tokens.length - 1 ? gap : 0);
				}
			}
		}
		if (i < numRungs - 1) svg += `
  <line x1="55" y1="${rungY + RUNG_HEIGHT / 2}" x2="${RAIL_X_RIGHT - 5}" y2="${rungY + RUNG_HEIGHT / 2}" stroke="${COLOR_COMMENT}" stroke-width="0.5" opacity="0.15"/>`;
	}
	svg += `
</svg>`;
	return svg;
}
var Route$5 = createFileRoute("/api/parse-l5x")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const file = (await request.formData()).get("file");
		if (!file || !file.name.endsWith(".L5X")) return new Response(JSON.stringify({ error: "Invalid file. Please upload a .L5X file." }), {
			status: 400,
			headers: { "content-type": "application/json" }
		});
		if (file.size > 10 * 1024 * 1024) return new Response(JSON.stringify({ error: "File too large. Max 10MB." }), {
			status: 400,
			headers: { "content-type": "application/json" }
		});
		const arrayBuffer = await file.arrayBuffer();
		const result = parseL5X(Buffer.from(arrayBuffer));
		const svg = renderLadderSVG(result.routines.flatMap((r) => r.rungs.map((rung) => ({
			index: rung.index,
			comment: rung.comment,
			logic_text: rung.logic_text,
			tokens: rung.tokens,
			warnings: rung.warnings
		}))), {
			title: result.metadata.project_name,
			metadata: result.metadata.l5x_hash.slice(0, 20),
			maxRungs: 100
		});
		return new Response(JSON.stringify({
			metadata: result.metadata,
			routines: result.routines,
			tag_inventory: result.tag_inventory,
			validation_summary: result.validation_summary,
			svg
		}), {
			status: 200,
			headers: { "content-type": "application/json" }
		});
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : "Unknown error";
		const stack = error instanceof Error ? error.stack : void 0;
		console.error("L5X parse error:", {
			message: errMsg,
			stack
		});
		return new Response(JSON.stringify({
			error: "Failed to parse L5X file. Invalid format or unsupported schema.",
			details: void 0
		}), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
} } } });
var Route$4 = createFileRoute("/api/chat")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const { message } = await request.json();
		if (!message || typeof message !== "string") return new Response(JSON.stringify({ error: "No message provided" }), {
			status: 400,
			headers: { "content-type": "application/json" }
		});
		const apiKey = process.env.DASHSCOPE_API_KEY;
		if (!apiKey) return new Response(JSON.stringify({
			error: "Configuration error",
			message: "DASHSCOPE_API_KEY not configured on server"
		}), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
		const response = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions", {
			method: "POST",
			headers: {
				Authorization: "Bearer " + apiKey,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: "qwen-plus",
				messages: [{
					role: "system",
					content: "You are an expert Master Electrician and NEC Co-Pilot. Answer questions about the National Electrical Code (NEC) with accurate article references, table numbers, and practical guidance. Always cite the relevant NEC article or table. Never paste copyrighted NEC text verbatim — paraphrase and cite the article/table number."
				}, {
					role: "user",
					content: message
				}],
				temperature: .1
			})
		});
		if (!response.ok) {
			const err = await response.text();
			return new Response(JSON.stringify({
				error: "Upstream API error",
				status: response.status,
				detail: err
			}), {
				status: 502,
				headers: { "content-type": "application/json" }
			});
		}
		const text = (await response.json()).choices?.[0]?.message?.content ?? "No response received.";
		return new Response(JSON.stringify({
			text,
			message: text
		}), {
			status: 200,
			headers: { "content-type": "application/json" }
		});
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : "Unknown error";
		return new Response(JSON.stringify({
			error: "Failed to process message",
			message: errMsg
		}), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
} } } });
var Route$3 = createFileRoute("/.well-known/oauth-protected-resource")({ server: { handlers: { ANY: createTanStackOAuthProtectedResourceMetadataHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var Route$2 = createFileRoute("/.mcp/list-tools")({ server: { handlers: { ANY: createTanStackListToolsHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var Route$1 = createFileRoute("/.mcp/invoke-tool/$tool")({ server: { handlers: { ANY: createTanStackInvokeToolHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var Route = createFileRoute("/api/public/share/$token")({ server: { handlers: { GET: async ({ params }) => {
	const { supabaseAdmin } = await import("./client.server-DtJC_w_f.mjs");
	const token = params.token;
	const { data: link } = await supabaseAdmin.from("share_links").select("user_id, label, created_at, revoked_at").eq("token", token).maybeSingle();
	if (!link || link.revoked_at) return new Response(JSON.stringify({ error: "not_found" }), {
		status: 404,
		headers: { "content-type": "application/json" }
	});
	const [profileRes, lessonsRes, quizRes] = await Promise.all([
		supabaseAdmin.from("profiles").select("display_name, nec_edition").eq("id", link.user_id).maybeSingle(),
		supabaseAdmin.from("lesson_completions").select("course_id, lesson_key, completed_at").eq("user_id", link.user_id),
		supabaseAdmin.from("quiz_results").select("course_id, module_id, attempts, best_score_pct, best_passed, best_at, last_score_pct, last_passed, last_at").eq("user_id", link.user_id)
	]);
	return new Response(JSON.stringify({
		label: link.label,
		createdAt: link.created_at,
		profile: profileRes.data ?? {},
		lessons: lessonsRes.data ?? [],
		quizzes: quizRes.data ?? []
	}), { headers: { "content-type": "application/json" } });
} } } });
var StudyToolsRoute = Route$17.update({
	id: "/study-tools",
	path: "/study-tools",
	getParentRoute: () => Route$18
});
var SitemapDotxmlRoute = Route$16.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$18
});
var ProfileRoute = Route$15.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$18
});
var PracticeTestRoute = Route$14.update({
	id: "/practice-test",
	path: "/practice-test",
	getParentRoute: () => Route$18
});
var PlcRoute = Route$13.update({
	id: "/plc",
	path: "/plc",
	getParentRoute: () => Route$18
});
var McpRoute = Route$12.update({
	id: "/mcp",
	path: "/mcp",
	getParentRoute: () => Route$18
});
var ExamPrepRoute = Route$11.update({
	id: "/exam-prep",
	path: "/exam-prep",
	getParentRoute: () => Route$18
});
var DataCenterRoute = Route$10.update({
	id: "/data-center",
	path: "/data-center",
	getParentRoute: () => Route$18
});
var AuthRoute = Route$20.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$18
});
var IndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$18
});
var ShareTokenRoute = Route$23.update({
	id: "/share/$token",
	path: "/share/$token",
	getParentRoute: () => Route$18
});
var DevMotorCalcsRoute = Route$8.update({
	id: "/dev/motor-calcs",
	path: "/dev/motor-calcs",
	getParentRoute: () => Route$18
});
var CoursesTradeRoute = Route$22.update({
	id: "/courses/$trade",
	path: "/courses/$trade",
	getParentRoute: () => Route$18
});
var CourseCourseIdRoute = Route$21.update({
	id: "/course/$courseId",
	path: "/course/$courseId",
	getParentRoute: () => Route$18
});
var ApiStripeWebhookRoute = Route$7.update({
	id: "/api/stripe-webhook",
	path: "/api/stripe-webhook",
	getParentRoute: () => Route$18
});
var ApiStripeCheckoutRoute = Route$6.update({
	id: "/api/stripe-checkout",
	path: "/api/stripe-checkout",
	getParentRoute: () => Route$18
});
var ApiParseL5xRoute = Route$5.update({
	id: "/api/parse-l5x",
	path: "/api/parse-l5x",
	getParentRoute: () => Route$18
});
var ApiChatRoute = Route$4.update({
	id: "/api/chat",
	path: "/api/chat",
	getParentRoute: () => Route$18
});
var Char91DotwellKnownChar93OauthProtectedResourceRoute = Route$3.update({
	id: "/.well-known/oauth-protected-resource",
	path: "/.well-known/oauth-protected-resource",
	getParentRoute: () => Route$18
});
var Char91DotmcpChar93ListToolsRoute = Route$2.update({
	id: "/.mcp/list-tools",
	path: "/.mcp/list-tools",
	getParentRoute: () => Route$18
});
var Char91DotmcpChar93InvokeToolToolRoute = Route$1.update({
	id: "/.mcp/invoke-tool/$tool",
	path: "/.mcp/invoke-tool/$tool",
	getParentRoute: () => Route$18
});
var rootRouteChildren = {
	IndexRoute,
	AuthRoute,
	DataCenterRoute,
	ExamPrepRoute,
	McpRoute,
	PlcRoute,
	PracticeTestRoute,
	ProfileRoute,
	SitemapDotxmlRoute,
	StudyToolsRoute,
	Char91DotmcpChar93ListToolsRoute,
	Char91DotwellKnownChar93OauthProtectedResourceRoute,
	ApiChatRoute,
	ApiParseL5xRoute,
	ApiStripeCheckoutRoute,
	ApiStripeWebhookRoute,
	CourseCourseIdRoute,
	CoursesTradeRoute,
	DevMotorCalcsRoute,
	ShareTokenRoute,
	DotlovableOauthConsentRoute: Route$19.update({
		id: "/.lovable/oauth/consent",
		path: "/.lovable/oauth/consent",
		getParentRoute: () => Route$18
	}),
	Char91DotmcpChar93InvokeToolToolRoute,
	ApiPublicShareTokenRoute: Route.update({
		id: "/api/public/share/$token",
		path: "/api/public/share/$token",
		getParentRoute: () => Route$18
	})
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
