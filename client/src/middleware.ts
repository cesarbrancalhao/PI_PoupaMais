import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/auth', '/cadastro', '/recuperar', '/confirmar'];
const protectedPaths = ['/dashboard', '/metas', '/analise', '/configuracoes'];

function isTokenValid(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    if (payload.exp) {
      const isExpired = Date.now() >= payload.exp * 1000;
      return !isExpired;
    }

    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isPublicPath = publicPaths.some(path => pathname === path);
  const isProtectedPath = protectedPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

  const isAuthenticated = token && isTokenValid(token);

  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if ((pathname === '/auth' || pathname === '/cadastro') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicPath && !isProtectedPath) {
    return NextResponse.redirect(new URL(isAuthenticated ? '/dashboard' : '/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
