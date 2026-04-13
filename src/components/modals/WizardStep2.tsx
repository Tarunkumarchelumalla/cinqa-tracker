'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/Button'
import { COLOR_OPTIONS, COLOR_SWATCHES } from '@/lib/utils/statusColors'
import type { DraftColumn, ColType, StatusOption } from '@/types/app'

const COL_TYPES: { value: ColType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'url', label: 'URL' },
  { value: 'date', label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'status', label: 'Status' },
  { value: 'user_ref', label: 'User' },
]

function generateId() {
  return Math.random().toString(36).slice(2)
}

interface ColumnRowProps {
  col: DraftColumn
  onChange: (id: string, updates: Partial<DraftColumn>) => void
  onRemove: (id: string) => void
}

function SortableColumnRow({ col, onChange, onRemove }: ColumnRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: col.id })
  const [configOpen, setConfigOpen] = useState(false)
  const hasOptions = col.col_type === 'status' || col.col_type === 'dropdown'
  const config = col.config as { options?: StatusOption[] }
  const options = config?.options ?? []

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  const updateOption = (i: number, field: keyof StatusOption, value: string) => {
    const newOptions = options.map((o, idx) => idx === i ? { ...o, [field]: value } : o)
    onChange(col.id, { config: { options: newOptions } })
  }

  const addOption = () => {
    onChange(col.id, { config: { options: [...options, { label: '', color: 'gray' }] } })
  }

  const removeOption = (i: number) => {
    onChange(col.id, { config: { options: options.filter((_, idx) => idx !== i) } })
  }

  return (
    <div ref={setNodeRef} style={style} className="rounded-lg border border-white/[0.06] bg-[#0A0F1E]">
      <div className="flex items-center gap-2 p-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-white/20 hover:text-white/40 active:cursor-grabbing"
          tabIndex={-1}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 8 12">
            <circle cx="2" cy="2" r="1.5" />
            <circle cx="6" cy="2" r="1.5" />
            <circle cx="2" cy="6" r="1.5" />
            <circle cx="6" cy="6" r="1.5" />
            <circle cx="2" cy="10" r="1.5" />
            <circle cx="6" cy="10" r="1.5" />
          </svg>
        </button>

        <input
          value={col.name}
          onChange={(e) => onChange(col.id, { name: e.target.value })}
          placeholder="Column name"
          className="flex-1 rounded-md border border-white/10 bg-transparent px-2 py-1.5 text-sm text-white placeholder:text-white/20 focus:border-[#1A6BFF] focus:outline-none"
        />

        <select
          value={col.col_type}
          onChange={(e) => onChange(col.id, { col_type: e.target.value as ColType, config: {} })}
          className="rounded-md border border-white/10 bg-[#060B18] px-2 py-1.5 text-sm text-white/80 focus:border-[#1A6BFF] focus:outline-none"
        >
          {COL_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {hasOptions && (
          <button
            onClick={() => setConfigOpen(!configOpen)}
            className="rounded-md border border-white/10 px-2 py-1.5 text-xs text-white/50 hover:border-white/20 hover:text-white/80 transition-colors"
          >
            Configure
          </button>
        )}

        <button
          onClick={() => onRemove(col.id)}
          className="text-white/20 hover:text-red-400 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Options editor */}
      {hasOptions && configOpen && (
        <div className="border-t border-white/[0.06] p-3 space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={opt.label}
                onChange={(e) => updateOption(i, 'label', e.target.value)}
                placeholder="Option label"
                className="flex-1 rounded-md border border-white/10 bg-[#060B18] px-2 py-1.5 text-xs text-white placeholder:text-white/20 focus:border-[#1A6BFF] focus:outline-none"
              />
              <div className="flex gap-1">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => updateOption(i, 'color', c.value)}
                    title={c.label}
                    className="h-4 w-4 rounded-full transition-transform hover:scale-110"
                    style={{
                      background: COLOR_SWATCHES[c.value],
                      outline: opt.color === c.value ? '2px solid white' : 'none',
                      outlineOffset: '1px',
                    }}
                  />
                ))}
              </div>
              <button onClick={() => removeOption(i)} className="text-white/20 hover:text-red-400 transition-colors">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={addOption}
            className="flex items-center gap-1.5 text-xs text-[#5B9BFF] hover:text-[#1A6BFF] transition-colors"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add option
          </button>
        </div>
      )}
    </div>
  )
}

interface WizardStep2Props {
  columns: DraftColumn[]
  onChange: (columns: DraftColumn[]) => void
  onBack: () => void
  onNext: () => void
}

export function WizardStep2({ columns, onChange, onBack, onNext }: WizardStep2Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const addColumn = () => {
    onChange([...columns, {
      id: generateId(),
      name: '',
      col_type: 'text',
      config: {},
      position: columns.length,
    }])
  }

  const updateCol = (id: string, updates: Partial<DraftColumn>) => {
    onChange(columns.map((c) => c.id === id ? { ...c, ...updates } : c))
  }

  const removeCol = (id: string) => {
    onChange(columns.filter((c) => c.id !== id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = columns.findIndex((c) => c.id === active.id)
    const newIndex = columns.findIndex((c) => c.id === over.id)
    onChange(arrayMove(columns, oldIndex, newIndex).map((c, i) => ({ ...c, position: i })))
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Define columns</h2>
        <p className="mt-1 text-sm text-white/40">Add and configure the columns for this list.</p>
      </div>

      <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={columns.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            {columns.map((col) => (
              <SortableColumnRow
                key={col.id}
                col={col}
                onChange={updateCol}
                onRemove={removeCol}
              />
            ))}
          </SortableContext>
        </DndContext>

        <button
          onClick={addColumn}
          className="flex w-full items-center gap-2 rounded-lg border border-dashed border-white/10 px-3 py-2.5 text-sm text-white/30 transition-colors hover:border-white/20 hover:text-white/60"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add column
        </button>
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>
          Next
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
