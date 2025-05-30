import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./src/lib/auth/jwt";

// List of paths that require authentication
const protectedPaths = [
  "/orders", // Protected orders page
];

// List of paths that are only accessible to non-authenticated users
const authOnlyPaths = ["/login", "/register"];

// List of API paths that require authentication
const protectedApiPaths = [
  "/api/auth/me",
  "/api/orders", // Protected orders API
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Add security headers to all responses
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Add Content-Security-Policy header
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'"
  );

  // Add Strict-Transport-Security header in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Check if this is an API request
  const isApiRequest = pathname.startsWith("/api/");

  // Get token from cookie
  const token = request.cookies.get("auth_token")?.value;

  // Verify the token if it exists
  const isAuthenticated = token ? !!verifyToken(token) : false;

  // Handle API authentication
  if (isApiRequest) {
    // Check if this API path requires authentication
    const isProtectedApiPath = protectedApiPaths.some((path) =>
      pathname.startsWith(path)
    );

    if (isProtectedApiPath && !isAuthenticated) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // For authenticated API requests, proceed normally
    return response;
  }

  // Handle page navigation (non-API requests)

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  // Check if the path is for non-authenticated users only
  const isAuthOnlyPath = authOnlyPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Redirect authenticated users away from auth-only pages (like login/register)
  if (isAuthenticated && isAuthOnlyPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users to login if they try to access protected paths
  if (!isAuthenticated && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

// Update the matcher to include all relevant paths
export const config = {
  matcher: [
    // Auth-only and protected pages
    "/login",
    "/register",
    "/orders",
    "/orders/:path*",
    // Protected API routes
    "/api/auth/me",
    "/api/orders/:path*",
    // Apply security headers to all routes
    "/(.*)",
  ],
};
