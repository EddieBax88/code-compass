import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as Zap } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/study-tools-MeKe3IzX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SUGGESTIONS = [
	"Wall outlet spacing in a living room",
	"Working space depth for 120/240V panel",
	"GFCI required in residential bathroom",
	"Vertical clearance over a driveway",
	"Wire gauge for a 20-amp circuit",
	"Bonding requirements for metal water pipe"
];
function CoPilot() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [response, setResponse] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const send = async () => {
		if (!query.trim()) return;
		setLoading(true);
		setError("");
		setResponse("");
		try {
			const res = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: query })
			});
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			const data = await res.json();
			setResponse(typeof data === "string" ? data : data.text ?? data.message ?? JSON.stringify(data));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Something went wrong.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-[calc(100vh-4rem)] bg-background px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-2xl flex-col items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full rounded-2xl bg-card p-6 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "copilot-input",
							className: "sr-only",
							children: "Exam question"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "copilot-input",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Paste your exam question here...",
							rows: 5,
							className: "w-full resize-none border-0 bg-transparent p-2 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: send,
							disabled: loading,
							className: "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
								className: "h-4 w-4",
								fill: "currentColor",
								strokeWidth: 0
							}), loading ? "Analyzing..." : "Analyze"]
						})
					]
				}),
				(response || error) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 w-full rounded-2xl bg-card p-6 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-border",
					children: error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: error
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-wrap text-[15px] leading-relaxed text-foreground",
						children: response
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
						children: "Suggested keywords"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: SUGGESTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setQuery(s),
							className: "rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground transition hover:bg-secondary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							children: s
						}, s))
					})]
				})
			]
		})
	});
}
//#endregion
export { CoPilot as component };
