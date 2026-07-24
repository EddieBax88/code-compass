import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-B1jDr4fN.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as Link, f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useAuth } from "./auth-Cfg3CyA2.mjs";
import { r as useNecEdition, t as NEC_EDITIONS } from "./nec-edition-7h2QGTQt.mjs";
import { n as TRADES, t as COURSES } from "./curriculum-BoKKyowv.mjs";
import { i as useProgress, r as quizPassed, t as courseProgress } from "./progress-DY0V9J-M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CjezTaqa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { user, loading: authLoading, signOut } = useAuth();
	const { state, loading } = useProgress();
	const { edition, setEdition } = useNecEdition();
	const nav = useNavigate();
	const [shares, setShares] = (0, import_react.useState)([]);
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [newLabel, setNewLabel] = (0, import_react.useState)("");
	const [origin, setOrigin] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") setOrigin(window.location.origin);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!authLoading && !user) nav({
			to: "/auth",
			search: { next: void 0 }
		});
	}, [
		authLoading,
		user,
		nav
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle().then(({ data }) => setDisplayName(data?.display_name ?? ""));
		refreshShares(user.id);
	}, [user]);
	async function refreshShares(uid) {
		const { data } = await supabase.from("share_links").select("token, label, created_at, revoked_at").eq("user_id", uid).order("created_at", { ascending: false });
		setShares(data ?? []);
	}
	async function saveName() {
		if (!user) return;
		await supabase.from("profiles").upsert({
			id: user.id,
			display_name: displayName
		}, { onConflict: "id" });
	}
	async function createShare() {
		if (!user) return;
		const token = crypto.randomUUID().replace(/-/g, "");
		await supabase.from("share_links").insert({
			token,
			user_id: user.id,
			label: newLabel || null
		});
		setNewLabel("");
		await refreshShares(user.id);
	}
	async function revokeShare(token) {
		if (!user) return;
		await supabase.from("share_links").update({ revoked_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("token", token);
		await refreshShares(user.id);
	}
	if (authLoading || !user) return null;
	const totalCourses = COURSES.length;
	const totalLessons = COURSES.reduce((n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0), 0);
	const totalQuizzes = COURSES.reduce((n, c) => n + c.modules.length, 0);
	const completedLessons = Object.values(state.lessons).reduce((n, a) => n + a.length, 0);
	const passedQuizzes = Object.values(state.quizResults).reduce((n, byMod) => n + Object.values(byMod).filter((r) => r.best.passed).length, 0);
	const coursesDone = COURSES.filter((c) => {
		const totals = {
			l: c.modules.reduce((s, m) => s + m.lessons.length, 0),
			q: c.modules.length
		};
		return courseProgress(state, c.id, totals.l, totals.q) === 100;
	}).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-5xl px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between flex-wrap gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.18em] text-primary",
						children: "Your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl font-semibold",
						children: displayName || user.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-sm text-muted-foreground",
						children: user.email
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => signOut(),
					className: "text-sm text-muted-foreground hover:text-foreground rounded-md border border-border bg-card px-3 py-1.5",
					children: "Sign out"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Courses complete",
						value: `${coursesDone}/${totalCourses}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Lessons finished",
						value: `${completedLessons}/${totalLessons}`,
						accent: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Quizzes passed",
						value: `${passedQuizzes}/${totalQuizzes}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "NEC edition",
						value: edition ? `NEC ${edition}` : "—"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 grid gap-6 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold",
							children: "Display name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Shown to anyone you share a read-only progress link with."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "profile-display-name",
									className: "sr-only",
									children: "Display name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "profile-display-name",
									value: displayName,
									onChange: (e) => setDisplayName(e.target.value),
									placeholder: "e.g. Jamie Rivera",
									"aria-label": "Display name",
									className: "flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: saveName,
									className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
									children: "Save"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold",
							children: "NEC edition"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "All code citations across the app render with this edition."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: NEC_EDITIONS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setEdition(e),
								className: `rounded-md border px-3 py-1.5 text-sm ${edition === e ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/60"}`,
								children: ["NEC ", e]
							}, e))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-2xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-start justify-between flex-wrap gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold",
							children: "Foreman / instructor view"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Create a read-only share link. Anyone with the URL can see which lessons and quizzes you've completed — nothing else. Revoke anytime."
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "share-link-label",
								className: "sr-only",
								children: "Share link label"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "share-link-label",
								value: newLabel,
								onChange: (e) => setNewLabel(e.target.value),
								placeholder: "Label (e.g. 'Foreman Ramirez')",
								"aria-label": "Share link label",
								className: "flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: createShare,
								className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
								children: "Create link"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-2",
						children: [shares.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "No share links yet."
						}), shares.map((s) => {
							const url = `${origin}/share/${s.token}`;
							const revoked = !!s.revoked_at;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex flex-wrap items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm ${revoked ? "opacity-60" : ""}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-medium truncate",
										children: [
											s.label || "Untitled link",
											" ",
											revoked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground",
												children: "(revoked)"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground truncate font-mono",
										children: url
									})]
								}), !revoked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => navigator.clipboard.writeText(url),
									className: "text-xs rounded-md border border-border px-2 py-1 hover:border-primary/60",
									children: "Copy"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => revokeShare(s.token),
									className: "text-xs rounded-md border border-border px-2 py-1 hover:border-primary/60 text-muted-foreground",
									children: "Revoke"
								})] })]
							}, s.token);
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold",
						children: "Your courses"
					}),
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 text-sm text-muted-foreground",
						children: "Loading…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-3 md:grid-cols-2",
						children: COURSES.map((c) => {
							const l = c.modules.reduce((n, m) => n + m.lessons.length, 0);
							const q = c.modules.length;
							const pct = courseProgress(state, c.id, l, q);
							const passed = c.modules.filter((m) => quizPassed(state, c.id, m.id)).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/course/$courseId",
								params: { courseId: c.id },
								search: { focus: void 0 },
								className: "rounded-xl border border-border bg-card p-4 hover:border-primary/60 transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] uppercase tracking-[0.16em] text-accent",
										children: [
											TRADES.find((t) => t.id === c.trade)?.name,
											" · ",
											c.level
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 font-display text-lg font-semibold",
										children: c.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-gradient-to-r from-primary to-accent",
											style: { width: `${pct}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex justify-between text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [pct, "% complete"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											passed,
											"/",
											q,
											" quizzes passed"
										] })]
									})
								]
							}, c.id);
						})
					})
				]
			})
		]
	});
}
function Stat({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `font-display text-2xl font-semibold ${accent ? "ember-text" : ""}`,
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
			children: label
		})]
	});
}
//#endregion
export { ProfilePage as component };
