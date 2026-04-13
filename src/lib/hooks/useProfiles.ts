'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/app'

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('profiles')
      .select('*')
      .order('full_name')
      .then(({ data }) => {
        if (data) setProfiles(data)
      })
  }, [])

  return profiles
}
