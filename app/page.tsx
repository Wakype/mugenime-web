import { fetchAnime } from "@/lib/api";
import { HomeData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Sparkles,
  Play,
  Calendar,
  Megaphone,
  Info,
  ServerCrash,
} from "lucide-react";
import AnimeCard from "@/components/animeCard";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Revalidate data setiap 30 menit (ISR)
export const revalidate = 1800;

export default async function HomePage() {
  const data = await fetchAnime<HomeData>("anime/home");

  const heroAnime = data.ongoing_anime[0];
  // Kita ambil 2-11 untuk list (karena index 0 sudah jadi hero)
  const ongoingList = data.ongoing_anime.slice(1, 11);
  const completedList = data.complete_anime.slice(0, 10);

  // Helper untuk proxy image
  const getProxyUrl = (url: string) =>
    `/api/image-proxy?url=${encodeURIComponent(url)}`;

  const announcementList = [
    {
      id: 1,
      icon: Info,
      title: "Fitur Komentar Segera Hadir",
      content: "Fitur komentar lagi dikerjain, so stay tune!",
      theme: "",
    },
    {
      id: 2,
      icon: ServerCrash,
      title: "Video Player Pixeldrain Error",
      content:
        "Server Pixeldrain lagi nge-bug. Mohon gunakan server lain sementara waktu.",
      theme: "red",
    },
  ];

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case "blue":
        return {
          icon: "text-blue-600",
          border: "hover:border-blue-300 dark:hover:border-blue-800",
        };
      case "amber":
        return {
          icon: "text-amber-600",
          border: "hover:border-amber-300 dark:hover:border-amber-800",
        };
      case "red":
        return {
          icon: "text-red-600",
          border: "hover:border-red-300 dark:hover:border-red-800",
        };
      default:
        return {
          icon: "text-indigo-600",
          border: "hover:border-indigo-300 dark:hover:border-indigo-800",
        };
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-white dark:bg-zinc-950 overflow-hidden">
      {/* --- HERO SECTION (Cinematic Style) --- */}
      {heroAnime && (
        <section className="relative w-full h-[80vh] flex items-end overflow-hidden">
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
              style={{
                backgroundImage: `url(${getProxyUrl(heroAnime.poster)})`,
              }}
            />
            {/* Gradient Overlay untuk Readability */}
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30" />
            <div className="absolute inset-0 bg-linear-to-r from-zinc-950/90 via-zinc-950/40 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="container relative z-10 mx-auto px-4 pb-16 md:pb-24">
            <div className="max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {/* Poster Image - Diperbaiki ukurannya */}
              <div className="relative w-44 sm:w-56 md:w-48 aspect-[3/4] rounded-xl overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl">
                <Image
                  src={getProxyUrl(heroAnime.poster)}
                  alt={heroAnime.title ?? "Anime Poster"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 150px, 250px"
                  priority
                  unoptimized
                />
              </div>

              {/* Badge Spotlight */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md text-indigo-300 text-xs font-bold uppercase tracking-widest">
                <Flame className="w-3.5 h-3.5 fill-indigo-500" />
                Episode terbaru
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] font-heading drop-shadow-xl">
                {heroAnime.title}
              </h1>

              {/* Meta Info Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>
                    {heroAnime.release_day}, {heroAnime.newest_release_date}
                  </span>
                </div>
                <div className="w-1 h-1 rounded-full bg-zinc-500" />
                <div className="flex items-center gap-1.5">
                  {heroAnime.current_episode && (
                    <Badge className="bg-white/10 text-white hover:bg-white/20 border-0 backdrop-blur-sm">
                      {heroAnime.current_episode}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 h-12 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all"
                >
                  <Link href={`/anime/${heroAnime.slug}`}>
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Tonton Sekarang
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-zinc-700 bg-black/20 text-zinc-100 hover:bg-white hover:text-black hover:border-white backdrop-blur-sm h-12 px-8 transition-all"
                >
                  <Link href="/jadwal-anime">Lihat Jadwal</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- ANNOUNCEMENT SECTION --- */}
      <div className="container mx-auto px-4 -mt-8 relative z-30">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 flex flex-col md:flex-row gap-6 items-start">
          {/* Header Label */}
          <div className="shrink-0 flex items-center gap-3 md:border-r border-zinc-100 dark:border-zinc-800 md:pr-6 md:py-2 w-full md:w-auto">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-tight">
                Pengumuman
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {announcementList.length} Berita Terbaru
              </p>
            </div>
          </div>

          {/* Announcement List */}
          <div className="flex-1 grid gap-3 w-full">
            {announcementList.map((item) => {
              const style = getThemeClasses(item.theme);
              const IconComponent = item.icon;

              return (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-zinc-100 dark:border-zinc-700/50 ${style.border}`}
                >
                  <IconComponent
                    className={`w-5 h-5 mt-0.5 shrink-0 ${style.icon}`}
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-snug">
                      {item.title}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="container mx-auto px-4 relative z-20 space-y-20 py-10">
        {/* Dekorasi Background Blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* ONGOING SECTION */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <span className="p-1.5 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-500">
                  <Flame className="w-6 h-6 fill-orange-500" />
                </span>{" "}
                Sedang Tayang
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Episode terbaru yang rilis minggu ini.
              </p>
            </div>

            <Button
              variant="ghost"
              asChild
              className="group text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              <Link href="/ongoing-anime" className="flex items-center gap-1">
                Lihat Semua
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
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
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <span className="p-1.5 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg text-yellow-500">
                  <Sparkles className="w-6 h-6 fill-yellow-500" />
                </span>{" "}
                Completed anime
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Anime yang sudah tamat
              </p>
            </div>

            <Button
              variant="ghost"
              asChild
              className="group text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              <Link href="/completed-anime" className="flex items-center gap-1">
                Lihat Semua
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
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
