'use client'

import { useState } from 'react'
import { downloadCsv, exportToExcel } from '@/lib/export/exportTable'
import type { Column, RecordWithValues } from '@/types/app'

interface ExportMenuProps {
  listName: string
  columns: Column[]
  records: RecordWithValues[]
}

export function ExportMenu({ listName, columns, records }: ExportMenuProps) {
  const [open, setOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleCsv = () => {
    downloadCsv(listName, columns, records)
    setOpen(false)
  }

  const handleExcel = async () => {
    setExporting(true)
    try {
      await exportToExcel(listName, columns, records)
    } finally {
      setExporting(false)
    }
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-7 items-center gap-1.5 rounded px-2 text-xs text-white/40 hover:bg-white/[0.05] hover:text-white/70 transition-colors border border-white/[0.08]"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-40 mt-1 w-48 rounded-lg border border-white/[0.08] bg-[#0D1220] py-1 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <button
              onClick={handleCsv}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-white/80 hover:bg-white/[0.05] transition-colors"
            >
              <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as CSV
            </button>
            <button
              onClick={handleExcel}
              disabled={exporting}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-white/80 hover:bg-white/[0.05] transition-colors disabled:opacity-50"
            >
              <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {exporting ? 'Exporting…' : 'Export as Excel (.xlsx)'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
