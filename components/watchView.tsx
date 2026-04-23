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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ChevronLeft,
  ChevronRight,
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
  Building2,
  Star,
  HardDrive,
  Calendar,
  Home,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BatchDownload from "./batchDownload";
import CommentSection from "./commentSection";
import { cn } from "@/lib/utils";

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
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(
    episode?.defaultStreamingUrl || "",
  );
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);

  const activeRequestRef = useRef<string>("");
  const addToHistory = useStore((state) => state.addToHistory);

  const isInvalid = !episode?.defaultStreamingUrl;

  // --- HELPERS ---
  // const getProxyUrl = (url: string | undefined) => {
  //   if (!url) return "";
  //   return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  // };

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
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 overflow-hidden">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="flex items-center gap-1 hover:text-primary"
              >
                <Home className="w-3.5 h-3.5" /> Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/list-anime" className="hover:text-primary">
                Anime
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/anime/${parentAnimeSlug}`}
                className="hover:text-primary line-clamp-1 max-w-[150px] sm:max-w-xs"
              >
                {animeDetail?.title || "Detail"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">
                Episode{" "}
                {new RegExp(/Episode\s+(\d+)/i).exec(episode.title)?.[1] ||
                  "Playing"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* --- LEFT COLUMN (PLAYER & INFO) --- */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. PLAYER CARD */}
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="relative w-full aspect-video bg-black">
              {/* Loading State Overlay */}
              <div
                className={cn(
                  "absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300",
                  isLoadingVideo
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none",
                )}
              >
                <div className="bg-white/10 p-3 rounded-full mb-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
                <p className="text-white/80 font-medium text-sm">
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

            {/* Player Controls */}
            <div className="p-4 sm:p-5 border-t border-border">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <h1 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                    {episode.title}
                  </h1>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {episode.releaseTime || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none border-border hover:bg-muted text-muted-foreground hover:text-primary hover:border-primary/50"
                    disabled={!episode.hasPrevEpisode}
                    asChild
                  >
                    {episode.prevEpisode ? (
                      <Link
                        href={`/watch/${slug}/${episode.prevEpisode.episodeId}`}
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
                    size="sm"
                    className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
                    disabled={!episode.hasNextEpisode}
                    asChild
                  >
                    {episode.nextEpisode ? (
                      <Link
                        href={`/watch/${slug}/${episode.nextEpisode.episodeId}`}
                      >
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
          </div>

          {/* 2. SERVER SELECTION */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                Pilih Server
              </h3>
              <a
                href={currentVideoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs text-primary hover:text-primary/80 font-medium flex items-center hover:underline"
              >
                <ExternalLink className="w-3 h-3 mr-1" /> Tab Baru
              </a>
            </div>

            <Tabs
              defaultValue={episode.server.qualities[0]?.title || "360p"}
              className="w-full"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 border-b border-border pb-2">
                <TabsList className="w-full sm:w-auto h-auto p-0 bg-transparent gap-2 justify-start flex-wrap">
                  {episode.server.qualities.map((qualityGroup) => (
                    <TabsTrigger
                      key={qualityGroup.title}
                      value={qualityGroup.title}
                      className="rounded-full px-4 py-1.5 text-xs font-medium border border-border bg-muted/40 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary text-muted-foreground transition-all shadow-sm"
                    >
                      {qualityGroup.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {episode.server.qualities.map((qualityGroup) => (
                <TabsContent
                  key={qualityGroup.title}
                  value={qualityGroup.title}
                  className="mt-0 focus-visible:outline-none"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {qualityGroup.serverList.map((server) => (
                      <button
                        key={server.serverId}
                        onClick={() => handleServerChange(server.serverId)}
                        disabled={
                          isLoadingVideo && selectedServerId !== server.serverId
                        }
                        className={cn(
                          "relative group flex items-center justify-center px-3 py-2.5 rounded-lg text-xs font-medium border transition-all duration-200",
                          selectedServerId === server.serverId
                            ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5",
                        )}
                      >
                        {isLoadingVideo &&
                        selectedServerId === server.serverId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                        ) : (
                          <PlayCircle
                            className={cn(
                              "w-3.5 h-3.5 mr-2",
                              selectedServerId === server.serverId
                                ? "opacity-100"
                                : "opacity-50 group-hover:opacity-100",
                            )}
                          />
                        )}
                        <span className="truncate capitalize">
                          {server.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* 3. ANIME DETAIL CARD (Overview) */}
          {animeDetail && (
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm flex flex-col md:flex-row gap-5">
              <div className="shrink-0 relative w-[100px] md:w-[120px] aspect-2/3 rounded-lg overflow-hidden bg-muted shadow-sm border border-border mx-auto md:mx-0">
                {animeDetail.poster ? (
                  <Image
                    // src={getProxyUrl(animeDetail.poster)}
                    src={animeDetail.poster ?? ""}
                    alt={animeDetail.title}
                    fill
                    className="object-cover"
                    sizes="120px"
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Info className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <h2 className="text-xl font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
                    <Link href={`/anime/${parentAnimeSlug}`}>
                      {animeDetail.title}
                    </Link>
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge
                      variant="secondary"
                      className="bg-muted text-muted-foreground border-border rounded-md"
                    >
                      {animeDetail.status}
                    </Badge>
                    {animeDetail.score && (
                      <Badge
                        variant="outline"
                        className="border-yellow-500/30 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 rounded-md flex items-center gap-1"
                      >
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />{" "}
                        {animeDetail.score}
                      </Badge>
                    )}
                    {animeDetail.studios && (
                      <Badge
                        variant="outline"
                        className="border-border text-muted-foreground flex items-center gap-1 rounded-md"
                      >
                        <Building2 className="w-3 h-3" />
                        {animeDetail.studios}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                    Sinopsis
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                    {(typeof animeDetail.synopsis === "string"
                      ? animeDetail.synopsis
                      : animeDetail.synopsis?.paragraphs?.join(" ")) ||
                      "Sinopsis tidak tersedia."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN (SIDEBAR) --- */}
        <div className="lg:col-span-4 space-y-6">
          {/* A. EPISODE LIST */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-muted/40 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                <List className="w-4 h-4 text-primary" /> Daftar Episode
              </h3>
              <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">
                {displayEpisodeList.length} Episode
              </span>
            </div>

            <div className="p-3 max-h-[350px] overflow-y-auto custom-scrollbar bg-card">
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {displayEpisodeList.toReversed().map((ep) => {
                  const isCurrent = ep.episodeId === episodeSlug;
                  return (
                    <Link
                      key={ep.episodeId}
                      href={`/watch/${slug}/${ep.episodeId}`}
                      className={cn(
                        "group relative flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold transition-all duration-200",
                        isCurrent
                          ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 hover:shadow-sm",
                      )}
                    >
                      <span className="z-10 relative">{ep.eps}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* B. INFO CREDITS */}
          {episode.info && (
            <div className="bg-card rounded-xl border border-border shadow-sm p-4 text-xs space-y-3">
              <h4 className="font-bold text-foreground border-b border-border pb-2 mb-2">
                Informasi File
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="w-3 h-3" /> Credit
                  </span>
                  <span className="text-foreground font-medium truncate max-w-[150px]">
                    {episode.info.credit || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Video className="w-3 h-3" /> Encoder
                  </span>
                  <span className="text-foreground font-medium truncate max-w-[150px]">
                    {episode.info.encoder || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Durasi
                  </span>
                  <span className="text-foreground font-medium">
                    {episode.info.duration || "-"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* C. DOWNLOAD SECTION (Improved UI) */}
          {(Object.keys(groupedDownloads).length > 0 || batchData) && (
            <div className="space-y-4">
              {Object.keys(groupedDownloads).length > 0 && (
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="p-4 bg-muted/40 border-b border-border flex items-center gap-2">
                    <Download className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-sm text-foreground">
                      Download Episode
                    </h3>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(groupedDownloads).map(
                      ([format, qualities]) => (
                        <AccordionItem
                          key={format}
                          value={format}
                          className="border-border px-0"
                        >
                          <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 hover:no-underline text-sm font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              {format === "MP4" ? (
                                <FileVideo className="w-4 h-4 text-blue-500" />
                              ) : (
                                <Film className="w-4 h-4 text-purple-500" />
                              )}
                              <span>{format}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 pt-1 bg-muted/20 space-y-2">
                            {qualities.map((item) => {
                              const { res } = parseDownloadTitle(item.title);
                              return (
                                <div
                                  key={item.title}
                                  className="bg-card border border-border rounded-lg p-3 shadow-sm hover:border-primary/20 transition-colors"
                                >
                                  {/* Header Item: Resolution & Size */}
                                  <div className="flex justify-between items-center mb-3">
                                    <Badge
                                      variant="outline"
                                      className="bg-primary/10 text-primary border-primary/20 font-bold"
                                    >
                                      {res}
                                    </Badge>
                                    <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                                      <HardDrive className="w-3 h-3" />
                                      {item.size}
                                    </span>
                                  </div>

                                  {/* Grid Links */}
                                  <div className="grid grid-cols-3 gap-2">
                                    {item.urls.map((link) => (
                                      <a
                                        key={link.title}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center h-7 px-2 text-[10px] font-medium text-muted-foreground bg-muted/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-border rounded transition-all truncate"
                                      >
                                        {link.title}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </AccordionContent>
                        </AccordionItem>
                      ),
                    )}
                  </Accordion>
                </div>
              )}

              {batchData && <BatchDownload batchData={batchData} />}
            </div>
          )}
        </div>
      </div>

      {/* 4. Comments */}
      <div className="mt-8 pt-8 border-t border-border">
        <CommentSection identifier={episodeSlug} page_url={`/watch/${slug}/${episodeSlug}`}/>
      </div>
    </div>
  );
}
