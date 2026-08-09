import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import type { Scheme, SchemeKind } from "./schemes";

type Row = Database["public"]["Tables"]["schemes"]["Row"];

export function toScheme(row: Row): Scheme {
  return {
    id: row.id,
    name: row.name,
    nameHi: row.name_hi,
    kind: row.kind as SchemeKind,
    summary: row.summary,
    amount: row.amount,
    min: Number(row.min_amount),
    max: Number(row.max_amount),
    collateral: row.collateral,
    documents: row.documents,
    applyAt: row.apply_at,
    tags: row.tags,
  };
}

export function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export async function fetchSchemes(): Promise<Scheme[]> {
  const { data, error } = await publicClient()
    .from("schemes")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toScheme);
}
