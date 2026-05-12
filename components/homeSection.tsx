"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, PlayCircle, TrendingUp, Star } from "lucide-react";
import { Anime } from "@/lib/types";

// --- HERO SECTION COMPONENT ---
export function HeroSection({
  heroAnime,
  poster,
}: Readonly<{
  heroAnime: Anime;
  poster: string;
}>) {
  if (!heroAnime) return null;

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 50 },
    },
  };

  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background Layer */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1.05 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={poster}
          alt="Hero Background"
          fill
          className="object-cover opacity-30 dark:opacity-20 blur-sm"
          priority
          unoptimized
          referrerPolicy="no-referrer"
        />
        {/* Gradient Overlay menyesuaikan 'bg-background' */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/0 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-background/70 via-transparent to-transparent" />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[40px_40px] text-muted-foreground/10 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-transparent" />
      </motion.div>

      {/* Hero Content */}
      <div className="container relative z-10 px-4 pt-20 pb-10 grid lg:grid-cols-12 gap-8 items-center">
        {/* Left: Text Info */}
        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 space-y-6 lg:space-y-8"
        >
          {/* Badges */}
          <motion.div
            variants={itemVars}
            className="flex flex-wrap items-center gap-3"
          >
            {/* Semantic Badge: Primary */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-primary/20">
              <TrendingUp className="w-3.5 h-3.5" />
              On Going
            </div>
            {/* Semantic Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-current" />
              Episode Terbaru
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVars}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-primary leading-[1.1] tracking-tight"
          >
            {heroAnime.title}
          </motion.h1>

          {/* Meta Data */}
          <motion.div
            variants={itemVars}
            className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-foreground">{heroAnime.releaseDay}</span>
            </div>
            {heroAnime.episodes && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border backdrop-blur-sm">
                <PlayCircle className="w-4 h-4 text-primary" />
                <span className="text-foreground">
                  Episode {heroAnime.episodes}
                </span>
              </div>
            )}
            <div className="text-xs text-primary font-semibold bg-primary/5 px-2 py-1 rounded-md">
              Updated: {heroAnime.latestReleaseDate}
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={itemVars}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 transition-all text-base"
            >
              <Link href={`/anime/${heroAnime.animeId}`}>Tonton Sekarang</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-border bg-background/50 hover:bg-secondary text-foreground backdrop-blur-sm h-12 px-8 text-base transition-all"
            >
              <Link href="/jadwal-anime">Jadwal Rilis</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Right: Floating Poster (Levitating Effect) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="hidden lg:flex lg:col-span-5 justify-center items-center"
        >
          {/* Levitating Animation */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative group"
          >
            {/* Glow Effect using Primary Color */}
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-purple-600 rounded-2xl blur-3xl opacity-20 group-hover:opacity-40 transition duration-1000" />

            <div className="relative w-[350px] aspect-3/4 rounded-xl overflow-hidden shadow-2xl ring-1 ring-border rotate-3 group-hover:rotate-0 transition-transform duration-500 bg-card">
              <Image
                src={poster}
                alt={heroAnime.title}
                fill
                className="object-cover"
                sizes="350px"
                priority
                unoptimized
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 h-1/3 bg-linear-to-t from-black/90 to-transparent flex items-end p-6">
                <p className="text-white text-sm font-medium line-clamp-1 opacity-90">
                  {heroAnime.title}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// --- FADE IN WRAPPER ---
export function FadeInWrapper({
  children,
  delay = 0,
}: Readonly<{
  children: React.ReactNode;
  delay?: number;
}>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
