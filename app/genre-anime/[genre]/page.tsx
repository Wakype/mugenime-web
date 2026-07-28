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

  // --- LOGIC PAGINATION DESKTOP ---
  const generateDesktopPagination = () => {
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
        totalPages,
      );
    }
    return pages;
  };

  // --- LOGIC PAGINATION MOBILE ---
  const generateMobilePagination = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      end = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
      start = Math.max(1, totalPages - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

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
                {""}. Urutan berdasarkan update terbaru.
              </p>
            </div>

            {/* Page Widget */}
            <div className="flex flex-col items-end justify-center px-6 py-3 rounded-2xl bg-card/60 border border-border backdrop-blur-md">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Halaman
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-primary">
                  {currentPage}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
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
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Layers className="w-12 h-12 mb-4 opacity-20" />
            <p>Belum ada anime di genre ini.</p>
          </div>
        )}

        {/* --- PAGINATION CONTROL --- */}
        <div className="w-full pb-4">
          {/* MOBILE PAGINATION */}
          <div className="flex md:hidden items-center justify-between gap-1 w-full">
            <Button
              variant="outline"
              size="icon"
              disabled={!pagination.hasPrevPage}
              asChild={pagination.hasPrevPage}
              className="h-9 w-9 shrink-0 rounded-lg border-border hover:bg-muted text-muted-foreground"
            >
              {pagination.hasPrevPage ? (
                <Link
                  href={`/genre-anime/${genre}?page=${pagination.prevPage}`}
                  prefetch={false}
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              ) : (
                <ChevronLeft className="w-4 h-4 opacity-30" />
              )}
            </Button>

            <div className="flex items-center justify-center gap-1 overflow-hidden">
              {generateMobilePagination().map((p) => {
                const isCurrent = p === currentPage;
                return (
                  <Button
                    key={p}
                    variant={isCurrent ? "default" : "ghost"}
                    size="icon"
                    asChild
                    className={cn(
                      "h-9 w-9 rounded-lg text-xs font-bold transition-all",
                      isCurrent
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <Link href={`/genre-anime/${genre}?page=${p}`} prefetch={false}>{p}</Link>
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              disabled={!pagination.hasNextPage}
              asChild={pagination.hasNextPage}
              className="h-9 w-9 shrink-0 rounded-lg border-border hover:bg-muted text-muted-foreground"
            >
              {pagination.hasNextPage ? (
                <Link
                  href={`/genre-anime/${genre}?page=${pagination.nextPage}`}
                  prefetch={false}
                  aria-label="Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <ChevronRight className="w-4 h-4 opacity-30" />
              )}
            </Button>
          </div>

          {/* DESKTOP PAGINATION */}
          <div className="hidden md:flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={!pagination.hasPrevPage}
              asChild={pagination.hasPrevPage}
              className="h-10 gap-2 border-border hover:bg-muted text-muted-foreground hover:text-foreground px-4"
            >
              {pagination.hasPrevPage ? (
                <Link
                  href={`/genre-anime/${genre}?page=${pagination.prevPage}`}
                  prefetch={false}
                >
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </Link>
              ) : (
                <span className="flex items-center gap-1.5">
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </span>
              )}
            </Button>

            <div className="flex items-center gap-1 mx-4">
              {generateDesktopPagination().map((p, idx) => {
                if (p === "...") {
                  return (
                    <span
                      key={`el-${idx}`}
                      className="px-2 text-muted-foreground select-none"
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
                      "w-10 h-10 rounded-lg transition-all",
                      isCurrent
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Link href={`/genre-anime/${genre}?page=${p}`} prefetch={false}>{p}</Link>
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              disabled={!pagination.hasNextPage}
              asChild={pagination.hasNextPage}
              className="h-10 gap-2 border-border hover:bg-muted text-muted-foreground hover:text-foreground px-4"
            >
              {pagination.hasNextPage ? (
                <Link
                  href={`/genre-anime/${genre}?page=${pagination.nextPage}`}
                  prefetch={false}
                >
                  Selanjutnya <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1.5">
                  Selanjutnya <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
