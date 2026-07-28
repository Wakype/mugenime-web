"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ListOrdered, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReadChapter } from "@/lib/komikTypes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ReaderNavProps {
  slug: string;
  chapterIndex: number;
  prevChapterId: number | null;
  nextChapterId: number | null;
  chapterList: ReadChapter[];
}

export default function ReaderNav({
  slug,
  chapterIndex,
  prevChapterId,
  nextChapterId,
  chapterList,
}: Readonly<ReaderNavProps>) {
  const router = useRouter();

  // Find prev/next chapter with fallback calculation
  const ascChapters = [...chapterList].sort(
    (a, b) => a.chapterIndex - b.chapterIndex,
  );
  const currentIdx = ascChapters.findIndex(
    (c) => c.chapterIndex === chapterIndex,
  );

  let prevChapter = currentIdx > 0 ? ascChapters[currentIdx - 1] : null;
  let nextChapter =
    currentIdx !== -1 && currentIdx < ascChapters.length - 1
      ? ascChapters[currentIdx + 1]
      : null;

  const apiPrev = chapterList.find(
    (c) => c.id === prevChapterId || c.chapterIndex === prevChapterId,
  );
  const apiNext = chapterList.find(
    (c) => c.id === nextChapterId || c.chapterIndex === nextChapterId,
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChapterIndex = e.target.value;
    if (selectedChapterIndex) {
      router.push(`/komik/${slug}/chapter-${selectedChapterIndex}`);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-2.5 p-3.5 bg-card border border-border rounded-2xl shadow-sm">
      {/* Prev Button */}
      {prevHref ? (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="shrink-0 rounded-xl font-bold h-10 px-3 sm:px-4 cursor-pointer hover:bg-secondary"
        >
          <Link href={prevHref} prefetch={false} title="Chapter Sebelumnya">
            <ChevronLeft className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </Link>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 rounded-xl font-bold h-10 px-3 sm:px-4 opacity-50 cursor-not-allowed"
          disabled
        >
          <ChevronLeft className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </Button>
      )}

      {/* Middle: Info Button, Chapter Sheet Trigger & Select Dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-center max-w-lg">
        {/* Info Komik Button */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl font-bold shrink-0 cursor-pointer h-10 px-3 border border-border/60 hover:bg-secondary"
        >
          <Link href={`/komik/${slug}`} prefetch={false} title="Info Komik">
            <Info className="w-4 h-4 sm:mr-1.5 text-primary" />
            <span className="hidden sm:inline">Info Komik</span>
          </Link>
        </Button>

        {/* Chapter List Sheet Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl font-bold shrink-0 cursor-pointer h-10 px-3 transition-colors border border-border/50 hover:bg-secondary/80"
            >
              <ListOrdered className="w-4 h-4 sm:mr-1.5 text-primary" />
              <span className="hidden sm:inline">Daftar Chapter</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="rounded-t-3xl border-t-border bg-background max-h-[85vh] flex flex-col"
          >
            <SheetHeader className="shrink-0">
              <SheetTitle className="text-center font-bold">
                Daftar Chapter
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto custom-scrollbar mb-10 container mx-auto px-4 pt-4">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {displayChapters.map((ch) => {
                  const isCurrent = ch.chapterIndex === chapterIndex;
                  return (
                    <Link
                      key={ch.id}
                      href={`/komik/${slug}/chapter-${ch.chapterIndex}`}
                      prefetch={false}
                      className={cn(
                        "flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all",
                        isCurrent
                          ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "bg-secondary/40 border-border hover:border-primary/50 text-foreground hover:bg-secondary",
                      )}
                    >
                      <span>Ch. {ch.chapterIndex}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Select Dropdown */}
        <div className="flex-1 max-w-[180px]">
          <select
            className="w-full h-10 px-3 bg-secondary/60 border border-border rounded-xl text-xs sm:text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer truncate"
            value={chapterIndex}
            onChange={handleSelectChange}
          >
            {displayChapters.map((ch) => (
              <option key={ch.id} value={ch.chapterIndex}>
                Chapter {ch.chapterIndex}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Next Button */}
      {nextHref ? (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="shrink-0 rounded-xl font-bold h-10 px-3 sm:px-4 cursor-pointer hover:bg-secondary"
        >
          <Link href={nextHref} prefetch={false} title="Chapter Selanjutnya">
            <span className="hidden sm:inline">Selanjutnya</span>
            <ChevronRight className="w-4 h-4 sm:ml-1" />
          </Link>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 rounded-xl font-bold h-10 px-3 sm:px-4 opacity-50 cursor-not-allowed"
          disabled
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="w-4 h-4 sm:ml-1" />
        </Button>
      )}
    </div>
  );
}
