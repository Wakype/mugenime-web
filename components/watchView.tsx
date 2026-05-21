"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  AnimeDetail,
  EpisodeDetail,
  BatchResponse,
  DownloadQuality,
} from "@/lib/types";
import { useStore } from "@/lib/store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import CommentSection from "./commentSection";
import VideoPlayer from "./watch/videoPlayer";
import PlayerControls from "./watch/playerControls";
import ServerTabs from "./watch/serverTabs";
import AnimeInfoCard from "./watch/animeInfoCard";
import EpisodeSidebar from "./watch/episodeSidebar";
import DownloadAccordion from "./watch/downloadAccordion";

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
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const activeRequestRef = useRef<string>("");
  const isInvalid = !episode?.defaultStreamingUrl;

  const { addToHistory } = useStore();
  const supabase = createClient();

  let parentAnimeSlug = slug;
  if (!parentAnimeSlug && episode.animeId) {
    parentAnimeSlug = episode.animeId.replace("-sub-indo", "");
  }

  // --- SAVE HISTORY LOGIC ---
  const handleSaveHistory = useCallback(async () => {
    if (isInvalid || !animeDetail) return;

    const historyPayload = {
      anime_slug: parentAnimeSlug,
      anime_title: animeDetail.title,
      episode_slug: episodeSlug,
      episode_title: episode.title,
      poster: animeDetail.poster || "",
    };

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await supabase.from("watch_history").upsert(
          {
            user_id: session.user.id,
            ...historyPayload,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id, anime_slug, episode_slug" },
        );
      } else {
        addToHistory({ ...historyPayload, updated_at: Date.now() });
      }
    } catch (error) {
      console.error("Error saving watch history, falling back to local storage:", error);
      addToHistory({ ...historyPayload, updated_at: Date.now() });
    }
  }, [
    isInvalid,
    animeDetail,
    parentAnimeSlug,
    episodeSlug,
    episode.title,
    supabase.auth,
    addToHistory,
  ]);

  // Trigger history save after 10 seconds of staying
  useEffect(() => {
    if (isInvalid) return;
    const timer = setTimeout(() => handleSaveHistory(), 10000);
    return () => clearTimeout(timer);
  }, [episodeSlug, isInvalid, handleSaveHistory]);

  // Toggle Theater Mode Helper (also scrolls slightly to focus player)
  const toggleTheaterMode = useCallback(() => {
    setIsTheaterMode((prev) => !prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Keyboard shortcut listener for "T" key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      )
        return;

      if (e.key.toLowerCase() === "t") {
        e.preventDefault();
        toggleTheaterMode();
      }
    };
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheaterMode]);

  // Normalize and group download links
  const groupedDownloads = useMemo(() => {
    if (!episode.downloadUrl) return {};
    const allQualities = episode.downloadUrl.formats
      ? episode.downloadUrl.formats.flatMap((group) => group.qualities)
      : episode.downloadUrl.qualities || [];

    const groups: Record<string, DownloadQuality[]> = {};
    allQualities.forEach((item) => {
      const match = new RegExp(/^(mp4|mkv)[\s_]+(\d+p)$/i).exec(item.title);
      const format = match
        ? match[1].toUpperCase()
        : item.title.toLowerCase().includes("mkv")
          ? "MKV"
          : "MP4";

      if (!groups[format]) groups[format] = [];
      groups[format].push(item);
    });
    return groups;
  }, [episode.downloadUrl]);

  // Reset states on episode change
  useEffect(() => {
    if (isInvalid) return;
    setCurrentVideoUrl(episode.defaultStreamingUrl);
    setSelectedServerId(null);
    setIsLoadingVideo(false);
    activeRequestRef.current = "";
  }, [episode, episodeSlug, isInvalid, animeDetail, slug]);

  // Handle Fetching Server Video URL
  const handleServerChange = async (urlId: string) => {
    if (urlId === selectedServerId) return;
    setIsLoadingVideo(true);
    setSelectedServerId(urlId);
    activeRequestRef.current = urlId;

    try {
      const res = await fetch(`/api/server?id=${encodeURIComponent(urlId)}`);
      const data = await res.json();
      if (activeRequestRef.current !== urlId) return;
      if (data.url) setCurrentVideoUrl(data.url);
    } catch (error) {
      if (activeRequestRef.current === urlId) console.error(error);
    } finally {
      if (activeRequestRef.current === urlId) setIsLoadingVideo(false);
    }
  };

  if (isInvalid) return null;

  const displayEpisodeList = episode.info?.episodeList?.length
    ? episode.info.episodeList
    : animeDetail?.episodeList || [];

  const epNumberMatch = new RegExp(/Episode\s+(\d+)/i).exec(episode.title);
  const epNumber = epNumberMatch ? epNumberMatch[1] : "Playing";

  return (
    <div
      className={cn(
        "min-h-screen pb-20 transition-colors duration-500",
        isTheaterMode ? "bg-background pt-0" : "bg-background pt-6",
      )}
    >
      {/* Breadcrumb Navigation */}
      <div
        className={cn(
          "mb-6 transition-all duration-300",
          isTheaterMode
            ? "container mx-auto px-4 pt-4 opacity-50 hover:opacity-100"
            : "container mx-auto px-4",
        )}
      >
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
              <BreadcrumbPage className="font-semibold text-primary">
                Episode {epNumber}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-y-6 transition-all duration-500",
          isTheaterMode
            ? "w-full lg:grid-cols-12"
            : "container mx-auto px-4 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-8",
        )}
      >
        {/* ==================== VIDEO PLAYER ==================== */}
        <div
          className={cn(
            "relative transition-all duration-500 w-full bg-black z-20 flex justify-center",
            isTheaterMode
              ? "lg:col-start-1 lg:col-span-12 lg:row-start-1 py-4 md:py-8 shadow-2xl border-b border-white/5 bg-black/95"
              : "lg:col-start-1 lg:col-span-8 lg:row-start-1 aspect-video rounded-2xl overflow-hidden shadow-xl border border-border/50",
          )}
        >
          <VideoPlayer
            currentUrl={currentVideoUrl}
            isLoading={isLoadingVideo}
            title={episode.title}
            isTheaterMode={isTheaterMode}
          />
        </div>

        {/* ==================== LEFT CONTENT ==================== */}
        <div
          className={cn(
            "flex flex-col gap-6 transition-all duration-500",
            isTheaterMode
              ? "lg:col-start-1 lg:col-span-8 lg:row-start-2 px-4 lg:pl-12 xl:pl-20 2xl:pl-32 lg:pr-4"
              : "lg:col-start-1 lg:col-span-8 lg:row-start-2",
          )}
        >
          <PlayerControls
            episode={episode}
            epNumber={epNumber}
            slug={slug}
            isTheaterMode={isTheaterMode}
            toggleTheaterMode={toggleTheaterMode}
          />
          <ServerTabs
            episode={episode}
            currentUrl={currentVideoUrl}
            selectedServerId={selectedServerId}
            isLoading={isLoadingVideo}
            onServerChange={handleServerChange}
          />
          {animeDetail && (
            <AnimeInfoCard
              animeDetail={animeDetail}
              parentSlug={parentAnimeSlug}
            />
          )}
        </div>

        {/* ==================== RIGHT CONTENT (SIDEBAR) ==================== */}
        <div
          className={cn(
            "flex flex-col gap-6 transition-all duration-500",
            isTheaterMode
              ? "lg:col-start-9 lg:col-span-4 lg:row-start-2 px-4 lg:pr-12 xl:pr-20 2xl:pr-32 lg:pl-4"
              : "lg:col-start-9 lg:col-span-4 lg:row-start-1 lg:row-span-2",
          )}
        >
          <EpisodeSidebar
            episodeList={displayEpisodeList}
            currentSlug={episodeSlug}
            parentSlug={slug}
          />
          <DownloadAccordion
            episodeInfo={episode.info}
            groupedDownloads={groupedDownloads}
            batchData={batchData}
            onDownloadClick={handleSaveHistory}
          />
        </div>
      </div>

      {/* ==================== 4. COMMENTS ==================== */}
      <div className="container mx-auto px-4 mt-12 relative">
        <CommentSection
          identifier={episodeSlug}
          page_url={`/watch/${slug}/${episodeSlug}`}
        />
      </div>
    </div>
  );
}
