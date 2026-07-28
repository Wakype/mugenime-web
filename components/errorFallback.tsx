"use client";

import { ServerCrash, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  className?: string;
}

export default function ErrorFallback({
  title = "Server Maintenance / Overload",
  message = "The data provider server is currently busy or experiencing temporary issues. Please try refreshing this page in a few moments.",
  showHomeButton = true,
  className,
}: Readonly<ErrorFallbackProps>) {
  return (
    <div
      className={cn(
        "relative w-full min-h-[80vh] flex flex-col items-center justify-center p-4 overflow-hidden rounded-3xl",
        className,
      )}
    >
      {/* Background Decoration Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />

      {/* Center Glow Effect for Destructive Theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-destructive/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Card */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 md:p-12 rounded-3xl bg-card/80 backdrop-blur-xl border border-border shadow-xl max-w-lg w-full animate-in fade-in zoom-in-95 duration-500">
        {/* Animated Icon */}
        <div className="relative flex items-center justify-center w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-destructive/20 rounded-full animate-ping opacity-50" />
          <div className="relative bg-card border-2 border-dashed border-destructive/50 w-full h-full rounded-full flex items-center justify-center shadow-lg shadow-destructive/20">
            <ServerCrash className="w-10 h-10 text-destructive" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3 mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight font-heading">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Button
            onClick={() => globalThis.location.reload()}
            size="lg"
            className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all cursor-pointer px-8"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>

          {showHomeButton && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full border-border hover:bg-muted text-muted-foreground transition-all cursor-pointer px-8"
            >
              <Link href="/" prefetch={false}>
                <Home className="w-4 h-4 mr-2" />
                Ke Beranda
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
