"use client";

import { useState } from "react";
import { AlertTriangle, Copy, Check, Info, HelpCircle } from "lucide-react";
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
    <div className="min-h-screen pb-20 py-10 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 space-y-10 max-w-6xl">
        {/* HEADER (Tetap sama) */}
        <div className="relative rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 md:p-10 shadow-sm overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider w-fit">
              <AlertTriangle className="w-3.5 h-3.5" />
              Pusat Bantuan
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading">
              Lapor <span className="text-indigo-600">Masalah</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
              Menemukan link mati, video error, atau kesalahan penamaan episode?
              Bantu kami memperbaiki Mugenime dengan melaporkannya di sini.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* KOLOM KIRI: GUIDE (Tetap sama) */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="w-5 h-5 text-indigo-600" />
                  Cara Melapor
                </CardTitle>
                <CardDescription>
                  Ikuti panduan berikut agar laporanmu cepat diproses admin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                <ul className="list-disc list-inside space-y-2 ml-1">
                  <li>
                    Pastikan koneksi internet kamu stabil sebelum melapor.
                  </li>
                  <li>
                    Coba refresh halaman atau gunakan <b>Browser Lain</b>{" "}
                    (Chrome/Firefox).
                  </li>
                  <li>
                    Gunakan fitur <b>&quot;Buka Tab Baru&quot;</b> di player
                    jika video tidak muncul (masalah sandbox).
                  </li>
                  <li>Jangan spam komentar yang sama berulang kali.</li>
                  <li>Gunakan bahasa yang sopan dan jelas.</li>
                </ul>
                <Alert className="bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900 mt-4">
                  <HelpCircle className="h-4 w-4 text-indigo-600" />
                  <AlertTitle className="text-indigo-800 dark:text-indigo-400 font-bold">
                    Catatan
                  </AlertTitle>
                  <AlertDescription className="text-indigo-700/80 dark:text-indigo-400/80 text-xs">
                    Laporan &quot;Batch&quot; yang error mungkin membutuhkan
                    waktu lebih lama untuk diperbaiki karena ukuran file yang
                    besar.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex justify-between items-center">
                  <span>Template Laporan</span>
                  <Button
                    size="sm"
                    variant={copied ? "default" : "outline"}
                    className={
                      copied ? "bg-green-600 hover:bg-green-700 text-white" : ""
                    }
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 mr-2" /> Disalin
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-2" /> Salin Template
                      </>
                    )}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Gunakan format ini di kolom komentar agar kami mudah
                  mengidentifikasi masalah.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono text-xs md:text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {templateText}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- KOLOM KANAN: KOMENTAR (COMPONENT) --- */}
          <div className="lg:col-span-5 h-full">
            <CommentSection />
          </div>
        </div>
      </div>
    </div>
  );
}
