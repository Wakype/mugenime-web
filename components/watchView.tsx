"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { AnimeDetail, EpisodeDetail, BatchResponse } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  MonitorPlay,
  Loader2,
  AlertCircle,
  ExternalLink,
  List,
  Info,
  Download,
  FileVideo,
  Film,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BatchDownload from "./batchDownload";
import CommentSection from "./commentSection";

interface WatchViewProps {
  episode: EpisodeDetail;
  animeDetail: AnimeDetail | null;
  episodeSlug: string;
  slug: string;
}

export default function WatchView({
  episode,
  animeDetail,
  episodeSlug,
  slug,
}: Readonly<WatchViewProps>) {
  // --- STATE ---
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(
    episode?.stream_url || ""
  );
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);

  // State untuk Batch Data
  const [batchData, setBatchData] = useState<BatchResponse | null>(null);
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);

  const activeRequestRef = useRef<string>("");
  const addToHistory = useStore((state) => state.addToHistory);

  const isInvalid = !episode?.stream_url;

  // --- HELPERS ---
  const getProxyUrl = (url: string | undefined) => {
    if (!url) return "";
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };

  const safeExtractSlug = (url: string | undefined) => {
    if (!url) return "";
    try {
      if (url.includes("otakudesu")) {
        const parts = url.split("/").filter((p) => p && p.trim() !== "");
        return parts.length > 0 ? parts.at(-1) : url;
      }
      return url;
    } catch (e) {
      return "";
    }
  };

  const getQualityLabel = (id: string) => {
    if (id.includes("360p")) return "360p";
    if (id.includes("480p")) return "480p";
    if (id.includes("720p")) return "720p";
    if (id.includes("1080p")) return "1080p";
    return "SD";
  };

  // --- EFFECTS ---

  // 1. History & Reset Video
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
  }, [episode, episodeSlug, addToHistory, isInvalid, animeDetail, slug]);

  // 2. Fetch Batch Data (Jika ada)
  useEffect(() => {
    const fetchBatch = async () => {
      if (animeDetail?.batch?.slug && !batchData) {
        setIsLoadingBatch(true);
        try {
          // const res = await fetch(`/api/anime/batch/${animeDetail.batch.slug}`);
          const response = await fetch(
            `/api/batch?slug=${animeDetail.batch.slug}`
          );
          const json = await response.json();
          if (json.data) setBatchData(json.data);
        } catch (error) {
          console.error("Gagal load batch:", error);
        } finally {
          setIsLoadingBatch(false);
        }
      }
    };

    fetchBatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeDetail]);

  // --- HANDLERS ---
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
        {/* 1. PLAYER SECTION */}
        <div className="space-y-4">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800 group ring-1 ring-white/10">
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

          {/* Judul & Navigasi */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-xl font-bold font-heading text-zinc-900 dark:text-zinc-100 line-clamp-1">
              {episode.episode}
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <Button
                variant="outline"
                size="sm"
                asChild
                disabled={!episode.has_previous_episode}
              >
                {episode.previous_episode ? (
                  <Link
                    href={`/watch/${slug}/${episode.previous_episode.slug}`}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                  </Link>
                ) : (
                  <span>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                  </span>
                )}
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                asChild
                disabled={!episode.has_next_episode}
              >
                {episode.next_episode ? (
                  <Link href={`/watch/${slug}/${episode.next_episode.slug}`}>
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                ) : (
                  <span>
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* 2. PILIH SERVER */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-200">
                Server Stream
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-xs text-zinc-500 hover:text-indigo-600"
            >
              <a
                href={currentVideoUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <ExternalLink className="w-3 h-3 mr-1" /> Tab Baru
              </a>
            </Button>
          </div>

          <Tabs
            defaultValue={processedServers[0]?.quality || "360p"}
            className="w-full"
          >
            <TabsList className="w-full justify-start h-auto p-1 bg-zinc-100 dark:bg-zinc-900 flex-wrap gap-1">
              {processedServers.map((group, idx) => (
                <TabsTrigger
                  key={idx}
                  value={group.quality}
                  className="px-4 py-2 flex-1 md:flex-none data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-indigo-600 shadow-sm"
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
                      className={`w-full capitalize truncate border-zinc-200 dark:border-zinc-800 ${
                        selectedServerId === server.id
                          ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                          : "hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600"
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

          <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 p-3 rounded-lg flex gap-3 items-center text-xs text-indigo-800 dark:text-indigo-200/80">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>
              Video tidak bisa diputar? Coba ganti server atau resolusi lain.
              Gunakan tombol &quot;Tab Baru&quot; jika player masih error.
            </p>
          </div>
        </div>

        {/* INFO ANIME (MINI) */}
        {animeDetail && (
          <div className="bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 md:p-6 flex flex-col md:flex-row gap-6">
            <div className="shrink-0 relative w-[100px] aspect-3/4 rounded-lg overflow-hidden shadow-md  bg-zinc-200 dark:bg-zinc-800">
              {animeDetail.poster ? (
                <Image
                  src={getProxyUrl(animeDetail.poster)}
                  alt={animeDetail.title}
                  fill
                  className="object-cover"
                  sizes="100px"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  <Info className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-col gap-1">
                <Link
                  href={`/anime/${parentAnimeSlug}`}
                  className="font-bold text-lg hover:text-indigo-600 transition-colors"
                >
                  {animeDetail.title}
                </Link>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge
                    variant="secondary"
                    className="bg-zinc-200 dark:bg-zinc-800"
                  >
                    {animeDetail.status}
                  </Badge>
                  <span className="text-zinc-500 self-center">
                    {animeDetail.studio}
                  </span>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                {animeDetail.synopsis}
              </p>
              <Button
                variant="link"
                asChild
                className="p-0 h-auto text-indigo-600"
              >
                <Link href={`/anime/${parentAnimeSlug}`}>
                  Lihat Selengkapnya &rarr;
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* 4. KOMENTAR SECTION */}
        <div className="mt-8">
          <CommentSection />
        </div>
      </div>

      {/* --- KOLOM KANAN (SIDEBAR) --- */}
      <div className="space-y-6">
        {/* 4. LIST EPISODE GRID */}
        {animeDetail?.episode_lists && (
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <List className="w-4 h-4 text-indigo-600" /> Daftar Episode
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="grid grid-cols-4 gap-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                {animeDetail.episode_lists.map((ep) => {
                  const isCurrent = ep.slug === episodeSlug;
                  return (
                    <Link
                      key={ep.slug}
                      href={`/watch/${slug}/${ep.slug}`}
                      className={`
                        text-xs font-medium py-2 rounded-md text-center border transition-all
                        ${
                          isCurrent
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                            : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600"
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

        {/* 5. DOWNLOAD PER EPISODE (REDESIGNED) */}
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Download className="w-4 h-4 text-green-600" /> Download Episode
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {/* MP4 Section */}
              {episode.download_urls?.mp4 && (
                <AccordionItem
                  value="mp4"
                  className="border-b border-zinc-100 dark:border-zinc-800"
                >
                  <AccordionTrigger className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <FileVideo className="w-4 h-4 text-blue-500" />
                      <span>MP4 Format</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-1 space-y-4">
                    {episode.download_urls.mp4.map((format, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {format.resolution}
                          </span>
                          <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800"></div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {format.urls.map((link, lIdx) => (
                            <Button
                              key={lIdx}
                              size="sm"
                              variant="outline"
                              asChild
                              className="h-7 text-[10px] px-3 rounded-full hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
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
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* MKV Section */}
              {episode.download_urls?.mkv && (
                <AccordionItem value="mkv" className="border-b-0">
                  <AccordionTrigger className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-purple-500" />
                      <span>MKV Format</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-1 space-y-4">
                    {episode.download_urls.mkv.map((format, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            {format.resolution}
                          </span>
                          <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800"></div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {format.urls.map((link, lIdx) => (
                            <Button
                              key={lIdx}
                              size="sm"
                              variant="outline"
                              asChild
                              className="h-7 text-[10px] px-3 rounded-full hover:border-purple-300 hover:text-purple-600 dark:hover:border-purple-700 dark:hover:text-purple-400"
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
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>

        {/* 6. BATCH DOWNLOAD SECTION (NEW) */}
        {/* Render BatchDownload component jika data batch tersedia di animeDetail */}
        {/* Kita mengirim object batchData yang di-fetch via useEffect ke komponen ini */}
        {(batchData || animeDetail?.batch) && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isLoadingBatch ? (
              <div className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400 gap-2 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Memuat info
                batch...
              </div>
            ) : batchData ? (
              <BatchDownload batchData={batchData} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
