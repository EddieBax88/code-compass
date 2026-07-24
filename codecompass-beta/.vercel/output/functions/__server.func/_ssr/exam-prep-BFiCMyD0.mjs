import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useNecEdition } from "./nec-edition-7h2QGTQt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exam-prep-BFiCMyD0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MODES = [
	{
		id: "speed",
		title: "Speed-Find",
		desc: "Locate any NEC rule under time pressure.",
		bank: [
			{
				id: "sf1",
				prompt: "Minimum burial depth for direct-buried UF cable under a residential driveway — which NEC table?",
				accept: [
					"300.5",
					"table 300.5",
					"t 300.5"
				],
				explain: "Table 300.5 lists minimum cover for underground installations."
			},
			{
				id: "sf2",
				prompt: "Working space in front of a 200A panel — which NEC section?",
				accept: ["110.26", "110.26(a)"],
				explain: "110.26 covers spaces about electrical equipment; Table 110.26(A)(1) has depth."
			},
			{
				id: "sf3",
				prompt: "Minimum small-appliance branch circuits in a dwelling kitchen?",
				accept: ["2", "two"],
				explain: "210.11(C)(1) — two 20A circuits."
			},
			{
				id: "sf4",
				prompt: "AFCI protection for dwelling branch circuits — which section?",
				accept: ["210.12"],
				explain: "210.12 covers arc-fault protection."
			},
			{
				id: "sf5",
				prompt: "Article that covers grounding and bonding?",
				accept: [
					"250",
					"article 250",
					"art 250"
				],
				explain: "Article 250 is the grounding & bonding article."
			},
			{
				id: "sf6",
				prompt: "Conductor ampacity table for insulated conductors?",
				accept: ["310.16", "table 310.16"],
				explain: "Table 310.16 — the workhorse ampacity table."
			},
			{
				id: "sf7",
				prompt: "Standard overcurrent device sizes are listed in which section?",
				accept: ["240.6", "240.6(a)"],
				explain: "240.6(A) lists standard fuse and breaker sizes."
			},
			{
				id: "sf8",
				prompt: "Motor branch-circuit short-circuit and ground-fault protection table?",
				accept: ["430.52", "table 430.52"],
				explain: "Table 430.52 — the most-tested motor table."
			}
		]
	},
	{
		id: "motor",
		title: "Motor Calc",
		desc: "FLA → conductor → OCP → disconnect.",
		bank: [
			{
				id: "mc1",
				prompt: "5 HP, 230V, 3-phase motor. Table 430.250 gives FLA 15.2 A. Minimum branch-circuit conductor ampacity (amps)?",
				accept: ["19", "19a"],
				explain: "15.2 × 1.25 = 19 A per 430.22."
			},
			{
				id: "mc2",
				prompt: "10 HP, 208V, 3-phase (FLA 30.8 A). Inverse-time breaker size after rounding to next standard, amps?",
				accept: ["80", "80a"],
				explain: "30.8 × 2.50 = 77 → round up to 80 A per 240.6(A)."
			},
			{
				id: "mc3",
				prompt: "Multiplier applied to motor FLA to size branch-circuit conductors (per 430.22)?",
				accept: [
					"1.25",
					"125%",
					"125"
				],
				explain: "125% (1.25)."
			},
			{
				id: "mc4",
				prompt: "Dual-element (time-delay) fuse max percentage of FLA per Table 430.52?",
				accept: ["175", "175%"],
				explain: "175%."
			},
			{
				id: "mc5",
				prompt: "Minimum disconnect rating for a motor, as % of FLA (430.110(A))?",
				accept: ["115", "115%"],
				explain: "115%."
			},
			{
				id: "mc6",
				prompt: "25 HP, 460V, 3-phase. Table 430.250 FLA (amps)?",
				accept: ["34", "34a"],
				explain: "34 A. Carry this through the rest of the calc."
			}
		]
	},
	{
		id: "hunt",
		title: "Code Hunt",
		desc: "Article-number recall.",
		bank: [
			{
				id: "ch1",
				prompt: "Which NEC article covers branch circuits?",
				accept: ["210", "article 210"],
				explain: "Article 210."
			},
			{
				id: "ch2",
				prompt: "Which NEC article covers services?",
				accept: ["230", "article 230"],
				explain: "Article 230."
			},
			{
				id: "ch3",
				prompt: "Which NEC article covers overcurrent protection?",
				accept: ["240", "article 240"],
				explain: "Article 240."
			},
			{
				id: "ch4",
				prompt: "GFCI protection for dwellings — which section?",
				accept: ["210.8", "210.8(a)"],
				explain: "210.8(A) for dwelling units."
			},
			{
				id: "ch5",
				prompt: "Grounding electrode conductor sizing table?",
				accept: ["250.66", "table 250.66"],
				explain: "Table 250.66."
			}
		]
	}
];
function ExamPrep() {
	const { edition } = useNecEdition();
	const [mode, setMode] = (0, import_react.useState)("speed");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-primary",
				children: ["Exam prep", edition && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full border border-border bg-card px-2 py-0.5 text-[10px] normal-case tracking-normal text-muted-foreground",
					children: ["NEC ", edition]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl font-semibold",
				children: "Timed drills."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-muted-foreground",
				children: "Speed-Find is the fastest way to build the muscle memory that carries into the licensing exam. Two minutes per question. Miss one? Read the answer and keep moving."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/practice-test",
					className: "inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition",
					children: "Take the full 25-question Journeyman Practice Test →"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMode(m.id),
					className: `rounded-md border px-4 py-2 text-sm font-medium transition ${mode === m.id ? "border-primary bg-primary text-primary-foreground shadow-ember" : "border-border bg-card hover:border-primary/60"}`,
					children: m.title
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 text-sm text-muted-foreground",
				children: MODES.find((m) => m.id === mode).desc
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drill, { mode }, mode),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/study-tools",
					className: "text-primary hover:underline",
					children: "← Back to study tools"
				})
			})
		]
	});
}
function Drill({ mode }) {
	const bank = (0, import_react.useMemo)(() => shuffle(MODES.find((m) => m.id === mode).bank), [mode]);
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [answer, setAnswer] = (0, import_react.useState)("");
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [correctCount, setCorrect] = (0, import_react.useState)(0);
	const [seconds, setSeconds] = (0, import_react.useState)(120);
	const inputRef = (0, import_react.useRef)(null);
	const q = bank[idx];
	const done = idx >= bank.length;
	(0, import_react.useEffect)(() => {
		if (done || feedback) return;
		setSeconds(120);
		const t = setInterval(() => {
			setSeconds((s) => {
				if (s <= 1) {
					clearInterval(t);
					setFeedback({
						correct: false,
						explain: `Time. Answer: ${q.accept[0]}. ${q.explain}`
					});
					return 0;
				}
				return s - 1;
			});
		}, 1e3);
		return () => clearInterval(t);
	}, [
		idx,
		done,
		feedback,
		q
	]);
	(0, import_react.useEffect)(() => {
		inputRef.current?.focus();
	}, [idx]);
	if (done) {
		const pct = Math.round(correctCount / bank.length * 100);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 rounded-2xl border border-border bg-card p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-[0.18em] text-primary",
					children: "Drill complete"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 font-display text-5xl font-semibold ember-text",
					children: [pct, "%"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 text-sm text-muted-foreground",
					children: [
						correctCount,
						" of ",
						bank.length,
						" correct"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setIdx(0);
						setCorrect(0);
						setAnswer("");
						setFeedback(null);
					},
					className: "mt-6 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
					children: "Run again"
				})
			]
		});
	}
	function submit(e) {
		e.preventDefault();
		if (feedback) return;
		const norm = answer.trim().toLowerCase();
		const ok = q.accept.some((a) => a.toLowerCase() === norm);
		if (ok) setCorrect((c) => c + 1);
		setFeedback({
			correct: ok,
			explain: ok ? q.explain : `Answer: ${q.accept[0]}. ${q.explain}`
		});
	}
	function next() {
		setIdx((i) => i + 1);
		setAnswer("");
		setFeedback(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 rounded-2xl border border-border bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Question ",
					idx + 1,
					" of ",
					bank.length
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: seconds <= 20 ? "text-red-500 font-mono font-semibold" : "font-mono",
					children: [
						"⏱ ",
						String(Math.floor(seconds / 60)).padStart(1, "0"),
						":",
						String(seconds % 60).padStart(2, "0")
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 text-lg",
				children: q.prompt
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mt-5 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					value: answer,
					onChange: (e) => setAnswer(e.target.value),
					disabled: !!feedback,
					placeholder: "Type your answer",
					className: "flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
				}), !feedback ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
					children: "Submit"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: next,
					className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
					children: "Next →"
				})]
			}),
			feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `mt-4 rounded-md border p-3 text-sm ${feedback.correct ? "border-primary/40 bg-primary/5 text-primary" : "border-red-500/30 bg-red-500/5 text-foreground"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold",
					children: feedback.correct ? "✓ Correct" : "✗ Not quite"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-muted-foreground",
					children: feedback.explain
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 text-xs text-muted-foreground",
				children: [
					"Score: ",
					correctCount,
					"/",
					idx + (feedback ? 1 : 0)
				]
			})
		]
	});
}
function shuffle(arr) {
	const a = arr.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
//#endregion
export { ExamPrep as component };
