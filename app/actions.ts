"use server";

import { fetchAnime } from "@/lib/api";
import { AnimeDetail, SearchResult } from "@/lib/types";

export async function getAnimeDetailAction(
  slug: string
): Promise<AnimeDetail | null> {
  try {
    const data = await fetchAnime<AnimeDetail>(`anime/anime/${slug}`, {
      next: { revalidate: 86400 }, // Cache 24 jam (ISR)
    });
    return data;
  } catch (error) {
    console.error(`Gagal fetch detail untuk ${slug}:`, error);
    return null;
  }
}

export async function searchAnimeAction(
  keyword: string
): Promise<SearchResult[]> {
  if (!keyword || keyword.trim().length < 3) return [];

  try {
    // Endpoint: /anime/search/:keyword
    // API Sanka mengembalikan array langsung di dalam properti 'data'
    const res = await fetchAnime<{ data: SearchResult[] }>(
      `anime/search/${encodeURIComponent(keyword)}`
    );

    // Defensive check: API kadang mengembalikan object dengan key data, atau array langsung
    // Sesuaikan dengan respon API yang Anda berikan: { data: [...] }
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;

    return [];
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}
