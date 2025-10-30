import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: any) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/matches/:path*',
    '/courses/:path*',
    '/requests/:path*',
    '/sessions/:path*',
    '/chat/:path*',
    '/profile/:path*',
  ],
}
