"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroKomik } from "@/lib/komikTypes";
import { getFormatWithFlag, cn } from "@/lib/utils";

export default function KomikHero({
  heroes,
}: {
  readonly heroes: HeroKomik[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
    Fade(),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  // Update selected index for pagination dots
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!heroes || heroes.length === 0) return null;

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] group bg-background">
      {/* Embla Viewport */}
      <div
        className="overflow-hidden w-full h-full absolute inset-0"
        ref={emblaRef}
      >
        <div className="flex h-full touch-pan-y">
          {heroes.map((hero, index) => {
            const isValidBg = hero.backgroundImage?.startsWith("http");

            return (
              <div
                key={hero.slug + index}
                className="relative flex-[0_0_100%] min-w-0 h-full flex items-end pb-16 md:pb-20 pt-32"
              >
                {/* Background Image Banner */}
                {isValidBg && (
                  <Image
                    src={hero.backgroundImage}
                    alt={hero.title}
                    fill
                    priority={index === 0}
                    unoptimized
                    referrerPolicy="no-referrer"
                    className="object-cover object-top opacity-50 md:opacity-70"
                    sizes="100vw"
                  />
                )}

                {/* Gradient Overlays for Text Readability */}
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-r from-background via-background/50 to-transparent" />

                {/* Content */}
                <div className="container mx-auto relative z-10 w-full px-4">
                  <div className="max-w-3xl space-y-4">
                    <div className="flex gap-2 items-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-primary/20">
                        {getFormatWithFlag(hero.format)}
                      </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-primary tracking-tight leading-tight line-clamp-2 md:line-clamp-3">
                      {hero.title}
                    </h1>

                    <p className="text-muted-foreground text-sm md:text-base font-medium max-w-xl line-clamp-1">
                      Author: {hero.author || "Unknown"}
                    </p>

                    <div className="pt-4 flex flex-wrap gap-3">
                      <Button
                        asChild
                        size="lg"
                        className="rounded-full px-8 font-bold border-0"
                      >
                        <Link href={`/komik/${hero.slug}`}>Mulai Membaca</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows (Hidden on Mobile, Shows on hover on Desktop) */}
      {heroes.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="hidden md:flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/20 hover:bg-background/50 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={scrollNext}
            className="hidden md:flex items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/20 hover:bg-background/50 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {heroes.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {heroes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer outline-none",
                selectedIndex === idx
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/50 hover:bg-muted-foreground",
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
