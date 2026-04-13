import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'
import { ListTable } from '@/components/table/ListTable'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Column, RecordWithValues } from '@/types/app'
import type { Database } from '@/types/database'

// ✅ Extract proper DB types
type ListRecordRow = Database['public']['Tables']['list_records']['Row']
type RecordValueRow = Database['public']['Tables']['record_values']['Row']
type ListColumnRow = Database['public']['Tables']['list_columns']['Row']

export default async function ListPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [
    { data: profile },
    { data: lists },
    { data: list },
    { data: columnsRaw },
    { data: recordsRaw },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('lists').select('*').order('created_at'),
    supabase.from('lists').select('*').eq('id', params.id).single(),
    supabase
      .from('list_columns')
      .select('*')
      .eq('list_id', params.id)
      .order('position'),
    supabase
      .from('list_records')
      .select('*, record_values(*)')
      .eq('list_id', params.id)
      .order('position'),
  ])

  if (!profile) redirect('/login')
  if (!list) redirect('/')

  // ✅ Properly type columns
  const columns: Column[] = ((columnsRaw ?? []) as ListColumnRow[]).map((c) => ({
    id: c.id,
    list_id: c.list_id,
    name: c.name,
    col_type: c.col_type,
    config: (c.config ?? {}) as Column['config'],
    position: c.position,
    created_at: c.created_at,
  }))

  // ✅ Properly type records (FIXES your Vercel error)
  const records: RecordWithValues[] = (
    (recordsRaw ?? []) as (ListRecordRow & {
      record_values: RecordValueRow[]
    })[]
  ).map((r) => ({
    id: r.id,
    list_id: r.list_id,
    position: r.position,
    created_at: r.created_at,
    values: Object.fromEntries(
      (r.record_values ?? []).map((v) => [
        v.column_id,
        v.value ?? '',
      ])
    ),
  }))

  return (
    <AppShell lists={lists ?? []} profile={profile}>
      <ListTable
        list={list}
        initialColumns={columns}
        initialRecords={records}
        profile={profile}
      />
    </AppShell>
  )
}