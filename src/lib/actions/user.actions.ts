'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types/app'

export async function updateUserRole(targetUserId: string, newRole: UserRole) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Forbidden')

  // Cannot demote yourself
  if (targetUserId === user.id && newRole !== 'admin') {
    throw new Error('Cannot demote yourself')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', targetUserId)

  if (error) throw new Error(error.message)
  revalidatePath('/users')
}
