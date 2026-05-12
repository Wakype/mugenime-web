/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  ListOrdered,
  Play,
  Pause,
  Maximize,
  Minimize,
  Book,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReadChapterData } from "@/lib/komikTypes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ComicReaderProps {
  data: ReadChapterData;
  slug: string;
}

interface ReaderSettings {
  fitToScreen: boolean;
  imageWidth: number; // percentage (20 to 100)
  autoScrollSpeed: number; // 1 to 10
}

export default function ComicReader({
  data,
  slug,
}: Readonly<ComicReaderProps>) {
  const router = useRouter();
  const readerRef = useRef<HTMLDivElement>(null);

  // --- STATE ---
  const [isUiVisible, setIsUiVisible] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [settings, setSettings] = useState<ReaderSettings>({
    fitToScreen: false,
    imageWidth: 80,
    autoScrollSpeed: 2,
  });

  // --- SET MOBILE DEFAULT WIDTH ---
  useEffect(() => {
    if (globalThis.window !== undefined && window.innerWidth < 800) {
      setSettings((prev) => ({ ...prev, fitToScreen: true }));
    }
  }, []);

  // --- PREV / NEXT CHAPTER LOGIC ---
  const ascChapters = [...data.chapterList].sort(
    (a, b) => a.chapterIndex - b.chapterIndex,
  );
  const currentIdx = ascChapters.findIndex(
    (c) => c.chapterIndex === data.chapterIndex,
  );

  let prevChapter = currentIdx > 0 ? ascChapters[currentIdx - 1] : null;
  let nextChapter =
    currentIdx !== -1 && currentIdx < ascChapters.length - 1
      ? ascChapters[currentIdx + 1]
      : null;

  const apiPrev = data.chapterList.find(
    (c) => c.id === data.prevChapterId || c.chapterIndex === data.prevChapterId,
  );
  const apiNext = data.chapterList.find(
    (c) => c.id === data.nextChapterId || c.chapterIndex === data.nextChapterId,
  );

  if (apiPrev) prevChapter = apiPrev;
  if (apiNext) nextChapter = apiNext;

  const prevHref = prevChapter
    ? `/komik/${slug}/chapter-${prevChapter.chapterIndex}`
    : null;
  const nextHref = nextChapter
    ? `/komik/${slug}/chapter-${nextChapter.chapterIndex}`
    : null;

  const displayChapters = [...ascChapters].reverse();

  // --- AUTO SCROLL TOGGLE HELPER ---
  const toggleAutoScroll = useCallback(() => {
    if (!isAutoScrolling) {
      setIsUiVisible(false); // Sembunyikan UI otomatis ketika Autoscroll dimulai
    }
    setIsAutoScrolling((prev) => !prev);
  }, [isAutoScrolling]);

  // --- AUTO SCROLL EXECUTION LOGIC ---
  useEffect(() => {
    let animationFrameId: number;

    const scroll = () => {
      if (isAutoScrolling) {
        window.scrollBy({ top: settings.autoScrollSpeed, behavior: "auto" });
        animationFrameId = requestAnimationFrame(scroll);
      }
    };

    if (isAutoScrolling) {
      animationFrameId = requestAnimationFrame(scroll);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoScrolling, settings.autoScrollSpeed]);

  // --- SCROLL HIDDEN LOGIC (FIXED) ---
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Jika auto-scroll aktif, jangan otomatis sembunyikan UI berdasarkan scroll (bypass behavior)
      if (isAutoScrolling) {
        lastScrollY = window.scrollY;
        return;
      }

      // Hide UI jika scroll manual ke bawah melewati 150px
      if (window.scrollY > lastScrollY && window.scrollY > 150) {
        if (isUiVisible) setIsUiVisible(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isUiVisible, isAutoScrolling]);

  // --- KEYBOARD SHORTCUTS ---
  const goToNextChapter = useCallback(() => {
    if (nextHref) router.push(nextHref);
  }, [nextHref, router]);

  const goToPrevChapter = useCallback(() => {
    if (prevHref) router.push(prevHref);
  }, [prevHref, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName))
        return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          window.scrollBy({ top: -100, behavior: "smooth" });
          break;
        case "ArrowDown":
          e.preventDefault();
          window.scrollBy({ top: 100, behavior: "smooth" });
          break;
        case "ArrowLeft":
          goToPrevChapter();
          break;
        case "ArrowRight":
          goToNextChapter();
          break;
        case " ":
          e.preventDefault();
          toggleAutoScroll();
          break;
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [goToNextChapter, goToPrevChapter, toggleAutoScroll]);

  // --- RENDER HELPERS ---
  const handleOverlayClick = () => {
    setIsUiVisible((prev) => !prev);
  };

  const updateSetting = (key: keyof ReaderSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const containerStyle = settings.fitToScreen
    ? { width: "100%" }
    : { width: `${settings.imageWidth}%`, maxWidth: "1000px" };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Clickable Overlay to toggle UI - Fixed for a11y */}
      <button
        type="button"
        aria-label="Toggle Navigation UI"
        className="fixed inset-0 z-20 w-full h-full cursor-pointer bg-transparent border-none outline-none appearance-none"
        onClick={handleOverlayClick}
      />

      {/* --- READER CONTENT (Long Strip Default) --- */}
      <div
        ref={readerRef}
        className="relative z-10 flex flex-col items-center justify-start min-h-screen"
      >
        <div
          className="flex flex-col items-center transition-all duration-300 mx-auto"
          style={containerStyle}
        >
          {data.images.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`Page ${index + 1}`}
              loading={index < 3 ? "eager" : "lazy"}
              referrerPolicy="no-referrer"
              className="w-full h-auto block m-0 p-0"
            />
          ))}
        </div>
      </div>

      {/* --- UNIFIED STICKY UI FLOATING DOCK --- */}
      <TooltipProvider delayDuration={300}>
        <div
          className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out w-[95%] max-w-4xl ${
            isUiVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-32 opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-background/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-2xl p-3 sm:p-4 flex flex-col gap-3">
            {/* Top Row: Title & Basic Info */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider line-clamp-2 mb-1">
                  {data.komikTitle}
                </span>
                <span className="text-sm font-bold text-primary">
                  Chapter {data.chapterIndex}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full cursor-pointer hover:bg-secondary"
                    >
                      <Link href="/komik">
                        <Home className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Beranda</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full cursor-pointer hover:bg-secondary"
                    >
                      <Link href={`/komik/${slug}`}>
                        <Book className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Detail Komik</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Bottom Row: Controls */}
            <div className="flex items-center justify-between gap-2">
              {/* Left: Chapters List */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="secondary"
                    className="rounded-xl font-bold shrink-0 cursor-pointer h-10 px-3 transition-colors"
                    disabled={isAutoScrolling}
                  >
                    <ListOrdered className="w-4 h-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">Chapter</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="rounded-t-3xl border-t-border bg-background max-h-[85vh] flex flex-col"
                >
                  <SheetHeader className="shrink-0">
                    <SheetTitle className="text-center">
                      Daftar Chapter
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto custom-scrollbar mb-10 container mx-auto px-5">
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                      {displayChapters.map((ch) => (
                        <Link
                          key={ch.id}
                          href={`/komik/${slug}/chapter-${ch.chapterIndex}`}
                          className={cn(
                            "px-2 py-3 rounded-xl flex justify-center items-center text-sm font-semibold transition-colors border",
                            ch.chapterIndex === data.chapterIndex
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50 text-foreground",
                          )}
                        >
                          {ch.chapterIndex}
                        </Link>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Center: Playback / Navigation Group */}
              <div className="flex items-center gap-1 bg-secondary/30 border border-border/40 p-1 rounded-xl shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild={!!prevHref}
                      disabled={!prevHref}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg cursor-pointer hover:bg-background/80"
                    >
                      {prevHref ? (
                        <Link href={prevHref}>
                          <ChevronLeft className="w-5 h-5" />
                        </Link>
                      ) : (
                        <button disabled>
                          <ChevronLeft className="w-5 h-5 opacity-50" />
                        </button>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Chapter Sebelumnya</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isAutoScrolling ? "default" : "secondary"}
                      size="icon"
                      className={cn(
                        "h-8 w-8 sm:h-9 sm:w-9 rounded-lg cursor-pointer transition-all duration-300",
                        isAutoScrolling &&
                          "bg-green-600 hover:bg-green-700 text-white shadow-md",
                      )}
                      onClick={toggleAutoScroll}
                    >
                      {isAutoScrolling ? (
                        <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isAutoScrolling
                      ? "Hentikan Autoscroll"
                      : "Mulai Autoscroll"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild={!!nextHref}
                      disabled={!nextHref}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg cursor-pointer hover:bg-background/80"
                    >
                      {nextHref ? (
                        <Link href={nextHref}>
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      ) : (
                        <button disabled>
                          <ChevronRight className="w-5 h-5 opacity-50" />
                        </button>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Chapter Selanjutnya</TooltipContent>
                </Tooltip>
              </div>

              {/* Right: Settings */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="secondary"
                    className="rounded-xl font-bold shrink-0 cursor-pointer h-10 px-3 transition-colors"
                    disabled={isAutoScrolling}
                  >
                    <Settings className="w-4 h-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">Pengaturan</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="rounded-t-3xl border-t-border bg-background max-h-[85vh] overflow-y-auto"
                >
                  <SheetHeader className="pb-4">
                    <SheetTitle className="text-center">Pengaturan</SheetTitle>
                  </SheetHeader>

                  <div className="space-y-6 pb-10 max-w-lg mx-auto">
                    {/* Shortcuts Hint */}
                    <div className="bg-secondary/50 rounded-xl p-3 text-xs text-muted-foreground flex flex-wrap justify-between gap-2 items-center">
                      <span>
                        <b>↑ / ↓</b> Scroll
                      </span>
                      <span>
                        <b>← / →</b> Ganti Chapter
                      </span>
                      <span>
                        <b>Spasi</b> Autoplay
                      </span>
                    </div>

                    {/* Fit to Screen */}
                    <div className="flex items-center justify-between bg-card border border-border p-3 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2">
                        {settings.fitToScreen ? (
                          <Maximize className="w-4 h-4 text-primary" />
                        ) : (
                          <Minimize className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm font-bold text-foreground">
                          Fit to Screen (Lebar)
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-primary cursor-pointer"
                        checked={settings.fitToScreen}
                        onChange={(e) =>
                          updateSetting("fitToScreen", e.target.checked)
                        }
                      />
                    </div>

                    {/* Image Width Slider */}
                    {!settings.fitToScreen && (
                      <div className="space-y-3 bg-card border border-border p-3 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-foreground">
                            Lebar Gambar (%)
                          </label>
                          <span className="text-sm font-bold text-primary">
                            {settings.imageWidth}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="100"
                          step="5"
                          value={settings.imageWidth}
                          onChange={(e) =>
                            updateSetting("imageWidth", Number(e.target.value))
                          }
                          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    )}

                    {/* Auto-Scroll Speed */}
                    <div className="space-y-3 bg-card border border-border p-3 rounded-xl shadow-sm">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-foreground">
                          Kecepatan Auto-Scroll
                        </label>
                        <span className="text-sm font-bold text-primary">
                          {settings.autoScrollSpeed}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={settings.autoScrollSpeed}
                        onChange={(e) =>
                          updateSetting(
                            "autoScrollSpeed",
                            Number(e.target.value),
                          )
                        }
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
