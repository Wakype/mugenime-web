import { fetchAnime } from "@/lib/api";
import { HomeData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Sparkles,
  PlayCircle,
  Calendar,
  Info,
  ServerCrash,
  TrendingUp,
  Star,
} from "lucide-react";
import AnimeCard from "@/components/animeCard";
import Image from "next/image";

// Revalidate data setiap 30 menit (ISR)
export const revalidate = 1800;

export default async function HomePage() {
  const data = await fetchAnime<HomeData>("anime/home");

  const heroAnime = data?.ongoing?.animeList[0] ?? null;
  // Skip index 0 karena sudah jadi Hero, ambil 10 berikutnya
  const ongoingList = data?.ongoing?.animeList.slice(1, 11) ?? [];
  const completedList = data?.completed?.animeList.slice(0, 10) ?? [];

  // Helper untuk proxy image
  const getProxyUrl = (url: string) =>
    `/api/image-proxy?url=${encodeURIComponent(url)}`;

  const announcementList = [
    {
      id: 1,
      icon: Info,
      title: "Komentar Segera Hadir",
      content: "Fitur diskusi antar wibu sedang dibangun. Stay tune!",
      theme: "blue",
    },
    {
      id: 2,
      icon: ServerCrash,
      title: "Info Player Stream",
      content: "Jika player Pixeldrain error, gunakan opsi server lain.",
      theme: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20 selection:bg-indigo-500/30">
      {/* --- 1. CINEMATIC HERO SECTION --- */}
      {heroAnime && (
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-900">
          {/* Background Layer with Blur & Dim */}
          <div className="absolute inset-0 z-0">
            <Image
              src={getProxyUrl(heroAnime.poster)}
              alt="Hero Background"
              fill
              className="object-cover opacity-60 dark:opacity-40 blur-sm scale-105"
              priority
              unoptimized
            />
            {/* Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-linear-to-t from-white via-white/40 to-transparent dark:from-zinc-950 dark:via-zinc-950/60 dark:to-zinc-950/30" />
            <div className="absolute inset-0 bg-linear-to-r from-white/90 via-transparent to-transparent dark:from-zinc-950/90 dark:via-zinc-950/20 dark:to-transparent" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] opacity-20 pointer-events-none" />
          </div>

          {/* Hero Content */}
          <div className="container relative z-10 px-4 pt-20 pb-10 grid lg:grid-cols-12 gap-8 items-center">
            {/* Left: Text Info (7 Columns) */}
            <div className="lg:col-span-7 space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-600/20 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <TrendingUp className="w-3.5 h-3.5" />
                  On Going
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Episode Terbaru
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-indigo-600 dark:text-indigo-600 leading-[1.1] tracking-tight font-heading">
                {heroAnime.title}
              </h1>

              {/* Meta Data */}
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-sm">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>{heroAnime.releaseDay}</span>
                </div>
                {heroAnime.episodes && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-sm">
                    <PlayCircle className="w-4 h-4 text-emerald-500" />
                    <span>Episode {heroAnime.episodes}</span>
                  </div>
                )}
                <div className="text-xs opacity-60">
                  Updated: {heroAnime.latestReleaseDate}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all text-base"
                >
                  <Link href={`/anime/${heroAnime.animeId}`}>
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Tonton Sekarang
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-zinc-800 text-zinc-900 dark:text-white backdrop-blur-sm h-12 px-8 text-base transition-all"
                >
                  <Link href="/jadwal-anime">Jadwal Rilis</Link>
                </Button>
              </div>
            </div>

            {/* Right: Floating Poster (5 Columns) */}
            <div className="hidden lg:flex lg:col-span-5 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <div className="relative group">
                {/* Glow Effect Behind */}
                <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition duration-1000" />

                {/* Card Container */}
                <div className="relative w-[350px] aspect-3/4 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20 dark:ring-white/10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <Image
                    src={getProxyUrl(heroAnime.poster)}
                    alt={heroAnime.title}
                    fill
                    className="object-cover"
                    sizes="300px"
                    priority
                    unoptimized
                  />
                  {/* Glass Overlay on Bottom */}
                  <div className="absolute bottom-0 inset-x-0 h-1/3 bg-linear-to-t from-black/80 to-transparent flex items-end p-6">
                    <p className="text-white text-sm font-medium line-clamp-1 opacity-90">
                      {heroAnime.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- 2. ANNOUNCEMENT & CONTENT --- */}
      <div className="container mx-auto px-4 -mt-10 relative z-20 space-y-16">
        {/* Announcement Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {announcementList.map((item) => {
            const Icon = item.icon;
            const isAlert = item.theme === "red";

            return (
              <div
                key={item.id}
                className={`
                  flex items-start gap-4 p-5 rounded-2xl border backdrop-blur-md shadow-lg transition-all hover:-translate-y-1
                  ${
                    isAlert
                      ? "bg-red-50/90 dark:bg-red-950/40 border-red-100 dark:border-red-900/50"
                      : "bg-white/90 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800"
                  }
                `}
              >
                <div
                  className={`
                  p-3 rounded-xl shrink-0
                  ${
                    isAlert
                      ? "bg-red-100 dark:bg-red-900/50 text-red-600"
                      : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  }
                `}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3
                    className={`font-bold text-base mb-1 ${
                      isAlert
                        ? "text-red-700 dark:text-red-200"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      isAlert
                        ? "text-red-600/80 dark:text-red-200/70"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {item.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- ONGOING SECTION --- */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider">
                <Flame className="w-5 h-5" />
                <span>Update Terbaru</span>
              </div>
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                Sedang Tayang
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-lg">
                Daftar anime musim ini yang sedang <i>on-going</i>. Tonton
                episode terbarunya sekarang.
              </p>
            </div>

            <Button
              variant="outline"
              asChild
              className="rounded-full border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 group"
            >
              <Link href="/ongoing-anime">
                Lihat Semua{" "}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            {ongoingList.map((anime) => (
              <AnimeCard key={anime.animeId} anime={anime} />
            ))}
          </div>
        </section>

        {/* --- COMPLETED SECTION --- */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-bold text-sm uppercase tracking-wider">
                <Sparkles className="w-5 h-5" />
                <span>Maraton Time</span>
              </div>
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                Anime Tamat
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-lg">
                Rekomendasi anime yang sudah selesai tayang (Completed). Cocok
                buat yang suka maraton!
              </p>
            </div>

            <Button
              variant="outline"
              asChild
              className="rounded-full border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 group"
            >
              <Link href="/completed-anime">
                Lihat Semua{" "}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            {completedList.map((anime) => (
              <AnimeCard key={anime.animeId} anime={anime} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
