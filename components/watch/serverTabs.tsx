import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ExternalLink, Loader2, PlayCircle, Server } from "lucide-react";
import { EpisodeDetail } from "@/lib/types";

interface ServerTabsProps {
  episode: EpisodeDetail;
  currentUrl: string;
  selectedServerId: string | null;
  isLoading: boolean;
  onServerChange: (id: string) => void;
}

export default function ServerTabs({
  episode,
  currentUrl,
  selectedServerId,
  isLoading,
  onServerChange,
}: Readonly<ServerTabsProps>) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
      <div className="flex flex-row items-center justify-between mb-5">
        <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md">
            <Server className="w-4 h-4 text-primary" />
          </div>
          Pilih Server
        </h3>
        <a
          href={currentUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-xs text-primary hover:text-primary/80 font-medium flex items-center hover:underline bg-primary/5 px-3 py-1.5 rounded-full transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Tab Baru
        </a>
      </div>

      <Tabs
        defaultValue={episode.server.qualities[0]?.title || "360p"}
        className="w-full"
      >
        <TabsList className="w-full sm:w-auto h-auto p-1.5 bg-muted/50 rounded-xl mb-5 flex-wrap gap-1">
          {episode.server.qualities.map((qualityGroup) => (
            <TabsTrigger
              key={qualityGroup.title}
              value={qualityGroup.title}
              className="cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-muted-foreground transition-all"
            >
              {qualityGroup.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {episode.server.qualities.map((qualityGroup) => (
          <TabsContent
            key={qualityGroup.title}
            value={qualityGroup.title}
            className="mt-0 focus-visible:outline-none"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {qualityGroup.serverList.map((server) => (
                <button
                  key={server.serverId}
                  onClick={() => onServerChange(server.serverId)}
                  disabled={isLoading && selectedServerId !== server.serverId}
                  className={cn(
                    "cursor-pointer relative group flex items-center justify-center px-4 py-3 rounded-xl text-xs font-semibold border transition-all duration-300",
                    selectedServerId === server.serverId
                      ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/30"
                      : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5",
                  )}
                >
                  {isLoading && selectedServerId === server.serverId ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <PlayCircle
                      className={cn(
                        "w-4 h-4 mr-2 transition-opacity",
                        selectedServerId === server.serverId
                          ? "opacity-100"
                          : "opacity-50 group-hover:opacity-100",
                      )}
                    />
                  )}
                  <span className="truncate capitalize tracking-wide">
                    {server.title}
                  </span>
                </button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
