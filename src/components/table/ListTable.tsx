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
import { reorderColumns } from '@/lib/actions/column.actions'
import type { Column, RecordWithValues, List, Profile } from '@/types/app'

interface ListTableProps {
  list: List
  initialColumns: Column[]
  initialRecords: RecordWithValues[]
  profile: Profile
}

export function ListTable({ list, initialColumns, initialRecords, profile }: ListTableProps) {
  const isAdmin = profile.role === 'admin'
  const { records, columns, setColumns, handleValueChange, addRecord, removeRecord } =
    useListRecords(list.id, initialRecords, initialColumns)

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
    await reorderColumns(list.id, reordered.map((c) => c.id))
  }, [columns, list.id, setColumns])

  const handleColumnUpdated = useCallback((updated: Column) => {
    setColumns((prev) => prev.map((c) => c.id === updated.id ? updated : c))
  }, [setColumns])

  const handleColumnDeleted = useCallback((columnId: string) => {
    setColumns((prev) => prev.filter((c) => c.id !== columnId))
  }, [setColumns])

  return (
    <div className="flex h-full flex-col">
      {/* Top toolbar */}
      <div className="flex h-12 items-center justify-between border-b border-white/[0.06] px-6">
        <div className="flex items-center gap-2 text-sm text-white/40">
          <span>Interface</span>
          <span>/</span>
          <span className="text-white/80">{list.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <ExportMenu
              listName={list.name}
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
                  onColumnUpdated={handleColumnUpdated}
                  onColumnDeleted={handleColumnDeleted}
                />
                <tbody>
                  {records.map((record) => (
                    <TableRow
                      key={record.id}
                      record={record}
                      columns={columns}
                      listId={list.id}
                      onValueChange={handleValueChange}
                      onDelete={removeRecord}
                      isAdmin={isAdmin}
                    />
                  ))}
                  <AddRecordRow
                    listId={list.id}
                    columns={columns}
                    recordCount={records.length}
                    onAdded={addRecord}
                  />
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
    </div>
  )
}
