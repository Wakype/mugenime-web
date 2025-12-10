"use server";

import { fetchAnime } from "@/lib/api";
import { AnimeDetail, SearchResult } from "@/lib/types";

interface ApiSearchRawItem {
  title: string;
  poster: string;
  status: string;
  score: string;
  animeId: string;
  genreList: { title: string; genreId: string }[];
}

interface ApiSearchResponse {
  animeList: ApiSearchRawItem[];
}

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
    // 1. Fetch data
    // Karena lib/api.ts otomatis return json.data, maka tipe kembaliannya adalah { animeList: [...] }
    const res = await fetchAnime<ApiSearchResponse>(
      `anime/search/${encodeURIComponent(keyword)}`
    );

    // 2. Cek apakah animeList ada dan berbentuk array
    if (res && Array.isArray(res.animeList)) {
      // 3. Lakukan Mapping dari format API ke format SearchResult (Frontend)
      return res.animeList.map((item) => ({
        title: item.title,
        slug: item.animeId, // Mapping: animeId -> slug
        poster: item.poster,
        status: item.status,
        rating: item.score, // Mapping: score -> rating
        genres: item.genreList, // Mapping: genreList -> genres
        url: `/anime/${item.animeId}`,
      }));
    }

    return [];
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}
