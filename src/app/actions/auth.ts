'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  // Get the site URL from environment or use the current origin
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const email = formData.get('email') as string
  const phone = formData.get('phone') as string

  // Check if email already exists
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('email')
    .eq('email', email)
    .single()

  if (existingUser) {
    return { error: 'This email is already registered. Please sign in instead.' }
  }

  // Check if phone already exists (only if provided)
  if (phone && phone.trim() !== '') {
    const { data: existingPhone } = await supabase
      .from('profiles')
      .select('phone')
      .eq('phone', phone)
      .single()

    if (existingPhone) {
      return { error: 'This phone number is already registered.' }
    }
  }

  const data = {
    email,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
        phone: phone || '',
        role: 'player',
      },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    // Provide more user-friendly error messages
    if (error.message.includes('already registered')) {
      return { error: 'This email is already registered. Please sign in instead.' }
    }
    return { error: error.message }
  }

  // Don't redirect - let the form show success message
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  // Get user profile to check role
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    revalidatePath('/', 'layout')
    
    if (profile?.role === 'admin') {
      redirect('/admin/dashboard')
    } else {
      redirect('/dashboard')
    }
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, player_stats(*)')
    .eq('id', user.id)
    .single()

  return profile
}

