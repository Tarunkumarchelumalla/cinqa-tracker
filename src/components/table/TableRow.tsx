'use client'

import { useState } from 'react'
import { TableCell } from './TableCell'
import { deleteRecord } from '@/lib/actions/record.actions'
import { COL_WIDTH } from './TableHeader'
import type { Column, RecordWithValues } from '@/types/app'

interface TableRowProps {
  record: RecordWithValues
  columns: Column[]
  listId: string
  onValueChange: (recordId: string, columnId: string, value: string) => void
  onDelete: (recordId: string) => void
  isAdmin: boolean
  canEdit: boolean
}

export function TableRow({ record, columns, listId, onValueChange, onDelete, isAdmin, canEdit }: TableRowProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this record?')) return
    setDeleting(true)
    try {
      await deleteRecord(record.id, listId)
      onDelete(record.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <tr className="group border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors">
      {columns.map((col, i) => {
        const w = COL_WIDTH[col.col_type] ?? 200
        return (
          <td
            key={col.id}
            style={{ width: w, minWidth: w, maxWidth: w, position: 'relative', overflow: 'visible' }}
            className="border-r border-white/[0.05] align-middle"
          >
            {/* Delete button — only on first cell, admin only */}
            {i === 0 && isAdmin && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                title="Delete record"
                className="absolute -left-1 top-1/2 z-10 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded text-white/20 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="overflow-hidden" style={{ maxWidth: w }}>
              <TableCell
                column={col}
                value={record.values[col.id] ?? ''}
                onChange={(val) => onValueChange(record.id, col.id, val)}
                readOnly={!canEdit}
              />
            </div>
          </td>
        )
      })}
    </tr>
  )
}
