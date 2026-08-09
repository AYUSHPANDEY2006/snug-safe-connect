import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { buildReply, matchFrom, parseQuery, type Scheme } from "./schemes";

export const listSchemes = createServerFn({ method: "GET" }).handler(async (): Promise<Scheme[]> => {
  const { fetchSchemes } = await import("./schemes.server");
  return fetchSchemes();
});

export const getScheme = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }): Promise<Scheme | null> => {
    const { publicClient, toScheme } = await import("./schemes.server");
    const { data: row, error } = await publicClient()
      .from("schemes")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? toScheme(row) : null;
  });

export const matchSchemesForQuery = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ query: z.string().min(1).max(1000), limit: z.number().int().min(1).max(12).optional() }).parse(input),
  )
  .handler(async ({ data }): Promise<{ reply: string; schemes: Scheme[] }> => {
    const { fetchSchemes } = await import("./schemes.server");
    const all = await fetchSchemes();
    const matched = matchFrom(all, data.query, data.limit ?? 4);
    const reply = buildReply(data.query, matched);

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const parsed = parseQuery(data.query);
      await supabaseAdmin.from("scheme_queries").insert({
        query_text: data.query,
        detected_tags: parsed.tags,
        detected_amount: parsed.amount,
        matched_scheme_ids: matched.map((s) => s.id),
      });
    } catch (error) {
      console.error("Failed to log scheme query", error);
    }

    return { reply, schemes: matched };
  });