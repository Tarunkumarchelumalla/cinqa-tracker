'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { List } from '@/types/app'

export function useLists(initialLists: List[] = []) {
  const [lists, setLists] = useState<List[]>(initialLists)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('lists-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lists' }, () => {
        supabase.from('lists').select('*').order('created_at').then(({ data }) => {
          if (data) setLists(data)
        })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return { lists, setLists }
}
