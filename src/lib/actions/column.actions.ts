'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ColumnConfig, ColType } from '@/types/app'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Forbidden')

  return supabase
}

export async function addColumn(
  listId: string,
  name: string,
  colType: ColType,
  config: ColumnConfig,
  position: number
) {
  const supabase = await requireAdmin()

  const { data, error } = await supabase
    .from('list_columns')
    .insert({ list_id: listId, name, col_type: colType, config, position })
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath(`/list/${listId}`)
  return data
}

export async function updateColumn(
  columnId: string,
  listId: string,
  updates: { name?: string; config?: ColumnConfig; col_type?: ColType }
) {
  const supabase = await requireAdmin()

  const { error } = await supabase
    .from('list_columns')
    .update(updates)
    .eq('id', columnId)

  if (error) throw new Error(error.message)
  revalidatePath(`/list/${listId}`)
}

export async function deleteColumn(columnId: string, listId: string) {
  const supabase = await requireAdmin()

  const { error } = await supabase
    .from('list_columns')
    .delete()
    .eq('id', columnId)

  if (error) throw new Error(error.message)
  revalidatePath(`/list/${listId}`)
}

export async function reorderColumns(
  listId: string,
  orderedIds: string[]
) {
  const supabase = await requireAdmin()

  const updates = orderedIds.map((id, position) => ({
    id,
    list_id: listId,
    position,
  }))

  for (const update of updates) {
    await supabase
      .from('list_columns')
      .update({ position: update.position })
      .eq('id', update.id)
  }

  revalidatePath(`/list/${listId}`)
}
