"use server";

import { fetchAnime, fetchKomik } from "@/lib/api";
import { AnimeDetail, SearchResult } from "@/lib/types";
import { AdvanceSearchKomikResponse, KomikItem } from "@/lib/komikTypes";

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
  slug: string,
): Promise<AnimeDetail | null> {
  try {
    const data = await fetchAnime<AnimeDetail>(`anime/anime/${slug}`, {
      next: { revalidate: 86400 },
    });
    return data;
  } catch (error) {
    console.error(`Gagal fetch detail untuk ${slug}:`, error);
    return null;
  }
}

export async function searchAnimeAction(
  keyword: string,
): Promise<SearchResult[]> {
  if (!keyword || keyword.trim().length < 3) return [];

  try {
    const res = await fetchAnime<ApiSearchResponse>(
      `anime/search/${encodeURIComponent(keyword)}`,
    );

    if (res && Array.isArray(res.animeList)) {
      return res.animeList.map((item) => ({
        title: item.title,
        slug: item.animeId,
        poster: item.poster,
        status: item.status,
        rating: item.score,
        genres: item.genreList,
        url: `/anime/${item.animeId}`,
      }));
    }

    return [];
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}

export async function searchKomikAction(keyword: string): Promise<KomikItem[]> {
  if (!keyword || keyword.trim().length < 3) return [];

  try {
    const res = await fetchKomik<AdvanceSearchKomikResponse>(
      `advanceSearch?page=1&take=5&sort=latest&sortOrder=desc&search=${encodeURIComponent(keyword)}`,
    );

    return res?.data?.data || [];
  } catch (error) {
    console.error("Komik Search Error:", error);
    return [];
  }
}
