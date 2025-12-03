import { fetchAnime } from "@/lib/api";
import { AnimeDetail } from "@/lib/types";
import AnimeCard from "@/components/animeCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Play, Star, MonitorPlay, Download, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Cache data selama 1 jam
export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

const getProxyUrl = (url: string) =>
  `/api/image-proxy?url=${encodeURIComponent(url)}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const anime = await fetchAnime<AnimeDetail>(`anime/anime/${slug}`);
    if (!anime) return { title: "Anime Not Found" };

    return {
      title: `${anime.title} - Mugenime`,
      description: anime.synopsis
        ? anime.synopsis.slice(0, 150) + "..."
        : "Nonton anime sub indo gratis.",
      openGraph: {
        images: [getProxyUrl(anime.poster)],
      },
    };
  } catch (e) {
    return {
      title: "Anime Not Found - Mugenime",
    };
  }
}

export default async function AnimeDetailPage({ params }: Props) {
  const { slug } = await params;

  let anime: AnimeDetail;

  try {
    anime = await fetchAnime<AnimeDetail>(`anime/anime/${slug}`);
  } catch (error) {
    console.error("Failed to fetch anime detail:", error);
    return notFound();
  }

  if (!anime) {
    return notFound();
  }

  const episodeLists = anime.episode_lists || [];

  // Ambil episode pertama (ambil index terakhir karena urutan biasanya descending di API ini)
  const firstEpisode =
    episodeLists.length > 0 ? episodeLists[episodeLists.length - 1] : null;

  const genres = anime.genres || [];

  return (
    <div className="min-h-screen pb-20">
      {/* --- HERO BACKGROUND --- */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur opacity-60 dark:opacity-40 scale-110"
          style={{
            backgroundImage: `url(${getProxyUrl(anime.poster)})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-zinc-950 dark:via-zinc-950/60 dark:to-transparent" />
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-4 -mt-32 md:-mt-48 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* SIDEBAR (Poster & Info) */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-6">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800">
              <Image
                src={getProxyUrl(anime.poster)}
                alt={anime.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
                unoptimized
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-yellow-500 text-black font-bold text-sm flex items-center gap-1 hover:bg-yellow-400">
                  <Star className="w-3 h-3 fill-black" /> {anime.rating}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {firstEpisode ? (
                <Button
                  asChild
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-lg shadow-indigo-600/20"
                  size="lg"
                >
                  <Link href={`/watch/${firstEpisode.slug}`}>
                    <Play className="w-4 h-4 mr-2 fill-current" /> Mulai Nonton
                  </Link>
                </Button>
              ) : (
                <Button
                  disabled
                  className="w-full rounded-full"
                  variant="secondary"
                >
                  Belum ada Episode
                </Button>
              )}

              {anime.batch && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-zinc-300 dark:border-zinc-700 rounded-full"
                >
                  <Link href={`/anime/batch/${anime.batch.slug}`}>
                    <Download className="w-4 h-4 mr-2" /> Download Batch
                  </Link>
                </Button>
              )}
            </div>

            {/* Detail Data Grid */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-sm">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Info className="w-4 h-4" /> Informasi Anime
              </h3>
              <Separator />
              <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Tipe</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-200">
                    {anime.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Episode</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-200">
                    {anime.episode_count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-200">
                    {anime.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rilis</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-200">
                    {anime.release_date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Studio</span>
                  <span
                    className="font-medium text-zinc-900 dark:text-zinc-200 truncate max-w-[150px] text-right"
                    title={anime.studio}
                  >
                    {anime.studio}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Durasi</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-200">
                    {anime.duration}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="md:col-span-9 lg:col-span-9 space-y-8">
            {/* Title & Header */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                  {anime.title}
                </h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                  {anime.japanese_title}
                </p>
              </div>

              {/* Genre Badges */}
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Link
                    key={genre.slug}
                    href={`/directory/genre/${genre.slug}`}
                  >
                    <Badge
                      variant="secondary"
                      className="hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer px-3 py-1"
                    >
                      {genre.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">
                Sinopsis
              </h3>
              <p>{anime.synopsis || "Sinopsis belum tersedia."}</p>
            </div>

            {/* Episode List Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MonitorPlay className="w-5 h-5 text-indigo-600" /> Daftar
                  Episode
                </h3>
                <span className="text-xs text-zinc-500 font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                  Total: {episodeLists.length}
                </span>
              </div>

              {episodeLists.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {episodeLists.map((ep) => (
                    <Link
                      key={ep.slug}
                      href={`/watch/${slug}/${ep.slug}`}
                      className="group relative flex items-center justify-center p-4 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-lg transition-all hover:shadow-md"
                    >
                      <div className="text-center">
                        <span className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                          Episode
                        </span>
                        <span className="block text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {ep.episode_number}
                        </span>
                      </div>
                      <Play className="absolute w-6 h-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity fill-current" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-500">
                  Belum ada episode yang tersedia.
                </div>
              )}
            </div>

            <Separator className="my-8" />

            {/* Recommendations Section */}
            {anime.recommendations && anime.recommendations.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Rekomendasi Sejenis</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
                  {anime.recommendations.map((rec) => (
                    <AnimeCard key={rec.slug} anime={rec} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
