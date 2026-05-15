import { GenreClient } from "@/components/genreClient";
import { fetchAnime } from "@/lib/api";
import { GenreListResponse } from "@/lib/types";

export const revalidate = 86400;

export default async function GenrePage() {
  const genres = await fetchAnime<GenreListResponse>("anime/genre").catch(
    (err) => {
      console.error("Failed to fetch anime genres:", err);
      return null;
    },
  );

  if (!genres?.genreList) {
    throw new Error(
      "Gagal memuat daftar genre anime. Server API mungkin sedang sibuk atau lambat, silakan muat ulang (refresh) halaman ini.",
    );
  }

  return <GenreClient genres={genres.genreList} />;
}
