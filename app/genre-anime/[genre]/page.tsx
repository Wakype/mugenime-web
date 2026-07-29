import { fetchAnime } from "@/lib/api";
import { GenreDetailResponse } from "@/lib/types";
import { Layers, Hash } from "lucide-react";
import { notFound } from "next/navigation";
import GenreCard from "@/components/genreAnimeCard";
import Pagination from "@/components/pagination";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function GenreDetailPage({
  params,
  searchParams,
}: Readonly<PageProps>) {
  const { genre } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  let response: GenreDetailResponse;
  try {
    response = await fetchAnime<GenreDetailResponse>(
      `anime/genre/${genre}?page=${currentPage}`,
    );
  } catch (error) {
    console.log(error);
    return notFound();
  }

  const { animeList, pagination } = response;
  const { totalPages } = pagination;

  const genreName =
    genre.charAt(0).toUpperCase() + genre.slice(1).replaceAll("-", " ");

  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-8">
        {/* --- HEADER --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <Hash className="w-3.5 h-3.5" />
                Kategori
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                Genre: <span className="text-primary">{genreName}</span>
              </h1>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Menampilkan koleksi anime dengan genre{" "}
                <span className="font-bold text-foreground capitalize">
                  {genreName}
                </span>
                . Urutan berdasarkan update terbaru.
              </p>
            </div>

            {/* Page Widget */}
            <div className="flex flex-col items-end justify-center px-6 py-3 rounded-2xl bg-card/60 border border-border backdrop-blur-md">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Halaman
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-primary">
                  {currentPage}
                </span>
                <span className="text-xs text-muted-foreground font-bold">
                  / {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- ANIME GRID --- */}
        {animeList && animeList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            {animeList.map((anime) => (
              <GenreCard key={anime.animeId} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Layers className="w-12 h-12 mb-4 opacity-20" />
            <p>Belum ada anime di genre ini.</p>
          </div>
        )}

        {/* --- PAGINATION CONTROL --- */}
        {animeList && animeList.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasPrevPage={pagination.hasPrevPage}
            hasNextPage={pagination.hasNextPage}
            pageUrlTemplate={`/genre-anime/${genre}?page={page}`}
          />
        )}
      </div>
    </div>
  );
}
