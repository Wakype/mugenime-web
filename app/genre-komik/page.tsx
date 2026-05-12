import { fetchKomik } from "@/lib/api";
import { GenresResponse, AdvanceSearchKomikResponse } from "@/lib/komikTypes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Tags, SearchX } from "lucide-react";
import KomikCard from "@/components/komikCard";
import GenreFilter from "@/components/genreKomikFilter";
import { cn } from "@/lib/utils";

export const revalidate = 1800;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GenreKomikPage({
  searchParams,
}: Readonly<PageProps>) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // Tangkap parameter genre dari URL
  const rawGenre = params.genre;
  const selectedGenres = Array.isArray(rawGenre)
    ? rawGenre
    : typeof rawGenre === "string"
      ? [rawGenre]
      : [];

  // Fetch List Semua Genre
  const genresRes = await fetchKomik<GenresResponse>("genres").catch(
    () => null,
  );
  const genreList = genresRes?.data || [];

  // Bangun parameter kueri untuk Advance Search API
  const apiParams = new URLSearchParams();
  apiParams.set("page", currentPage.toString());
  apiParams.set("take", "24");
  apiParams.set("sort", "latest");
  apiParams.set("sortOrder", "desc");
  selectedGenres.forEach((g) => apiParams.append("genreIds", g));

  // Fetch Hasil Pencarian Komik
  const searchRes = await fetchKomik<AdvanceSearchKomikResponse>(
    `advanceSearch?${apiParams.toString()}`,
  ).catch(() => null);

  const komikList = searchRes?.data?.data || [];
  const meta = searchRes?.data?.meta || { total: 0, page: 1, lastPage: 1 };
  const totalPages = meta.lastPage;

  // Pagination navigation states
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  // Helper membuat URL Paginasi agar filter genre tidak hilang
  const createPageUrl = (page: number | string) => {
    const urlParams = new URLSearchParams();
    urlParams.set("page", page.toString());
    selectedGenres.forEach((g) => urlParams.append("genre", g));
    return `/genre-komik?${urlParams.toString()}`;
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

          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
              <Tags className="w-3.5 h-3.5" />
              Katalog Genre
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
              Eksplorasi <span className="text-primary">Komik</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Temukan komik (Manga, Manhwa, Manhua) favoritmu berdasarkan genre.
              Kamu bisa menggabungkan beberapa genre sekaligus untuk pencarian
              yang spesifik.
            </p>
          </div>
        </div>

        {/* --- INTERACTIVE GENRE FILTER --- */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2.5 text-sm font-bold text-foreground capitalize tracking-wider whitespace-nowrap">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-sm shadow-primary/20">
              <Tags className="w-4 h-4 text-white" />{" "}
            </div>
            Filter Genre:
          </div>
          {/* Komponen filter memanjang penuh mengambil ruang card */}
          <GenreFilter genres={genreList} />
        </div>

        {/* --- RESULT TITLE --- */}
        <div className="flex items-center justify-between border-b border-border pb-2 pt-4">
          <h2 className="text-xl font-bold text-foreground">
            Hasil Pencarian{" "}
            {selectedGenres.length > 0 && (
              <span className="text-primary">({meta.total})</span>
            )}
          </h2>
          {selectedGenres.length > 0 && (
            <Link
              href="/genre-komik"
              className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 font-medium"
            >
              Reset Filter
            </Link>
          )}
        </div>

        {/* --- GRID CONTENT --- */}
        {komikList && komikList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-6">
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
          <div className="text-center py-24 border-2 border-dashed border-border rounded-2xl bg-muted/20">
            <SearchX className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-foreground font-semibold text-lg">
              Komik tidak ditemukan
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Tidak ada komik yang cocok dengan kombinasi genre yang kamu pilih.
              Coba kurangi pilihan genre atau reset filter.
            </p>
          </div>
        )}

        {totalPages > 1 && <Separator className="bg-border" />}

        {/* --- PAGINATION CONTROL --- */}
        {totalPages > 1 && (
          <div className="w-full pb-4">
            {/* A. MOBILE PAGINATION */}
            <div className="flex md:hidden items-center justify-between gap-1 w-full">
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

            {/* B. DESKTOP PAGINATION */}
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
