import { fetchAnime } from "@/lib/api";
import { OngoingResponse } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Calendar, Zap } from "lucide-react";
import OngoingCard from "@/components/ongoingCard";
import Pagination from "@/components/pagination";

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
  ).catch((err) => {
    console.error("Failed to fetch ongoing anime:", err);
    return null;
  });

  if (!response) {
    throw new Error(
      "Gagal memuat daftar anime ongoing. Server API mungkin sedang sibuk atau lambat, silakan muat ulang (refresh) halaman ini.",
    );
  }

  const { pagination, animeList } = response;
  const { totalPages } = pagination;

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
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-primary/20" />
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
            Data tidak ditemukan. Silakan coba refresh atau kembali ke halaman 1.
          </div>
        )}

        <Separator className="bg-border" />

        {animeList && animeList.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasPrevPage={pagination.hasPrevPage}
            hasNextPage={pagination.hasNextPage}
            pageUrlTemplate="/ongoing-anime?page={page}"
          />
        )}
      </div>
    </div>
  );
}
