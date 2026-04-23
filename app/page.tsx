import { fetchAnime, fetchKS } from "@/lib/api";
import { HomeData } from "@/lib/types";
import { KS_LatestResponse } from "@/lib/batchAnimeTypes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Sparkles,
  ServerCrash,
  Info,
  MessageCircle,
  Layers,
} from "lucide-react";
import AnimeCard from "@/components/animeCard";
import BatchAnimeCard from "@/components/batchAnimeCard";
import { FadeInWrapper, HeroSection } from "@/components/homeSection";
import CommentSection from "@/components/commentSection";

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

  const announcementList = [
    {
      id: 1,
      icon: Info,
      title: "Batch Anime dah ada!",
      content:
        "Mugenime udah ada halaman khusus buat anime batch, lho! Cek koleksi lengkapnya sekarang.",
      theme: "blue",
    },
    {
      id: 2,
      icon: Info,
      title: "Fitur Komentar",
      content: "Fitur komentar sudah bis dicoba!",
      theme: "blue",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 selection:bg-primary/30">
      {/* --- 1. HERO SECTION --- */}
      {heroAnime && (
        <HeroSection heroAnime={heroAnime} proxyUrl={heroAnime.poster} />
      )}

      {/* --- 2. ANNOUNCEMENT & CONTENT --- */}
      <div className="container mx-auto px-4 -mt-10 relative z-20 space-y-16">
        {/* Announcement Section */}
        <FadeInWrapper delay={0.2}>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 w-full">
            {announcementList.map((item) => {
              const Icon = item.icon;
              const isAlert = item.theme === "red";

              return (
                <div
                  key={item.id}
                  className={`
                    relative group flex-1 overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                    ${
                      isAlert
                        ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900 border-l-4 border-l-red-500"
                        : "bg-card/60 border-primary/20 border-l-4 border-l-primary"
                    }
                    backdrop-blur-md
                  `}
                >
                  {/* Background Watermark Icon */}
                  <div className="absolute -right-6 -top-6 text-current opacity-5 dark:opacity-[0.03] group-hover:scale-110 transition-transform duration-500 rotate-12">
                    <Icon
                      className={`w-32 h-32 ${
                        isAlert ? "text-red-500" : "text-primary"
                      }`}
                    />
                  </div>

                  <div className="relative z-10 flex items-start gap-4">
                    <div
                      className={`
                        p-3 rounded-full shrink-0 shadow-sm ring-1 ring-inset
                        ${
                          isAlert
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 ring-red-200 dark:ring-red-800"
                            : "bg-primary/10 text-primary ring-primary/20"
                        }
                      `}
                    >
                      <Icon
                        className={`w-5 h-5 ${isAlert && "animate-pulse"}`}
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-lg text-foreground tracking-tight flex items-center gap-2">
                        {item.title}
                        {isAlert && (
                          <span className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-900/50 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/10">
                            Penting
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-full">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeInWrapper>

        {/* --- ONGOING SECTION --- */}
        <section className="space-y-8">
          <FadeInWrapper>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                  <Flame className="w-5 h-5" />
                  <span>Update Terbaru</span>
                </div>
                <h2 className="text-3xl font-black text-foreground tracking-tight">
                  Sedang Tayang
                </h2>
                <p className="text-muted-foreground max-w-lg">
                  Daftar anime musim ini yang sedang <i>on-going</i>. Tonton
                  episode terbarunya sekarang.
                </p>
              </div>

              <Button
                variant="outline"
                asChild
                className="rounded-full border-border hover:bg-secondary group"
              >
                <Link href="/ongoing-anime">
                  Lihat Semua{" "}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
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
        <section className="space-y-8">
          <FadeInWrapper>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-bold text-sm uppercase tracking-wider">
                  <Sparkles className="w-5 h-5" />
                  <span>Maraton Time</span>
                </div>
                <h2 className="text-3xl font-black text-foreground tracking-tight">
                  Anime Tamat
                </h2>
                <p className="text-muted-foreground max-w-lg">
                  Rekomendasi anime yang sudah selesai tayang (Completed). Cocok
                  buat yang suka maraton!
                </p>
              </div>

              <Button
                variant="outline"
                asChild
                className="rounded-full border-border hover:bg-secondary group"
              >
                <Link href="/completed-anime">
                  Lihat Semua{" "}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
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
          <section className="space-y-8">
            <FadeInWrapper>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                    <Layers className="w-5 h-5" />
                    <span>Koleksi Lengkap</span>
                  </div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">
                    Anime Batch
                  </h2>
                  <p className="text-muted-foreground max-w-lg">
                    Download seluruh episode anime dalam satu paket dengan
                    resolusi tinggi.
                  </p>
                </div>

                <Button
                  variant="outline"
                  asChild
                  className="rounded-full border-border hover:bg-secondary group"
                >
                  <Link href="/batch-anime">
                    Lihat Semua{" "}
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
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
        <section className="space-y-8 pt-10">
          <FadeInWrapper>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                <MessageCircle className="w-5 h-5" />
                <span>Komunitas</span>
              </div>
              <h2 className="text-3xl font-black text-foreground tracking-tight">
                General
              </h2>
              <p className="text-muted-foreground max-w-lg">
                Tempat ngobrol santai atau sekadar menyapa.
              </p>
            </div>

            {/* Komponen Komentar Diupdate */}
            <CommentSection identifier="general" page_url="/" />
          </FadeInWrapper>
        </section>
      </div>
    </div>
  );
}
