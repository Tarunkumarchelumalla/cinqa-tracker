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
  columnWidths: Record<string, number>
  onValueChange: (recordId: string, columnId: string, value: string) => void
  onDelete: (recordId: string) => void
  isAdmin: boolean
  canEdit: boolean
  isSelected: boolean
  onSelect: (id: string, checked: boolean) => void
}

export function TableRow({ record, columns, listId, columnWidths, onValueChange, onDelete, isAdmin, canEdit, isSelected, onSelect }: TableRowProps) {
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
    <tr className={`group border-b border-white/[0.05] transition-colors ${isSelected ? 'bg-[#1A6BFF]/[0.06]' : 'hover:bg-white/[0.03]'}`}>
      {/* Fixed checkbox + delete cell */}
      <td
        className="border-r border-white/[0.05] align-middle"
        style={{ width: 40, minWidth: 40, maxWidth: 40, position: 'relative' }}
      >
        <div className="flex items-center justify-center px-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(record.id, e.target.checked)}
            className="h-3.5 w-3.5 cursor-pointer rounded border-white/20 bg-transparent accent-[#1A6BFF]"
          />
        </div>
        {/* Delete button — admin only, shows on hover */}
        {isAdmin && (
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
      </td>

      {columns.map((col) => {
        const w = columnWidths[col.id] ?? COL_WIDTH[col.col_type] ?? 200
        return (
          <td
            key={col.id}
            style={{ width: w, minWidth: w, maxWidth: w }}
            className="border-r border-white/[0.05] align-middle"
          >
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
