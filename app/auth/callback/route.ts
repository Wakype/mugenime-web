import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies();
    const response = NextResponse.redirect(`${origin}${next}`)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
            response.cookies.set(name, value, options)
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return response
    }
  }

  // Jika terjadi error, redirect ke halaman error atau beranda
  return NextResponse.redirect(`${origin}/`)
}