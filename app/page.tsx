import { fetchAnime, fetchKS } from "@/lib/api";
import { HomeData } from "@/lib/types";
import { KS_LatestResponse } from "@/lib/batchAnimeTypes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Sparkles,
  MessageCircle,
  Layers,
  Megaphone,
  Package2,
} from "lucide-react";
import AnimeCard from "@/components/animeCard";
import BatchAnimeCard from "@/components/batchAnimeCard";
import { FadeInWrapper, HeroSection } from "@/components/homeSection";
import CommentSection from "@/components/commentSection";
import { Badge } from "@/components/ui/badge";

export const revalidate = 1800;

export default async function HomePage() {
  const [data, batchDataResponse] = await Promise.all([
    fetchAnime<HomeData>("anime/home").catch(() => null),
    fetchKS<KS_LatestResponse>("latest?page=1").catch(() => null),
  ]);

  const heroAnime = data?.ongoing?.animeList[0] ?? null;
  const ongoingList = data?.ongoing?.animeList.slice(1, 11) ?? [];
  const completedList = data?.completed?.animeList.slice(0, 10) ?? [];
  const batchList = batchDataResponse?.anime_list?.slice(0, 9) ?? [];

  // --- STRUKTUR DATA CHANGELOG COMPACT ---
  const announcementList = [
    {
      id: 1,
      date: "26 April 2026",
      tag: "Baru",
      tagColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      icon: MessageCircle,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      title: "Fitur Komentar Sudah Tersedia!",
      content: "Udah bisa komen di mugenime nih! tinggal login aja",
    },
    {
      id: 2,
      date: "20 April 2026",
      tag: "Update",
      tagColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      icon: Package2,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
      title: "Halaman Batch",
      content:
        "Anime Batch sekarang punya halaman khusus. Download seluruh episode / movie anime disini.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 selection:bg-primary/30">
      {/* --- 1. HERO SECTION --- */}
      {heroAnime && (
        <HeroSection heroAnime={heroAnime} poster={heroAnime.poster} />
      )}

      {/* --- 2. MAIN CONTENT --- */}
      <div className="container mx-auto px-4 -mt-10 relative z-20 space-y-12">
        {/* --- COMPACT ANNOUNCEMENT SECTION --- */}
        <FadeInWrapper delay={0.2}>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
              <Megaphone className="w-4 h-4" />
              <span>Pengumuman</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcementList.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div
                      className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${item.iconBg}`}
                    >
                      <Icon
                        className={`w-5 h-5 ${item.iconColor} group-hover:scale-110 transition-transform`}
                      />
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[9px] py-0 h-4 border uppercase tracking-wider ${item.tagColor}`}
                        >
                          {item.tag}
                        </Badge>
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          {item.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-foreground leading-tight truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeInWrapper>

        {/* --- ONGOING SECTION --- */}
        <section className="space-y-6 pt-4">
          <FadeInWrapper>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                  <Flame className="w-5 h-5" />
                  <span>Update Terbaru</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                  Sedang Tayang
                </h2>
              </div>

              <Button
                variant="outline"
                asChild
                className="rounded-full border-border hover:bg-secondary group h-9 px-4 text-xs font-semibold"
              >
                <Link href="/ongoing-anime">
                  Lihat Semua{" "}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </FadeInWrapper>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            {ongoingList.map((anime, idx) => (
              <AnimeCard key={anime.animeId} anime={anime} index={idx} />
            ))}
          </div>
        </section>

        {/* --- COMPLETED SECTION --- */}
        <section className="space-y-6 pt-4">
          <FadeInWrapper>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-bold text-sm uppercase tracking-wider">
                  <Sparkles className="w-5 h-5" />
                  <span>Maraton Time</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                  Anime Tamat
                </h2>
              </div>

              <Button
                variant="outline"
                asChild
                className="rounded-full border-border hover:bg-secondary group h-9 px-4 text-xs font-semibold"
              >
                <Link href="/completed-anime">
                  Lihat Semua{" "}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </FadeInWrapper>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            {completedList.map((anime, idx) => (
              <AnimeCard key={anime.animeId} anime={anime} index={idx} />
            ))}
          </div>
        </section>

        {/* --- BATCH SECTION --- */}
        {batchList.length > 0 && (
          <section className="space-y-6 pt-4">
            <FadeInWrapper>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                    <Layers className="w-5 h-5" />
                    <span>Koleksi Lengkap</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                    Anime Batch
                  </h2>
                </div>

                <Button
                  variant="outline"
                  asChild
                  className="rounded-full border-border hover:bg-secondary group h-9 px-4 text-xs font-semibold"
                >
                  <Link href="/batch-anime">
                    Lihat Semua{" "}
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </FadeInWrapper>

            {/* Grid Layout Lanskap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {batchList.map((anime, idx) => (
                <BatchAnimeCard key={anime.slug} anime={anime} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* --- 3. GENERAL COMMENT SECTION --- */}
        <section className="space-y-6 pt-10">
          <FadeInWrapper>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                <MessageCircle className="w-5 h-5" />
                <span>Komunitas</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                General Chat
              </h2>
            </div>

            {/* Komponen Komentar */}
            <CommentSection identifier="general" page_url="/" />
          </FadeInWrapper>
        </section>
      </div>
    </div>
  );
}
