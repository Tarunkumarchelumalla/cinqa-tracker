'use client'

import { useState, useRef } from 'react'
import { Popover } from '@/components/ui/Popover'
import { Pill } from '@/components/ui/Pill'
import type { StatusOption } from '@/types/app'

interface StatusCellProps {
  value: string
  options: StatusOption[]
  onChange: (val: string) => void
  readOnly?: boolean
}

export function StatusCell({ value, options, onChange, readOnly }: StatusCellProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.label === value)

  return (
    <div className="relative w-full">
      <div
        ref={triggerRef}
        onClick={() => !readOnly && setOpen(true)}
        className="flex min-h-[36px] w-full cursor-pointer items-center px-3 py-1.5 hover:bg-white/[0.03]"
      >
        {selected ? (
          <Pill label={selected.label} color={selected.color} />
        ) : (
          <span className="text-sm text-white/20">—</span>
        )}
      </div>

      <Popover open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} className="min-w-[160px]">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => { onChange(opt.label); setOpen(false) }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-white/[0.06]"
          >
            <Pill label={opt.label} color={opt.color} />
          </button>
        ))}
        {value && (
          <button
            onClick={() => { onChange(''); setOpen(false) }}
            className="flex w-full items-center gap-2 border-t border-white/[0.06] px-3 py-1.5 text-left text-xs text-white/30 transition-colors hover:bg-white/[0.06]"
          >
            Clear
          </button>
        )}
      </Popover>
    </div>
  )
}
