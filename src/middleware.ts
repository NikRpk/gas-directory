import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/admin";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh the Supabase session on every request (standard @supabase/ssr flow).
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Only /admin and /api/admin need protection; everything else is public.
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi =
    pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return response;
  }

  if (!user) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!isAdminEmail(user.email)) {
    if (isAdminApi) {
      return NextResponse.json(
        { error: "This account is not an admin" },
        { status: 403 }
      );
    }
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "not-admin");
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
