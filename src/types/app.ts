import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type List = Database['public']['Tables']['lists']['Row'] & { is_active: boolean }
export type ListRecord = Database['public']['Tables']['list_records']['Row']
export type RecordValue = Database['public']['Tables']['record_values']['Row']

export type ColType =
  | 'text'
  | 'url'
  | 'status'
  | 'dropdown'
  | 'user_ref'
  | 'date'
  | 'number'
  | 'checkbox'

export interface StatusOption {
  label: string
  color: string
}

export type ColumnConfig =
  | { options: StatusOption[] }  // for status / dropdown
  | Record<string, never>        // for all other types

export interface Column {
  id: string
  list_id: string
  name: string
  col_type: ColType
  config: ColumnConfig
  position: number
  created_at: string
}

// A record with its cell values as a map: column_id → value
export interface RecordWithValues extends ListRecord {
  values: Record<string, string>
}

// Used in the wizard step 2 column builder
export interface DraftColumn {
  id: string  // temporary client-side id
  name: string
  col_type: ColType
  config: ColumnConfig
  position: number
}

export type UserRole = 'admin' | 'viewer'
