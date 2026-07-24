import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ShieldCheck, c as Cpu, l as CircleCheck, t as Zap, u as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cq925E4C.js
var import_jsx_runtime = require_jsx_runtime();
var MODULES = [
	{
		to: "/study-tools",
		kicker: "Module 01 · Free",
		title: "NEC 2026 Rapid Lookup",
		desc: "AI co-pilot for the National Electrical Code. Paste any exam question or field scenario — get the article, section, and answer in seconds.",
		Icon: Zap,
		cta: "Open lookup",
		tier: "FREE"
	},
	{
		to: "/plc",
		kicker: "Module 02 · Premium",
		title: "Industrial PLC Parsing",
		desc: "Upload Rockwell L5K / L5X exports. Parse tags, routines, and rung logic for controls-engineer troubleshooting and code review.",
		Icon: Cpu,
		cta: "Open PLC parser",
		tier: "PREMIUM"
	},
	{
		to: "/data-center",
		kicker: "Module 03 · Premium",
		title: "Data Center Compliance",
		desc: "Arc-flash boundary calcs and EMS compliance workflows for hyperscale and colo environments. Built to NFPA 70E and NEC Article 645.",
		Icon: ShieldCheck,
		cta: "Open compliance",
		tier: "PREMIUM"
	}
];
var MODULE_02 = MODULES.find((m) => m.kicker.includes("Module 02"));
var MODULE_03 = MODULES.find((m) => m.kicker.includes("Module 03"));
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-5 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative pt-14 pb-10 sm:pt-20 sm:pb-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-4xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-6 font-display text-5xl sm:text-7xl font-black leading-[0.95] tracking-tight",
							children: "Automating NEC Compliance and PLC Logic Translation for Active Data Centers."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-lg sm:text-2xl text-foreground/85 max-w-3xl font-medium",
							children: "The elite training weapon for electrical apprentices to pass their exam and instantly look up code on the job site."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/plc",
							className: "mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-ember transition hover:opacity-90",
							children: ["Launch Enterprise Demo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCard, { ...MODULE_02 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCard, { ...MODULE_03 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "what",
				className: "mt-14 rounded-2xl border border-border bg-card/40 p-6 sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.2em] text-accent",
						children: "What Code Compass does"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "what",
						className: "mt-2 font-display text-2xl sm:text-3xl font-semibold",
						children: "One clear path to the code, the logic, and the compliance answer."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 grid gap-3 sm:grid-cols-3",
						children: [
							"Paste any NEC exam question — get the article and section instantly.",
							"Drill timed practice tests calibrated to the 2026 code cycle.",
							"Pull code lookups on-site from your phone, even one-handed."
						].map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: line })]
						}, line))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-14 rounded-2xl border border-border bg-card/50 p-6 sm:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-[0.2em] text-primary",
							children: "Sharpen your license track"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-2xl font-semibold",
							children: "Journeyman exam prep"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground max-w-xl",
							children: "Timed NEC drills and a full 25-question practice test. Read the answer, keep moving."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/practice-test",
							className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90",
							children: ["25-question practice test", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/exam-prep",
							className: "inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary",
							children: "Timed drills"
						})]
					})]
				})
			})
		]
	});
}
function ModuleCard({ to, kicker, title, desc, Icon, cta, tier }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		"aria-labelledby": "modules",
		className: "mt-14",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to,
			className: "group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:border-primary/60 hover:shadow-ember sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-12 w-12 shrink-0 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-[0.2em] text-accent",
							children: kicker
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: tier === "FREE" ? "rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary" : "rounded-full border border-border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground",
							children: tier
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 font-display text-xl sm:text-2xl font-semibold leading-tight",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground max-w-2xl",
						children: desc
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm text-primary sm:pl-4",
				children: [cta, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition group-hover:translate-x-1" })]
			})]
		})
	});
}
//#endregion
export { Home as component };
