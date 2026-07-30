import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CN, KR, JP } from "country-flag-icons/react/3x2";

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

// Map format to include country flag SVG icon
export function getFormatWithFlag(format?: string): React.ReactNode {
  const f = format?.toLowerCase();

  let label = "Comic";
  let icon: React.ReactNode = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5 shrink-0 inline-block"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  );

  if (f === "manhua") {
    label = "Manhua";
    icon = (
      <CN
        title="China"
        className="w-4 h-3 rounded-[2px] overflow-hidden shrink-0 inline-block border border-black/10"
      />
    );
  } else if (f === "manhwa") {
    label = "Manhwa";
    icon = (
      <KR
        title="South Korea"
        className="w-4 h-3 rounded-[2px] overflow-hidden shrink-0 inline-block border border-black/10"
      />
    );
  } else if (f === "manga") {
    label = "Manga";
    icon = (
      <JP
        title="Japan"
        className="w-4 h-3 rounded-[2px] overflow-hidden shrink-0 inline-block border border-black/10"
      />
    );
  } else if (format) {
    label = format;
  }

  return (
    <span className="inline-flex items-center gap-1.5 align-middle">
      {icon}
      <span>{label}</span>
    </span>
  );
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

  if (f === "manhua") {
    return {
      name: "Manhua",
      icon: (
        <CN
          title="China"
          className="w-4 h-3 rounded-[2px] overflow-hidden shrink-0 inline-block border border-black/10"
        />
      ),
    };
  }

  if (f === "manhwa") {
    return {
      name: "Manhwa",
      icon: (
        <KR
          title="South Korea"
          className="w-4 h-3 rounded-[2px] overflow-hidden shrink-0 inline-block border border-black/10"
        />
      ),
    };
  }

  return {
    name: "Manga",
    icon: (
      <JP
        title="Japan"
        className="w-4 h-3 rounded-[2px] overflow-hidden shrink-0 inline-block border border-black/10"
      />
    ),
  };
}
