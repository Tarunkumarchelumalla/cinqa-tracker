const COLOR_MAP: Record<string, string> = {
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  orange: 'bg-orange-100 text-orange-800',
  gray: 'bg-gray-100 text-gray-700',
}

export function getStatusColorClasses(color: string): string {
  return COLOR_MAP[color.toLowerCase()] ?? COLOR_MAP.gray
}

export const COLOR_OPTIONS = [
  { label: 'Green', value: 'green' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
  { label: 'Purple', value: 'purple' },
  { label: 'Orange', value: 'orange' },
  { label: 'Gray', value: 'gray' },
]

export const COLOR_SWATCHES: Record<string, string> = {
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
  blue: '#3b82f6',
  purple: '#a855f7',
  orange: '#f97316',
  gray: '#6b7280',
}
