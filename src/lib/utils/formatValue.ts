import type { ColType } from '@/types/app'

export function formatDisplayValue(value: string | undefined, colType: ColType): string {
  if (!value) return ''

  switch (colType) {
    case 'checkbox':
      return value === 'true' ? '✓' : ''
    case 'date':
      try {
        return new Date(value).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      } catch {
        return value
      }
    default:
      return value
  }
}
