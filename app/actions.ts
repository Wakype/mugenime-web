"use server";

import { fetchAnime } from "@/lib/api";
import { AnimeDetail } from "@/lib/types";

export async function getAnimeDetailAction(slug: string): Promise<AnimeDetail | null> {
  try {
    const data = await fetchAnime<AnimeDetail>(`anime/anime/${slug}`, {
      next: { revalidate: 86400 } // Cache 24 jam (ISR)
    });
    return data;
  } catch (error) {
    console.error(`Gagal fetch detail untuk ${slug}:`, error);
    return null;
  }
}