'use client'

import { useState, useRef } from 'react'

interface DateCellProps {
  value: string
  onChange: (val: string) => void
  readOnly?: boolean
}

export function DateCell({ value, onChange, readOnly }: DateCellProps) {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const startEdit = () => {
    if (readOnly) return
    setEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      try { inputRef.current?.showPicker() } catch { /* not supported in all browsers */ }
    }, 50)
  }

  const commit = (val: string) => {
    setEditing(false)
    if (val !== value) onChange(val)
  }

  const display = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="date"
        defaultValue={value}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit((e.target as HTMLInputElement).value)
          if (e.key === 'Escape') setEditing(false)
        }}
        className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none ring-1 ring-inset ring-[#1A6BFF] min-h-[36px]"
        style={{ colorScheme: 'dark' }}
      />
    )
  }

  return (
    <div
      onClick={startEdit}
      className="flex min-h-[36px] w-full cursor-text items-center px-3 py-1.5 text-sm text-white/90 hover:bg-white/[0.03]"
    >
      {display || <span className="text-white/20">—</span>}
    </div>
  )
}
