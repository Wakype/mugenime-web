"use client";
import Link from "next/link";
import {
  AlertTriangle,
  Zap,
  CheckCircle2,
  XCircle,
  Calendar,
  Package2,
  Tags,
  List,
  Home,
  Flame,
  Compass,
  Library,
  BookOpen,
  Tv,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const animeLinks = [
  { name: "Jadwal Rilis", href: "/jadwal-anime", icon: Calendar },
  { name: "Ongoing", href: "/ongoing-anime", icon: Zap },
  { name: "Completed", href: "/completed-anime", icon: CheckCircle2 },
  { name: "Batch", href: "/batch-anime", icon: Package2 },
  { name: "Genre", href: "/genre-anime", icon: Tags },
  { name: "List A–Z", href: "/list", icon: List },
];

const komikLinks = [
  { name: "Beranda Komik", href: "/komik", icon: Home, badge: true },
  { name: "Update Terbaru", href: "/update-komik", icon: Zap, badge: true },
  { name: "Format Komik", href: "/format-komik", icon: Library, badge: true },
  { name: "Popular", href: "/popular-komik", icon: Flame, badge: true },
  { name: "Explore", href: "/explore-komik", icon: Compass, badge: true },
  { name: "Genre", href: "/genre-komik", icon: Tags, badge: true },
];

const panduanLinks = [
  { name: "Tentang Kami", href: "/about" },
  { name: "Cara Streaming", href: "/guide/streaming" },
  { name: "Cara Download", href: "/guide/download" },
  { name: "DMCA / Copyright", href: "/dmca" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { isApiDown } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    useStore.persist.rehydrate();
    setMounted(true);
  }, []);

  return (
    <footer className="border-t border-foreground/6 bg-background pt-14 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 mb-12">
          {/* BRAND */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="relative h-9 w-auto aspect-1142/249">
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

            <p className="text-sm leading-relaxed text-justify text-foreground/35 max-w-[300px]">
              Download dan streaming anime subtitle Indonesia lengkap, format
              MP4 &amp; MKV, tanpa iklan yang mengganggu, dan hemat kuota.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              <SocialButton
                href="https://www.facebook.com/profile.php?id=61584752845992"
                label="Facebook"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103v3.325s-.733-.045-1.468-.045c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.673 3.667h-3.246v8.245C4.604 22.236 2 17.436 2 12.044 2 6.477 6.477 2 12.044 2S22.087 6.477 22.087 12.044c0 5.628-3.874 10.35-9.101 11.647z" />
                </svg>
              </SocialButton>
              <SocialButton href="#" label="Instagram">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </SocialButton>
              <SocialButton href="#" label="Discord">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.1.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </SocialButton>
            </div>
          </div>

          {/* ANIME LINKS */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2">
              <Tv className="w-3.5 h-3.5 text-primary" />
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-foreground/30">
                Anime
              </h3>
            </div>
            <ul className="space-y-2.5">
              {animeLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2.5 text-[13.5px] text-foreground/50 hover:text-foreground transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:bg-primary transition-colors shrink-0" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* KOMIK LINKS */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-foreground/30">
                Komik
              </h3>
            </div>
            <ul className="space-y-2.5">
              {komikLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2.5 text-[13.5px] text-foreground/50 hover:text-foreground transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:bg-primary transition-colors shrink-0" />
                    {link.name}
                    {link.badge && (
                      <span className="text-[9px] font-bold bg-violet-500/20 text-violet-500 dark:text-violet-300 px-1.5 py-0.5 rounded tracking-wide">
                        NEW
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* PANDUAN LINKS */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-foreground/30">
              Panduan
            </h3>
            <ul className="space-y-2.5">
              {panduanLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] text-foreground/50 hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* STATUS + REPORT */}
          <div className="lg:col-span-2 space-y-3">
            {/* Status Card */}
            <div
              className={cn(
                "rounded-2xl border p-4 transition-colors",
                mounted && isApiDown
                  ? "border-red-500/20 bg-red-500/4"
                  : "border-foreground/[0.07] bg-foreground/3",
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/25">
                  System Status
                </span>
                <span className="relative flex h-2 w-2">
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                      mounted && isApiDown ? "bg-red-400" : "bg-emerald-400",
                    )}
                  />
                  <span
                    className={cn(
                      "relative inline-flex rounded-full h-2 w-2",
                      mounted && isApiDown ? "bg-red-500" : "bg-emerald-500",
                    )}
                  />
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                    mounted && isApiDown
                      ? "border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-400"
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
                  )}
                >
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground/80 leading-none mb-1">
                    API Service
                  </p>
                  <div className="flex items-center gap-1">
                    {mounted && isApiDown ? (
                      <>
                        <XCircle className="w-3 h-3 text-red-500 dark:text-red-400" />
                        <p className="text-[11px] font-medium text-red-500 dark:text-red-400">
                          Maintenance / Down
                        </p>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                        <p className="text-[11px] font-medium text-emerald-500 dark:text-emerald-400">
                          Operational (Stable)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Report Button */}
            <Link
              href="/report"
              className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/6 text-rose-500 dark:text-rose-400 text-[13px] font-medium hover:bg-rose-500/12 hover:border-rose-500/30 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              Lapor Link Rusak / Error
            </Link>
          </div>
        </div>

        {/* DIVIDER */}
        <Separator className="bg-foreground/6" />

        {/* BOTTOM */}
        <div className="mt-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[12px] text-foreground/40">
              <span className="text-foreground/60 font-medium">
                © {currentYear} Mugenime.
              </span>{" "}
              Semua hak dilindungi.
            </p>
            <p className="text-[11px] text-foreground/25">
              Mugenime tidak menyimpan file video di server sendiri. Semua
              konten disediakan oleh pihak ketiga non-afiliasi.
            </p>
          </div>

          <div className="flex gap-5">
            <Link
              href="/terms"
              className="text-[12px] text-foreground/25 hover:text-foreground/60 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-[12px] text-foreground/25 hover:text-foreground/60 transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialButton({
  href,
  label,
  children,
}: Readonly<{
  href: string;
  label: string;
  children: React.ReactNode;
}>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-foreground/[0.07] bg-foreground/4 text-foreground/50 hover:bg-violet-500/15 hover:border-violet-500/30 hover:text-violet-500 dark:hover:text-violet-300 transition-all"
    >
      {children}
    </a>
  );
}
