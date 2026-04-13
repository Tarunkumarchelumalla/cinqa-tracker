'use client'

import { useState } from 'react'
import { addRecord } from '@/lib/actions/record.actions'
import type { Column, RecordWithValues } from '@/types/app'

interface AddRecordRowProps {
  listId: string
  columns: Column[]
  recordCount: number
  onAdded: (record: RecordWithValues) => void
}

export function AddRecordRow({
  listId,
  columns,
  recordCount,
  onAdded,
}: AddRecordRowProps) {
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    setLoading(true)
    try {
      // ✅ FIX: enforce type
      const record: RecordWithValues = await addRecord(listId, recordCount)

      onAdded({ ...record, values: record.values ?? {} })
    } finally {
      setLoading(false)
    }
  }

  return (
    <tr className="border-b border-white/[0.05]">
      <td colSpan={columns.length}>
        <button
          onClick={handleAdd}
          disabled={loading}
          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/30 transition-colors hover:bg-white/[0.02] hover:text-white/60 disabled:opacity-50"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {loading ? 'Adding…' : 'Add record'}
        </button>
      </td>
    </tr>
  )
}