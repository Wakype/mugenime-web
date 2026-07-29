import { fetchKomik } from "@/lib/api";
import { PopularKomikResponse, KomikItem } from "@/lib/komikTypes";
import { Separator } from "@/components/ui/separator";
import { Trophy } from "lucide-react";
import KomikCard from "@/components/komikCard";
import PopularFilter from "@/components/popularKomikFilter";
import Pagination from "@/components/pagination";

export const revalidate = 1800;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PopularKomikPage({
  searchParams,
}: Readonly<PageProps>) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentCategory = (params.category as string) || "trending";

  const apiParams = new URLSearchParams();
  apiParams.set("category", currentCategory);
  apiParams.set("take", "25");
  apiParams.set("page", currentPage.toString());

  const response = await fetchKomik<PopularKomikResponse>(
    `popular?${apiParams.toString()}`,
  ).catch((err) => {
    console.error("Failed to fetch popular komik:", err);
    return null;
  });

  if (!response?.data) {
    throw new Error(
      "Gagal memuat peringkat komik populer. Server API mungkin sedang sibuk atau lambat, silakan muat ulang (refresh) halaman ini.",
    );
  }

  const rawPopularList = response?.data?.data || [];
  const meta = response?.data?.meta;

  const komikList: KomikItem[] = rawPopularList.map((item) => ({
    title: item.data.title,
    slug: item.data.slug,
    cover: item.data.coverImage,
    backgroundImage: item.data.backgroundImage,
    rating: String(item.data.rating),
    type: item.data.type,
    isHot: item.data.isHot,
    isRecommended: false,
    chapters: [],
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    author: item.data.author,
    format: item.data.format,
    nativeTitle: item.data.nativeTitle,
    releaseDate: "",
    genres: item.data.genres,
  }));

  const totalPages = Number(
    meta?.lastPage || Math.ceil(Number(meta?.total || 0) / 25) || 1,
  );

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const urlParams = new URLSearchParams();
  urlParams.set("category", currentCategory);
  const searchStr = urlParams.toString();
  const pageUrlTemplate = `/popular-komik?${searchStr ? searchStr + "&" : ""}page={page}`;

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
                <Trophy className="w-3.5 h-3.5" />
                Peringkat Tertinggi
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                Komik <span className="text-primary">Populer</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Jelajahi jajaran komik terbaik, karya terhangat yang sedang
                ramai dibicarakan, hingga adaptasi anime paling dinantikan oleh
                para pembaca.
              </p>
            </div>
          </div>
        </div>

        {/* --- FILTER SECTION --- */}
        <div className="w-full">
          <PopularFilter />
        </div>

        {/* --- GRID CONTENT --- */}
        {komikList && komikList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 pt-4">
            {komikList.map((komik, idx) => (
              <KomikCard
                key={komik.slug}
                comic={komik}
                index={idx}
                showChaptersList={false} // API ini tidak menyertakan chapters, set false agar UI rapi
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-muted/20">
            <Trophy className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              Data tidak ditemukan.
            </p>
          </div>
        )}

        {komikList && komikList.length > 0 && (
          <Separator className="bg-border" />
        )}

        {komikList && komikList.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            pageUrlTemplate={pageUrlTemplate}
          />
        )}
      </div>
    </div>
  );
}
