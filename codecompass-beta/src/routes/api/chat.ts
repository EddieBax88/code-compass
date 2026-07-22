import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { message } = await request.json();

          if (!message || typeof message !== "string") {
            return new Response(JSON.stringify({ error: "No message provided" }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const apiKey = process.env.DASHSCOPE_API_KEY;
          if (!apiKey) {
            return new Response(
              JSON.stringify({
                error: "Configuration error",
                message: "DASHSCOPE_API_KEY not configured on server",
              }),
              {
                status: 500,
                headers: { "content-type": "application/json" },
              },
            );
          }

          const response = await fetch(
            "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + apiKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "qwen-plus",
                messages: [
                  {
                    role: "system",
                    content:
                      "You are an expert Master Electrician and NEC Co-Pilot. Answer questions about the National Electrical Code (NEC) with accurate article references, table numbers, and practical guidance. Always cite the relevant NEC article or table. Never paste copyrighted NEC text verbatim — paraphrase and cite the article/table number.",
                  },
                  { role: "user", content: message },
                ],
                temperature: 0.1,
              }),
            },
          );

          if (!response.ok) {
            const err = await response.text();
            return new Response(
              JSON.stringify({
                error: "Upstream API error",
                status: response.status,
                detail: err,
              }),
              {
                status: 502,
                headers: { "content-type": "application/json" },
              },
            );
          }

          const data = await response.json();
          const text = data.choices?.[0]?.message?.content ?? "No response received.";

          return new Response(JSON.stringify({ text, message: text }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : "Unknown error";
          return new Response(
            JSON.stringify({ error: "Failed to process message", message: errMsg }),
            {
              status: 500,
              headers: { "content-type": "application/json" },
            },
          );
        }
      },
    },
  },
});
