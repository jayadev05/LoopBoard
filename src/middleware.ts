// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";
import { AUTH_COOKIES, AUTH_ROUTES } from "./features/auth/constants";
import { ApplicationUser } from "./types/auth";

export const extractUserFromCookies = async (
  cookies: NextRequest['cookies']
): Promise<ApplicationUser | null> => {
  const customSessionToken = cookies.get(AUTH_COOKIES.customSession);
  const nextAuthSessionToken = cookies.get(AUTH_COOKIES.nextAuthSession);
  
  // Try to extract user from custom session first
  if (customSessionToken?.value) {
    try {
      const decryptedSession = await decrypt(customSessionToken.value);
      
      // Check if session is valid and not expired
      if (decryptedSession && 
          decryptedSession.user && 
          (!decryptedSession.expiresAt || 
           Date.now() < new Date(decryptedSession.expiresAt).getTime())) {
        return {
          ...decryptedSession.user,
        };
      }
    } catch (error) {
      console.error("Failed to decrypt session:", error);
    }
  }
  
  // Fall back to NextAuth session
  if (nextAuthSessionToken) {
    
    return { 
      isNextAuthLoggedIn: true 
    } as ApplicationUser;
  }
  
  return null;
};

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = AUTH_ROUTES.protected.has(path as any);
  const isPublicRoute = AUTH_ROUTES.public.has(path as any);
  
  
  // Extract user from cookies
  const user = await extractUserFromCookies(req.cookies);
  

  
  // Handle protected routes
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL(AUTH_ROUTES.signIn, req.nextUrl));
  }
  
  // Handle public routes (redirect logged-in users)
  if (isPublicRoute && user) {
    return NextResponse.redirect(new URL(AUTH_ROUTES.home, req.nextUrl));
  }
  
  // Pass user data via request headers if user exists
  if (user) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user", JSON.stringify(user));
    
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }
  
  // Default case: continue without modification
  return NextResponse.next();
}

// CRITICAL: Update the config to include API routes
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/:path*" // Make sure API routes are processed by the middleware
  ]
};