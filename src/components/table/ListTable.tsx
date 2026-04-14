'use client'

import { useState, useCallback } from 'react'
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
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { TableHeader } from './TableHeader'
import { TableRow } from './TableRow'
import { AddRecordRow } from './AddRecordRow'
import { ExportMenu } from '@/components/export/ExportMenu'
import { EmptyState } from '@/components/ui/EmptyState'
import { useListRecords } from '@/lib/hooks/useListRecords'
import { useColumnWidths } from '@/lib/hooks/useColumnWidths'
import { useListNames } from '@/lib/context/ListNamesContext'
import { reorderColumns } from '@/lib/actions/column.actions'
import { copyRecords } from '@/lib/actions/record.actions'
import type { Column, RecordWithValues, List, Profile } from '@/types/app'

interface ListTableProps {
  list: List
  initialColumns: Column[]
  initialRecords: RecordWithValues[]
  profile: Profile
}

export function ListTable({ list, initialColumns, initialRecords, profile }: ListTableProps) {
  const isAdmin = profile.role === 'admin'
  const canEdit = profile.role === 'admin' || profile.role === 'editor'
  const { records, columns, setColumns, handleValueChange, addRecord, removeRecord } =
    useListRecords(list.id, initialRecords, initialColumns)

  const { widths: columnWidths, setWidth: handleColumnResize } = useColumnWidths(columns)

  const { getName } = useListNames()
  const listName = getName(list.id) ?? list.name

  // Row selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [copying, setCopying] = useState(false)

  const allSelected = records.length > 0 && selectedIds.size === records.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < records.length

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = columns.findIndex((c) => c.id === active.id)
    const newIndex = columns.findIndex((c) => c.id === over.id)
    const reordered = arrayMove(columns, oldIndex, newIndex)

    setColumns(reordered)
    setSelectedIds(new Set())
    await reorderColumns(list.id, reordered.map((c) => c.id))
  }, [columns, list.id, setColumns])

  const handleColumnUpdated = useCallback((updated: Column) => {
    setColumns((prev) => prev.map((c) => c.id === updated.id ? updated : c))
  }, [setColumns])

  const handleColumnDeleted = useCallback((columnId: string) => {
    setColumns((prev) => prev.filter((c) => c.id !== columnId))
  }, [setColumns])

  const handleColumnAdded = useCallback((col: Column) => {
    setColumns((prev) => [...prev, col])
  }, [setColumns])

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedIds(checked ? new Set(records.map((r) => r.id)) : new Set())
  }, [records])

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id); else next.delete(id)
      return next
    })
  }, [])

  const handleCopyRows = useCallback(async () => {
    if (copying || selectedIds.size === 0) return
    setCopying(true)
    try {
      const toCopy = records
        .filter((r) => selectedIds.has(r.id))
        .map((r) => ({ values: r.values }))
      const newRecords = await copyRecords(list.id, toCopy, records.length)
      newRecords.forEach(addRecord)
      setSelectedIds(new Set())
    } finally {
      setCopying(false)
    }
  }, [copying, selectedIds, records, list.id, addRecord])

  return (
    <div className="flex h-full flex-col">
      {/* Top toolbar */}
      <div className="flex h-12 items-center justify-between border-b border-white/[0.06] px-6">
        <div className="flex items-center gap-2 text-sm text-white/40">
          <span>Interface</span>
          <span>/</span>
          <span className="text-white/80">{listName}</span>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <ExportMenu
              listName={listName}
              columns={columns}
              records={records}
            />
          )}
          <button className="flex h-7 items-center gap-1.5 rounded px-2 text-xs text-white/40 hover:bg-white/[0.05] hover:text-white/70 transition-colors">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
          <button className="flex h-7 items-center gap-1.5 rounded px-2 text-xs text-white/40 hover:bg-white/[0.05] hover:text-white/70 transition-colors">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M7 12h10M11 17h2" />
            </svg>
            Sort
          </button>
        </div>
      </div>

      {/* Table */}
      {columns.length === 0 ? (
        <EmptyState
          title="No columns defined"
          description="This list has no columns yet. Add columns to get started."
        />
      ) : (
        <div className="flex-1 overflow-auto">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
              <table className="border-collapse" style={{ tableLayout: 'fixed', width: 'max-content', minWidth: '100%' }}>
                <TableHeader
                  columns={columns}
                  listId={list.id}
                  isAdmin={isAdmin}
                  columnWidths={columnWidths}
                  onColumnResize={handleColumnResize}
                  onColumnUpdated={handleColumnUpdated}
                  onColumnDeleted={handleColumnDeleted}
                  onColumnAdded={handleColumnAdded}
                  allSelected={allSelected}
                  someSelected={someSelected}
                  onSelectAll={handleSelectAll}
                />
                <tbody>
                  {records.map((record) => (
                    <TableRow
                      key={record.id}
                      record={record}
                      columns={columns}
                      listId={list.id}
                      columnWidths={columnWidths}
                      onValueChange={handleValueChange}
                      onDelete={removeRecord}
                      isAdmin={isAdmin}
                      canEdit={canEdit}
                      isSelected={selectedIds.has(record.id)}
                      onSelect={handleSelectRow}
                    />
                  ))}
                  {isAdmin && (
                    <AddRecordRow
                      listId={list.id}
                      columns={columns}
                      recordCount={records.length}
                      onAdded={addRecord}
                    />
                  )}
                </tbody>
              </table>
            </SortableContext>
          </DndContext>

          {/* Record count */}
          <div className="px-4 py-3 text-xs text-white/30">
            {records.length} {records.length === 1 ? 'record' : 'records'}
          </div>
        </div>
      )}

      {/* Floating selection toolbar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-xl border border-white/[0.1] bg-[#0D1220] px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <span className="text-xs text-white/50">
            {selectedIds.size} {selectedIds.size === 1 ? 'row' : 'rows'} selected
          </span>
          {canEdit && (
            <button
              onClick={handleCopyRows}
              disabled={copying}
              className="flex items-center gap-1.5 rounded-md bg-[#1A6BFF]/20 px-3 py-1.5 text-xs text-[#5B9BFF] transition-colors hover:bg-[#1A6BFF]/30 disabled:opacity-50"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copying ? 'Copying…' : 'Copy row(s)'}
            </button>
          )}
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-white/30 hover:text-white/60 transition-colors"
            title="Clear selection"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
