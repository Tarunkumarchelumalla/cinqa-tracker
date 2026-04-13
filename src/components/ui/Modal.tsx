'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Card */}
      <div
        className={cn(
          'relative z-10 w-full max-w-lg rounded-xl border border-white/[0.06] bg-[#0D1220] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_48px_rgba(0,0,0,0.6)]',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
