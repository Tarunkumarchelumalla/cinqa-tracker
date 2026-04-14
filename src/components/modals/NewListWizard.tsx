'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { WizardStep1 } from './WizardStep1'
import { WizardStep2 } from './WizardStep2'
import { WizardStep3 } from './WizardStep3'
import { createList } from '@/lib/actions/list.actions'
import type { DraftColumn, List, Profile } from '@/types/app'

interface NewListWizardProps {
  open: boolean
  onClose: () => void
  onCreated: (list: List) => void
  profile: Profile
  existingLists: List[]
}

export function NewListWizard({
  open,
  onClose,
  onCreated,
  profile,
  existingLists,
}: NewListWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [listName, setListName] = useState('')
  const [columns, setColumns] = useState<DraftColumn[]>([])
  const [creating, setCreating] = useState(false)

  const reset = () => {
    setStep(1)
    setListName('')
    setColumns([])
    setCreating(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleCreate = async () => {
    setCreating(true)
    try {
      const list: List = await createList(listName.trim(), columns)
      onCreated(list)
      reset()
      onClose()
      router.push(`/list/${list.id}`)
    } catch (err) {
      console.error('Failed to create list:', err)
      setCreating(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} className="max-w-2xl">
      {/* Step indicator */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-6 py-3">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium transition-colors"
              style={{
                background: step >= s ? '#1A6BFF' : 'rgba(255,255,255,0.08)',
                color: step >= s ? 'white' : 'rgba(255,255,255,0.3)',
              }}
            >
              {step > s ? (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s
              )}
            </div>
            <span className="text-xs text-white/40">
              {s === 1 ? 'Name' : s === 2 ? 'Columns' : 'Confirm'}
            </span>
            {s < 3 && <div className="h-px w-6 bg-white/[0.08]" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <WizardStep1
          listName={listName}
          onChange={setListName}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <WizardStep2
          columns={columns}
          existingLists={existingLists}
          onChange={setColumns}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <WizardStep3
          listName={listName}
          columns={columns}
          onBack={() => setStep(2)}
          onCreate={handleCreate}
          creating={creating}
        />
      )}
    </Modal>
  )
}
