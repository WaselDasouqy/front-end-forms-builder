import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for token in cookies
  const token = request.cookies.get('formwave_token')?.value;
  
  // Root path handling - skip middleware on homepage
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Define public and protected paths
  const isAuthPath = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/forms/builder');
  
  // Redirect logic
  if (isProtectedPath && !token) {
    // Redirect to login if trying to access protected routes without token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPath && token) {
    // Redirect to dashboard if already logged in
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Update matcher to exclude more paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.).*)']
}; 