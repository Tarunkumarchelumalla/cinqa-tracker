'use client'

import { useState, useRef, useEffect } from 'react'
import { addColumn } from '@/lib/actions/column.actions'
import { COLOR_OPTIONS, COLOR_SWATCHES } from '@/lib/utils/statusColors'
import type { ColType, Column, StatusOption } from '@/types/app'

const COL_TYPES: { value: ColType; label: string }[] = [
  { value: 'text',     label: 'Text' },
  { value: 'number',   label: 'Number' },
  { value: 'url',      label: 'URL' },
  { value: 'date',     label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'status',   label: 'Status' },
  { value: 'user_ref', label: 'User' },
]

interface AddColumnButtonProps {
  listId: string
  columnCount: number
  onAdded: (col: Column) => void
}

export function AddColumnButton({ listId, columnCount, onAdded }: AddColumnButtonProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [colType, setColType] = useState<ColType>('text')
  const [options, setOptions] = useState<StatusOption[]>([])
  const [showOptions, setShowOptions] = useState(false)
  const [saving, setSaving] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  const hasOptions = colType === 'status' || colType === 'dropdown'

  useEffect(() => {
    if (open) setTimeout(() => nameRef.current?.focus(), 50)
  }, [open])

  // Reset when type changes
  useEffect(() => {
    setOptions([])
    setShowOptions(false)
  }, [colType])

  const handleAdd = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      const config = hasOptions ? { options } : {}
      const col = await addColumn(listId, name.trim(), colType, config, columnCount)
      onAdded(col as Column)
      setName('')
      setColType('text')
      setOptions([])
      setShowOptions(false)
      setOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const addOption = () => setOptions((p) => [...p, { label: '', color: 'gray' }])
  const updateOption = (i: number, field: keyof StatusOption, val: string) =>
    setOptions((p) => p.map((o, idx) => idx === i ? { ...o, [field]: val } : o))
  const removeOption = (i: number) =>
    setOptions((p) => p.filter((_, idx) => idx !== i))

  if (!open) {
    return (
      <th className="bg-[#0A0F1E] border-l border-white/[0.04]" style={{ width: 40, minWidth: 40 }}>
        <button
          onClick={() => setOpen(true)}
          title="Add column"
          className="flex h-full w-full items-center justify-center py-2.5 text-white/20 transition-colors hover:bg-white/[0.04] hover:text-white/60"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </th>
    )
  }

  return (
    <th
      className="bg-[#0D1220] border-l border-white/[0.06] align-top"
      style={{ minWidth: 280, width: 280 }}
    >
      <div className="p-3 space-y-2.5">
        {/* Name + type row */}
        <div className="flex gap-2">
          <input
            ref={nameRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setOpen(false) }}
            placeholder="Column name"
            className="flex-1 min-w-0 rounded-md border border-white/10 bg-[#0A0F1E] px-2.5 py-1.5 text-sm text-white placeholder:text-white/20 focus:border-[#1A6BFF] focus:outline-none"
          />
          <select
            value={colType}
            onChange={(e) => setColType(e.target.value as ColType)}
            className="rounded-md border border-white/10 bg-[#0A0F1E] px-2 py-1.5 text-xs text-white/70 focus:border-[#1A6BFF] focus:outline-none"
          >
            {COL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Configure options for status / dropdown */}
        {hasOptions && (
          <div>
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              <svg className={`h-3 w-3 transition-transform ${showOptions ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 8 12">
                <path d="M2 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
              {showOptions ? 'Hide options' : 'Configure options'}
              {options.length > 0 && <span className="text-white/30">({options.length})</span>}
            </button>

            {showOptions && (
              <div className="mt-2 space-y-1.5">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      value={opt.label}
                      onChange={(e) => updateOption(i, 'label', e.target.value)}
                      placeholder="Label"
                      className="flex-1 min-w-0 rounded-md border border-white/10 bg-[#060B18] px-2 py-1 text-xs text-white placeholder:text-white/20 focus:border-[#1A6BFF] focus:outline-none"
                    />
                    <div className="flex gap-0.5">
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => updateOption(i, 'color', c.value)}
                          title={c.label}
                          className="h-3.5 w-3.5 rounded-full transition-transform hover:scale-110"
                          style={{
                            background: COLOR_SWATCHES[c.value],
                            outline: opt.color === c.value ? '2px solid white' : 'none',
                            outlineOffset: '1px',
                          }}
                        />
                      ))}
                    </div>
                    <button onClick={() => removeOption(i)} className="text-white/20 hover:text-red-400 transition-colors">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={addOption}
                  className="flex items-center gap-1 text-xs text-[#5B9BFF] hover:text-[#1A6BFF] transition-colors"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add option
                </button>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={handleAdd}
            disabled={saving || !name.trim()}
            className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-[#060B18] transition-all hover:bg-[#E8EAEF] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'Adding…' : 'Add column'}
          </button>
          <button
            onClick={() => { setOpen(false); setName(''); setColType('text'); setOptions([]) }}
            className="rounded-md px-2 py-1.5 text-xs text-white/40 hover:bg-white/[0.05] hover:text-white/70 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </th>
  )
}
