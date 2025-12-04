"use client";

import { useState } from "react";
import {
  Download,
  ChevronDown,
  ChevronUp,
  Package,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BatchResponse } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function BatchDownload({
  batchData,
}: {
  batchData: BatchResponse;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Ambil format pertama (biasanya cuma ada 1 format list batch)
  const formats = batchData.downloadUrl.formats[0];

  if (!formats) return null;

  return (
    <div className="mt-8">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all group"
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-500">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600">
                  Download Batch (Tamat)
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Unduh semua episode dalam satu paket (Zip/Rar).
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-9 h-9 p-0 rounded-full"
            >
              {isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span className="sr-only">Toggle Batch</span>
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="animate-collapsible-down">
          <div className="p-4 space-y-6 border-t border-zinc-200 dark:border-zinc-800">
            {formats.qualities.map((quality, idx) => (
              <div key={idx} className="space-y-3">
                {/* Header Kualitas & Ukuran */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-50 font-bold"
                  >
                    {quality.title}
                  </Badge>
                  <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                    <HardDrive className="w-3 h-3" /> {quality.size}
                  </span>
                </div>

                {/* Grid Tombol Download */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2">
                  {quality.urls.map((link, linkIdx) => (
                    <Button
                      key={linkIdx}
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-xs h-9 bg-white dark:bg-zinc-950 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex items-center justify-start"
                      >
                        <Download className="w-3 h-3 mr-1 ml-3" />
                        {link.title}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
