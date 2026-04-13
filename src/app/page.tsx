import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Database } from '@/types/database'

// ✅ DB types
type ListRow = Database['public']['Tables']['lists']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [
    { data: firstListRaw },
    { data: allListsRaw },
    { data: profile },
  ] = await Promise.all([
    supabase
      .from('lists')
      .select('id')
      .eq('is_active', true)
      .order('created_at')
      .limit(1),

    supabase
      .from('lists')
      .select('*')
      .order('created_at'),

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
  ])

  if (!profile) redirect('/login')

  // ✅ Fix: explicit typing (prevents `never[]`)
  const firstList = (firstListRaw ?? []) as Pick<ListRow, 'id'>[]
  const allLists = (allListsRaw ?? []) as ListRow[]

  if (firstList.length > 0) {
    redirect(`/list/${firstList[0].id}`)
  }

  return (
    <AppShell lists={allLists} profile={profile as ProfileRow}>
      <div className="flex h-full items-center justify-center">
        <EmptyState
          title="No lists yet"
          description={
            profile.role === 'admin'
              ? 'Create your first list using the + button in the sidebar.'
              : 'Ask an admin to create a list for you.'
          }
        />
      </div>
    </AppShell>
  )
}