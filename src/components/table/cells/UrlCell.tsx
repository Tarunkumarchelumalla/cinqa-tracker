'use client'

import { useState, useRef } from 'react'

interface UrlCellProps {
  value: string
  onChange: (val: string) => void
  readOnly?: boolean
}

export function UrlCell({ value, onChange, readOnly }: UrlCellProps) {
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
        type="url"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') { setEditing(false); setDraft(value) }
        }}
        className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none ring-1 ring-inset ring-[#1A6BFF] min-h-[36px]"
        placeholder="https://"
      />
    )
  }

  return (
    <div
      className="flex min-h-[36px] w-full items-center px-3 py-1.5 hover:bg-white/[0.03]"
      onClick={startEdit}
    >
      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="truncate text-sm text-[#5B9BFF] hover:underline"
        >
          {value.replace(/^https?:\/\//, '')}
        </a>
      ) : (
        <span className="cursor-text text-sm text-white/20">—</span>
      )}
    </div>
  )
}
