'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils/cn'

interface PopoverProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  triggerRef?: React.RefObject<HTMLElement>
}

export function Popover({ open, onClose, children, className, triggerRef }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  // Position relative to trigger element
  useEffect(() => {
    if (!open || !triggerRef?.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    })
  }, [open, triggerRef])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) {
      document.addEventListener('mousedown', handleClick)
      document.addEventListener('keydown', handleKey)
    }
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  if (!open) return null

  const content = (
    <div
      ref={ref}
      style={triggerRef ? { position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 } : {}}
      className={cn(
        'rounded-lg border border-white/[0.08] bg-[#0D1220] py-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)]',
        !triggerRef && 'absolute left-0 top-full mt-1 z-40',
        className
      )}
    >
      {children}
    </div>
  )

  // Use portal when triggerRef is provided (table cells) to escape stacking context
  if (triggerRef && typeof document !== 'undefined') {
    return createPortal(content, document.body)
  }

  return content
}
