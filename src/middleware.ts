import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "./utils/jwt.utils";

class AuthMiddleware {
  readonly path: string;
  private readonly req: NextRequest;
  readonly authCookie: string | undefined;

  constructor(request: NextRequest) {
    this.req = request;
    this.authCookie = request.cookies.get(cookieName)?.value;
    this.path = request.nextUrl.pathname;
  }

  getAuthInfo() {
    if (!this.authCookie) return null;
    return decodeJwt(this.authCookie);
  }

  isProtectedPage() {
    return this.path?.startsWith("/p/") || this.path === "/p";
  }

  isAuthPage() {
    return this.path?.startsWith("/auth/login");
  }
}

const cookieName = process.env.NEXT_PUBLIC_TOKEN_NAME as string;
const homePage = "/p/home";
const loginPage = "/auth/login";
export function middleware(request: NextRequest) {
  const authMiddleware = new AuthMiddleware(request);

  if (authMiddleware.isProtectedPage()) {
    const authInfo = authMiddleware.getAuthInfo();
    if (!authInfo) {
      return NextResponse.redirect(new URL(loginPage, request.url));
    }
  }

  if (authMiddleware.isAuthPage()) {
    const authInfo = authMiddleware.getAuthInfo();
    if (authInfo) {
      return NextResponse.redirect(new URL(homePage, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/p/:path*"],
};
