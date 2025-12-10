"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  AnimeDetail,
  EpisodeDetail,
  BatchResponse,
  DownloadQuality,
} from "@/lib/types";
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
import {
  ChevronLeft,
  ChevronRight,
  MonitorPlay,
  Loader2,
  ExternalLink,
  List,
  Info,
  Download,
  FileVideo,
  Film,
  User,
  Clock,
  Video,
  PlayCircle,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BatchDownload from "./batchDownload";
import CommentSection from "./commentSection";

interface WatchViewProps {
  episode: EpisodeDetail;
  animeDetail: AnimeDetail | null;
  batchData: BatchResponse | null;
  episodeSlug: string;
  slug: string;
}

export default function WatchView({
  episode,
  animeDetail,
  batchData,
  episodeSlug,
  slug,
}: Readonly<WatchViewProps>) {
  // --- STATE ---
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(
    episode?.defaultStreamingUrl || ""
  );
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);

  const activeRequestRef = useRef<string>("");
  const addToHistory = useStore((state) => state.addToHistory);

  const isInvalid = !episode?.defaultStreamingUrl;

  // --- HELPERS ---
  const getProxyUrl = (url: string | undefined) => {
    if (!url) return "";
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };

  const parseDownloadTitle = (title: string) => {
    const match = new RegExp(/^(mp4|mkv)[\s_]+(\d+p)$/i).exec(title);
    if (match) {
      return {
        format: match[1].toUpperCase(),
        res: match[2],
      };
    }
    const isMkv = title.toLowerCase().includes("mkv");
    return {
      format: isMkv ? "MKV" : "MP4",
      res: title.replaceAll(/mp4|mkv|_|\s/gi, ""),
    };
  };

  const normalizeDownloads = (): DownloadQuality[] => {
    if (!episode.downloadUrl) return [];
    if (episode.downloadUrl.formats) {
      return episode.downloadUrl.formats.flatMap((group) => group.qualities);
    }
    if (episode.downloadUrl.qualities) {
      return episode.downloadUrl.qualities;
    }
    return [];
  };

  const groupedDownloads = useMemo(() => {
    const allQualities = normalizeDownloads();
    const groups: Record<string, DownloadQuality[]> = {};
    allQualities.forEach((item) => {
      const { format } = parseDownloadTitle(item.title);
      if (!groups[format]) groups[format] = [];
      groups[format].push(item);
    });
    return groups;
  }, [episode.downloadUrl]);

  // --- EFFECTS ---
  useEffect(() => {
    if (isInvalid) return;

    setCurrentVideoUrl(episode.defaultStreamingUrl);
    setSelectedServerId(null);
    setIsLoadingVideo(false);
    activeRequestRef.current = "";

    const cleanTitle = episode.title.replace(/Episode\s+\d+.*/i, "").trim();

    addToHistory({
      title: cleanTitle,
      slug: slug,
      poster: animeDetail?.poster || "",
      currentEpisode: episode.title,
      url: `/watch/${slug}/${episodeSlug}`,
    });
  }, [episode, episodeSlug, addToHistory, isInvalid, animeDetail, slug]);

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

  if (isInvalid) return null;

  let parentAnimeSlug = slug;
  if (!parentAnimeSlug && episode.animeId) {
    parentAnimeSlug = episode.animeId.replace("-sub-indo", "");
  }

  const displayEpisodeList =
    episode.info?.episodeList && episode.info.episodeList.length > 0
      ? episode.info.episodeList
      : animeDetail?.episodeList || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* --- KOLOM UTAMA (KIRI / 8 Columns) --- */}
      <div className="lg:col-span-8 space-y-8">
        {/* 1. PLAYER SECTION (Cinema Style) */}
        <section className="relative group">
          {/* Ambient Glow Background */}
          <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>

          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] border border-zinc-800 ring-1 ring-white/10 z-10">
            {/* Loading Overlay */}
            <div
              className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-sm transition-opacity duration-300 ${
                isLoadingVideo
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-3" />
              <p className="text-zinc-400 font-medium animate-pulse">
                Menghubungkan ke Server...
              </p>
            </div>

            <iframe
              key={currentVideoUrl}
              src={currentVideoUrl}
              title={episode.title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>

        {/* 2. TITLE & CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              {episode.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />{" "}
                {episode.releaseTime || "Unknown"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="default"
              className="flex-1 md:flex-none justify-center"
              asChild
              disabled={!episode.hasPrevEpisode}
            >
              {episode.prevEpisode ? (
                <Link href={`/watch/${slug}/${episode.prevEpisode.episodeId}`}>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Prev
                </Link>
              ) : (
                <span>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Prev
                </span>
              )}
            </Button>

            <Button
              size="default"
              className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white justify-center shadow-lg shadow-indigo-600/20"
              asChild
              disabled={!episode.hasNextEpisode}
            >
              {episode.nextEpisode ? (
                <Link href={`/watch/${slug}/${episode.nextEpisode.episodeId}`}>
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              ) : (
                <span>
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* 3. SERVER SELECTOR (Modern Pills) */}
        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <MonitorPlay className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                  Pilih Server
                </h3>
                <p className="text-xs text-zinc-500">
                  Jika macet, ganti server lain
                </p>
              </div>
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
            defaultValue={episode.server.qualities[0]?.title || "360p"}
            className="w-full"
          >
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent flex-wrap gap-2 mb-4">
              {episode.server.qualities.map((qualityGroup) => (
                <TabsTrigger
                  key={qualityGroup.title}
                  value={qualityGroup.title}
                  className="rounded-full px-4 py-1.5 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 data-[state=active]:bg-zinc-900 dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-zinc-900 shadow-sm transition-all"
                >
                  {qualityGroup.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {episode.server.qualities.map((qualityGroup) => (
              <TabsContent
                key={qualityGroup.title}
                value={qualityGroup.title}
                className="mt-0 animate-in fade-in-50 slide-in-from-left-2"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {qualityGroup.serverList.map((server) => (
                    <Button
                      key={server.serverId}
                      variant={
                        selectedServerId === server.serverId
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleServerChange(server.serverId)}
                      disabled={
                        isLoadingVideo && selectedServerId !== server.serverId
                      }
                      className={`
                        w-full capitalize truncate h-10 transition-all duration-200
                        ${
                          selectedServerId === server.serverId
                            ? "bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white shadow-md shadow-indigo-500/20"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10"
                        }
                      `}
                    >
                      {isLoadingVideo &&
                      selectedServerId === server.serverId ? (
                        <Loader2 className="w-3 h-3 animate-spin mr-2" />
                      ) : (
                        <PlayCircle className="w-3.5 h-3.5 mr-2 opacity-70" />
                      )}
                      {server.title}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* 4. ANIME DETAIL CARD */}
        {animeDetail && (
          <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col md:flex-row gap-6 shadow-sm group hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-colors">
            <div className="shrink-0 relative w-[110px] aspect-2/3 rounded-lg overflow-hidden shadow-lg bg-zinc-200 dark:bg-zinc-800">
              {animeDetail.poster ? (
                <Image
                  src={getProxyUrl(animeDetail.poster)}
                  alt={animeDetail.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="110px"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  <Info className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <Link
                  href={`/anime/${parentAnimeSlug}`}
                  className="font-bold text-xl hover:text-indigo-600 transition-colors line-clamp-1"
                >
                  {animeDetail.title}
                </Link>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                  >
                    {animeDetail.status}
                  </Badge>
                  {animeDetail.studios && (
                    <Badge
                      variant="outline"
                      className="border-zinc-200 dark:border-zinc-700 text-zinc-500"
                    >
                      {animeDetail.studios}
                    </Badge>
                  )}
                  {animeDetail.score && (
                    <Badge
                      variant="default"
                      className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-200 dark:border-yellow-500/20"
                    >
                      ⭐ {animeDetail.score}
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-4 leading-relaxed">
                {typeof animeDetail.synopsis === "string"
                  ? animeDetail.synopsis
                  : animeDetail.synopsis?.paragraphs?.join(" ")}
              </p>
            </div>
          </div>
        )}

        {/* 5. COMMENTS */}
        <div className="mt-8">
          <CommentSection />
        </div>
      </div>

      {/* --- KOLOM KANAN (SIDEBAR / 4 Columns) --- */}
      <div className="lg:col-span-4 space-y-6">
        <div className="top-24 space-y-6">
          {/* A. EPISODE LIST */}
          {displayEpisodeList.length > 0 && (
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 backdrop-blur shadow-sm overflow-hidden flex flex-col max-h-[60vh]">
              <CardHeader className="py-3 px-4 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <List className="w-4 h-4 text-indigo-600" /> Daftar Episode
                </CardTitle>
                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                  {displayEpisodeList.length} Episode
                </Badge>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 p-3 overflow-y-auto max-h-[400px] custom-scrollbar">
                  {displayEpisodeList.toReversed().map((ep) => {
                    const isCurrent = ep.episodeId === episodeSlug;
                    return (
                      <Link
                        key={ep.episodeId}
                        href={`/watch/${slug}/${ep.episodeId}`}
                        className={`
                          relative group flex items-center justify-center text-xs font-semibold py-2.5 rounded-lg border transition-all duration-200
                          ${
                            isCurrent
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-200 dark:ring-indigo-900"
                              : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-600"
                          }
                        `}
                      >
                        {ep.eps}
                        {isCurrent && (
                          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* B. INFO CREDITS */}
          {episode.info && (
            <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200 mb-2 border-b border-indigo-200 dark:border-indigo-800 pb-2">
                Informasi File
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-2 text-xs">
                    <User className="w-3 h-3" /> Credit
                  </span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 text-right max-w-[150px]">
                    {episode.info.credit || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-2 text-xs">
                    <Video className="w-3 h-3" /> Encoder
                  </span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 text-right max-w-[150px]">
                    {episode.info.encoder || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-2 text-xs">
                    <Clock className="w-3 h-3" /> Durasi
                  </span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 text-right">
                    {episode.info.duration || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* C. DOWNLOAD SECTION */}
          {(Object.keys(groupedDownloads).length > 0 || batchData) && (
            <div className="space-y-4">
              {Object.keys(groupedDownloads).length > 0 && (
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <CardHeader className="py-3 px-4 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Download className="w-4 h-4 text-emerald-600" /> Download
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      {Object.entries(groupedDownloads).map(
                        ([format, qualities], idx) => (
                          <AccordionItem
                            key={format}
                            value={format}
                            className={`border-zinc-100 dark:border-zinc-800 px-2 ${
                              idx === Object.keys(groupedDownloads).length - 1
                                ? "border-b-0"
                                : "border-b"
                            }`}
                          >
                            <AccordionTrigger className="px-2 py-3 hover:no-underline hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg my-1 text-sm font-medium transition-colors">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-1.5 rounded-md ${
                                    format === "MP4"
                                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                      : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                                  }`}
                                >
                                  {format === "MP4" ? (
                                    <FileVideo className="w-4 h-4" />
                                  ) : (
                                    <Film className="w-4 h-4" />
                                  )}
                                </div>
                                <span>{format}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-2 pb-4 pt-1 space-y-3">
                              {qualities.map((item) => {
                                const { res } = parseDownloadTitle(item.title);
                                return (
                                  <div
                                    key={item.title}
                                    className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-2.5 border border-zinc-100 dark:border-zinc-800/50"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <Badge
                                        variant="outline"
                                        className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-bold"
                                      >
                                        {res}
                                      </Badge>
                                      <span className="text-[10px] text-zinc-400 font-mono">
                                        {item.size}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {item.urls.map((link) => (
                                        <Button
                                          key={link.title}
                                          size="sm"
                                          variant="secondary"
                                          asChild
                                          className="h-6 text-[10px] px-2.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-all"
                                        >
                                          <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {link.title}
                                          </a>
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              {batchData && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <BatchDownload batchData={batchData} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
