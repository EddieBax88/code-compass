import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getMyProgress from "./tools/get-my-progress";
import listMyQuizResults from "./tools/list-my-quiz-results";
import listCourses from "./tools/list-courses";
import setNecEdition from "./tools/set-nec-edition";

// Direct Supabase issuer — the .lovable.cloud proxy fails RFC 8414 discovery.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "code-compass-mcp",
  title: "Code Compass",
  version: "0.1.0",
  instructions:
    "Tools for a signed-in Code Compass user. Use these to check their NEC learning progress, list courses, review quiz results, and set the active NEC edition used for code citations.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getMyProgress, listMyQuizResults, listCourses, setNecEdition],
});
