'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ColumnConfig, ColType } from '@/types/app'
import type { Database, Json } from '@/types/database'

type ColumnRow = Database['public']['Tables']['list_columns']['Row']
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

  if ((profile as { role: string } | null)?.role !== 'admin') {
    throw new Error('Forbidden')
  }

  return supabase
}

export async function addColumn(
  listId: string,
  name: string,
  colType: ColType,
  config: ColumnConfig,
  position: number
): Promise<ColumnRow> {
  const supabase = await requireAdmin()

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
  const supabase = await requireAdmin()

  const { error } = await supabase
    .from('list_columns')
    .update({
      ...updates,
      ...(updates.config !== undefined
        ? { config: updates.config as unknown as Json }
        : {}),
    })
    .eq('id', columnId)

  if (error) throw new Error(error.message)

  revalidatePath(`/list/${listId}`)
}

export async function deleteColumn(
  columnId: string,
  listId: string
): Promise<void> {
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
): Promise<void> {
  const supabase = await requireAdmin()

  for (const [index, id] of orderedIds.entries()) {
    await supabase
      .from('list_columns')
      .update({ position: index })
      .eq('id', id)
  }

  revalidatePath(`/list/${listId}`)
}
