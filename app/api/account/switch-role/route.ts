import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'

const VIEW_COOKIE = 'isla_view'

export async function POST(request: Request) {
  const siteUrl = new URL(request.url).origin
  const supabase = await createServerClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) {
    return NextResponse.redirect(new URL('/login', siteUrl), { status: 302 })
  }

  const formData = await request.formData()
  const target = formData.get('target')

  if (target !== 'customer' && target !== 'worker') {
    return NextResponse.redirect(new URL('/more', siteUrl), { status: 302 })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role, date_of_birth')
    .eq('id', authUser.id)
    .single()

  if (!profile) {
    return NextResponse.redirect(new URL('/login', siteUrl), { status: 302 })
  }

  // Switching into worker view for the first time: collect the worker profile
  // (DOB + bio) before granting worker access.
  if (target === 'worker' && profile.role === 'customer' && !profile.date_of_birth) {
    return NextResponse.redirect(new URL('/worker-setup?upgrade=1', siteUrl), { status: 302 })
  }

  // Grant the other role on the same account (never downgrade an existing role).
  if (profile.role !== 'both' && profile.role !== target) {
    await supabase.from('users').update({ role: 'both' }).eq('id', authUser.id)
  }

  const cookieStore = await cookies()
  cookieStore.set(VIEW_COOKIE, target, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  return NextResponse.redirect(new URL('/home', siteUrl), { status: 302 })
}
