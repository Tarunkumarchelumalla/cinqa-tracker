'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types/app'

export async function updateUserRole(targetUserId: string, newRole: UserRole): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((profile as { role: string } | null)?.role !== 'admin') throw new Error('Forbidden')

  // Cannot change your own role
  if (targetUserId === user.id) {
    throw new Error('Cannot change your own role')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole as any })
    .eq('id', targetUserId)

  if (error) throw new Error(error.message)
  revalidatePath('/users')
}
