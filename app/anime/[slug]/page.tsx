import { fetchAnime } from "@/lib/api";
import { AnimeDetail, BatchResponse } from "@/lib/types";
import AnimeCard from "@/components/animeCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  Star,
  MonitorPlay,
  Info,
  Calendar,
  Clock,
  Layers,
  Share2,
  Tv,
  Users,
  Film,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BatchDownload from "@/components/batchDownload";
import CommentSection from "@/components/commentSection";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

function isAnimeDetail(data: unknown): data is AnimeDetail {
  if (typeof data !== "object" || data === null) return false;
  const d = data as AnimeDetail;
  return (
    typeof d.title === "string" &&
    (typeof d.synopsis === "object" || typeof d.synopsis === "string") &&
    "episodeList" in d &&
    Array.isArray(d.episodeList)
  );
}

const getProxyUrl = (url: string) =>
  `/api/image-proxy?url=${encodeURIComponent(url)}`;

const getSynopsisText = (synopsis: AnimeDetail["synopsis"]) => {
  if (typeof synopsis === "string") return synopsis;
  if (synopsis && Array.isArray(synopsis.paragraphs)) {
    return synopsis.paragraphs.join(" ");
  }
  return "";
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const responseData = await fetchAnime<AnimeDetail>(`anime/anime/${slug}`);
    if (!isAnimeDetail(responseData)) return { title: "Anime Not Found" };
    const anime = responseData;
    const synopsisText = getSynopsisText(anime.synopsis);
    return {
      title: `${anime.title} - Mugenime`,
      description: synopsisText
        ? synopsisText.slice(0, 150) + "..."
        : "Nonton anime sub indo gratis.",
      openGraph: { images: [getProxyUrl(anime.poster)] },
    };
  } catch (e) {
    console.error(e);
    return { title: "Anime Not Found - Mugenime" };
  }
}

// --- MAIN PAGE COMPONENT ---

export default async function AnimeDetailPage({ params }: Readonly<Props>) {
  const { slug } = await params;
  let responseData: unknown;

  try {
    responseData = await fetchAnime<AnimeDetail>(`anime/anime/${slug}`);
  } catch (error) {
    console.error("Failed to fetch anime detail:", error);
    return notFound();
  }

  if (!isAnimeDetail(responseData)) {
    return notFound();
  }

  const anime = responseData;
  const synopsisText = getSynopsisText(anime.synopsis);

  // Batch Data Logic
  let batchData: BatchResponse | null = null;
  if (anime.batch?.batchId) {
    try {
      batchData = await fetchAnime<BatchResponse>(
        `anime/batch/${anime.batch.batchId}`
      );
    } catch (error) {
      console.error("Gagal mengambil data batch:", error);
    }
  }

  const episodeLists = anime.episodeList || [];
  const firstEpisode = episodeLists.length > 0 ? episodeLists.at(-1) : null;
  const genres = anime.genreList || [];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20">
      {/* --- 1. HERO BACKGROUND (Immersive) --- */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={getProxyUrl(anime.poster)}
            alt="Background"
            fill
            className="object-cover opacity-50 dark:opacity-30 blur-xl scale-110"
            priority
            unoptimized
          />
        </div>

        {/* Gradients for readability and seamless transition */}
        <div className="absolute inset-0 bg-linear-to-t from-white via-white/50 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 dark:to-zinc-950/20" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white dark:to-zinc-950 opacity-90" />
      </div>

      {/* --- 2. MAIN CONTENT CONTAINER --- */}
      <div className="container mx-auto px-4 -mt-64 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* --- SIDEBAR (Left - Sticky) --- */}
          <div className="lg:col-span-3 lg:block">
            <div className="lg:top-24 space-y-6">
              {/* Poster Card */}
              <div className="group relative aspect-3/4 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 bg-zinc-200 dark:bg-zinc-800">
                <Image
                  src={getProxyUrl(anime.poster)}
                  alt={anime.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 60vw, 300px"
                  priority
                  unoptimized
                />

                {/* Rating Badge Overlay */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white text-sm font-bold shadow-lg">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{anime.score || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {firstEpisode ? (
                  <Button
                    asChild
                    size="lg"
                    className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all"
                  >
                    <Link href={`/watch/${slug}/${firstEpisode.episodeId}`}>
                      <Play className="w-5 h-5 mr-2 fill-current" />
                      Mulai Nonton (Episode 1)
                    </Link>
                  </Button>
                ) : (
                  <Button
                    disabled
                    size="lg"
                    className="w-full rounded-xl"
                    variant="secondary"
                  >
                    Belum Tayang
                  </Button>
                )}

                {/* Secondary Actions Row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Dummy Share Button */}
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Bagikan
                  </Button>
                  {/* Dummy Bookmark */}
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 mr-2" /> Simpan
                  </Button>
                </div>
              </div>

              {/* Information Card */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800/50 space-y-4">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Info className="w-4 h-4" /> Informasi
                </h3>
                <Separator />
                <div className="space-y-3 text-sm">
                  <InfoRow
                    icon={<Tv className="w-4 h-4" />}
                    label="Tipe"
                    value={anime.type}
                  />
                  <InfoRow
                    icon={<Layers className="w-4 h-4" />}
                    label="Eps"
                    value={anime.episodes ?? `${episodeLists.length}`}
                  />
                  <InfoRow
                    icon={<Calendar className="w-4 h-4" />}
                    label="Status"
                    value={anime.status}
                  />
                  <InfoRow
                    icon={<Clock className="w-4 h-4" />}
                    label="Durasi"
                    value={anime.duration}
                  />
                  <InfoRow
                    icon={<Users className="w-4 h-4" />}
                    label="Studio"
                    value={anime.studios}
                  />

                  {/* --- TAMBAHAN PRODUCERS --- */}
                  <InfoRow
                    icon={<Film className="w-4 h-4" />}
                    label="Produser"
                    value={anime.producers}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- CONTENT AREA (Right) --- */}
          <div className="lg:col-span-9 space-y-10 pt-4 lg:pt-0">
            {/* Header: Title & Genres */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white leading-[1.15]">
                {anime.title}
              </h1>

              {/* --- TAMBAHAN JAPANESE TITLE --- */}
              {anime.japanese && (
                <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium font-serif italic">
                  {anime.japanese}
                </p>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {genres.map((genre) => (
                  <Link
                    key={genre.genreId}
                    href={`/genre-anime/${genre.genreId}`}
                  >
                    <Badge
                      variant="secondary"
                      className="px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                    >
                      {genre.title}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
                <span className="w-1 h-6 bg-indigo-600 rounded-full mr-2"></span>{" "}
                Sinopsis
              </h3>
              <div className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-base">
                {synopsisText || "Sinopsis belum tersedia untuk anime ini."}
              </div>
            </div>

            {/* Episode List Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center">
                  <span className="w-1 h-6 bg-indigo-600 rounded-full mr-3"></span>{" "}
                  Daftar Episode
                </h3>
                <Badge
                  variant="outline"
                  className="h-7 border-zinc-300 dark:border-zinc-700"
                >
                  Total: {episodeLists.length}
                </Badge>
              </div>

              {episodeLists.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {episodeLists.toReversed().map((ep) => (
                    <Link
                      key={ep.episodeId}
                      href={`/watch/${slug}/${ep.episodeId}`}
                      className="group relative flex items-center justify-center p-3 h-16 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-lg transition-all hover:shadow-md hover:shadow-indigo-500/10 overflow-hidden"
                    >
                      {/* Hover Effect Background */}
                      <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10 flex flex-col items-center">
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wide font-medium">
                          Episode
                        </span>
                        <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {ep.eps}
                        </span>
                      </div>

                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-x-1">
                        <Play className="w-3 h-3 text-indigo-500 fill-indigo-500" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                  <MonitorPlay className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                  <p className="text-zinc-500">
                    Belum ada episode yang tersedia.
                  </p>
                </div>
              )}
            </div>

            {/* Batch Download */}
            {batchData && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <BatchDownload batchData={batchData} />
              </div>
            )}

            {/* Recommendations */}
            {anime.recommendations && anime.recommendations.length > 0 && (
              <div className="space-y-6 pt-4">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center">
                  <span className="w-1 h-6 bg-pink-500 rounded-full mr-3"></span>{" "}
                  Rekomendasi
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
                  {anime.recommendations.map((rec) => (
                    <AnimeCard key={rec.animeId} anime={rec} />
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="pt-8">
              <CommentSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function InfoRow({
  icon,
  label,
  value,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  value?: string;
}>) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between group">
      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
        {icon}
        <span>{label}</span>
      </div>
      <span
        className="font-medium text-zinc-900 dark:text-zinc-200 text-right max-w-[150px] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
