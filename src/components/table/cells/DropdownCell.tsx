'use client'

import { useState, useRef } from 'react'
import { Popover } from '@/components/ui/Popover'
import { COLOR_SWATCHES } from '@/lib/utils/statusColors'
import type { StatusOption } from '@/types/app'

interface DropdownCellProps {
  value: string
  options: StatusOption[]
  onChange: (val: string) => void
  readOnly?: boolean
}

export function DropdownCell({ value, options, onChange, readOnly }: DropdownCellProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.label === value)

  return (
    <div className="relative w-full">
      <div
        ref={triggerRef}
        onClick={() => !readOnly && setOpen(true)}
        className="flex min-h-[36px] w-full cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-white/[0.03]"
      >
        {selected && (
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: COLOR_SWATCHES[selected.color] ?? '#6b7280' }}
          />
        )}
        {value ? (
          <span className="truncate text-sm text-white/90">{value}</span>
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
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: COLOR_SWATCHES[opt.color] ?? '#6b7280' }}
            />
            <span className="text-sm text-white/80">{opt.label}</span>
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
