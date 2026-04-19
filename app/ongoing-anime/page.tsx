import { fetchAnime } from "@/lib/api";
import { OngoingResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import OngoingCard from "@/components/ongoingCard";
import { cn } from "@/lib/utils";

export const revalidate = 1800;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function OngoingPage({
  searchParams,
}: Readonly<PageProps>) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const daysMap = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const currentDayName = daysMap[new Date().getDay()];

  const response = await fetchAnime<OngoingResponse>(
    `anime/ongoing-anime?page=${currentPage}`,
  );

  const { pagination, animeList } = response;
  const { totalPages } = pagination;

  // --- LOGIC PAGINATION DESKTOP  ---
  const generateDesktopPagination = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
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
  // Menampilkan: [Current-2, Current-1, Current, Current+1, Current+2]
  // Maksimal 5 tombol angka agar muat di layar HP
  const generateMobilePagination = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    // Geser window jika berada di awal halaman (biar tetap menampilkan 5 angka jika ada)
    if (currentPage <= 3) {
      end = Math.min(5, totalPages);
    }
    // Geser window jika berada di akhir halaman
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
      <div className="container mx-auto px-4 space-y-10">
        {/* --- HERO HEADER SECTION --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="space-y-6 max-w-2xl flex-1">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                  <Zap className="w-3.5 h-3.5" />
                  Anime Ongoing
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                  Anime <span className="text-primary">Sedang Tayang</span>
                </h1>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
                  Daftar anime musim ini yang sedang on-going. Pantau episode
                  terbaru favoritmu agar tidak ketinggalan!
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full lg:w-auto">
              <div className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border shadow-sm overflow-hidden lg:min-w-[200px]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-orange-500/20" />
                <div className="relative z-10 flex items-center gap-1.5 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                  <Calendar className="w-3 h-3" />
                  HARI INI
                </div>
                <div className="relative z-10">
                  <span className="text-4xl md:text-5xl font-black tracking-tighter text-primary">
                    {currentDayName}
                  </span>
                </div>
                <div className="relative z-10 mt-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <p className="text-xs font-semibold text-primary">
                    {new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID CONTENT --- */}
        {animeList && animeList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            {animeList.map((anime) => (
              <OngoingCard key={anime.animeId} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            Data tidak ditemukan. Silakan coba refresh atau kembali ke halaman
            1.
          </div>
        )}

        <Separator className="bg-border" />

        {/* --- PAGINATION CONTROL --- */}
        <div className="w-full pb-4">
          {/* A. MOBILE PAGINATION (Numbers + Arrows) */}
          <div className="flex md:hidden items-center justify-between gap-1 w-full">
            {/* Tombol Prev */}
            <Button
              variant="outline"
              size="icon"
              disabled={!pagination.hasPrevPage}
              asChild={pagination.hasPrevPage}
              className="h-9 w-9 shrink-0 rounded-lg border-border hover:bg-muted text-muted-foreground"
            >
              {pagination.hasPrevPage ? (
                <Link
                  href={`/ongoing-anime?page=${pagination.prevPage}`}
                  aria-label="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              ) : (
                <ChevronLeft className="w-4 h-4 opacity-30" />
              )}
            </Button>

            {/* Deretan Angka (Mobile Logic) */}
            <div className="flex items-center justify-center gap-1 overflow-hidden">
              {generateMobilePagination().map((page) => {
                const isCurrent = page === currentPage;
                return (
                  <Button
                    key={page}
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
                    <Link href={`/ongoing-anime?page=${page}`}>{page}</Link>
                  </Button>
                );
              })}
            </div>

            {/* Tombol Next */}
            <Button
              variant="outline"
              size="icon"
              disabled={!pagination.hasNextPage}
              asChild={pagination.hasNextPage}
              className="h-9 w-9 shrink-0 rounded-lg border-border hover:bg-muted text-muted-foreground"
            >
              {pagination.hasNextPage ? (
                <Link
                  href={`/ongoing-anime?page=${pagination.nextPage}`}
                  aria-label="Halaman Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <ChevronRight className="w-4 h-4 opacity-30" />
              )}
            </Button>
          </div>

          {/* B. DESKTOP PAGINATION (Full Logic) */}
          <div className="hidden md:flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={!pagination.hasPrevPage}
              asChild={pagination.hasPrevPage}
              className="h-10 gap-2 border-border hover:bg-muted text-muted-foreground hover:text-foreground px-4"
            >
              {pagination.hasPrevPage ? (
                <Link href={`/ongoing-anime?page=${pagination.prevPage}`}>
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </Link>
              ) : (
                <span className="flex items-center gap-1.5">
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </span>
              )}
            </Button>

            <div className="flex items-center gap-1 mx-4">
              {generateDesktopPagination().map((page, idx) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-muted-foreground select-none"
                    >
                      ...
                    </span>
                  );
                }

                const isCurrent = page === currentPage;
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
                    <Link href={`/ongoing-anime?page=${page}`}>{page}</Link>
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
                <Link href={`/ongoing-anime?page=${pagination.nextPage}`}>
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
