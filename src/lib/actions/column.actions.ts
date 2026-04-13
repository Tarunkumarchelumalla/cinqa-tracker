'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ColumnConfig, ColType } from '@/types/app'
import type { Database, Json } from '@/types/database'

type ColumnRow = Database['public']['Tables']['list_columns']['Row']

async function requireAdmin(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if ((profile as { role: string } | null)?.role !== 'admin') {
    throw new Error('Forbidden')
  }
}

export async function addColumn(
  listId: string,
  name: string,
  colType: ColType,
  config: ColumnConfig,
  position: number
): Promise<ColumnRow> {
  await requireAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('list_columns')
    .insert({
      list_id: listId,
      name,
      col_type: colType,
      config: config as unknown as Json,
      position,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath(`/list/${listId}`)
  return data as ColumnRow
}

export async function updateColumn(
  columnId: string,
  listId: string,
  updates: { name?: string; config?: ColumnConfig; col_type?: ColType }
): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const payload: {
    name?: string
    col_type?: ColType
    config?: Json
  } = {}
  if (updates.name !== undefined) payload.name = updates.name
  if (updates.col_type !== undefined) payload.col_type = updates.col_type
  if (updates.config !== undefined) payload.config = updates.config as unknown as Json

  const { error } = await supabase
    .from('list_columns')
    .update(payload)
    .eq('id', columnId)

  if (error) throw new Error(error.message)
  revalidatePath(`/list/${listId}`)
}

export async function deleteColumn(
  columnId: string,
  listId: string
): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

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
): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  for (let index = 0; index < orderedIds.length; index++) {
    await supabase
      .from('list_columns')
      .update({ position: index })
      .eq('id', orderedIds[index])
  }

  revalidatePath(`/list/${listId}`)
}
