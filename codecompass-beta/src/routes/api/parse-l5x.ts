import { createFileRoute } from "@tanstack/react-router";
import { parseL5X } from "@/lib/l5x-parser";
import { renderLadderSVG } from "@/lib/svg-renderer";

export const Route = createFileRoute("/api/parse-l5x")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData();
          const file = formData.get("file") as File | null;

          if (!file || !file.name.endsWith(".L5X")) {
            return new Response(
              JSON.stringify({ error: "Invalid file. Please upload a .L5X file." }),
              { status: 400, headers: { "content-type": "application/json" } },
            );
          }

          if (file.size > 10 * 1024 * 1024) {
            return new Response(JSON.stringify({ error: "File too large. Max 10MB." }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const result = parseL5X(buffer);
          const rungs = result.routines.flatMap((r) =>
            r.rungs.map((rung) => ({
              index: rung.index,
              comment: rung.comment,
              logic_text: rung.logic_text,
              tokens: rung.tokens,
              warnings: rung.warnings,
            })),
          );

          const svg = renderLadderSVG(rungs as any, {
            title: result.metadata.project_name,
            metadata: result.metadata.l5x_hash.slice(0, 20),
            maxRungs: 100, // Prevent SVG overflow on large programs
          });

          return new Response(
            JSON.stringify({
              metadata: result.metadata,
              routines: result.routines,
              tag_inventory: result.tag_inventory,
              validation_summary: result.validation_summary,
              svg,
            }),
            {
              status: 200,
              headers: { "content-type": "application/json" },
            },
          );
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : "Unknown error";
          const stack = error instanceof Error ? error.stack : undefined;
          console.error("L5X parse error:", { message: errMsg, stack });
          return new Response(
            JSON.stringify({ 
              error: "Failed to parse L5X file. Invalid format or unsupported schema.",
              details: process.env.NODE_ENV === "development" ? errMsg : undefined,
            }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
