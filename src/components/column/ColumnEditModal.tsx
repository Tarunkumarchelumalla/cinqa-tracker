'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { COLOR_OPTIONS, COLOR_SWATCHES } from '@/lib/utils/statusColors'
import { updateColumn } from '@/lib/actions/column.actions'
import type { Column, StatusOption } from '@/types/app'

interface ColumnEditModalProps {
  open: boolean
  column: Column
  listId: string
  onClose: () => void
  onUpdated: (updated: Column) => void
}

export function ColumnEditModal({ open, column, listId, onClose, onUpdated }: ColumnEditModalProps) {
  const hasOptions = column.col_type === 'status' || column.col_type === 'dropdown'
  const config = column.config as { options?: StatusOption[] }

  const [name, setName] = useState(column.name)
  const [options, setOptions] = useState<StatusOption[]>(config?.options ?? [])
  const [saving, setSaving] = useState(false)

  const addOption = () => setOptions([...options, { label: '', color: 'gray' }])

  const updateOption = (i: number, field: keyof StatusOption, value: string) => {
    setOptions((prev) => prev.map((o, idx) => idx === i ? { ...o, [field]: value } : o))
  }

  const removeOption = (i: number) => setOptions((prev) => prev.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    setSaving(true)
    try {
      const newConfig = hasOptions ? { options } : {}
      await updateColumn(column.id, listId, { name, config: newConfig })
      onUpdated({ ...column, name, config: newConfig })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <h2 className="mb-4 text-base font-semibold text-white">Edit column</h2>

        <div className="space-y-4">
          <Input
            label="Column name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {hasOptions && (
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                Options
              </label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={opt.label}
                      onChange={(e) => updateOption(i, 'label', e.target.value)}
                      placeholder="Option label"
                      className="flex-1 rounded-md border border-white/10 bg-[#0A0F1E] px-3 py-1.5 text-sm text-white placeholder:text-white/20 focus:border-[#1A6BFF] focus:outline-none"
                    />
                    {/* Color swatches */}
                    <div className="flex gap-1">
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => updateOption(i, 'color', c.value)}
                          title={c.label}
                          className="h-5 w-5 rounded-full transition-transform hover:scale-110"
                          style={{
                            background: COLOR_SWATCHES[c.value],
                            outline: opt.color === c.value ? `2px solid white` : 'none',
                            outlineOffset: '1px',
                          }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => removeOption(i)}
                      className="text-white/20 hover:text-red-400 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={addOption}
                  className="flex items-center gap-1.5 text-xs text-[#5B9BFF] hover:text-[#1A6BFF] transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add option
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
