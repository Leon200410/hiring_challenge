import type { ApiResult, Novel, Scene } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type StoryApiPayload = {
  novels?: Novel[];
  novel?: Novel | null;
  scenes?: Scene[];
  error?: string;
};

export function isStoryApiConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

async function requestStoryApi<T>(
  resource: "novels" | "novel" | "scenes",
  slug?: string,
): Promise<ApiResult<T>> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      configured: false,
      data: null,
      error:
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const endpoint = new URL(`${supabaseUrl}/functions/v1/story-api`);
  endpoint.searchParams.set("resource", resource);
  if (slug) {
    endpoint.searchParams.set("slug", slug);
  }

  try {
    const response = await fetch(endpoint, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      next: { revalidate: 60 },
    });

    const payload = (await response.json()) as StoryApiPayload;

    if (response.status === 404) {
      return {
        configured: true,
        data: null,
        error: null,
        status: 404,
      };
    }

    if (!response.ok || payload.error) {
      return {
        configured: true,
        data: null,
        error: payload.error ?? `Story API returned ${response.status}.`,
        status: response.status,
      };
    }

    const data =
      resource === "novels"
        ? payload.novels
        : resource === "novel"
          ? payload.novel
          : payload.scenes;

    return {
      configured: true,
      data: data as T,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      configured: true,
      data: null,
      error: error instanceof Error ? error.message : "Unknown API error.",
    };
  }
}

export function getNovels() {
  return requestStoryApi<Novel[]>("novels");
}

export function getNovel(slug: string) {
  return requestStoryApi<Novel>("novel", slug);
}

export function getScenes(slug: string) {
  return requestStoryApi<Scene[]>("scenes", slug);
}
