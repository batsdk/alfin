import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";
import { isPublicPath, loginUrl } from "@/lib/auth-routes";

// Optimistic check: only looks for the session cookie, never validates it. A missing
// cookie means logged out, so redirect before rendering. A present cookie may be
// stale, which the client-side AuthGuard catches. Logged-in users are deliberately
// not redirected away from /login here, because a stale cookie would cause a loop.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isPublicPath(pathname) || getSessionCookie(request)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(loginUrl(pathname + search), request.url));
}

export const config = {
  // Skip build assets and public files such as /next.svg
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)"],
};
