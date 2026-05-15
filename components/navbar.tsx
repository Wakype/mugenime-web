/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/client";
import {
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
  Package2,
  User as UserIcon,
  LogOut,
  Settings,
  LogIn,
  ShieldAlert,
  Tv,
  BookOpen,
  ChevronDown,
  Library,
  Flame,
  Compass,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import SearchInput from "./searchInput";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ModeToggle } from "./modeToggle";

const navLinks = [
  { name: "Beranda", href: "/", icon: Home },
  {
    name: "Anime",
    icon: Tv,
    accentLight: "violet",
    children: [
      {
        name: "Jadwal Rilis",
        href: "/jadwal-anime",
        icon: Calendar,
        description: "Lihat jadwal tayang anime favoritmu setiap minggunya.",
      },
      {
        name: "Ongoing",
        href: "/ongoing-anime",
        icon: Zap,
        description: "Daftar anime yang sedang tayang pada musim ini.",
      },
      {
        name: "Completed",
        href: "/completed-anime",
        icon: CheckCircle,
        description: "Kumpulan anime yang sudah tamat dan siap ditonton.",
      },
      {
        name: "Batch",
        href: "/batch-anime",
        icon: Package2,
        description: "Download anime per musim sekaligus dalam satu paket.",
      },
      {
        name: "Genre",
        href: "/genre-anime",
        icon: Tags,
        description: "Eksplorasi berbagai anime berdasarkan genre favoritmu.",
      },
      {
        name: "List (A-Z)",
        href: "/list-anime",
        icon: List,
        description: "Daftar lengkap semua judul anime sesuai abjad.",
      },
    ],
  },
  {
    name: "Komik",
    icon: BookOpen,
    accentLight: "rose",
    children: [
      {
        name: "Beranda Komik",
        href: "/komik",
        icon: Home,
        description: "Halaman utama komik.",
      },
      {
        name: "Update Terbaru",
        href: "/update-komik",
        icon: Zap,
        description: "Chapter komik terbaru yang rilis hari ini.",
      },
      {
        name: "Format Komik",
        href: "/format-komik",
        icon: Library,
        description: "Komik berdasarkan format (Manga, Manhwa, atau Manhua).",
      },
      {
        name: "Popular",
        href: "/popular-komik",
        icon: Flame,
        description: "Komik terpopuler yang sedang hangat dibaca saat ini.",
      },
      {
        name: "Explore",
        href: "/explore-komik",
        icon: Compass,
        description: "Fitur pencarian lanjutan (Advance Search).",
      },
      {
        name: "Genre",
        href: "/genre-komik",
        icon: Tags,
        description: "Jelajahi berbagai komik berdasarkan kategori genre.",
      },
    ],
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = useMemo(() => createClient(), []);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setMounted(true);
    const handleUserSession = async (sessionUser: any) => {
      if (!sessionUser) {
        if (isMounted) setUser(null);
        return;
      }
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name, avatar_url")
          .eq("id", sessionUser.id)
          .single();
        if (isMounted)
          setUser({
            ...sessionUser,
            role: profile?.role || "user",
            db_full_name:
              profile?.full_name || sessionUser.user_metadata?.full_name,
            db_avatar_url:
              profile?.avatar_url || sessionUser.user_metadata?.avatar_url,
          });
      } catch {
        if (isMounted)
          setUser({
            ...sessionUser,
            role: "user",
            db_full_name: sessionUser.user_metadata?.full_name,
            db_avatar_url: sessionUser.user_metadata?.avatar_url,
          });
      }
    };
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => handleUserSession(session?.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => handleUserSession(s?.user));
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLoginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${globalThis.location.origin}${globalThis.location.pathname}`,
      },
    });
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleNavMouseEnter = (name: string, hasChildren: boolean) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredItem(name);
    if (hasChildren) setActiveMega(name);
    else setActiveMega(null);
  };
  const handleNavMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
      setActiveMega(null);
    }, 150);
  };
  const handleMegaMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    if (
      !(document as any).startViewTransition ||
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(newTheme);
      return;
    }
    const { clientX: x, clientY: y } = e;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const transition = (document as any).startViewTransition(() =>
      setTheme(newTheme),
    );
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

  const isChildActive = (children: any[]) =>
    children?.some((c) => pathname === c.href) || false;
  const logoHref = pathname?.includes("komik") ? "/komik" : "/";
  const activeMegaLink = navLinks.find((l) => l.name === activeMega) as any;

  const getMobileItemClass = (path: string) =>
    cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
      pathname === path
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background border-b border-border/50 shadow-[0_2px_24px_rgba(0,0,0,0.07)]"
          : "bg-background border-b border-border/40",
      )}
      onMouseLeave={handleNavMouseLeave}
    >
      <div className="container mx-auto px-4 h-[65px] flex items-center justify-between gap-10">
        {/* Logo */}
        <Link
          href={logoHref}
          className="flex items-center gap-2 group shrink-0 relative z-50"
        >
          <div className="relative h-[35px] w-auto aspect-1142/249 group-hover:opacity-75 transition-opacity duration-200">
            <Image
              src="/assets/logo.png"
              alt="Mugenime Logo"
              fill
              className="object-contain"
              priority
              sizes="140px"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden lg:flex items-center gap-0.5 relative z-50"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const isDirectActive = link.href && pathname === link.href;
            const isParentActive = link.children
              ? isChildActive(link.children)
              : false;
            const isActive = isDirectActive || isParentActive;
            const isHovered = hoveredItem === link.name;
            const isMegaOpen = activeMega === link.name;
            const hasChildren = Boolean(link.children);
            const showHighlight = isHovered || isActive;

            return (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => handleNavMouseEnter(link.name, hasChildren)}
              >
                {hasChildren ? (
                  <button
                    className={cn(
                      "relative px-3.5 py-1.5 text-sm rounded-lg flex items-center gap-1.5 transition-colors duration-150 outline-none cursor-pointer font-medium",
                      showHighlight
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {showHighlight && (
                      <motion.div
                        layoutId="nav-highlight"
                        className="absolute inset-0 bg-muted rounded-lg -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                    <link.icon
                      className={cn(
                        "w-3.5 h-3.5 shrink-0",
                        isActive && "text-primary",
                      )}
                    />
                    {link.name}
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 opacity-40 transition-transform duration-200",
                        isMegaOpen && "rotate-180 opacity-80",
                      )}
                    />
                    {isActive && !isMegaOpen && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    href={link.href!}
                    className={cn(
                      "relative px-3.5 py-1.5 text-sm rounded-lg flex items-center gap-1.5 transition-colors duration-150 font-medium",
                      showHighlight
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {showHighlight && (
                      <motion.div
                        layoutId="nav-highlight"
                        className="absolute inset-0 bg-muted rounded-lg -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                    <link.icon
                      className={cn(
                        "w-3.5 h-3.5 shrink-0",
                        isActive && "text-primary",
                      )}
                    />
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      />
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 flex-1 justify-end relative z-50">
          {/* Search */}
          <div className="hidden md:block w-full max-w-[220px] lg:max-w-[300px] transition-all duration-300 focus-within:max-w-[340px]">
            <SearchInput />
          </div>

          <TooltipProvider delayDuration={100}>
            <div className="hidden md:flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                  >
                    <Link href="/history">
                      <History className="w-4 h-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Riwayat Tontonan
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                  >
                    <Link href="/bookmark">
                      <Bookmark className="w-4 h-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Bookmark Saya
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    tabIndex={0}
                    className="rounded-lg cursor-pointer outline-none"
                  >
                    <ModeToggle className="w-8 h-8 rounded-lg hover:bg-muted hover:text-foreground cursor-pointer" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Ganti Tema
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="hidden md:block w-px h-5 bg-border/50 mx-1" />

            {/* User */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-border/50 bg-muted/30 hover:bg-muted hover:border-border transition-all duration-200 cursor-pointer group">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border/50 shrink-0">
                      {user.db_avatar_url ? (
                        <Image
                          src={user.db_avatar_url}
                          alt="Profile"
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="24px"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-foreground max-w-[80px] truncate">
                      {user.db_full_name?.split(" ")[0] || "Pengguna"}
                    </span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground/70 transition-transform group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 mt-2 rounded-xl border-border/60 shadow-xl"
                  sideOffset={6}
                >
                  <div className="flex items-center gap-2.5 p-3">
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-border shrink-0">
                      {user.db_avatar_url ? (
                        <Image
                          src={user.db_avatar_url}
                          alt="Profile"
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="36px"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {user.db_full_name || "Pengguna"}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer mx-1 rounded-lg"
                  >
                    <Link href="/profile" className="flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5" /> Pengaturan Profil
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === "admin" || user.role === "superadmin") && (
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer mx-1 rounded-lg"
                    >
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 text-primary focus:text-primary"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" /> Dashboard Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive mx-1 mb-1 rounded-lg"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-2" /> Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleLoginGoogle}
                size="sm"
                className="hidden md:flex h-8 rounded-full px-4 text-xs font-semibold gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" /> Masuk
              </Button>
            )}
          </TooltipProvider>

          {/* Mobile trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden w-9 h-9 rounded-lg hover:bg-muted cursor-pointer relative z-50"
              >
                <span className="flex flex-col gap-[5px] w-4">
                  <motion.span
                    animate={
                      isOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }
                    }
                    className="block w-full h-0.5 bg-foreground rounded-full origin-center"
                  />
                  <motion.span
                    animate={
                      isOpen ? { opacity: 0, x: -6 } : { opacity: 1, x: 0 }
                    }
                    className="block w-full h-0.5 bg-foreground rounded-full"
                  />
                  <motion.span
                    animate={
                      isOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }
                    }
                    className="block w-full h-0.5 bg-foreground rounded-full origin-center"
                  />
                </span>
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[88vw] sm:w-[360px] p-0 border-l border-border/50 bg-background flex flex-col"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>

              <SheetHeader className="flex-row items-center px-5 py-4 border-b border-border/40 shrink-0">
                <div className="relative h-7 w-28">
                  <Image
                    src="/assets/logo.png"
                    alt="Mugenime Logo"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto overscroll-contain">
                {/* User card */}
                <div className="px-4 pt-4 pb-3">
                  {user ? (
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-muted/50 border border-border/40">
                      <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-border/40 shrink-0">
                        {user.db_avatar_url ? (
                          <Image
                            src={user.db_avatar_url}
                            alt="Profile"
                            unoptimized
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">
                          {user.db_full_name || "Pengguna"}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleLoginGoogle();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" /> Masuk via Google
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="px-4 pb-3 border-b border-border/30">
                  <SearchInput onSearchSubmit={() => setIsOpen(false)} />
                </div>

                {/* Theme */}
                <div className="px-4 py-3 border-b border-border/30">
                  <button
                    onClick={handleThemeToggle}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-primary">
                        {mounted ? (
                          resolvedTheme === "dark" ? (
                            <Moon className="w-4 h-4" />
                          ) : (
                            <Sun className="w-4 h-4" />
                          )
                        ) : (
                          <div className="w-4 h-4 rounded bg-muted-foreground/20" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-tight">
                          Tampilan
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {mounted
                            ? resolvedTheme === "dark"
                              ? "Mode Gelap"
                              : "Mode Terang"
                            : "Memuat..."}
                        </p>
                      </div>
                    </div>
                    {/* Toggle pill */}
                    <div
                      className={cn(
                        "w-9 h-5 rounded-full relative transition-colors border",
                        mounted && resolvedTheme === "dark"
                          ? "bg-primary border-primary/40"
                          : "bg-muted border-border/60",
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-4 h-4 rounded-full bg-background shadow-sm transition-all duration-200",
                          mounted && resolvedTheme === "dark"
                            ? "translate-x-4"
                            : "translate-x-0.5",
                        )}
                      />
                    </div>
                  </button>
                </div>

                {/* Nav links */}
                <div className="px-4 py-4 space-y-5">
                  {navLinks.map((link) => (
                    <div key={link.name}>
                      {link.children ? (
                        <>
                          <div className="flex items-center gap-1.5 mb-2 px-1">
                            <link.icon className="w-3 h-3 text-muted-foreground/50" />
                            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                              {link.name}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {link.children.map((child) => {
                              const ChildIcon = child.icon;
                              const isActive = pathname === child.href;
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setIsOpen(false)}
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border",
                                    isActive
                                      ? "bg-primary/10 text-primary border-primary/20"
                                      : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent",
                                  )}
                                >
                                  <ChildIcon className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate">{child.name}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={getMobileItemClass(link.href)}
                        >
                          <link.icon className="w-4 h-4 shrink-0" />
                          {link.name}
                        </Link>
                      )}
                    </div>
                  ))}

                  {/* Aktivitas */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 px-1">
                      <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                        Aktivitas
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <Link
                        href="/history"
                        onClick={() => setIsOpen(false)}
                        className={getMobileItemClass("/history")}
                      >
                        <History className="w-4 h-4 shrink-0" /> Riwayat
                        Tontonan
                      </Link>
                      <Link
                        href="/bookmark"
                        onClick={() => setIsOpen(false)}
                        className={getMobileItemClass("/bookmark")}
                      >
                        <Bookmark className="w-4 h-4 shrink-0" /> Bookmark Saya
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-4 border-t border-border/40 shrink-0">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-destructive/8 text-destructive border border-destructive/15 text-sm font-semibold hover:bg-destructive/15 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Keluar Akun
                  </button>
                ) : (
                  <p className="text-[10px] text-muted-foreground/40 text-center">
                    &copy; {new Date().getFullYear()} Mugenime.
                  </p>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mega Menu */}
      <AnimatePresence>
        {activeMega && activeMegaLink?.children && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={handleMegaMouseEnter}
            onMouseLeave={handleNavMouseLeave}
            className="hidden lg:block absolute top-full left-0 w-full z-40 bg-background border-b border-border/50 shadow-[0_12px_40px_rgba(0,0,0,0.07)]"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex gap-10">
                {/* Sidebar label */}
                <div className="w-40 shrink-0 flex flex-col gap-3 py-0.5">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider w-fit bg-primary/10 text-primary dark:text-primary",
                    )}
                  >
                    <activeMegaLink.icon className="w-3.5 h-3.5" />
                    {activeMegaLink.name}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {activeMegaLink.accentLight === "violet"
                      ? "Nonton anime dari berbagai kategori."
                      : "Baca manga, manhwa, dan manhua favoritmu."}
                  </p>
                  <p className="text-[10px] text-muted-foreground/40 font-medium mt-auto">
                    {activeMegaLink.children.length} halaman tersedia
                  </p>
                </div>

                {/* Grid */}
                <div className="flex-1 grid grid-cols-3 gap-1.5">
                  {activeMegaLink.children.map((child: any, i: number) => {
                    const ChildIcon = child.icon;
                    const isActive = pathname === child.href;
                    return (
                      <motion.div
                        key={child.href}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: i * 0.035,
                          duration: 0.18,
                          ease: "easeOut",
                        }}
                      >
                        <Link
                          href={child.href}
                          onClick={() => setActiveMega(null)}
                          className={cn(
                            "group flex items-center gap-3 p-3 rounded-xl border transition-all duration-150",
                            isActive
                              ? "bg-primary/8 border-primary/20"
                              : "bg-transparent border-transparent hover:bg-muted hover:border-border/50",
                          )}
                        >
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                              isActive
                                ? "bg-primary text-primary-foreground border-primary/50"
                                : "bg-muted text-muted-foreground border-border/40 group-hover:text-primary group-hover:border-primary/20 group-hover:bg-background",
                            )}
                          >
                            <ChildIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p
                              className={cn(
                                "text-sm font-semibold leading-tight mb-0.5 transition-colors truncate",
                                isActive
                                  ? "text-primary"
                                  : "text-foreground group-hover:text-primary",
                              )}
                            >
                              {child.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground line-clamp-1 leading-snug">
                              {child.description}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
