import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Clock, Download, FileVideo, Film, HardDrive, Info, User, Video } from "lucide-react";
import BatchDownload from "../batchDownload";
import { BatchResponse, DownloadQuality, EpisodeDetail } from "@/lib/types";

interface DownloadAccordionProps {
  episodeInfo: EpisodeDetail["info"];
  groupedDownloads: Record<string, DownloadQuality[]>;
  batchData: BatchResponse | null;
  onDownloadClick: () => void;
}

export default function DownloadAccordion({
  episodeInfo,
  groupedDownloads,
  batchData,
  onDownloadClick,
}: Readonly<DownloadAccordionProps>) {
  const parseDownloadTitle = (title: string) => {
    const match = new RegExp(/^(mp4|mkv)[\s_]+(\d+p)$/i).exec(title);
    if (match) return { format: match[1].toUpperCase(), res: match[2] };
    const isMkv = title.toLowerCase().includes("mkv");
    return { format: isMkv ? "MKV" : "MP4", res: title.replaceAll(/mp4|mkv|_|\s/gi, "") };
  };

  return (
    <>
      {/* File Info Card */}
      {episodeInfo && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 text-xs space-y-4">
          <h4 className="font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" /> Informasi File
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-muted/20 p-2.5 rounded-lg border border-border/50">
              <span className="text-muted-foreground flex items-center gap-2 font-medium">
                <User className="w-3.5 h-3.5" /> Credit
              </span>
              <span className="text-foreground font-semibold truncate max-w-[140px]">{episodeInfo.credit || "-"}</span>
            </div>
            <div className="flex justify-between items-center bg-muted/20 p-2.5 rounded-lg border border-border/50">
              <span className="text-muted-foreground flex items-center gap-2 font-medium">
                <Video className="w-3.5 h-3.5" /> Encoder
              </span>
              <span className="text-foreground font-semibold truncate max-w-[140px]">{episodeInfo.encoder || "-"}</span>
            </div>
            <div className="flex justify-between items-center bg-muted/20 p-2.5 rounded-lg border border-border/50">
              <span className="text-muted-foreground flex items-center gap-2 font-medium">
                <Clock className="w-3.5 h-3.5" /> Durasi
              </span>
              <span className="text-foreground font-semibold">{episodeInfo.duration || "-"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Downloads */}
      {(Object.keys(groupedDownloads).length > 0 || batchData) && (
        <div className="space-y-4">
          {Object.keys(groupedDownloads).length > 0 && (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 bg-muted/30 border-b border-border flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <Download className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-sm text-foreground">Download Episode</h3>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {Object.entries(groupedDownloads).map(([format, qualities]) => (
                  <AccordionItem key={format} value={format} className="border-border px-0">
                    <AccordionTrigger className="px-5 py-3.5 hover:bg-muted/30 hover:no-underline text-sm font-semibold text-foreground transition-colors">
                      <div className="flex items-center gap-2.5">
                        {format === "MP4" ? <FileVideo className="w-4 h-4 text-blue-500" /> : <Film className="w-4 h-4 text-purple-500" />}
                        <span className="tracking-wide">{format}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 bg-muted/10 space-y-3 border-t border-border/30">
                      {qualities.map((item) => {
                        const { res } = parseDownloadTitle(item.title);
                        return (
                          <div key={item.title} className="bg-background border border-border rounded-xl p-3 shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center mb-3">
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold px-2 py-0.5 rounded-md">
                                {res}
                              </Badge>
                              <span className="text-[10px] font-mono font-semibold text-muted-foreground flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md border border-border/50">
                                <HardDrive className="w-3 h-3 text-muted-foreground/70" />
                                {item.size}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {item.urls.map((link) => (
                                <a
                                  key={link.title}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={onDownloadClick}
                                  className="flex items-center justify-center h-8 px-2 text-[11px] font-bold text-muted-foreground bg-muted/40 hover:bg-primary hover:text-primary-foreground border border-border/80 hover:border-primary rounded-lg transition-all shadow-sm truncate tracking-wide"
                                >
                                  {link.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          {batchData && <BatchDownload batchData={batchData} />}
        </div>
      )}
    </>
  );
}