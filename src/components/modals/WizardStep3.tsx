'use client'

import { Button } from '@/components/ui/Button'
import type { DraftColumn } from '@/types/app'

interface WizardStep3Props {
  listName: string
  columns: DraftColumn[]
  onBack: () => void
  onCreate: () => void
  creating: boolean
}

const TYPE_LABELS: Record<string, string> = {
  text: 'Text',
  number: 'Number',
  url: 'URL',
  date: 'Date',
  checkbox: 'Checkbox',
  dropdown: 'Dropdown',
  status: 'Status',
  user_ref: 'User',
}

export function WizardStep3({ listName, columns, onBack, onCreate, creating }: WizardStep3Props) {
  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Confirm &amp; create</h2>
        <p className="mt-1 text-sm text-white/40">Review your list before creating it.</p>
      </div>

      <div className="rounded-lg border border-white/[0.06] bg-[#0A0F1E] p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold uppercase" style={{ background: 'rgba(26,107,255,0.15)', color: '#5B9BFF' }}>
            {listName.charAt(0)}
          </span>
          <span className="text-sm font-medium text-white">{listName}</span>
        </div>

        {columns.length === 0 ? (
          <p className="text-xs text-white/30">No columns defined — you can add them later.</p>
        ) : (
          <div className="space-y-1">
            {columns.map((col, i) => (
              <div key={col.id} className="flex items-center justify-between rounded px-2 py-1 hover:bg-white/[0.03]">
                <span className="text-sm text-white/80">{col.name || <em className="text-white/30">Unnamed</em>}</span>
                <span className="text-xs text-white/30">{TYPE_LABELS[col.col_type] ?? col.col_type}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-white/30">
        {columns.length} column{columns.length !== 1 ? 's' : ''}
      </p>

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={onBack} disabled={creating}>Back</Button>
        <Button onClick={onCreate} disabled={creating}>
          {creating ? 'Creating…' : 'Create list'}
        </Button>
      </div>
    </div>
  )
}
