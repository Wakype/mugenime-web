import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCountryFromFormat(format?: string): string {
  const f = format?.toLowerCase();
  if (f === "manhua") return "China";
  if (f === "manhwa") return "Korea";
  if (f === "manga") return "Jepang";
  return format || "Unknown";
}

// Map format to include country flag emoji
export function getFormatWithFlag(format?: string): string {
  const f = format?.toLowerCase();
  if (f === "manhua") return "🇨🇳 Manhua";
  if (f === "manhwa") return "🇰🇷 Manhwa";
  if (f === "manga") return "🇯🇵 Manga";
  // Fallback if the format is not matched
  return `🏳️ ${format || "Comic"}`;
}

// Convert date string to relative time
export function timeAgo(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInDays < 30) return `${diffInWeeks} minggu yang lalu`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} bulan yang lalu`;
  const diffInYears = Math.max(1, Math.floor(diffInDays / 365));
  return `${diffInYears} tahun yang lalu`;
}

export function getFormatDisplay(format?: string): {
  name: string;
  icon: React.ReactNode;
} {
  const f = format?.toLowerCase();

  // China Flag SVG (Manhua)
  if (f === "manhua") {
    return {
      name: "Manhua",
      icon: (
        <svg
          viewBox="0 0 640 480"
          className="w-3.5 h-3.5 rounded-[2px] overflow-hidden"
        >
          <path fill="#de2910" d="M0 0h640v480H0z" />
          <path
            fill="#ffde00"
            d="M119.6 79.9l22.6 69.4H215l-59 42.8 22.5 69.4-58.9-42.8-58.9 42.8 22.5-69.4-59-42.8h72.8zM245.9 59.4l11.4 34.8h36.6l-29.6 21.5 11.3 34.8-29.6-21.5-29.6 21.5 11.4-34.8-29.6-21.5h36.5zM292.8 131.5l11.3 34.8h36.6l-29.6 21.5 11.3 34.8-29.5-21.5-29.6 21.5 11.3-34.8-29.6-21.5H281zM286.9 238l11.4 34.7h36.5l-29.5 21.5 11.3 34.8-29.6-21.5-29.6 21.5 11.4-34.8-29.6-21.5h36.6zM228.6 303.4l11.3 34.8h36.6l-29.6 21.5 11.4 34.8-29.6-21.5-29.6 21.5 11.3-34.8-29.6-21.5h36.6z"
          />
        </svg>
      ),
    };
  }

  // Korea Flag SVG (Manhwa)
  if (f === "manhwa") {
    return {
      name: "Manhwa",
      icon: (
        <svg
          viewBox="0 0 640 480"
          className="w-3.5 h-3.5 rounded-[2px] overflow-hidden bg-white"
        >
          <path fill="#fff" d="M0 0h640v480H0z" />
          <g transform="rotate(33.69 320 240)">
            <path fill="#cd2e3a" d="M545.2 240a225.2 225.2 0 0 1-450.4 0z" />
            <path fill="#0047a0" d="M94.8 240a225.2 225.2 0 0 0 450.4 0z" />
            <circle cx="207.4" cy="240" r="56.3" fill="#cd2e3a" />
            <circle cx="432.6" cy="240" r="56.3" fill="#0047a0" />
          </g>
          <g fill="#000">
            <path d="M110 131.3h87v14.4h-87zM110 160h87v14.4h-87zM110 188.8h87v14.4h-87zM110 276.8h87v14.4h-87zM110 334.4h87v14.4h-87zM110 305.6h38.2v14.4H110zM158.8 305.6h38.2v14.4h-38.2zM443 131.3h87v14.4h-87zM443 188.8h87v14.4h-87zM443 160h38.2v14.4H443zM491.8 160h38.2v14.4h-38.2zM443 276.8h38.2v14.4H443zM491.8 276.8h38.2v14.4h-38.2zM443 305.6h38.2v14.4H443zM491.8 305.6h38.2v14.4h-38.2zM443 334.4h38.2v14.4H443zM491.8 334.4h38.2v14.4h-38.2z" />
          </g>
        </svg>
      ),
    };
  }

  // Default: Japan Flag SVG (Manga)
  return {
    name: "Manga",
    icon: (
      <svg
        viewBox="0 0 640 480"
        className="w-3.5 h-3.5 rounded-[2px] overflow-hidden bg-white"
      >
        <path fill="#fff" d="M0 0h640v480H0z" />
        <circle cx="320" cy="240" r="144" fill="#bc002d" />
      </svg>
    ),
  };
}
