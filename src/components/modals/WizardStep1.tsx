'use client'

import { useRef, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface WizardStep1Props {
  listName: string
  onChange: (name: string) => void
  onNext: () => void
}

export function WizardStep1({ listName, onChange, onNext }: WizardStep1Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">New list</h2>
        <p className="mt-1 text-sm text-white/40">Give your list a name to get started.</p>
      </div>

      <Input
        ref={inputRef}
        label="List name"
        value={listName}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. ai-influencer"
        onKeyDown={(e) => { if (e.key === 'Enter' && listName.trim()) onNext() }}
      />

      <div className="mt-6 flex justify-end">
        <Button onClick={onNext} disabled={!listName.trim()}>
          Next
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
