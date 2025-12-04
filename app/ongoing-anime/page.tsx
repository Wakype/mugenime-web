import { fetchAnime } from "@/lib/api";
import { OngoingResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import OngoingCard from "@/components/ongoingCard";
import { cn } from "@/lib/utils";

// Revalidate 30 menit (Cukup fresh untuk ongoing)
export const revalidate = 1800;

// Props untuk menangkap ?page= di URL
interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function OngoingPage({
  searchParams,
}: Readonly<PageProps>) {
  // 1. Ambil page dari URL, default ke 1 jika tidak ada
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

  // 2. Fetch API dengan parameter page
  const response = await fetchAnime<OngoingResponse>(
    `anime/ongoing-anime?page=${currentPage}`
  );

  const { paginationData, ongoingAnimeData } = response;
  const { last_visible_page } = paginationData;

  const generatePagination = () => {
    const pages = [];
    const maxVisible = 5; // Jumlah maksimal tombol angka yang ingin ditampilkan

    if (last_visible_page <= maxVisible) {
      // Jika total halaman sedikit, tampilkan semua (1 2 3 4 5)
      for (let i = 1; i <= last_visible_page; i++) {
        pages.push(i);
      }
    } else {
      // Logika "Ellipsis" (...)
      if (currentPage <= 3) {
        // Posisi awal: 1 2 3 ... 5
        pages.push(1, 2, 3, "...", last_visible_page);
      } else if (currentPage >= last_visible_page - 2) {
        // Posisi akhir: 1 ... 3 4 5
        pages.push(
          1,
          "...",
          last_visible_page - 2,
          last_visible_page - 1,
          last_visible_page
        );
      } else {
        // Posisi tengah: 1 ... 4 5 6 ... 10
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
    }
    return pages;
  };

  return (
    <div className="min-h-screen pb-20 py-10 dark:bg-zinc-950">
      <div className="container mx-auto px-4 space-y-10">
        {/* --- HERO HEADER SECTION (PREMIUM) --- */}
        <div className="relative rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 md:p-10 shadow-sm overflow-hidden group">
          {/* 1. BACKGROUND DECORATION */}
          {/* Grid Pattern Halus */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

          {/* Gradient Blobs (Dekorasi) */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            {/* --- KIRI: KONTEN UTAMA --- */}
            <div className="space-y-6 max-w-2xl flex-1">
              <div className="space-y-3">
                {/* Label Kecil (Update Setiap Hari) */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider w-fit">
                  <Zap className="w-3.5 h-3.5" />
                  Anime Ongoing
                </div>

                {/* Judul dengan Gradient Text */}
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading">
                  Anime <span className="text-indigo-600">Sedang Tayang</span>
                </h1>

                <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
                  Daftar anime musim ini yang sedang on-going. Pantau episode
                  terbaru favoritmu secara real-time agar tidak ketinggalan!
                </p>
              </div>
            </div>

            {/* --- KANAN: WIDGET HARI (Calendar Style) --- */}
            <div className="shrink-0 w-full lg:w-auto">
              <div className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden lg:min-w-[200px]">
                {/* Dekorasi Background Halus */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-orange-500/10" />

                {/* Label Atas */}
                <div className="relative z-10 flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                  <Calendar className="w-3 h-3" />
                  HARI INI
                </div>

                {/* Nama Hari Besar */}
                <div className="relative z-10">
                  <span className="text-4xl md:text-5xl font-black tracking-tighter text-indigo-600">
                    {currentDayName}
                  </span>
                </div>

                {/* Tanggal Lengkap (Formatted) */}
                <div className="relative z-10 mt-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
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
        {ongoingAnimeData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            {ongoingAnimeData.map((anime) => (
              <OngoingCard key={anime.slug} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-500">
            Data tidak ditemukan. Silakan coba refresh atau kembali ke halaman
            1.
          </div>
        )}

        <Separator />

        {/* --- PAGINATION CONTROL --- */}
        <div className="flex items-center justify-center gap-5 pt-8 overflow-x-auto pb-4">
          {/* Tombol Sebelumnya */}
          <Button
            variant="outline"
            disabled={!paginationData.has_previous_page}
            asChild={paginationData.has_previous_page}
            className="h-10 gap-2"
          >
            {paginationData.has_previous_page ? (
              <Link href={`/ongoing-anime?page=${currentPage - 1}`}>
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </Link>
            ) : (
              <span className="flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </span>
            )}
          </Button>

          {/* List Angka */}
          <div className="flex items-center gap-1">
            {generatePagination().map((page, idx) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
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
                  <Link href={`/ongoing-anime?page=${page}`}>{page}</Link>
                </Button>
              );
            })}
          </div>

          {/* Tombol Selanjutnya */}
          <Button
            variant="outline"
            disabled={!paginationData.has_next_page}
            asChild={paginationData.has_next_page}
            className="h-10 gap-2"
          >
            {paginationData.has_next_page ? (
              <Link href={`/ongoing-anime?page=${currentPage + 1}`}>
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
  );
}
