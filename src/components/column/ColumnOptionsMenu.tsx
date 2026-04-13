'use client'

import { useState } from 'react'
import { ColumnEditModal } from './ColumnEditModal'
import { deleteColumn } from '@/lib/actions/column.actions'
import type { Column } from '@/types/app'

interface ColumnOptionsMenuProps {
  column: Column
  listId: string
  onUpdated: (updated: Column) => void
  onDeleted: () => void
}

export function ColumnOptionsMenu({ column, listId, onUpdated, onDeleted }: ColumnOptionsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete column "${column.name}"? All values will be lost.`)) return
    setDeleting(true)
    try {
      await deleteColumn(column.id, listId)
      onDeleted()
    } finally {
      setDeleting(false)
    }
    setMenuOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
        className="flex h-5 w-5 items-center justify-center rounded text-white/20 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/10 hover:text-white/60"
      >
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-full z-40 mt-1 w-44 rounded-lg border border-white/[0.08] bg-[#0D1220] py-1 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => { setEditOpen(true); setMenuOpen(false) }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white/80 hover:bg-white/[0.05] transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit column
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete column
            </button>
          </div>
        </>
      )}

      <ColumnEditModal
        open={editOpen}
        column={column}
        listId={listId}
        onClose={() => setEditOpen(false)}
        onUpdated={onUpdated}
      />
    </div>
  )
}
