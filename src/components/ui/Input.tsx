'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium uppercase tracking-wider text-[#E8EAEF]/50">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-md border border-white/10 bg-[#0A0F1E] px-3 py-2 text-sm text-white placeholder:text-white/30 transition-colors focus:border-[#1A6BFF] focus:outline-none',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'
