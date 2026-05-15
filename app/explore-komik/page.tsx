import { fetchKomik } from "@/lib/api";
import { AdvanceSearchKomikResponse, GenresResponse } from "@/lib/komikTypes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Compass, SearchX } from "lucide-react";
import KomikCard from "@/components/komikCard";
import AdvanceSearchFilter from "@/components/advanceSearchKomikFilter";
import { cn } from "@/lib/utils";

export const revalidate = 1800;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ExploreKomikPage({
  searchParams,
}: Readonly<PageProps>) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const search = (params.search as string) || "";
  const sort = (params.sort as string) || "latest";
  const sortOrder = (params.sortOrder as string) || "desc";

  const parseArrayParam = (param: string | string[] | undefined) =>
    Array.isArray(param) ? param : typeof param === "string" ? [param] : [];

  const selectedStatus = parseArrayParam(params.status);
  const selectedFormats = parseArrayParam(params.format);
  const selectedGenres = parseArrayParam(params.genreIds);

  const apiParams = new URLSearchParams();
  apiParams.set("page", currentPage.toString());
  apiParams.set("take", "30");
  apiParams.set("sort", sort);
  apiParams.set("sortOrder", sortOrder);
  if (search) apiParams.set("search", search);

  selectedStatus.forEach((s) => apiParams.append("status", s));
  selectedFormats.forEach((f) => apiParams.append("format", f));
  selectedGenres.forEach((g) => apiParams.append("genreIds", g));

  const [komikRes, genresRes] = await Promise.all([
    fetchKomik<AdvanceSearchKomikResponse>(
      `advanceSearch?${apiParams.toString()}`,
    ).catch((err) => {
      console.error("Failed to fetch explore komik:", err);
      return null;
    }),
    fetchKomik<GenresResponse>("genres").catch(() => null),
  ]);

  if (!komikRes?.data) {
    throw new Error(
      "Gagal memuat hasil pencarian komik. Server API mungkin sedang sibuk atau lambat, silakan muat ulang (refresh) halaman ini.",
    );
  }

  const komikList = komikRes?.data?.data || [];
  const meta = komikRes?.data?.meta;
  const hasNextPageAPI = komikRes?.data?.hasNextPage || false;
  const genresList = genresRes?.data || [];

  const totalPages = Number(
    meta?.lastPage || Math.ceil(Number(meta?.total || 0) / 30) || 1,
  );

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages || hasNextPageAPI;
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const createPageUrl = (page: number | string) => {
    const urlParams = new URLSearchParams(apiParams.toString());
    urlParams.set("page", page.toString());
    urlParams.delete("take");
    return `/explore-komik?${urlParams.toString()}`;
  };

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
                <Compass className="w-3.5 h-3.5" />
                Advance Search
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                Pencarian <span className="text-primary">Spesifik</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Gunakan kombinasi filter genre, status, dan format untuk
                menemukan komik yang paling pas dengan selera kamu.
              </p>
            </div>
          </div>
        </div>

        {/* --- MAIN LAYOUT (FULL WIDTH GRID) --- */}
        <section className="w-full space-y-6">
          {/* Header & Filter Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Hasil Pencarian
              </h2>
              <Badge
                variant="secondary"
                className="px-3 py-1 text-sm font-medium"
              >
                {meta?.total || 0} Ditemukan
              </Badge>
            </div>

            {/* Filter Sheet di-render disini */}
            <AdvanceSearchFilter genres={genresList} />
          </div>

          {/* List Komik */}
          {komikList && komikList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
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
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-border rounded-3xl bg-muted/10">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <SearchX className="w-8 h-8 text-muted-foreground/70" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Pencarian Tidak Ditemukan
              </h3>
              <p className="text-muted-foreground max-w-md text-sm">
                Kami tidak dapat menemukan komik yang cocok dengan kombinasi
                filter Anda. Coba kurangi filter genre atau gunakan kata kunci
                lain.
              </p>
            </div>
          )}

          {komikList && komikList.length > 0 && (
            <Separator className="bg-border my-8" />
          )}

          {/* --- PAGINATION CONTROL --- */}
          {komikList &&
            komikList.length > 0 &&
            (totalPages > 1 || hasNextPageAPI) && (
              <div className="w-full pb-8">
                {/* A. MOBILE PAGINATION (Diperbarui agar mirip Desktop) */}
                <div className="flex md:hidden items-center justify-center gap-2 w-full">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={!hasPrevPage}
                    asChild={hasPrevPage}
                    className="h-10 w-10 shrink-0 rounded-xl border-border hover:bg-muted font-medium transition-colors"
                  >
                    {hasPrevPage ? (
                      <Link
                        href={createPageUrl(prevPage)}
                        aria-label="Halaman Sebelumnya"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Link>
                    ) : (
                      <button disabled>
                        <ChevronLeft className="w-5 h-5 opacity-30" />
                      </button>
                    )}
                  </Button>

                  <div className="flex items-center gap-1 bg-muted/30 p-1.5 rounded-2xl border border-border overflow-x-auto no-scrollbar">
                    {generatePagination().map((page, idx) => {
                      if (page === "...") {
                        return (
                          <span
                            key={`mob-ellipsis-${idx}`}
                            className="px-1.5 text-muted-foreground text-xs select-none"
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
                            "h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-lg text-sm font-bold transition-all",
                            isCurrent
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
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
                    size="icon"
                    disabled={!hasNextPage}
                    asChild={hasNextPage}
                    className="h-10 w-10 shrink-0 rounded-xl border-border hover:bg-muted font-medium transition-colors"
                  >
                    {hasNextPage ? (
                      <Link
                        href={createPageUrl(nextPage)}
                        aria-label="Halaman Selanjutnya"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    ) : (
                      <button disabled>
                        <ChevronRight className="w-5 h-5 opacity-30" />
                      </button>
                    )}
                  </Button>
                </div>

                {/* B. DESKTOP PAGINATION */}
                <div className="hidden md:flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={!hasPrevPage}
                    asChild={hasPrevPage}
                    className="h-11 px-5 rounded-xl gap-2 border-border hover:bg-muted font-medium transition-colors"
                  >
                    {hasPrevPage ? (
                      <Link href={createPageUrl(prevPage)}>
                        <ChevronLeft className="w-4 h-4" /> Sebelumnya
                      </Link>
                    ) : (
                      <span className="opacity-50 cursor-not-allowed">
                        <ChevronLeft className="w-4 h-4" /> Sebelumnya
                      </span>
                    )}
                  </Button>

                  <div className="flex items-center gap-1.5 mx-4 bg-muted/30 p-1.5 rounded-2xl border border-border">
                    {generatePagination().map((page, idx) => {
                      if (page === "...") {
                        return (
                          <span
                            key={`desk-ellipsis-${idx}`}
                            className="px-3 text-muted-foreground select-none"
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
                            "w-10 h-10 rounded-xl text-sm font-bold transition-all",
                            isCurrent
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
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
                    className="h-11 px-5 rounded-xl gap-2 border-border hover:bg-muted font-medium transition-colors"
                  >
                    {hasNextPage ? (
                      <Link href={createPageUrl(nextPage)}>
                        Selanjutnya <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <span className="opacity-50 cursor-not-allowed">
                        Selanjutnya <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}
        </section>
      </div>
    </div>
  );
}
