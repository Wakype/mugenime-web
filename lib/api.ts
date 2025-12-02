import { notFound } from "next/navigation";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ApiResponse<T> {
  status: string;
  creator: string;
  data: T;
  pagination?: unknown;
  statusCode?: number;
}

export class FetchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function fetchAnime<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${path}`;

  const defaultHeaders = {
    "User-Agent": "Mugenime/1.0",
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
      // Default cache untuk Next.js (bisa di-override per request)
      // next: { revalidate: 3600 } // Contoh default 1 jam
    });

    // Handle 404 (Not Found)
    if (res.status === 404) {
      return notFound() as never;
    }

    // Handle Rate Limit (429) atau Server Error
    if (!res.ok) {
      throw new FetchError(`API Error: ${res.status} ${res.statusText}`, res.status);
    }

    const json: ApiResponse<T> = await res.json();
    
    // Kadang API mengembalikan data langsung, kadang dibungkus properti "data"
    // Kita return properti "data" jika ada, agar lebih rapi di frontend
    return json.data ? json.data : (json as unknown as T);

  } catch (error) {
    console.error(`[Fetch Error] ${url}:`, error);
    throw error;
  }
}