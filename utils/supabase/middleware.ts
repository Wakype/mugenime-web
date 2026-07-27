import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  // If request contains OAuth 'code' parameter but is not landing on /auth/callback,
  // redirect to /auth/callback so the code gets exchanged for session cookies.
  const { pathname, searchParams } = request.nextUrl;
  if (searchParams.has("code") && !pathname.startsWith("/auth/callback")) {
    const code = searchParams.get("code")!;
    const nextPath = searchParams.get("next") || pathname;
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    url.searchParams.set("code", code);
    url.searchParams.set("next", nextPath);
    return NextResponse.redirect(url);
  }

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT: Do NOT remove this getUser() call.
  // It is required to trigger token refresh and update the session cookies.
  await supabase.auth.getUser();

  return supabaseResponse;
}
