// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    envDir: "..", // read .env from project root (code-compass/)
    plugins: [mcpPlugin()],
    server: {
      proxy: {
        "/api/chat/qwen": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/api/lookup": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        // /api/parse-l5x and /api/chat handled natively by TanStack Start SSR
      },
    },
  },
});
