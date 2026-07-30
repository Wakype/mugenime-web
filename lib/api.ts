import { notFound } from "next/navigation";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const KS_BASE_URL = process.env.NEXT_PUBLIC_KS_API_BASE_URL;
export const MANGA_BASE_URL = process.env.NEXT_PUBLIC_MANGA_API;
export const BYPASS_SECRET = process.env.BYPASS_SECRET;

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

// ── Rate Limiting Queue & In-Flight Deduplication ────────────────────────────

const MAX_CONCURRENT_REQUESTS = 3;
const DELAY_BETWEEN_REQUESTS_MS = 50;

let activeRequests = 0;
const queue: (() => void)[] = [];

async function enqueueRequest<T>(fn: () => Promise<T>): Promise<T> {
  if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    await new Promise<void>((resolve) => queue.push(resolve));
  }
  activeRequests++;
  try {
    return await fn();
  } finally {
    activeRequests--;
    if (queue.length > 0) {
      const next = queue.shift();
      if (next) {
        setTimeout(next, DELAY_BETWEEN_REQUESTS_MS);
      }
    }
  }
}

const inFlightMap = new Map<string, Promise<unknown>>();

async function fetchWithQueueAndDedup<T>(
  url: string,
  fetcherFn: () => Promise<T>,
): Promise<T> {
  if (inFlightMap.has(url)) {
    return inFlightMap.get(url) as Promise<T>;
  }

  const promise = enqueueRequest(fetcherFn).finally(() => {
    inFlightMap.delete(url);
  });

  inFlightMap.set(url, promise);
  return promise;
}

// ── Fetch Functions ──────────────────────────────────────────────────────────

export async function fetchAnime<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${path}`;

  return fetchWithQueueAndDedup(url, async () => {
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
        next: { revalidate: 1800 },
      });

      if (res.status === 404) {
        return notFound() as never;
      }

      if (!res.ok) {
        throw new FetchError(
          `API Error: ${res.status} ${res.statusText}`,
          res.status,
        );
      }

      const json: ApiResponse<T> = await res.json();

      if (
        json.data &&
        json.pagination &&
        typeof json.data === "object" &&
        !Array.isArray(json.data)
      ) {
        return {
          ...json.data,
          pagination: json.pagination,
        } as unknown as T;
      }

      return json.data ? json.data : (json as unknown as T);
    } catch (error) {
      console.error(`[Fetch Error] ${url}:`, error);
      throw error;
    }
  });
}

export async function fetchKS<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${KS_BASE_URL}${path}`;

  return fetchWithQueueAndDedup(url, async () => {
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
        next: { revalidate: 1800 },
      });

      if (res.status === 404) {
        return notFound() as never;
      }

      if (!res.ok) {
        throw new FetchError(
          `KS API Error: ${res.status} ${res.statusText}`,
          res.status,
        );
      }

      const json = await res.json();
      return json as T;
    } catch (error) {
      console.error(`[Fetch KS Error] ${url}:`, error);
      throw error;
    }
  });
}

export async function fetchKomik<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${MANGA_BASE_URL}${path}`;

  return fetchWithQueueAndDedup(url, async () => {
    const defaultHeaders: Record<string, string> = {
      "User-Agent": "Mugenime/1.0",
      "Content-Type": "application/json",
    };

    if (BYPASS_SECRET) {
      defaultHeaders["X-API-Key"] = BYPASS_SECRET;
    }

    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options?.headers,
        },
        next: { revalidate: 1800 },
      });

      if (res.status === 404) {
        return notFound() as never;
      }

      if (!res.ok) {
        throw new FetchError(
          `Manga API Error: ${res.status} ${res.statusText}`,
          res.status,
        );
      }

      const json = await res.json();
      return json as T;
    } catch (error) {
      console.error(`[Fetch Manga Error] ${url}:`, error);
      throw error;
    }
  });
}
