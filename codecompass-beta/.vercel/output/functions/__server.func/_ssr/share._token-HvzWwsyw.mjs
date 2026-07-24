import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TRADES, t as COURSES } from "./curriculum-BoKKyowv.mjs";
import { t as Route } from "./share._token-BsQZfGql.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/share._token-HvzWwsyw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SharePage() {
	const { token } = Route.useParams();
	const [data, setData] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		fetch(`/api/public/share/${token}`).then(async (r) => {
			if (!r.ok) throw new Error("This share link is invalid or has been revoked.");
			return r.json();
		}).then(setData).catch((e) => setErr(String(e.message ?? e)));
	}, [token]);
	if (err) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-2xl px-5 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Link unavailable"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: err
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-6 inline-block text-primary",
				children: "← Home"
			})
		]
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-2xl px-5 py-20 text-sm text-muted-foreground",
		children: "Loading…"
	});
	const lessonSet = /* @__PURE__ */ new Map();
	for (const l of data.lessons) {
		if (!lessonSet.has(l.course_id)) lessonSet.set(l.course_id, /* @__PURE__ */ new Set());
		lessonSet.get(l.course_id).add(l.lesson_key);
	}
	const quizByCourse = /* @__PURE__ */ new Map();
	for (const q of data.quizzes) {
		if (!quizByCourse.has(q.course_id)) quizByCourse.set(q.course_id, /* @__PURE__ */ new Map());
		quizByCourse.get(q.course_id).set(q.module_id, q);
	}
	const name = data.profile.display_name || "Code Compass apprentice";
	const totalLessons = COURSES.reduce((n, c) => n + c.modules.reduce((m, mm) => m + mm.lessons.length, 0), 0);
	const totalQuizzes = COURSES.reduce((n, c) => n + c.modules.length, 0);
	const doneLessons = data.lessons.length;
	const passedQuizzes = data.quizzes.filter((q) => q.best_passed).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-4xl px-5 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-primary/40 bg-primary/5 p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-[0.18em] text-primary",
					children: "Read-only foreman view"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-1 font-display text-3xl font-semibold",
					children: [name, "'s progress"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: [
						data.label ? `Shared link: ${data.label}. ` : "",
						"NEC ",
						data.profile.nec_edition ?? "—",
						" · shared",
						" ",
						new Date(data.createdAt).toLocaleDateString()
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Lessons",
							value: `${doneLessons}/${totalLessons}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Quizzes passed",
							value: `${passedQuizzes}/${totalQuizzes}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "NEC edition",
							value: data.profile.nec_edition ? `NEC ${data.profile.nec_edition}` : "—"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 space-y-6",
			children: COURSES.map((c) => {
				const lessons = c.modules.reduce((n, m) => n + m.lessons.length, 0);
				const quizzes = c.modules.length;
				const doneLcount = lessonSet.get(c.id)?.size ?? 0;
				const passed = Array.from(quizByCourse.get(c.id)?.values() ?? []).filter((r) => r.best_passed).length;
				const pct = Math.round((doneLcount + passed) / (lessons + quizzes) * 100);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[10px] uppercase tracking-[0.16em] text-accent",
							children: [
								TRADES.find((t) => t.id === c.trade)?.name,
								" · ",
								c.level
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-display text-xl font-semibold",
							children: c.title
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-semibold",
							children: [pct, "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-2",
						children: c.modules.map((m) => {
							const q = quizByCourse.get(c.id)?.get(m.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border border-border bg-background p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: m.title
									}), q?.best_passed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-semibold text-primary",
										children: [
											"✓ ",
											q.best_score_pct,
											"%"
										]
									}) : q ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [
											"attempted — best ",
											q.best_score_pct,
											"%"
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "not attempted"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 flex flex-wrap gap-1.5 text-[11px]",
									children: m.lessons.map((l) => {
										const done = lessonSet.get(c.id)?.has(`${m.id}:${l.id}`);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `rounded px-1.5 py-0.5 border ${done ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-secondary/40 text-muted-foreground"}`,
											children: [
												done ? "✓" : "○",
												" ",
												l.title
											]
										}, l.id);
									})
								})]
							}, m.id);
						})
					})]
				}, c.id);
			})
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-xl font-semibold",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-[0.16em] text-muted-foreground mt-1",
			children: label
		})]
	});
}
//#endregion
export { SharePage as component };
