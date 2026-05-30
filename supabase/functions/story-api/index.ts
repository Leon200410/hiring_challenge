import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

const novelColumns =
  "id, slug, title, author, summary, cover_path, reading_minutes, created_at";

type NovelRow = {
  id: string;
  slug: string;
  title: string;
  author: string;
  summary: string;
  cover_path: string;
  reading_minutes: number;
  created_at: string;
};

type SceneRow = {
  id: number;
  position: number;
  title: string;
  body: string;
};

function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { ...corsHeaders, ...init.headers },
  });
}

function mapNovel(row: NovelRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    author: row.author,
    summary: row.summary,
    coverPath: row.cover_path,
    readingMinutes: row.reading_minutes,
    createdAt: row.created_at,
  };
}

function mapScene(row: SceneRow) {
  return {
    id: row.id,
    position: row.position,
    title: row.title,
    body: row.body,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    return json({ error: "Supabase Edge Function is missing env vars." }, { status: 500 });
  }

  const url = new URL(req.url);
  const resource = url.searchParams.get("resource") ?? "novels";
  const slug = url.searchParams.get("slug") ?? "";
  const authHeader = req.headers.get("Authorization") ?? `Bearer ${supabaseAnonKey}`;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  if (resource === "novels") {
    const { data, error } = await supabase
      .from("novels")
      .select(novelColumns)
      .order("created_at", { ascending: false });

    if (error) {
      return json({ error: error.message }, { status: 500 });
    }

    return json({ novels: (data ?? []).map(mapNovel) });
  }

  if (!slug) {
    return json({ error: "Missing slug." }, { status: 400 });
  }

  const { data: novel, error: novelError } = await supabase
    .from("novels")
    .select(novelColumns)
    .eq("slug", slug)
    .maybeSingle();

  if (novelError) {
    return json({ error: novelError.message }, { status: 500 });
  }

  if (!novel) {
    return json({ error: "Novel not found." }, { status: 404 });
  }

  if (resource === "novel") {
    return json({ novel: mapNovel(novel as NovelRow) });
  }

  if (resource === "scenes") {
    const { data, error } = await supabase
      .from("scenes")
      .select("id, position, title, body")
      .eq("novel_id", novel.id)
      .order("position", { ascending: true });

    if (error) {
      return json({ error: error.message }, { status: 500 });
    }

    return json({ scenes: ((data ?? []) as SceneRow[]).map(mapScene) });
  }

  return json({ error: "Unknown resource." }, { status: 400 });
});
