/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Menu,
  Home,
  Calendar,
  Zap,
  CheckCircle,
  List,
  Tags,
  Bookmark,
  History,
  Sun,
  Moon,
  Package2
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import SearchInput from "./searchInput";
import Image from "next/image";
import { motion } from "motion/react";
import { ModeToggle } from "./modeToggle";

const navLinks = [
  { name: "Beranda", href: "/", icon: Home },
  { name: "Jadwal", href: "/jadwal-anime", icon: Calendar },
  { name: "Ongoing", href: "/ongoing-anime", icon: Zap },
  { name: "Completed", href: "/completed-anime", icon: CheckCircle },
  { name: "Batch", href: "/batch-anime", icon: Package2 },
  { name: "Genre", href: "/genre-anime", icon: Tags },
  { name: "List (A-Z)", href: "/list-anime", icon: List },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const pathname = usePathname();

  // Logic Theme
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // --- FUNGSI ANIMASI TRANSISI TEMA (LINGKARAN) ---
  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";

    if (
      !(document as any).startViewTransition ||
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(newTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = (document as any).startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  const getMobileItemClass = (path: string) =>
    cn(
      "flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group",
      pathname === path
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
    );

  const getMobileIconContainerClass = (path: string) =>
    cn(
      "p-2 rounded-lg transition-colors",
      pathname === path
        ? "bg-primary/20"
        : "bg-secondary group-hover:bg-background shadow-xs",
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b",
        "bg-background/80 backdrop-blur-xl border-border shadow-sm",
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* --- LOGO SECTION --- */}
        <Link
          href="/"
          className="flex items-center gap-2 group shrink-0 relative z-50"
        >
          <div className="relative h-9 md:h-10 w-auto aspect-1142/249 transition-transform duration-300 group-hover:-rotate-2">
            <Image
              src="/assets/logo.png"
              alt="Mugenime Logo"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 120px, 160px"
            />
          </div>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav
          className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-md"
          onMouseLeave={() => setHoveredPath(null)}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const showPill =
              hoveredPath === link.href || (isActive && hoveredPath === null);

            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredPath(link.href)}
                className={cn(
                  "relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200",
                  "z-10",
                )}
              >
                {showPill && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                <span
                  className={cn(
                    "relative z-20 transition-colors duration-200",
                    showPill
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* --- ACTIONS --- */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Search Input */}
          <div className="hidden md:block w-full max-w-[200px] lg:max-w-[260px] transition-all focus-within:max-w-[300px]">
            <SearchInput />
          </div>

          {/* DESKTOP ACTION BUTTONS CONTAINER */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-md">
            <TooltipProvider delayDuration={100}>
              {/* History Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-8 h-8 text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                  >
                    <Link href="/history" aria-label="Riwayat Tontonan">
                      <History className="w-4 h-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-medium">
                  <p>Riwayat Tontonan</p>
                </TooltipContent>
              </Tooltip>

              {/* Bookmark Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-8 h-8 text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                  >
                    <Link href="/bookmark" aria-label="Lihat Bookmark">
                      <Bookmark className="w-4 h-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-medium">
                  <p>Bookmark Saya</p>
                </TooltipContent>
              </Tooltip>

              {/* Theme Toggle Desktop */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    tabIndex={0}
                    className="rounded-full cursor-pointer outline-none"
                  >
                    <ModeToggle className="w-8 h-8 rounded-full hover:bg-background hover:text-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-medium">
                  <p>Ganti Tema</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* MOBILE MENU TRIGGER */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full hover:bg-secondary"
              >
                <Menu className="w-6 h-6 text-foreground" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[85vw] sm:w-[380px] p-0 border-l-border bg-background"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <SheetHeader className="p-6 border-b border-border text-left">
                <div className="relative h-8 w-32">
                  <Image
                    src="/assets/logo.png"
                    alt="Mugenime Logo"
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col h-full overflow-y-auto">
                <div className="p-6 pb-2 space-y-4">
                  {/* SEARCH SECTION */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Pencarian
                    </h4>
                    <SearchInput onSearchSubmit={() => setIsOpen(false)} />
                  </div>

                  {/* THEME TOGGLE BUTTON (MOBILE) */}
                  <button
                    onClick={handleThemeToggle}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/50 hover:bg-secondary/70 active:scale-[0.98] transition-all duration-200 text-left group overflow-hidden relative"
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="p-2.5 bg-background rounded-lg shadow-sm text-primary group-hover:text-primary transition-colors border border-border/50">
                        {mounted ? (
                          resolvedTheme === "dark" ? (
                            <Moon className="w-4.5 h-4.5" />
                          ) : (
                            <Sun className="w-4.5 h-4.5" />
                          )
                        ) : (
                          <div className="w-4.5 h-4.5 bg-muted rounded-full" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">
                          Tampilan Aplikasi
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {mounted
                            ? resolvedTheme === "dark"
                              ? "Mode Gelap"
                              : "Mode Terang"
                            : "Memuat tema..."}
                        </span>
                      </div>
                    </div>
                    {/* Indikator Status (Dot) */}
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mr-1 relative z-10",
                        mounted
                          ? resolvedTheme === "dark"
                            ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                            : "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                          : "bg-muted",
                      )}
                    />
                  </button>
                </div>

                <div className="p-6 pt-2 space-y-1">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Menu Utama
                  </h4>

                  {/* Nav Links */}
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={getMobileItemClass(link.href)}
                      >
                        <div className={getMobileIconContainerClass(link.href)}>
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        {link.name}
                      </Link>
                    );
                  })}

                  <div className="my-2 border-t border-border/50" />

                  {/* History Item */}
                  <Link
                    href="/history"
                    onClick={() => setIsOpen(false)}
                    className={getMobileItemClass("/history")}
                  >
                    <div className={getMobileIconContainerClass("/history")}>
                      <History className="w-4.5 h-4.5" />
                    </div>
                    Riwayat Tontonan
                  </Link>

                  {/* Bookmark Item */}
                  <Link
                    href="/bookmark"
                    onClick={() => setIsOpen(false)}
                    className={getMobileItemClass("/bookmark")}
                  >
                    <div className={getMobileIconContainerClass("/bookmark")}>
                      <Bookmark className="w-4.5 h-4.5" />
                    </div>
                    Bookmark Saya
                  </Link>
                </div>

                {/* Footer */}
                <div className="mt-auto p-6 border-t border-border text-center">
                  <p className="text-[10px] text-muted-foreground">
                    &copy; {new Date().getFullYear()} Mugenime.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
