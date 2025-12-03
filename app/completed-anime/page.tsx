import { fetchAnime } from "@/lib/api";
import { CompleteAnimeResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CompletedCard from "@/components/completedAnimeCard";

// Cache 1 jam karena data anime tamat jarang berubah drastis
export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function CompletedPage({ searchParams }: PageProps) {
  // 1. Pagination Logic
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // 2. Fetch Data
  const response = await fetchAnime<CompleteAnimeResponse>(
    `anime/complete-anime/${currentPage}`
  );

  const { paginationData, completeAnimeData } = response;
  const { last_visible_page } = paginationData;

  // 3. Helper Pagination (Sama seperti Ongoing)
  const generatePagination = () => {
    const pages = [];
    const maxVisible = 5;

    if (last_visible_page <= maxVisible) {
      for (let i = 1; i <= last_visible_page; i++) pages.push(i);
    } else if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", last_visible_page);
      } else if (currentPage >= last_visible_page - 2) {
        pages.push(
          1,
          "...",
          last_visible_page - 2,
          last_visible_page - 1,
          last_visible_page
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          last_visible_page
        );
      }
    return pages;
  };

  return (
    <div className="min-h-screen pb-20 py-10 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 space-y-8">
        {/* --- HEADER SECTION (PREMIUM) --- */}
        <div className="relative rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 md:p-10 shadow-sm overflow-hidden group">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              {/* Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider w-fit">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Anime Tamat
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading">
                Anime <span className="text-indigo-600">Selesai Tayang</span>
              </h1>

              <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
                Koleksi lengkap anime yang sudah tamat. Nikmati maraton nonton
                tanpa perlu menunggu episode baru rilis setiap minggu.
              </p>
            </div>

            {/* Page Indicator Widget */}
            <div className="flex flex-col items-end justify-center px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Halaman
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-indigo-600">
                  {currentPage}
                </span>
                <span className="text-sm font-medium text-zinc-400">
                  / {last_visible_page}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID ANIME --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {completeAnimeData.map((anime) => (
            <CompletedCard key={anime.slug} anime={anime} />
          ))}
        </div>

        {/* --- PAGINATION CONTROL --- */}
        <div className="flex items-center justify-center gap-5 pt-8 overflow-x-auto pb-4">
          <Button
            variant="outline"
            disabled={!paginationData.has_previous_page}
            asChild={paginationData.has_previous_page}
            className="h-10 px-4 gap-2"
          >
            {paginationData.has_previous_page ? (
              <Link
                href={`/completed-anime?page=${paginationData.previous_page}`}
              >
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </Link>
            ) : (
              <span>
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </span>
            )}
          </Button>

          <div className="flex items-center gap-1">
            {generatePagination().map((page, idx) => {
              if (page === "...") {
                return (
                  <span
                    key={`el-${idx}`}
                    className="px-2 text-zinc-400 select-none"
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
                    "w-10 h-10 rounded-lg",
                    isCurrent
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  <Link href={`/completed-anime?page=${page}`}>{page}</Link>
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            disabled={!paginationData.has_next_page}
            asChild={paginationData.has_next_page}
            className="h-10 px-4 gap-2"
          >
            {paginationData.has_next_page ? (
              <Link href={`/completed-anime?page=${paginationData.next_page}`}>
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
