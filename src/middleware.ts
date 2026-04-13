import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware-client'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })
  const supabase = createMiddlewareClient(request, response)

  // Always call getUser() — this refreshes expired tokens via the refresh token
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Let auth callback through unconditionally
  if (pathname.startsWith('/auth/')) return response

  // Unauthenticated → redirect to /login
  if (!user && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Authenticated user hitting /login → redirect to app
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // /users route requires admin role
  if (user && pathname.startsWith('/users')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
}
