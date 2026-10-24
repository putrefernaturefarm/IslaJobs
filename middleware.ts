import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons/|login|register|verify-otp|terms|privacy|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
