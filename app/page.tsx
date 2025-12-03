import { fetchAnime } from "@/lib/api";
import { HomeData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import AnimeCard from "@/components/animeCard";

// Revalidate data setiap 30 menit (ISR)
export const revalidate = 1800;

export default async function HomePage() {
  const data = await fetchAnime<HomeData>("anime/home");

  const heroAnime = data.ongoing_anime[0];
  const ongoingList = data.ongoing_anime.slice(1, 11);
  const completedList = data.complete_anime.slice(0, 10);

  return (
    <div className="min-h-screen pb-20 space-y-12">
      {/* HERO SECTION */}
      {heroAnime && (
        <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
          {/* Background Image Blur */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-xs opacity-50 dark:opacity-30 scale-110"
            style={{
              backgroundImage: `url(/api/image-proxy?url=${encodeURIComponent(
                heroAnime.poster
              )})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-zinc-950 dark:via-zinc-950/60 dark:to-transparent" />

          {/* Hero Content */}
          <div className="container relative h-full flex flex-col justify-end pb-12 md:pb-20 z-10 mx-auto px-4">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/20">
                  Update Baru
                </span>
                <span className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                  {heroAnime.release_day}, {heroAnime.newest_release_date}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight font-heading">
                {heroAnime.title}
              </h1>
              <div className="flex gap-3 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8"
                >
                  <Link href={`/anime/${heroAnime.slug}`}>Tonton Sekarang</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Link href="/jadwal-anime">Lihat Jadwal Anime</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 space-y-16">
        {/* ONGOING SECTION */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame className="text-orange-500 fill-orange-500" size={24} />
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Sedang Tayang
              </h2>
            </div>
            <Button
              variant="ghost"
              asChild
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              <Link
                href="/ongoing-anime"
                className="flex items-center gap-1"
              >
                Lihat Semua <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            {ongoingList.map((anime) => (
              <AnimeCard key={anime.slug} anime={anime} />
            ))}
          </div>
        </section>

        {/* COMPLETED SECTION */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="text-yellow-500 fill-yellow-500" size={24} />
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Baru Tamat
              </h2>
            </div>
            <Button
              variant="ghost"
              asChild
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              <Link
                href="/completed-anime"
                className="flex items-center gap-1"
              >
                Lihat Semua <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            {completedList.map((anime) => (
              <AnimeCard key={anime.slug} anime={anime} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
