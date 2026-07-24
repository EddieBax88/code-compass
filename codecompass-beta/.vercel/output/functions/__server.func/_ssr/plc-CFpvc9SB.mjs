import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Cpu, d as ArrowLeft, n as Upload, r as TriangleAlert, s as FileCode } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plc-CFpvc9SB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PlcPage() {
	const [file, setFile] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const handleUpload = async () => {
		if (!file) return;
		setLoading(true);
		setError(null);
		setResult(null);
		try {
			const formData = new FormData();
			formData.append("file", file);
			const response = await fetch("/api/parse-l5x", {
				method: "POST",
				body: formData
			});
			const data = await response.json();
			if (!response.ok) {
				setError(data.error || "Failed to parse file");
				return;
			}
			setResult(data);
		} catch (err) {
			setError("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-5xl px-5 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), " Back to dashboard"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-11 w-11 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-ember",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-[0.2em] text-accent",
					children: "Module 02"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl font-semibold",
				children: "Industrial PLC Parsing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-sm font-medium text-primary",
				children: "NFPA 70 National Electrical Code (NEC) 2026 Edition"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground max-w-xl",
				children: "Upload Rockwell L5X exports. Parse tags, routines, and rung logic with SHA-256 verification for NEC-compliant controls-engineer troubleshooting and code review per the 2026 Edition."
			}),
			!result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 rounded-2xl border border-dashed border-border bg-card/60 p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCode, { className: "h-12 w-12 text-muted-foreground/50" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-[0.18em] text-primary mb-2",
								children: "Upload L5X File"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: ".L5X,.l5x",
								onChange: (e) => setFile(e.target.files?.[0] || null),
								className: "block w-full text-sm text-muted-foreground\n                  file:mr-4 file:py-2 file:px-4\n                  file:rounded-md file:border-0\n                  file:text-sm file:font-semibold\n                  file:bg-primary file:text-primary-foreground\n                  hover:file:bg-primary/90\n                  file:cursor-pointer cursor-pointer"
							})]
						}),
						file && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground",
							children: ["Selected: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-foreground",
								children: file.name
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleUpload,
							disabled: !file || loading,
							className: "mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 animate-pulse" }), "Parsing..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), "Parse & Visualize"] })
						})
					]
				})
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-lg border border-red-500/50 bg-red-950/20 p-4 flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-red-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold text-red-400",
					children: "Parse Error"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-red-300/80 mt-1",
					children: error
				})] })]
			}),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-card p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl font-semibold",
									children: result.metadata.project_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-sm text-muted-foreground space-x-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Version: ", result.metadata.version] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-xs",
											children: [result.metadata.l5x_hash.slice(0, 30), "..."]
										})
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setResult(null);
										setFile(null);
										setError(null);
									},
									className: "text-xs uppercase tracking-[0.18em] text-primary hover:text-primary/80",
									children: "Upload New"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md bg-background/50 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1",
											children: "Controller"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-xs",
											children: result.metadata.controller?.processorType || "N/A"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md bg-background/50 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1",
											children: "Routines"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-xs",
											children: result.routines.length
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md bg-background/50 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1",
											children: "Total Rungs"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-xs",
											children: result.validation_summary.total_rungs
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md bg-background/50 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1",
											children: "Tags Defined"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-xs",
											children: result.validation_summary.tags_defined
										})]
									})
								]
							}),
							result.validation_summary.total_warnings > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 rounded-md border border-yellow-500/50 bg-yellow-950/20 p-3 flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-yellow-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm text-yellow-200",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: result.validation_summary.total_warnings
										}),
										" ",
										"tag reference warning",
										result.validation_summary.total_warnings > 1 ? "s" : "",
										" ",
										"detected"
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-card overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border px-6 py-4 bg-background/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-semibold",
								children: "Ladder Logic Visualization"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Visual rung representation with live-pulse animation support"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-6 overflow-x-auto",
							dangerouslySetInnerHTML: { __html: result.svg }
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-card p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-semibold mb-4",
							children: "Routine Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: result.routines.map((routine, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border border-border rounded-md p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between mb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: routine.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											routine.type,
											" • ",
											routine.rung_count,
											" rungs"
										]
									})] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [routine.rungs.slice(0, 5).map((rung, rungIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs border-l-2 border-primary/30 pl-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-primary font-bold shrink-0",
												children: ["#", rung.index]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1 min-w-0",
												children: [
													rung.comment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-muted-foreground italic mb-1",
														children: ["// ", rung.comment]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-mono text-foreground break-all",
														children: rung.logic_text
													}),
													rung.warnings && rung.warnings.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-1 text-yellow-400 text-[10px]",
														children: [
															"⚠ ",
															rung.warnings.length,
															" warning",
															rung.warnings.length > 1 ? "s" : ""
														]
													})
												]
											})]
										})
									}, rungIdx)), routine.rung_count > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground pt-2",
										children: [
											"... and ",
											routine.rung_count - 5,
											" more rungs"
										]
									})]
								})]
							}, idx))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-card p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-semibold mb-4",
							children: "Tag Inventory"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [result.tag_inventory.slice(0, 50).map((tag, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block rounded-md bg-background/50 px-3 py-1.5 text-xs font-mono",
								children: tag
							}, idx)), result.tag_inventory.length > 50 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground self-center",
								children: [
									"+",
									result.tag_inventory.length - 50,
									" more"
								]
							})]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { PlcPage as component };
