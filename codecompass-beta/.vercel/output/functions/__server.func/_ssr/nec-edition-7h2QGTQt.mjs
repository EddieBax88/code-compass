import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B1jDr4fN.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as useAuth } from "./auth-Cfg3CyA2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nec-edition-7h2QGTQt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var NEC_EDITIONS = [
	"2026",
	"2023",
	"2020",
	"2017"
];
var DEFAULT_NEC_EDITION = "2026";
var KEY = "tradesmith.nec.edition";
function readLocal() {
	if (typeof window === "undefined") return null;
	const v = window.localStorage.getItem(KEY);
	if (v === "2017" || v === "2020" || v === "2023" || v === "2026") return v;
	return null;
}
function writeLocal(v) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(KEY, v);
	window.dispatchEvent(new CustomEvent("tradesmith:nec"));
}
function useNecEdition() {
	const { user, loading: authLoading } = useAuth();
	const [edition, setEditionState] = (0, import_react.useState)(DEFAULT_NEC_EDITION);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (authLoading) return;
		if (user) return;
		setEditionState(readLocal() ?? "2026");
		setHydrated(true);
		const on = () => setEditionState(readLocal() ?? "2026");
		window.addEventListener("tradesmith:nec", on);
		window.addEventListener("storage", on);
		return () => {
			window.removeEventListener("tradesmith:nec", on);
			window.removeEventListener("storage", on);
		};
	}, [user, authLoading]);
	(0, import_react.useEffect)(() => {
		if (authLoading || !user) return;
		let cancelled = false;
		(async () => {
			const { data } = await supabase.from("profiles").select("nec_edition").eq("id", user.id).maybeSingle();
			const cloud = data?.nec_edition ?? null;
			const local = readLocal();
			const chosen = cloud ?? local ?? "2026";
			if (!cancelled) {
				setEditionState(chosen);
				setHydrated(true);
			}
			if (!cloud && local) await supabase.from("profiles").upsert({
				id: user.id,
				nec_edition: local
			}, { onConflict: "id" });
		})();
		return () => {
			cancelled = true;
		};
	}, [user, authLoading]);
	return {
		edition,
		setEdition: (0, import_react.useCallback)((v) => {
			writeLocal(v);
			setEditionState(v);
			if (user) supabase.from("profiles").upsert({
				id: user.id,
				nec_edition: v
			}, { onConflict: "id" }).then(({ error }) => {
				if (error) console.error(error);
			});
		}, [user]),
		hydrated
	};
}
function citeLabel(edition, ref) {
	return `NEC ${edition ?? "—"} · ${ref}`;
}
//#endregion
export { citeLabel as n, useNecEdition as r, NEC_EDITIONS as t };
