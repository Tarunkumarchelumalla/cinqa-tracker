'use client'

import { TextCell } from './cells/TextCell'
import { NumberCell } from './cells/NumberCell'
import { UrlCell } from './cells/UrlCell'
import { DateCell } from './cells/DateCell'
import { CheckboxCell } from './cells/CheckboxCell'
import { StatusCell } from './cells/StatusCell'
import { DropdownCell } from './cells/DropdownCell'
import { UserRefCell } from './cells/UserRefCell'
import type { Column } from '@/types/app'

interface TableCellProps {
  column: Column
  value: string
  onChange: (val: string) => void
  readOnly?: boolean
}

export function TableCell({ column, value, onChange, readOnly }: TableCellProps) {
  const config = column.config as { options?: { label: string; color: string }[] }

  switch (column.col_type) {
    case 'text':
      return <TextCell value={value} onChange={onChange} readOnly={readOnly} />
    case 'number':
      return <NumberCell value={value} onChange={onChange} readOnly={readOnly} />
    case 'url':
      return <UrlCell value={value} onChange={onChange} readOnly={readOnly} />
    case 'date':
      return <DateCell value={value} onChange={onChange} readOnly={readOnly} />
    case 'checkbox':
      return <CheckboxCell value={value} onChange={onChange} readOnly={readOnly} />
    case 'status':
      return (
        <StatusCell
          value={value}
          options={config?.options ?? []}
          onChange={onChange}
          readOnly={readOnly}
        />
      )
    case 'dropdown':
      return (
        <DropdownCell
          value={value}
          options={config?.options ?? []}
          onChange={onChange}
          readOnly={readOnly}
        />
      )
    case 'user_ref':
      return <UserRefCell value={value} onChange={onChange} readOnly={readOnly} />
    default:
      return <TextCell value={value} onChange={onChange} readOnly={readOnly} />
  }
}
