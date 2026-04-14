'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ColumnOptionsMenu } from '@/components/column/ColumnOptionsMenu'
import { AddColumnButton } from '@/components/column/AddColumnButton'
import type { Column } from '@/types/app'

// Default pixel widths per column type (used as fallback when no custom width set)
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
  width: number
  onResize: (w: number) => void
  onColumnUpdated: (updated: Column) => void
  onColumnDeleted: (columnId: string) => void
}

function SortableHeaderCell({ column, listId, isAdmin, width, onResize, onColumnUpdated, onColumnDeleted }: HeaderCellProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column.id })

  return (
    <th
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        width,
        minWidth: width,
        maxWidth: width,
        position: 'relative',
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

      {/* Resize handle */}
      <div
        className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none opacity-0 group-hover:opacity-100 hover:bg-[#1A6BFF]/40 transition-opacity"
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const startX = e.clientX
          const startW = width

          const onMove = (me: MouseEvent) => {
            onResize(Math.max(60, startW + me.clientX - startX))
          }
          const onUp = () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
          }
          window.addEventListener('mousemove', onMove)
          window.addEventListener('mouseup', onUp)
        }}
      />
    </th>
  )
}

interface TableHeaderProps {
  columns: Column[]
  listId: string
  isAdmin: boolean
  columnWidths: Record<string, number>
  onColumnResize: (id: string, w: number) => void
  onColumnUpdated: (updated: Column) => void
  onColumnDeleted: (columnId: string) => void
  onColumnAdded: (col: Column) => void
  allSelected: boolean
  someSelected: boolean
  onSelectAll: (checked: boolean) => void
}

export function TableHeader({
  columns,
  listId,
  isAdmin,
  columnWidths,
  onColumnResize,
  onColumnUpdated,
  onColumnDeleted,
  onColumnAdded,
  allSelected,
  someSelected,
  onSelectAll,
}: TableHeaderProps) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="border-b border-white/[0.08]">
        {/* Fixed checkbox column */}
        <th
          className="border-r border-white/[0.06] bg-[#0A0F1E]"
          style={{ width: 40, minWidth: 40, maxWidth: 40 }}
        >
          <div className="flex items-center justify-center px-2 py-2.5">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = someSelected && !allSelected
              }}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="h-3.5 w-3.5 cursor-pointer rounded border-white/20 bg-transparent accent-[#1A6BFF]"
            />
          </div>
        </th>

        {columns.map((col) => (
          <SortableHeaderCell
            key={col.id}
            column={col}
            listId={listId}
            isAdmin={isAdmin}
            width={columnWidths[col.id] ?? COL_WIDTH[col.col_type] ?? 200}
            onResize={(w) => onColumnResize(col.id, w)}
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
