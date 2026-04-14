'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'
import type { RecordWithValues } from '@/types/app'

type RecordRow = Database['public']['Tables']['list_records']['Row']

export async function addRecord(listId: string, position: number): Promise<RecordRow> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if ((profile as { role: string } | null)?.role !== 'admin') throw new Error('Forbidden')

  const { data, error } = await supabase
    .from('list_records')
    .insert({ list_id: listId, position })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as RecordRow
}

export async function updateValue(
  recordId: string,
  columnId: string,
  value: string
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('record_values')
    .upsert(
      { record_id: recordId, column_id: columnId, value },
      { onConflict: 'record_id,column_id' }
    )

  if (error) throw new Error(error.message)
}

export async function deleteRecord(recordId: string, listId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((profile as { role: string } | null)?.role !== 'admin') throw new Error('Forbidden')

  const { error } = await supabase
    .from('list_records')
    .delete()
    .eq('id', recordId)

  if (error) throw new Error(error.message)
  revalidatePath(`/list/${listId}`)
}

export async function copyRecords(
  listId: string,
  records: { values: Record<string, string> }[],
  startPosition: number
): Promise<RecordWithValues[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = (profile as { role: string } | null)?.role
  if (role !== 'admin' && role !== 'editor') throw new Error('Forbidden')

  const results: RecordWithValues[] = []

  for (let i = 0; i < records.length; i++) {
    const { data: newRec, error: recErr } = await supabase
      .from('list_records')
      .insert({ list_id: listId, position: startPosition + i })
      .select()
      .single()

    if (recErr || !newRec) throw new Error(recErr?.message ?? 'Failed to insert record')

    const rec = newRec as RecordRow
    const valueEntries = Object.entries(records[i].values).filter(([, v]) => v !== '')

    if (valueEntries.length > 0) {
      const { error: valErr } = await supabase.from('record_values').insert(
        valueEntries.map(([columnId, value]) => ({
          record_id: rec.id,
          column_id: columnId,
          value,
        }))
      )
      if (valErr) throw new Error(valErr.message)
    }

    results.push({ ...rec, values: records[i].values })
  }

  return results
}
