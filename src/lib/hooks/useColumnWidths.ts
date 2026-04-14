'use client'

import { useState, useCallback } from 'react'
import { COL_WIDTH } from '@/components/table/TableHeader'
import type { Column } from '@/types/app'

const STORAGE_KEY = 'cinqa:col-widths'

function readStored(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function writeStored(map: Record<string, number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // ignore
  }
}

export function useColumnWidths(columns: Column[]): {
  widths: Record<string, number>
  setWidth: (id: string, w: number) => void
} {
  const [widths, setWidths] = useState<Record<string, number>>(() => {
    const stored = readStored()
    const currentIds = new Set(columns.map((c) => c.id))

    // Build initial widths: stored value if present, else COL_WIDTH default
    const initial: Record<string, number> = {}
    for (const col of columns) {
      initial[col.id] = stored[col.id] ?? COL_WIDTH[col.col_type] ?? 200
    }

    // Prune stale keys from localStorage
    const pruned: Record<string, number> = {}
    for (const [id, w] of Object.entries(stored)) {
      if (currentIds.has(id)) pruned[id] = w
    }
    if (Object.keys(pruned).length !== Object.keys(stored).length) {
      writeStored(pruned)
    }

    return initial
  })

  const setWidth = useCallback((id: string, w: number) => {
    setWidths((prev) => {
      const next = { ...prev, [id]: w }
      // Merge with stored to preserve widths for columns not currently visible
      const stored = readStored()
      writeStored({ ...stored, [id]: w })
      return next
    })
  }, [])

  return { widths, setWidth }
}
