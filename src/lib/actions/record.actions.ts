'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addRecord(listId: string, position: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('list_records')
    .insert({ list_id: listId, position })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateValue(
  recordId: string,
  columnId: string,
  value: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('record_values')
    .upsert({ record_id: recordId, column_id: columnId, value }, { onConflict: 'record_id,column_id' })

  if (error) throw new Error(error.message)
}

export async function deleteRecord(recordId: string, listId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Forbidden')

  const { error } = await supabase
    .from('list_records')
    .delete()
    .eq('id', recordId)

  if (error) throw new Error(error.message)
  revalidatePath(`/list/${listId}`)
}
