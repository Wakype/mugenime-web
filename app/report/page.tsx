"use client";

import { useState } from "react";
import { AlertTriangle, Copy, Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CommentSection from "@/components/commentSection";

export default function ReportPage() {
  const [copied, setCopied] = useState(false);

  const templateText = `Judul Anime: [Nama Anime]
Episode: [Nomor Episode]
Masalah: [Link Rusak / Video Error / Subtitle Hilang]
Server (gunakan jika error pada video player): [VidHide / StreamWish / dll]
Keterangan Tambahan: [Jelaskan detailnya]
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(templateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-10">
        {/* --- HEADER --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
              <AlertTriangle className="w-3.5 h-3.5" />
              Pusat Bantuan
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
              Lapor <span className="text-primary">Masalah</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
              Menemukan link mati, video error, atau kesalahan penamaan episode?
              Bantu kami memperbaiki Mugenime dengan melaporkannya di sini.
            </p>
          </div>
        </div>

        {/* --- BAGIAN 1: PANDUAN & TEMPLATE (Grid Side-by-Side) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Kiri: Cara Melapor */}
          <Card className="border-border bg-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                Cara Melapor
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Ikuti panduan berikut agar laporanmu cepat diproses admin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-2 ml-1">
                <li>Pastikan koneksi internet kamu stabil.</li>
                <li>
                  Coba refresh atau gunakan{" "}
                  <b className="text-foreground">Browser Lain</b>.
                </li>
                <li>
                  Gunakan fitur{" "}
                  <b className="text-foreground">&quot;Buka Tab Baru&quot;</b>{" "}
                  jika player error.
                </li>
                <li>Jangan spam komentar berulang.</li>
                <li>Gunakan bahasa yang sopan.</li>
              </ul>
              <Alert className="bg-primary/5 border-primary/20 mt-4">
                <HelpCircle className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-bold">
                  Catatan
                </AlertTitle>
                <AlertDescription className="text-muted-foreground text-xs">
                  Laporan &quot;Batch&quot; error mungkin butuh waktu lebih lama
                  untuk diperbaiki.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Card Kanan: Template */}
          <Card className="border-border bg-card h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex justify-between items-center text-foreground">
                <span>Template Laporan</span>
                <Button
                  size="sm"
                  variant={copied ? "default" : "outline"}
                  className={
                    copied
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-background border-border text-foreground hover:bg-muted"
                  }
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-2" /> Disalin
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-2" /> Salin
                    </>
                  )}
                </Button>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Gunakan format ini agar mudah diidentifikasi.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="bg-muted p-4 rounded-lg border border-border font-mono text-xs md:text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed h-full">
                {templateText}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- BAGIAN 2: KOMENTAR (FULL WIDTH DI BAWAH) --- */}
        <div className="w-full">
          <CommentSection identifier="report" page_url="/report"/>
        </div>
      </div>
    </div>
  );
}
