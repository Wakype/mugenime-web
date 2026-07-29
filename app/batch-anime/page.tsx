import { fetchKS } from "@/lib/api";
import { KS_LatestResponse } from "@/lib/batchAnimeTypes";
import { PackageOpen } from "lucide-react";
import BatchAnimeCard from "@/components/batchAnimeCard";
import Pagination from "@/components/pagination";

export const revalidate = 1800;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BatchAnimePage({
  searchParams,
}: Readonly<PageProps>) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const response = await fetchKS<KS_LatestResponse>(
    `latest?page=${currentPage}`,
  ).catch((err) => {
    console.error("Failed to fetch batch anime:", err);
    return null;
  });

  if (!response?.anime_list) {
    throw new Error(
      "Gagal memuat daftar anime batch. Server API mungkin sedang sibuk atau lambat, silakan muat ulang (refresh) halaman ini.",
    );
  }

  const animeList = response?.anime_list || [];

  const hasPrevPage = currentPage > 1;
  const hasNextPage = animeList.length > 0;

  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-10">
        {/* --- HEADER SECTION --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <PackageOpen className="w-3.5 h-3.5" />
                Koleksi Lengkap
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                Anime <span className="text-primary">Batch</span>
              </h1>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Koleksi update terbaru anime batch dengan resolusi tinggi.
                Download seluruh episode dalam satu paket praktis.
              </p>
            </div>

            {/* Page Indicator Widget */}
            <div className="flex flex-col items-end justify-center px-6 py-3 rounded-2xl bg-card/60 border border-border backdrop-blur-md">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Halaman
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-primary">
                  {currentPage}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID ANIME --- */}
        {animeList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {animeList.map((anime) => (
              <BatchAnimeCard key={anime.slug} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground bg-card border border-border rounded-xl">
            Data anime batch tidak ditemukan atau Anda telah mencapai halaman
            terakhir.
          </div>
        )}

        {animeList.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={999}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            pageUrlTemplate="/batch-anime?page={page}"
          />
        )}
      </div>
    </div>
  );
}
