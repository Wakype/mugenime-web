import { fetchKomik } from "@/lib/api";
import { AdvanceSearchKomikResponse } from "@/lib/komikTypes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import KomikCard from "@/components/komikCard";
import FormatFilter from "@/components/formatKomikFilter";
import { cn } from "@/lib/utils";

export const revalidate = 1800;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FormatKomikPage({
  searchParams,
}: Readonly<PageProps>) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // Tangkap parameter format yang bisa berupa string tunggal atau array
  const rawFormat = params.format;
  const selectedFormats = Array.isArray(rawFormat)
    ? rawFormat
    : typeof rawFormat === "string"
      ? [rawFormat]
      : [];

  // Bangun parameter kueri untuk API Advance Search
  const apiParams = new URLSearchParams();
  apiParams.set("page", currentPage.toString());
  apiParams.set("take", "25");
  apiParams.set("sort", "latest");
  apiParams.set("sortOrder", "desc");
  selectedFormats.forEach((f) => apiParams.append("format", f));

  // Fetch API
  const response = await fetchKomik<AdvanceSearchKomikResponse>(
    `advanceSearch?${apiParams.toString()}`,
  );

  const komikList = response?.data?.data || [];
  const meta = response?.data?.meta;
  const hasNextPageAPI = response?.data?.hasNextPage || false;

  // Fallback property jika struktur API berbeda
  const totalPages = Number(
    meta?.lastPage || Math.ceil(Number(meta?.total || 0) / 25) || 1,
  );

  // Pagination navigation states
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages || hasNextPageAPI;
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  // Helper untuk membuat URL Paginasi dengan mempertahankan filter format yang sedang aktif
  const createPageUrl = (page: number | string) => {
    const urlParams = new URLSearchParams();
    urlParams.set("page", page.toString());
    selectedFormats.forEach((f) => urlParams.append("format", f));
    return `/format-komik?${urlParams.toString()}`;
  };

  // --- LOGIC PAGINATION ---
  const generatePagination = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
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

  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-8">
        {/* --- HERO HEADER SECTION --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col space-y-6 max-w-3xl">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <Layers className="w-3.5 h-3.5" />
                Eksplorasi Format
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                Koleksi <span className="text-primary">Komik</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Temukan bacaan seru berdasarkan negara asalnya. Filter karya
                favoritmu dari Jepang (Manga), Korea (Manhwa), China (Manhua),
                atau MangaToon.
              </p>
            </div>
          </div>
        </div>

        {/* --- FILTER SECTION (Full Row) --- */}
        <div className="w-full">
          <FormatFilter />
        </div>

        {/* --- GRID CONTENT --- */}
        {komikList && komikList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 pt-4">
            {komikList.map((komik, idx) => (
              <KomikCard
                key={komik.slug}
                comic={komik}
                index={idx}
                showChaptersList={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-muted/20">
            <Layers className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              Data tidak ditemukan.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Coba ubah kombinasi filter format atau kembali ke halaman 1.
            </p>
          </div>
        )}

        {komikList && komikList.length > 0 && (
          <Separator className="bg-border" />
        )}

        {/* --- PAGINATION CONTROL --- */}
        {komikList &&
          komikList.length > 0 &&
          (totalPages > 1 || hasNextPageAPI) && (
            <div className="w-full pb-4">
              {/* A. MOBILE PAGINATION (Numbers + Arrows) */}
              <div className="flex md:hidden items-center justify-between gap-1 w-full">
                {/* Tombol Prev */}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!hasPrevPage}
                  asChild={hasPrevPage}
                  className="h-9 w-9 shrink-0 rounded-lg border-border hover:bg-muted text-muted-foreground"
                >
                  {hasPrevPage ? (
                    <Link
                      href={createPageUrl(prevPage)}
                      aria-label="Halaman Sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button disabled>
                      <ChevronLeft className="w-4 h-4 opacity-30" />
                    </button>
                  )}
                </Button>

                {/* Deretan Angka (Mobile Logic) */}
                <div className="flex items-center justify-center gap-0.5 sm:gap-1 overflow-hidden">
                  {generatePagination().map((page, idx) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`mob-ellipsis-${idx}`}
                          className="px-1 text-muted-foreground text-xs select-none"
                        >
                          ...
                        </span>
                      );
                    }

                    const isCurrent = page === currentPage;
                    return (
                      <Button
                        key={`mob-${page}`}
                        variant={isCurrent ? "default" : "ghost"}
                        size="icon"
                        asChild
                        className={cn(
                          "h-8 w-8 sm:h-9 sm:w-9 rounded-lg text-xs font-bold transition-all",
                          isCurrent
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:bg-muted",
                        )}
                      >
                        <Link href={createPageUrl(page)}>{page}</Link>
                      </Button>
                    );
                  })}
                </div>

                {/* Tombol Next */}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!hasNextPage}
                  asChild={hasNextPage}
                  className="h-9 w-9 shrink-0 rounded-lg border-border hover:bg-muted text-muted-foreground"
                >
                  {hasNextPage ? (
                    <Link
                      href={createPageUrl(nextPage)}
                      aria-label="Halaman Selanjutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button disabled>
                      <ChevronRight className="w-4 h-4 opacity-30" />
                    </button>
                  )}
                </Button>
              </div>

              {/* B. DESKTOP PAGINATION (Full Logic) */}
              <div className="hidden md:flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={!hasPrevPage}
                  asChild={hasPrevPage}
                  className="h-10 gap-2 border-border hover:bg-muted text-muted-foreground hover:text-foreground px-4 cursor-pointer"
                >
                  {hasPrevPage ? (
                    <Link href={createPageUrl(prevPage)}>
                      <ChevronLeft className="w-4 h-4" /> Sebelumnya
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5 opacity-50">
                      <ChevronLeft className="w-4 h-4" /> Sebelumnya
                    </span>
                  )}
                </Button>

                <div className="flex items-center gap-1 mx-4">
                  {generatePagination().map((page, idx) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`desk-ellipsis-${idx}`}
                          className="px-2 text-muted-foreground select-none"
                        >
                          ...
                        </span>
                      );
                    }

                    const isCurrent = page === currentPage;
                    return (
                      <Button
                        key={`desk-${page}`}
                        variant={isCurrent ? "default" : "ghost"}
                        size="icon"
                        asChild
                        className={cn(
                          "w-10 h-10 rounded-lg transition-all cursor-pointer",
                          isCurrent
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <Link href={createPageUrl(page)}>{page}</Link>
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={!hasNextPage}
                  asChild={hasNextPage}
                  className="h-10 gap-2 border-border hover:bg-muted text-muted-foreground hover:text-foreground px-4 cursor-pointer"
                >
                  {hasNextPage ? (
                    <Link href={createPageUrl(nextPage)}>
                      Selanjutnya <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5 opacity-50">
                      Selanjutnya <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
