"use client";

import {
  Construction,
  Hammer,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function CommentSection() {
  return (
    <section className="relative w-full max-w-full mx-auto my-8">
      <div className="relative flex flex-col items-center justify-center min-h-[400px] text-center p-8 rounded-3xl border border-dashed border-border bg-muted/20 overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] max-h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
          {/* Icon Wrapper */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <div className="relative w-24 h-24 bg-card border border-border rounded-3xl flex items-center justify-center shadow-xl rotate-3 transition-transform hover:rotate-6">
              <Construction className="w-12 h-12 text-primary" />
            </div>
            {/* Floating Tool Icon */}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg border-2 border-background -rotate-12">
              <Hammer className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-heading">
              🚧 Sedang Dibangun 🚧
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Fitur <b>Komentar</b> sedang dikerjakan. Nantinya kamu bisa isi
              komentar di sini.
            </p>
          </div>

          <div className="pt-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
