import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  currentUrl: string;
  isLoading: boolean;
  title: string;
  isTheaterMode: boolean;
}

export default function VideoPlayer({
  currentUrl,
  isLoading,
  title,
  isTheaterMode,
}: Readonly<VideoPlayerProps>) {
  return (
    <div
      className={cn(
        "relative w-full transition-all duration-500",
        isTheaterMode ? "max-w-[1500px] aspect-video md:h-[75vh]" : "h-full"
      )}
    >
      {/* Loading Overlay */}
      <div
        className={cn(
          "absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300",
          isLoading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-primary/20 p-4 rounded-full mb-4 ring-4 ring-primary/10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <p className="text-white font-medium text-sm animate-pulse tracking-wide">
          Connecting to Server...
        </p>
      </div>

      <iframe
        key={currentUrl}
        src={currentUrl}
        title={title}
        className="w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}