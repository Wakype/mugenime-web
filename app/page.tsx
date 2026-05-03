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
} from "lucide-react";
import AnimeCard from "@/components/animeCard";
import BatchAnimeCard from "@/components/batchAnimeCard";
import { FadeInWrapper, HeroSection } from "@/components/homeSection";
import CommentSection from "@/components/commentSection";
import AnnouncementSlider from "@/components/announcementSlider";

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

  return (
    <div className="min-h-screen bg-background pb-20 selection:bg-primary/30">
      {/* --- HERO SECTION --- */}
      {heroAnime && (
        <HeroSection heroAnime={heroAnime} poster={heroAnime.poster} />
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-4 -mt-10 relative z-20 space-y-12">
        {/* --- COMPACT ANNOUNCEMENT SECTION --- */}
        <FadeInWrapper delay={0.2}>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
              <Megaphone className="w-4 h-4" />
              <span>Pengumuman</span>
            </div>

            {/* Render Slider Component */}
            <AnnouncementSlider />
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

        {/* --- GENERAL COMMENT SECTION --- */}
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
