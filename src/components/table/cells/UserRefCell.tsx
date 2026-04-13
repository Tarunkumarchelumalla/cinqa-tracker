'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Popover } from '@/components/ui/Popover'
import { useProfiles } from '@/lib/hooks/useProfiles'

interface UserRefCellProps {
  value: string
  onChange: (val: string) => void
  readOnly?: boolean
}

export function UserRefCell({ value, onChange, readOnly }: UserRefCellProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const profiles = useProfiles()
  const selected = profiles.find((p) => p.id === value)

  return (
    <div className="relative w-full">
      <div
        ref={triggerRef}
        onClick={() => !readOnly && setOpen(true)}
        className="flex min-h-[36px] w-full cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-white/[0.03]"
      >
        {selected ? (
          <>
            {selected.avatar_url ? (
              <Image src={selected.avatar_url} alt="" width={20} height={20} className="rounded-full" />
            ) : (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1A6BFF]/20 text-[10px] font-semibold text-[#5B9BFF]">
                {(selected.full_name ?? selected.email).charAt(0).toUpperCase()}
              </div>
            )}
            <span className="truncate text-sm text-white/90">{selected.full_name ?? selected.email}</span>
          </>
        ) : (
          <span className="text-sm text-white/20">—</span>
        )}
      </div>

      <Popover open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} className="w-[220px] max-h-[240px] overflow-y-auto">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => { onChange(p.id); setOpen(false) }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-white/[0.06]"
          >
            {p.avatar_url ? (
              <Image src={p.avatar_url} alt="" width={24} height={24} className="rounded-full" />
            ) : (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1A6BFF]/20 text-xs font-semibold text-[#5B9BFF]">
                {(p.full_name ?? p.email).charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm text-white/90">{p.full_name ?? '—'}</p>
              <p className="truncate text-xs text-white/30">{p.email}</p>
            </div>
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
