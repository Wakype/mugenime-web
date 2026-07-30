import { GenreClient } from "@/components/genreClient";
import { fetchAnime } from "@/lib/api";
import { GenreListResponse, GenreDetailResponse } from "@/lib/types";

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ genre?: string; page?: string }>;
}

export default async function GenrePage({ searchParams }: Readonly<PageProps>) {
  const { genre, page } = await searchParams;
  const currentPage = Number(page) || 1;

  const genresRes = await fetchAnime<GenreListResponse>("anime/genre").catch(
    (err) => {
      console.error("Failed to fetch anime genres:", err);
      return null;
    },
  );

  if (!genresRes?.genreList) {
    throw new Error(
      "Gagal memuat daftar genre anime. Server API mungkin sedang sibuk atau lambat, silakan muat ulang (refresh) halaman ini.",
    );
  }

  let genreDetail: GenreDetailResponse | null = null;
  if (genre) {
    try {
      genreDetail = await fetchAnime<GenreDetailResponse>(
        `anime/genre/${genre}?page=${currentPage}`,
      );
    } catch (error) {
      console.error(`Failed to fetch genre detail for ${genre}:`, error);
    }
  }

  return (
    <GenreClient
      genres={genresRes.genreList}
      selectedGenreId={genre}
      animeList={genreDetail?.animeList}
      pagination={genreDetail?.pagination}
      currentPage={currentPage}
    />
  );
}
