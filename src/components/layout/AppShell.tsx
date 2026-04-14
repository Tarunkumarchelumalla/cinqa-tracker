'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { NewListWizard } from '@/components/modals/NewListWizard'
import type { List, Profile } from '@/types/app'

interface AppShellProps {
  lists: List[]
  profile: Profile
  children: React.ReactNode
}

export function AppShell({ lists, profile, children }: AppShellProps) {
  const [wizardOpen, setWizardOpen] = useState(false)
  const [localLists, setLocalLists] = useState<List[]>(lists)

  const handleListCreated = (newList: List) => {
    setLocalLists((prev) => [...prev, newList])
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#060B18]">
      <Sidebar
        lists={localLists}
        profile={profile}
        onNewList={() => setWizardOpen(true)}
      />

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {profile.role === 'admin' && (
        <NewListWizard
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
          onCreated={handleListCreated}
          profile={profile}
          existingLists={localLists}
        />
      )}
    </div>
  )
}
