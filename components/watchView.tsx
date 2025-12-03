"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { AnimeDetail, EpisodeDetail } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  MonitorPlay,
  Loader2,
  AlertCircle,
  ExternalLink,
  List,
  Info,
  Package,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface WatchViewProps {
  episode: EpisodeDetail;
  animeDetail: AnimeDetail | null; // Bisa null jika fetch gagal
  episodeSlug: string;
  slug: string;
}

export default function WatchView({
  episode,
  animeDetail,
  episodeSlug,
  slug,
}: WatchViewProps) {
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(
    episode?.stream_url || ""
  );

  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const activeRequestRef = useRef<string>("");
  const addToHistory = useStore((state) => state.addToHistory);

  const isInvalid = !episode || !episode.stream_url;

  // Helper untuk Image Proxy (Defensive)
  const getProxyUrl = (url: string | undefined) => {
    if (!url) return "";
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };

  // Helper untuk Ekstrak Slug dengan Aman (Dipakai di Effect & Render)
  const safeExtractSlug = (url: string | undefined) => {
    if (!url) return "";
    try {
      if (url.includes("otakudesu")) {
        const parts = url.split("/").filter((p) => p && p.trim() !== "");
        return parts.length > 0 ? parts[parts.length - 1] : url;
      }
      return url;
    } catch (e) {
      return "";
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    if (isInvalid) return;

    setCurrentVideoUrl(episode.stream_url);
    setSelectedServerId(null);
    setIsLoadingVideo(false);
    activeRequestRef.current = "";

    const cleanTitle = episode.episode.replace(/Episode\s+\d+.*/i, "").trim();

    addToHistory({
      title: cleanTitle,
      slug: slug,
      poster: animeDetail?.poster || "",
      currentEpisode: episode.episode,
      url: `/watch/${episodeSlug}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode, episodeSlug, addToHistory, isInvalid, animeDetail]);

  // --- HELPERS ---
  const getQualityLabel = (id: string) => {
    if (id.includes("360p")) return "360p";
    if (id.includes("480p")) return "480p";
    if (id.includes("720p")) return "720p";
    if (id.includes("1080p")) return "1080p";
    return "SD";
  };

  const handleServerChange = async (urlId: string) => {
    if (urlId === selectedServerId) return;
    setIsLoadingVideo(true);
    setSelectedServerId(urlId);
    activeRequestRef.current = urlId;

    try {
      const res = await fetch(`/api/server?id=${encodeURIComponent(urlId)}`);
      const data = await res.json();
      if (activeRequestRef.current !== urlId) return;

      if (data.url) {
        setCurrentVideoUrl(data.url);
      } else {
        throw new Error("URL tidak ditemukan");
      }
    } catch (error) {
      if (activeRequestRef.current === urlId) console.error(error);
    } finally {
      if (activeRequestRef.current === urlId) setIsLoadingVideo(false);
    }
  };

  const processedServers = useMemo(() => {
    if (isInvalid) return [];
    return episode.stream_servers.map((group) => {
      const firstId = group.servers[0]?.id || "";
      return {
        ...group,
        quality: getQualityLabel(firstId) || "Unknown",
      };
    });
  }, [episode, isInvalid]);

  if (isInvalid) return null;

  // PERBAIKAN 2: Logic Safe Parsing Slug untuk Link "Lihat Detail Anime"
  let parentAnimeSlug = "#";

  if (animeDetail?.slug) {
    const extracted = safeExtractSlug(animeDetail.slug);
    if (extracted) parentAnimeSlug = extracted;
  } else if (episode.anime?.slug) {
    const extracted = safeExtractSlug(episode.anime.slug);
    if (extracted) parentAnimeSlug = extracted;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* --- KOLOM UTAMA (KIRI) --- */}
      <div className="lg:col-span-2 space-y-8">
        {/* 1. PLAYER */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800 group">
          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950 transition-opacity duration-300 ${
              isLoadingVideo
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-3" />
            <p className="text-zinc-400 font-medium animate-pulse">
              Memuat Stream...
            </p>
          </div>
          <iframe
            key={currentVideoUrl}
            src={currentVideoUrl}
            title={episode.episode}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* 2. NAVIGASI & JUDUL */}
        <div className="space-y-4">
          <h1 className="text-xl md:text-2xl font-bold font-heading leading-tight text-zinc-900 dark:text-zinc-100">
            {episode.episode}
          </h1>

          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              asChild
              disabled={!episode.has_previous_episode}
              className="flex-1 md:flex-none"
            >
              {episode.previous_episode ? (
                <Link href={`/watch/${slug}/${episode.previous_episode.slug}`}>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Sebelumnya
                </Link>
              ) : (
                <span>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Sebelumnya
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              asChild
              className="text-indigo-600 hidden md:flex hover:text-indigo-700"
            >
              <Link href={`/anime/${parentAnimeSlug}`}>Lihat Detail Anime</Link>
            </Button>

            <Button
              variant="default"
              asChild
              disabled={!episode.has_next_episode}
              className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {episode.next_episode ? (
                <Link href={`/watch/${slug}/${episode.next_episode.slug}`}>
                  Selanjutnya <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              ) : (
                <span>
                  Selanjutnya <ChevronRight className="w-4 h-4 ml-2" />
                </span>
              )}
            </Button>
          </div>
        </div>

        <Separator />

        {/* 3. PILIH SERVER */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-lg">Pilih Server</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-xs text-zinc-500"
            >
              <a
                href={currentVideoUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <ExternalLink className="w-3 h-3 mr-1" /> Buka Tab Baru
              </a>
            </Button>
          </div>

          <Tabs
            defaultValue={processedServers[0]?.quality || "360p"}
            className="w-full"
          >
            <TabsList className="w-full justify-start h-auto p-1 bg-zinc-100 dark:bg-zinc-900 flex-wrap">
              {processedServers.map((group, idx) => (
                <TabsTrigger
                  key={idx}
                  value={group.quality}
                  className="px-4 py-2 flex-1 md:flex-none"
                >
                  {group.quality}
                </TabsTrigger>
              ))}
            </TabsList>
            {processedServers.map((group, idx) => (
              <TabsContent
                key={idx}
                value={group.quality}
                className="mt-4 animate-in fade-in-50"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {group.servers.map((server) => (
                    <Button
                      key={server.id}
                      variant={
                        selectedServerId === server.id ? "default" : "outline"
                      }
                      onClick={() => handleServerChange(server.id)}
                      disabled={
                        isLoadingVideo && selectedServerId !== server.id
                      }
                      className={`w-full capitalize truncate ${
                        selectedServerId === server.id
                          ? "bg-indigo-600 text-white border-0"
                          : ""
                      }`}
                    >
                      {isLoadingVideo && selectedServerId === server.id ? (
                        <Loader2 className="w-3 h-3 animate-spin mr-2" />
                      ) : null}
                      {server.name}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50 p-3 rounded-md flex gap-3 items-centerr text-xs text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>
              Jika video error (Hotlink/Sandboxed), coba ganti server lain atau
              gunakan tombol <b>&quot;Buka Tab Baru&quot;</b>.
            </p>
          </div>
        </div>

        {/* 4. INFO ANIME & BATCH */}
        {animeDetail && (
          <div className="bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col md:flex-row gap-6">
            <div className="shrink-0 relative w-[120px] aspect-[3/4] rounded-lg overflow-hidden shadow-md hidden md:block bg-zinc-200 dark:bg-zinc-800">
              {animeDetail.poster ? (
                <Image
                  src={getProxyUrl(animeDetail.poster)}
                  alt={animeDetail.title || "Poster Anime"}
                  fill
                  className="object-cover"
                  sizes="120px"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  <Info className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-lg font-heading">
                  {animeDetail.title || "Judul Tidak Tersedia"}
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">{animeDetail.status || "?"}</Badge>
                  <Badge variant="outline">{animeDetail.rating || "-"} ★</Badge>
                  <span className="text-zinc-500 self-center">
                    {animeDetail.studio}
                  </span>
                </div>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                {animeDetail.synopsis || "Sinopsis belum tersedia."}
              </p>

              {/* BATCH DOWNLOAD BUTTON */}
              {animeDetail.status?.toLowerCase() === "completed" &&
                animeDetail.batch && (
                  <div className="pt-2">
                    <Button
                      asChild
                      size="sm"
                      className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Link href={`/anime/batch/${animeDetail.batch.slug}`}>
                        <Package className="w-4 h-4 mr-2" /> Download Batch
                        (Tamat)
                      </Link>
                    </Button>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* --- KOLOM KANAN (SIDEBAR) --- */}
      <div className="space-y-6">
        {/* 5. LIST EPISODE */}
        {animeDetail && animeDetail.episode_lists && (
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <List className="w-4 h-4" /> Daftar Episode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {animeDetail.episode_lists.map((ep) => {
                  const isCurrent = ep.slug === episodeSlug;
                  return (
                    <Link
                      key={ep.slug}
                      href={`/watch/${slug}/${ep.slug}`}
                      className={`
                        text-xs font-medium py-2 px-1 rounded text-center border transition-colors
                        ${
                          isCurrent
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-zinc-100 dark:bg-zinc-800 border-transparent hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        }
                      `}
                    >
                      {ep.episode_number}
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 6. DOWNLOAD PER EPISODE */}
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="w-4 h-4 text-green-600" /> Download Episode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {episode.download_urls?.mp4 && (
              <div className="space-y-2">
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100"
                >
                  MP4
                </Badge>
                {episode.download_urls.mp4.map((format, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-500">
                      {format.resolution}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {format.urls.map((link, lIdx) => (
                        <Button
                          key={lIdx}
                          size="sm"
                          variant="outline"
                          asChild
                          className="h-6 text-[10px] px-2"
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.provider}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {episode.download_urls?.mkv && (
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-100"
                >
                  MKV
                </Badge>
                {episode.download_urls.mkv.map((format, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-500">
                      {format.resolution}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {format.urls.map((link, lIdx) => (
                        <Button
                          key={lIdx}
                          size="sm"
                          variant="outline"
                          asChild
                          className="h-6 text-[10px] px-2"
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.provider}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}