import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');
  const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');

  // If user is logged in and tries to access login/register, send them to dashboard
  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return null; // Let them stay on login page
  }

  // If user is not logged in and tries to access dashboard, send them to login
  if (isDashboardPage) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return null; // Let them access dashboard
  }

  return null;
}

export const config = {
  // Only run middleware on these specific routes
  matcher: ['/dashboard/:path*', '/login', '/register']
};
