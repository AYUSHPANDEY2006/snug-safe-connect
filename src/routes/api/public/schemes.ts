import { createFileRoute } from "@tanstack/react-router";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Content-Type": "application/json",
};

export const Route = createFileRoute("/api/public/schemes")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      GET: async () => {
        const { fetchSchemes } = await import("@/lib/schemes.server");
        const schemes = await fetchSchemes();
        return new Response(JSON.stringify({ schemes }), { headers: cors });
      },
      POST: async ({ request }) => {
        const { z } = await import("zod");
        const body = await request.json().catch(() => null);
        const parsedBody = z
          .object({ query: z.string().min(1).max(1000), limit: z.number().int().min(1).max(12).optional() })
          .safeParse(body);
        if (!parsedBody.success) {
          return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400, headers: cors });
        }
        const { fetchSchemes } = await import("@/lib/schemes.server");
        const { matchFrom, buildReply } = await import("@/lib/schemes");
        const all = await fetchSchemes();
        const schemes = matchFrom(all, parsedBody.data.query, parsedBody.data.limit ?? 4);
        return new Response(JSON.stringify({ reply: buildReply(parsedBody.data.query, schemes), schemes }), {
          headers: cors,
        });
      },
    },
  },
});