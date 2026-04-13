import { cn } from '@/lib/utils/cn'
import { getStatusColorClasses } from '@/lib/utils/statusColors'

interface PillProps {
  label: string
  color?: string
  className?: string
}

export function Pill({ label, color, className }: PillProps) {
  const colorClasses = color ? getStatusColorClasses(color) : 'bg-gray-100 text-gray-700'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorClasses,
        className
      )}
    >
      {label}
    </span>
  )
}
