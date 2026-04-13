'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#1A6BFF]/40'

    const variants = {
      primary: 'bg-white text-[#060B18] hover:bg-[#E8EAEF]',
      secondary: 'bg-transparent text-white border border-white/15 hover:border-white/30 hover:bg-white/5',
      ghost: 'bg-transparent text-[#E8EAEF] hover:bg-white/5',
      danger: 'bg-transparent text-red-400 border border-red-500/20 hover:bg-red-500/10',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
