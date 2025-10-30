import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password, firstName, lastName, dateOfBirth } = body

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: 'Invalid email or password too short (min 8 characters)' },
      { status: 400 }
    )
  }

  // Check email domain restrictions
  const allowedDomains = (process.env.ALLOWED_EMAIL_DOMAINS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)

  if (allowedDomains.length > 0) {
    const domain = email.split('@').pop()?.toLowerCase()
    if (!domain || !allowedDomains.includes(domain)) {
      return NextResponse.json(
        { error: 'Email domain not allowed' },
        { status: 403 }
      )
    }
  }

  const supabase = await createClient()

  // Sign up the user with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        full_name: `${firstName || ''} ${lastName || ''}`.trim(),
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(
    {
      success: true,
      message: 'Registration successful! You can now sign in.',
      user: data.user,
    },
    { status: 201 }
  )
}
