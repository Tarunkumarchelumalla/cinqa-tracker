'use client'

interface CheckboxCellProps {
  value: string
  onChange: (val: string) => void
  readOnly?: boolean
}

export function CheckboxCell({ value, onChange, readOnly }: CheckboxCellProps) {
  const checked = value === 'true'

  return (
    <div className="flex min-h-[36px] w-full items-center justify-center px-3">
      <button
        onClick={() => !readOnly && onChange(checked ? 'false' : 'true')}
        disabled={readOnly}
        className="flex h-4 w-4 items-center justify-center rounded border transition-colors disabled:cursor-default"
        style={{
          background: checked ? '#1A6BFF' : 'transparent',
          borderColor: checked ? '#1A6BFF' : 'rgba(255,255,255,0.2)',
        }}
      >
        {checked && (
          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  )
}
