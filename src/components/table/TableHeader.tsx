'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ColumnOptionsMenu } from '@/components/column/ColumnOptionsMenu'
import { AddColumnButton } from '@/components/column/AddColumnButton'
import type { Column } from '@/types/app'

// Fixed pixel widths per column type
export const COL_WIDTH: Record<string, number> = {
  checkbox: 72,
  number: 120,
  date: 148,
  url: 200,
  status: 152,
  dropdown: 152,
  user_ref: 172,
  text: 200,
}

interface HeaderCellProps {
  column: Column
  listId: string
  isAdmin: boolean
  onColumnUpdated: (updated: Column) => void
  onColumnDeleted: (columnId: string) => void
}

function SortableHeaderCell({ column, listId, isAdmin, onColumnUpdated, onColumnDeleted }: HeaderCellProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column.id })

  const w = COL_WIDTH[column.col_type] ?? 200

  return (
    <th
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        width: w,
        minWidth: w,
        maxWidth: w,
      }}
      className="group relative border-r border-white/[0.06] bg-[#0A0F1E] text-left"
    >
      <div className="flex items-center gap-1 px-3 py-2.5">
        {isAdmin && (
          <button
            {...attributes}
            {...listeners}
            className="flex h-4 w-3 shrink-0 cursor-grab items-center justify-center text-white/20 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
            tabIndex={-1}
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 8 12">
              <circle cx="2" cy="2" r="1.5" /><circle cx="6" cy="2" r="1.5" />
              <circle cx="2" cy="6" r="1.5" /><circle cx="6" cy="6" r="1.5" />
              <circle cx="2" cy="10" r="1.5" /><circle cx="6" cy="10" r="1.5" />
            </svg>
          </button>
        )}
        <span className="flex-1 truncate text-xs font-semibold uppercase tracking-wider text-white/40">
          {column.name}
        </span>
        {isAdmin && (
          <ColumnOptionsMenu
            column={column}
            listId={listId}
            onUpdated={onColumnUpdated}
            onDeleted={() => onColumnDeleted(column.id)}
          />
        )}
      </div>
    </th>
  )
}

interface TableHeaderProps {
  columns: Column[]
  listId: string
  isAdmin: boolean
  onColumnUpdated: (updated: Column) => void
  onColumnDeleted: (columnId: string) => void
  onColumnAdded: (col: Column) => void
}

export function TableHeader({
  columns,
  listId,
  isAdmin,
  onColumnUpdated,
  onColumnDeleted,
  onColumnAdded,
}: TableHeaderProps) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="border-b border-white/[0.08]">
        {columns.map((col) => (
          <SortableHeaderCell
            key={col.id}
            column={col}
            listId={listId}
            isAdmin={isAdmin}
            onColumnUpdated={onColumnUpdated}
            onColumnDeleted={onColumnDeleted}
          />
        ))}
        {isAdmin && (
          <AddColumnButton
            listId={listId}
            columnCount={columns.length}
            onAdded={onColumnAdded}
          />
        )}
      </tr>
    </thead>
  )
}
