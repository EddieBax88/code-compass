import { createFileRoute } from "@tanstack/react-router";
import {
  getAuthUser,
  checkIsFoundingMember,
  parseUsageCookie,
  getClientIp,
} from "@/lib/paywall.server";

export const Route = createFileRoute("/api/subscription-status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await getAuthUser(request);
          const isFoundingMember = user ? await checkIsFoundingMember(user.id, user.email) : false;

          const cookieHeader = request.headers.get("cookie");
          const parsed = parseUsageCookie(cookieHeader);
          const used = parsed.valid ? parsed.count : 0;

          return new Response(
            JSON.stringify({
              isFoundingMember,
              guestUsage: {
                used,
                limit: 1,
                remaining: Math.max(0, 1 - used),
              },
              user: user ? { id: user.id, email: user.email } : null,
            }),
            {
              status: 200,
              headers: { "content-type": "application/json" },
            },
          );
        } catch (err) {
          console.error("[subscription-status] Error:", err);
          return new Response(
            JSON.stringify({
              isFoundingMember: false,
              guestUsage: { used: 0, limit: 1, remaining: 1 },
              user: null,
            }),
            {
              status: 200,
              headers: { "content-type": "application/json" },
            },
          );
        }
      },
    },
  },
});
