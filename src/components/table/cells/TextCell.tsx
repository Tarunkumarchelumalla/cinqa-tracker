'use client'

import { useState, useRef } from 'react'

interface TextCellProps {
  value: string
  onChange: (val: string) => void
  readOnly?: boolean
}

export function TextCell({ value, onChange, readOnly }: TextCellProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  const startEdit = () => {
    if (readOnly) return
    setDraft(value)
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const commit = () => {
    setEditing(false)
    if (draft !== value) onChange(draft)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') { setEditing(false); setDraft(value) }
        }}
        className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none ring-1 ring-inset ring-[#1A6BFF] min-h-[36px]"
      />
    )
  }

  return (
    <div
      onClick={startEdit}
      className="flex min-h-[36px] w-full cursor-text items-center px-3 py-1.5 text-sm text-white/90 hover:bg-white/[0.03]"
    >
      <span className="truncate">{value || <span className="text-white/20">—</span>}</span>
    </div>
  )
}
