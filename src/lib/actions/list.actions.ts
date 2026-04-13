'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { DraftColumn } from '@/types/app'
import type { Database, Json } from '@/types/database'

type ListRow = Database['public']['Tables']['lists']['Row']
type SupabaseTyped = Awaited<ReturnType<typeof createClient>>

async function requireAdmin(): Promise<SupabaseTyped> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if ((profile as { role: string } | null)?.role !== 'admin') throw new Error('Forbidden')
  return supabase
}

export async function createList(name: string, columns: DraftColumn[]): Promise<ListRow> {
  const supabase = await requireAdmin()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: list, error: listError } = await supabase
    .from('lists')
    .insert({ name, created_by: user!.id, is_active: true })
    .select()
    .single()

  if (listError || !list) throw new Error(listError?.message ?? 'Failed to create list')

  if (columns.length > 0) {
    const { error: colError } = await supabase.from('list_columns').insert(
      columns.map((col, i) => ({
        list_id: (list as ListRow).id,
        name: col.name,
        col_type: col.col_type,
        config: col.config as unknown as Json,
        position: i,
      }))
    )
    if (colError) throw new Error(colError.message)
  }

  revalidatePath('/')
  return list as ListRow
}

export async function hideList(listId: string): Promise<void> {
  const supabase = await requireAdmin()
  const { error } = await supabase
    .from('lists')
    .update({ is_active: false })
    .eq('id', listId)
  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function restoreList(listId: string): Promise<void> {
  const supabase = await requireAdmin()
  const { error } = await supabase
    .from('lists')
    .update({ is_active: true })
    .eq('id', listId)
  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function deleteList(listId: string): Promise<void> {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('lists').delete().eq('id', listId)
  if (error) throw new Error(error.message)
  revalidatePath('/')
}
