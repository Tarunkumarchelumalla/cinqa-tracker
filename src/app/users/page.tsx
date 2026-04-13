import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'
import { UsersTable } from '@/components/users/UsersTable'
import type { Database } from '@/types/database'

// ✅ Types
type ProfileRow = Database['public']['Tables']['profiles']['Row']
type ListRow = Database['public']['Tables']['lists']['Row']

export default async function UsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [
    { data: profileRaw },
    { data: listsRaw },
    { data: usersRaw },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),

    supabase
      .from('lists')
      .select('*')
      .order('created_at'),

    supabase
      .from('profiles')
      .select('*')
      .order('created_at'),
  ])

  // ✅ Fix types
  const profile = profileRaw as ProfileRow | null
  const lists = (listsRaw ?? []) as ListRow[]
  const users = (usersRaw ?? []) as ProfileRow[]

  if (!profile) redirect('/login')
  if (profile.role !== 'admin') redirect('/')

  return (
    <AppShell lists={lists} profile={profile}>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">Users</h1>
          <p className="mt-1 text-sm text-white/40">
            Manage team members and their roles.
          </p>
        </div>
        <UsersTable users={users} currentUserId={user.id} />
      </div>
    </AppShell>
  )
}