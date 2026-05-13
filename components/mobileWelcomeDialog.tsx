"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Tv, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileWelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      const isMobile = globalThis.matchMedia("(max-width: 768px)").matches;
      const hasSeenDialog = sessionStorage.getItem("welcomeDialogShown");
      if (isMobile && !hasSeenDialog) {
        setIsOpen(true);
        sessionStorage.setItem("welcomeDialogShown", "true");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChoice = (path: string) => {
    setIsOpen(false);
    if (path !== "/") router.push(path);
  };

  if (!mounted) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-[92vw] max-w-sm rounded-3xl border-0 bg-transparent p-0 shadow-none md:hidden">
        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0f0f12] p-7">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -left-14 -top-20 h-56 w-56 rounded-full bg-indigo-600/20 blur-3xl" />

          {/* Icon badge */}
          <div className="relative mx-auto mb-3 flex h-fit w-fit items-center justify-center ">
            <p className="text-3xl">🤔</p>
          </div>

          {/* Heading */}
          <h2 className="mb-2 text-center text-[22px] font-extrabold tracking-tight text-white/95">
            Mau Ngapain?
          </h2>
          <p className="mb-6 text-center text-[13.5px] leading-relaxed text-white/40">
            Mau ngapain hari ini di Mugenime?
          </p>

          {/* Choices */}
          <div className="flex flex-col gap-3">
            <ChoiceButton
              label="Nonton Anime"
              sub="Streaming Anime & Download Batch"
              icon={<Tv className="h-5 w-5" />}
              iconClass="bg-primary/[0.16] text-primary"
              hoverClass="hover:border-primary/30 hover:bg-primary/[0.09]"
              onClick={() => handleChoice("/")}
            />
            <ChoiceButton
              label="Baca Komik"
              sub="Manga, Manhwa & Manhua"
              icon={<BookOpen className="h-5 w-5" />}
              iconClass="bg-primary/[0.14] text-primary"
              hoverClass="hover:border-primary/30 hover:bg-primary/[0.09]"
              onClick={() => handleChoice("/komik")}
            />
          </div>

          {/* Divider + Skip */}
          <div className="mt-5 border-t border-white/6 pt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-[13px] text-white/25 transition-colors hover:text-white/50"
            >
              Nanti saja
            </button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type ChoiceButtonProps = {
  label: string;
  sub: string;
  icon: React.ReactNode;
  iconClass: string;
  hoverClass: string;
  onClick: () => void;
};

function ChoiceButton({
  label,
  sub,
  icon,
  iconClass,
  hoverClass,
  onClick,
}: Readonly<ChoiceButtonProps>) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/3 px-4 py-[14px] text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary",
        hoverClass,
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          iconClass,
        )}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1">
        <span className="block text-[15px] font-bold text-white/90">
          {label}
        </span>
        <span className="block text-xs text-white/35">{sub}</span>
      </div>

      {/* Arrow */}
      <ArrowRight className="h-4 w-4 shrink-0 translate-x-0 text-white/30 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
    </button>
  );
}
