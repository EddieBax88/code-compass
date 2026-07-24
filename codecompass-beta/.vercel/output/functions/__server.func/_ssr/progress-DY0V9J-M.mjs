import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B1jDr4fN.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as useAuth } from "./auth-Cfg3CyA2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-DY0V9J-M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var KEY = "tradesmith.progress.v2";
var MIGRATED_KEY = "tradesmith.progress.migrated";
var empty = {
	lessons: {},
	quizResults: {}
};
function readLocal() {
	if (typeof window === "undefined") return empty;
	try {
		const raw = window.localStorage.getItem(KEY);
		if (!raw) return empty;
		const parsed = JSON.parse(raw);
		return {
			lessons: parsed.lessons ?? {},
			quizResults: parsed.quizResults ?? {}
		};
	} catch {
		return empty;
	}
}
function writeLocal(s) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(KEY, JSON.stringify(s));
	window.dispatchEvent(new CustomEvent("tradesmith:progress"));
}
async function loadCloud(userId) {
	const [lessonsRes, quizzesRes] = await Promise.all([supabase.from("lesson_completions").select("course_id, lesson_key").eq("user_id", userId), supabase.from("quiz_results").select("*").eq("user_id", userId)]);
	const lessons = {};
	for (const row of lessonsRes.data ?? []) (lessons[row.course_id] ||= []).push(row.lesson_key);
	const quizResults = {};
	for (const q of quizzesRes.data ?? []) {
		const byCourse = quizResults[q.course_id] ||= {};
		byCourse[q.module_id] = {
			attempts: q.attempts,
			best: {
				scorePct: q.best_score_pct,
				correct: q.best_correct,
				total: q.best_total,
				passed: q.best_passed,
				at: q.best_at ? new Date(q.best_at).getTime() : 0
			},
			last: {
				scorePct: q.last_score_pct,
				correct: q.last_correct,
				total: q.last_total,
				passed: q.last_passed,
				at: q.last_at ? new Date(q.last_at).getTime() : 0
			}
		};
	}
	return {
		lessons,
		quizResults
	};
}
async function upsertLessonCloud(userId, courseId, key) {
	await supabase.from("lesson_completions").upsert({
		user_id: userId,
		course_id: courseId,
		lesson_key: key
	}, { onConflict: "user_id,course_id,lesson_key" });
}
async function deleteLessonCloud(userId, courseId, key) {
	await supabase.from("lesson_completions").delete().eq("user_id", userId).eq("course_id", courseId).eq("lesson_key", key);
}
async function upsertQuizCloud(userId, courseId, moduleId, rec) {
	await supabase.from("quiz_results").upsert({
		user_id: userId,
		course_id: courseId,
		module_id: moduleId,
		attempts: rec.attempts,
		best_score_pct: rec.best.scorePct,
		best_correct: rec.best.correct,
		best_total: rec.best.total,
		best_passed: rec.best.passed,
		best_at: new Date(rec.best.at).toISOString(),
		last_score_pct: rec.last.scorePct,
		last_correct: rec.last.correct,
		last_total: rec.last.total,
		last_passed: rec.last.passed,
		last_at: new Date(rec.last.at).toISOString(),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "user_id,course_id,module_id" });
}
async function migrateLocalToCloud(user) {
	if (typeof window === "undefined") return;
	if (window.localStorage.getItem(MIGRATED_KEY) === user.id) return;
	const local = readLocal();
	const jobs = [];
	for (const [courseId, keys] of Object.entries(local.lessons)) for (const k of keys) jobs.push(upsertLessonCloud(user.id, courseId, k));
	for (const [courseId, byModule] of Object.entries(local.quizResults)) for (const [moduleId, rec] of Object.entries(byModule)) jobs.push(upsertQuizCloud(user.id, courseId, moduleId, rec));
	await Promise.allSettled(jobs);
	window.localStorage.setItem(MIGRATED_KEY, user.id);
}
function useProgress() {
	const { user, loading: authLoading } = useAuth();
	const [state, setState] = (0, import_react.useState)(empty);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const userIdRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (authLoading) return;
		if (user) return;
		setState(readLocal());
		setLoading(false);
		const onChange = () => setState(readLocal());
		window.addEventListener("tradesmith:progress", onChange);
		window.addEventListener("storage", onChange);
		return () => {
			window.removeEventListener("tradesmith:progress", onChange);
			window.removeEventListener("storage", onChange);
		};
	}, [user, authLoading]);
	(0, import_react.useEffect)(() => {
		if (authLoading || !user) return;
		let cancelled = false;
		userIdRef.current = user.id;
		(async () => {
			await migrateLocalToCloud(user);
			const cloud = await loadCloud(user.id);
			if (!cancelled) {
				setState(cloud);
				setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [user, authLoading]);
	return {
		state,
		markLesson: (0, import_react.useCallback)((courseId, key) => {
			const uid = userIdRef.current;
			if (user && uid) {
				setState((s) => {
					const arr = new Set(s.lessons[courseId] ?? []);
					arr.add(key);
					return {
						...s,
						lessons: {
							...s.lessons,
							[courseId]: Array.from(arr)
						}
					};
				});
				upsertLessonCloud(uid, courseId, key).catch(console.error);
			} else {
				const s = readLocal();
				const arr = new Set(s.lessons[courseId] ?? []);
				arr.add(key);
				s.lessons[courseId] = Array.from(arr);
				writeLocal(s);
			}
		}, [user]),
		unmarkLesson: (0, import_react.useCallback)((courseId, key) => {
			const uid = userIdRef.current;
			if (user && uid) {
				setState((s) => {
					const arr = new Set(s.lessons[courseId] ?? []);
					arr.delete(key);
					return {
						...s,
						lessons: {
							...s.lessons,
							[courseId]: Array.from(arr)
						}
					};
				});
				deleteLessonCloud(uid, courseId, key).catch(console.error);
			} else {
				const s = readLocal();
				const arr = new Set(s.lessons[courseId] ?? []);
				arr.delete(key);
				s.lessons[courseId] = Array.from(arr);
				writeLocal(s);
			}
		}, [user]),
		recordQuiz: (0, import_react.useCallback)((courseId, moduleId, result) => {
			const uid = userIdRef.current;
			if (user && uid) setState((s) => {
				const byCourse = { ...s.quizResults[courseId] ?? {} };
				const prev = byCourse[moduleId];
				const best = !prev || result.scorePct > prev.best.scorePct ? result : prev.best;
				const rec = {
					attempts: (prev?.attempts ?? 0) + 1,
					best,
					last: result
				};
				byCourse[moduleId] = rec;
				upsertQuizCloud(uid, courseId, moduleId, rec).catch(console.error);
				return {
					...s,
					quizResults: {
						...s.quizResults,
						[courseId]: byCourse
					}
				};
			});
			else {
				const s = readLocal();
				const byCourse = s.quizResults[courseId] ?? {};
				const prev = byCourse[moduleId];
				const best = !prev || result.scorePct > prev.best.scorePct ? result : prev.best;
				byCourse[moduleId] = {
					attempts: (prev?.attempts ?? 0) + 1,
					best,
					last: result
				};
				s.quizResults[courseId] = byCourse;
				writeLocal(s);
			}
		}, [user]),
		reset: (0, import_react.useCallback)(() => {
			if (!user) writeLocal(empty);
		}, [user]),
		loading
	};
}
function quizPassed(state, courseId, moduleId) {
	return state.quizResults[courseId]?.[moduleId]?.best.passed ?? false;
}
function quizBest(state, courseId, moduleId) {
	return state.quizResults[courseId]?.[moduleId]?.best ?? null;
}
function courseProgress(state, courseId, totalLessons, totalQuizzes) {
	const lessons = state.lessons[courseId]?.length ?? 0;
	const passedQuizzes = Object.values(state.quizResults[courseId] ?? {}).filter((r) => r.best.passed).length;
	const total = totalLessons + totalQuizzes;
	if (total === 0) return 0;
	return Math.round((lessons + passedQuizzes) / total * 100);
}
//#endregion
export { useProgress as i, quizBest as n, quizPassed as r, courseProgress as t };
