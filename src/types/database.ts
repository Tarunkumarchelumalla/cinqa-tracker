export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'editor' | 'viewer'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'viewer'
          created_at?: string
        }
        Relationships: []
      }
      lists: {
        Row: {
          id: string
          name: string
          created_by: string | null
          created_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          created_by?: string | null
          created_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          created_by?: string | null
          created_at?: string
          is_active?: boolean
        }
        Relationships: []
      }
      list_columns: {
        Row: {
          id: string
          list_id: string
          name: string
          col_type: 'text' | 'url' | 'status' | 'dropdown' | 'user_ref' | 'date' | 'number' | 'checkbox'
          config: Json
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          list_id: string
          name: string
          col_type: 'text' | 'url' | 'status' | 'dropdown' | 'user_ref' | 'date' | 'number' | 'checkbox'
          config?: Json
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          name?: string
          col_type?: 'text' | 'url' | 'status' | 'dropdown' | 'user_ref' | 'date' | 'number' | 'checkbox'
          config?: Json
          position?: number
          created_at?: string
        }
        Relationships: []
      }
      list_records: {
        Row: {
          id: string
          list_id: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          list_id: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          position?: number
          created_at?: string
        }
        Relationships: []
      }
      record_values: {
        Row: {
          id: string
          record_id: string
          column_id: string
          value: string | null
        }
        Insert: {
          id?: string
          record_id: string
          column_id: string
          value?: string | null
        }
        Update: {
          id?: string
          record_id?: string
          column_id?: string
          value?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      get_my_role: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
