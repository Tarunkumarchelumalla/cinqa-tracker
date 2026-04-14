'use client'

import { useState } from 'react'
import Image from 'next/image'
import { updateUserRole } from '@/lib/actions/user.actions'
import type { Profile, UserRole } from '@/types/app'

interface UsersTableProps {
  users: Profile[]
  currentUserId: string
}

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  const [localUsers, setLocalUsers] = useState(users)
  const [savingId, setSavingId] = useState<string | null>(null)

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (userId === currentUserId && newRole !== 'admin') {
      alert('You cannot demote yourself.')
      return
    }
    setSavingId(userId)
    try {
      await updateUserRole(userId, newRole)
      setLocalUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u))
    } catch (err) {
      console.error('Failed to update role:', err)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div>
      <p className="mb-4 text-sm text-white/40">{localUsers.length} {localUsers.length === 1 ? 'user' : 'users'}</p>
      <div className="overflow-hidden rounded-xl border border-white/[0.06]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] bg-[#0A0F1E]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/30">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/30">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/30">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/30">Joined</th>
            </tr>
          </thead>
          <tbody>
            {localUsers.map((user) => {
              const isSelf = user.id === currentUserId
              return (
                <tr key={user.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <Image src={user.avatar_url} alt={user.full_name ?? ''} width={32} height={32} className="rounded-full" />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A6BFF]/20 text-sm font-semibold text-[#5B9BFF]">
                          {(user.full_name ?? user.email).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">
                          {user.full_name ?? '—'}
                          {isSelf && <span className="ml-1.5 text-xs text-white/30">(you)</span>}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/60">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      disabled={savingId === user.id || isSelf}
                      className="rounded-md border border-white/10 bg-[#0A0F1E] px-2 py-1 text-sm text-white/80 focus:border-[#1A6BFF] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/40">
                    {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
