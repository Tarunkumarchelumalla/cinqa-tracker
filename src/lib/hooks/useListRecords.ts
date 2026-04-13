'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateValue } from '@/lib/actions/record.actions'
import type { Column, RecordWithValues } from '@/types/app'

export function useListRecords(
  listId: string,
  initialRecords: RecordWithValues[],
  initialColumns: Column[]
) {
  const [records, setRecords] = useState<RecordWithValues[]>(initialRecords)
  const [columns, setColumns] = useState<Column[]>(initialColumns)

  // Realtime subscription for record_values changes
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`list-${listId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'list_records', filter: `list_id=eq.${listId}` },
        async () => {
          // Re-fetch records and values
          const { data: recs } = await supabase
            .from('list_records')
            .select('*, record_values(*)')
            .eq('list_id', listId)
            .order('position')

          if (recs) {
            setRecords(recs.map((r) => ({
              ...r,
              values: Object.fromEntries(
                (r.record_values ?? []).map((v: { column_id: string; value: string | null }) => [v.column_id, v.value ?? ''])
              ),
            })))
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'record_values' },
        async (payload) => {
          const changed = payload.new as { record_id: string; column_id: string; value: string } | null
          if (!changed) return

          setRecords((prev) =>
            prev.map((rec) => {
              if (rec.id !== changed.record_id) return rec
              return {
                ...rec,
                values: { ...rec.values, [changed.column_id]: changed.value ?? '' },
              }
            })
          )
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [listId])

  const handleValueChange = useCallback(
    async (recordId: string, columnId: string, value: string) => {
      // Optimistic update
      setRecords((prev) =>
        prev.map((rec) => {
          if (rec.id !== recordId) return rec
          return { ...rec, values: { ...rec.values, [columnId]: value } }
        })
      )
      // Persist
      await updateValue(recordId, columnId, value)
    },
    []
  )

  const addRecord = useCallback(
    (newRecord: RecordWithValues) => {
      setRecords((prev) => [...prev, newRecord])
    },
    []
  )

  const removeRecord = useCallback((recordId: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== recordId))
  }, [])

  return { records, columns, setColumns, handleValueChange, addRecord, removeRecord }
}
