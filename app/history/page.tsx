"use client";

import { useEffect, useState, useMemo } from "react";
import {
  History,
  Play,
  Trash2,
  Loader2,
  Clock,
  MonitorPlay,
  Film,
  Info,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useStore, HistoryItem } from "@/lib/store";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface GroupedHistory {
  anime_slug: string;
  anime_title: string;
  poster: string;
  last_updated: number;
  episodes: {
    episode_slug: string;
    episode_title: string;
    updated_at: number;
  }[];
}

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const supabase = createClient();
  const { clearHistory: clearGuestHistory, cleanupOldHistory } = useStore();

  useEffect(() => {
    const fetchHistory = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsLoggedIn(true);
        const { data, error } = await supabase
          .from("watch_history")
          .select("*")
          .order("updated_at", { ascending: false });

        if (!error && data) {
          const formatted = data.map((item) => ({
            ...item,
            updated_at: new Date(item.updated_at).getTime(),
          }));
          setHistoryData(formatted);
        }
      } else {
        // Untuk Guest: Panggil rehydrate, lalu bersihkan data usang, lalu set state
        useStore.persist.rehydrate();
        setTimeout(() => {
          cleanupOldHistory(); // Hapus data > 30 hari di local storage
          setHistoryData(useStore.getState().watchHistory);
        }, 100);
      }
      setIsLoading(false);
    };

    fetchHistory();
  }, [supabase, cleanupOldHistory]);

  const groupedHistory = useMemo(() => {
    const groups: Record<string, GroupedHistory> = {};

    historyData.forEach((item) => {
      if (!groups[item.anime_slug]) {
        groups[item.anime_slug] = {
          anime_slug: item.anime_slug,
          anime_title: item.anime_title,
          poster: item.poster,
          last_updated: item.updated_at,
          episodes: [],
        };
      }

      groups[item.anime_slug].episodes.push({
        episode_slug: item.episode_slug,
        episode_title: item.episode_title,
        updated_at: item.updated_at,
      });

      if (item.updated_at > groups[item.anime_slug].last_updated) {
        groups[item.anime_slug].last_updated = item.updated_at;
      }
    });

    Object.values(groups).forEach((group) => {
      group.episodes.sort((a, b) => b.updated_at - a.updated_at);
    });

    return Object.values(groups).sort(
      (a, b) => b.last_updated - a.last_updated,
    );
  }, [historyData]);

  const handleClearAll = async () => {
    setIsLoading(true);
    if (isLoggedIn) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from("watch_history")
          .delete()
          .eq("user_id", session.user.id);
      }
    } else {
      clearGuestHistory();
    }
    setHistoryData([]);
    setIsLoading(false);
    toast.success("Riwayat tontonan berhasil dibersihkan");
  };

  let pageContent;

  if (isLoading) {
    pageContent = (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="p-4 bg-primary/10 rounded-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <p className="text-muted-foreground font-medium animate-pulse">
          Memuat riwayat...
        </p>
      </div>
    );
  } else if (groupedHistory.length > 0) {
    pageContent = (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TooltipProvider delayDuration={100}>
          {groupedHistory.map((group) => (
            <div
              key={group.anime_slug}
              className="group flex flex-col sm:flex-row gap-5 p-4 sm:p-5 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300"
            >
              <Link
                href={`/anime/${group.anime_slug}`}
                className="relative w-full sm:w-36 aspect-21/9 sm:aspect-3/4 rounded-2xl overflow-hidden shrink-0 bg-muted cursor-pointer block"
              >
                <Image
                  src={group.poster || ""}
                  alt={group.anime_title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 150px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 bg-primary/90 backdrop-blur-sm text-white rounded-full flex items-center justify-center transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-xl">
                    <MonitorPlay className="w-5 h-5 ml-0.5" />
                  </div>
                </div>
              </Link>

              <div className="flex flex-col justify-start min-w-0 flex-1 py-1">
                <h3 className="font-extrabold text-xl md:text-2xl text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {group.anime_title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Terakhir ditonton{" "}
                  {formatDistanceToNow(group.last_updated, {
                    addSuffix: true,
                    locale: id,
                  })}
                </p>

                <div className="mt-auto pt-4 flex flex-col gap-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Film className="w-3 h-3" /> Lanjutkan Menonton:
                  </p>
                  <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-2 pb-2">
                    {group.episodes.map((ep) => {
                      const epMatch = new RegExp(/Episode\s+(\d+)/i).exec(
                        ep.episode_title,
                      );
                      const displayTitle = epMatch
                        ? `Eps ${epMatch[1]}`
                        : ep.episode_title || "Eps ?";
                      const timeAgo = formatDistanceToNow(ep.updated_at, {
                        addSuffix: true,
                        locale: id,
                      });

                      return (
                        <Tooltip key={ep.episode_slug}>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/watch/${group.anime_slug}/${ep.episode_slug}`}
                              className="group/btn flex flex-col items-center justify-center px-3 py-1.5 rounded-xl bg-secondary/60 border border-border/60 hover:bg-primary hover:border-primary transition-all cursor-pointer min-w-[70px] shadow-sm hover:shadow-primary/20"
                            >
                              <span className="flex items-center gap-1.5 text-xs font-extrabold text-foreground group-hover/btn:text-primary-foreground transition-colors">
                                <Play className="w-3 h-3 text-primary group-hover/btn:text-primary-foreground fill-current transition-colors" />
                                {displayTitle}
                              </span>
                              <span className="text-[9px] text-muted-foreground group-hover/btn:text-primary-foreground/80 font-medium mt-0.5 whitespace-nowrap transition-colors">
                                {timeAgo}
                              </span>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="text-xs font-semibold"
                          >
                            <p>Ditonton {timeAgo}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TooltipProvider>
      </div>
    );
  } else {
    pageContent = (
      <div className="relative flex flex-col items-center justify-center min-h-[400px] text-center p-8 rounded-3xl border border-dashed border-border bg-muted/10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] max-h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <div className="relative w-24 h-24 bg-card border border-border rounded-3xl flex items-center justify-center shadow-xl rotate-3 transition-transform hover:rotate-6">
              <MonitorPlay className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-heading">
              Riwayat Kosong
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Kamu belum menonton anime apa pun akhir-akhir ini. Eksplorasi
              katalog kami dan temukan tontonan seru berikutnya!
            </p>
          </div>

          <div className="pt-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 cursor-pointer px-8"
            >
              <Link href="/list-anime">
                <Play className="w-4 h-4 mr-2 fill-current" /> Mulai Menonton
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-10 bg-background">
      <div className="container mx-auto px-4 space-y-8">
        {/* --- HEADER SECTION --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <History className="w-3.5 h-3.5" />
                History
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                Riwayat <span className="text-primary">Tontonan</span>
              </h1>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
                Lihat kembali riwayat tontonanmu.
              </p>
            </div>

            {historyData.length > 0 && (
              <Button
                onClick={handleClearAll}
                variant="destructive"
                className="rounded-xl font-bold shadow-lg shadow-destructive/20 cursor-pointer shrink-0"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Bersihkan Semua
              </Button>
            )}
          </div>
        </div>

        {/* --- INFO CARDS --- */}
        {historyData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Auto Cleanup Card */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20 text-foreground shadow-sm">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm">
                  Penghapusan History Otomatis
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Untuk menjaga performa dan privasi, riwayat tontonan yang
                  berusia lebih dari <strong>30 hari</strong> akan dihapus
                  secara otomatis dari sistem.
                </p>
              </div>
            </div>

            {/* Tracking Logic Card */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20 text-foreground shadow-sm">
              <MonitorPlay className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm">Cara Kerja History</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Anime akan otomatis ditambahkan ke daftar ini jika kamu
                  membuka halaman episode selama minimal{" "}
                  <strong>10 detik</strong>, atau saat kamu mengunduh episode
                  tersebut.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTENT SECTION --- */}
        {pageContent}
      </div>
    </div>
  );
}
