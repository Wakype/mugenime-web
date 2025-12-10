import { fetchAnime } from "@/lib/api";
import { GenreDetailResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Layers, ChevronLeft, ChevronRight, Hash } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import GenreCard from "@/components/genreAnimeCard";

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

  // Fetch Data
  let response: GenreDetailResponse;
  try {
    response = await fetchAnime<GenreDetailResponse>(
      `anime/genre/${genre}?page=${currentPage}`
    );

    console.log("genre =", response);
  } catch (error) {
    console.log(error);
    return notFound();
  }

  const { animeList, pagination } = response;

  const { totalPages } = pagination;

  const genreName =
    genre.charAt(0).toUpperCase() + genre.slice(1).replaceAll("-", " ");

  const generatePagination = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen pb-20 py-10 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 space-y-8">
        {/* --- HEADER --- */}
        <div className="relative rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 md:p-10 shadow-sm overflow-hidden group">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider w-fit">
                <Hash className="w-3.5 h-3.5" />
                Kategori
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading">
                Genre: <span className="text-indigo-600">{genreName}</span>
              </h1>

              <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
                Menampilkan koleksi anime dengan genre{" "}
                <span className="font-bold text-zinc-700 dark:text-zinc-300 capitalize">
                  {genreName}
                </span>
                {""}. Urutan berdasarkan update terbaru.
              </p>
            </div>

            {/* Page Widget */}
            <div className="flex flex-col items-end justify-center px-6 py-3 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Halaman
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-indigo-600">
                  {currentPage}
                </span>
                <span className="text-sm font-medium text-zinc-400">
                  / {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID ANIME --- */}

        {animeList && animeList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            {animeList.map((anime) => (
              <GenreCard key={anime.animeId} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Layers className="w-12 h-12 mb-4 opacity-20" />
            <p>Belum ada anime di genre ini.</p>
          </div>
        )}

        {/* --- PAGINATION CONTROL --- */}
        <div className="flex items-center justify-center gap-5 pt-8 overflow-x-auto pb-4">
          <Button
            variant="outline"
            // PERBAIKAN: Ganti has_previous_page -> hasPrevPage
            disabled={!pagination.hasPrevPage}
            asChild={pagination.hasPrevPage}
            className="h-10 px-4 gap-2"
          >
            {pagination.hasPrevPage ? (
              // PERBAIKAN: Ganti previous_page -> prevPage
              <Link href={`/genre-anime/${genre}?page=${pagination.prevPage}`}>
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </Link>
            ) : (
              <span>
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </span>
            )}
          </Button>

          <div className="flex items-center gap-1">
            {generatePagination().map((p, idx) => {
              if (p === "...") {
                return (
                  <span
                    key={`el-${idx}`}
                    className="px-2 text-zinc-400 select-none"
                  >
                    ...
                  </span>
                );
              }
              const isCurrent = p === currentPage;
              return (
                <Button
                  key={idx}
                  variant={isCurrent ? "default" : "ghost"}
                  size="icon"
                  asChild
                  className={cn(
                    "w-10 h-10 rounded-lg",
                    isCurrent
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  <Link href={`/genre-anime/${genre}?page=${p}`}>{p}</Link>
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            // PERBAIKAN: Ganti has_next_page -> hasNextPage
            disabled={!pagination.hasNextPage}
            asChild={pagination.hasNextPage}
            className="h-10 px-4 gap-2"
          >
            {pagination.hasNextPage ? (
              // PERBAIKAN: Ganti next_page -> nextPage
              <Link href={`/genre-anime/${genre}?page=${pagination.nextPage}`}>
                Selanjutnya <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span>
                Selanjutnya <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
