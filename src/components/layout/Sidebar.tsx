'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'
import { hideList, restoreList } from '@/lib/actions/list.actions'
import type { List, Profile } from '@/types/app'

interface SidebarProps {
  lists: List[]
  profile: Profile
  onNewList: () => void
}

interface ListItemProps {
  list: List
  active: boolean
  isAdmin: boolean
  onHide: (id: string) => void
  onRestore: (id: string) => void
  onClick: () => void
}

function ListItem({ list, active, isAdmin, onHide, onRestore, onClick }: ListItemProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleHide = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    setMenuOpen(false)
    await hideList(list.id)
    onHide(list.id)
    setLoading(false)
  }

  const handleRestore = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    await restoreList(list.id)
    onRestore(list.id)
    setLoading(false)
  }

  if (!list.is_active) {
    // Archived list item — simpler, just name + restore button
    return (
      <div className="group flex items-center gap-2 rounded-md px-2 py-1.5 opacity-50 hover:opacity-100 transition-opacity">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-semibold uppercase" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>
          {list.name.charAt(0)}
        </span>
        <span className="flex-1 truncate text-xs text-white/40">{list.name}</span>
        {isAdmin && (
          <button
            onClick={handleRestore}
            disabled={loading}
            title="Restore list"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-white/20 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/10 hover:text-white/60"
          >
            {loading ? (
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="group relative">
      <Link
        href={`/list/${list.id}`}
        onClick={onClick}
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors pr-7',
          active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
        )}
      >
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-semibold uppercase"
          style={{ background: 'rgba(26,107,255,0.15)', color: '#5B9BFF' }}>
          {list.name.charAt(0)}
        </span>
        <span className="truncate">{list.name}</span>
      </Link>

      {/* ··· menu — admin only, shows on hover */}
      {isAdmin && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2">
          <button
            onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen) }}
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded text-white/20 transition-all hover:bg-white/10 hover:text-white/60',
              menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 4">
              <circle cx="2" cy="2" r="1.5" /><circle cx="8" cy="2" r="1.5" /><circle cx="14" cy="2" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <div className="absolute left-0 top-full z-40 mt-1 w-40 rounded-lg border border-white/[0.08] bg-[#0D1220] py-1 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <button
                  onClick={handleHide}
                  disabled={loading}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
                >
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  Hide list
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ lists, profile, onNewList }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [localLists, setLocalLists] = useState<List[]>(lists)
  const [archivedOpen, setArchivedOpen] = useState(false)
  const isAdmin = profile.role === 'admin'

  const activeLists = localLists.filter((l) => l.is_active)
  const hiddenLists = localLists.filter((l) => !l.is_active)

  const handleHide = (id: string) => {
    setLocalLists((prev) => prev.map((l) => l.id === id ? { ...l, is_active: false } : l))
    // If currently viewing the hidden list, redirect to home
    if (pathname === `/list/${id}`) router.push('/')
  }

  const handleRestore = (id: string) => {
    setLocalLists((prev) => prev.map((l) => l.id === id ? { ...l, is_active: true } : l))
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-14 items-center gap-2.5 border-b border-white/[0.06] px-4">
        <div className="relative h-7 w-7 shrink-0">
          <Image src="/logo.png" alt="Cinqa" fill className="object-contain" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-white">Cinqa</span>
      </div>

      {/* Scrollable nav area */}
      <div className="flex-1 overflow-y-auto px-2 py-3">

        {/* Active lists */}
        <div className="mb-1 flex items-center justify-between px-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Lists</span>
          {isAdmin && (
            <button
              onClick={onNewList}
              title="New List"
              className="flex h-5 w-5 items-center justify-center rounded text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>

        <nav className="space-y-0.5">
          {activeLists.length === 0 ? (
            <p className="px-2 py-2 text-xs text-white/20">No lists yet</p>
          ) : (
            activeLists.map((list) => (
              <ListItem
                key={list.id}
                list={list}
                active={pathname === `/list/${list.id}`}
                isAdmin={isAdmin}
                onHide={handleHide}
                onRestore={handleRestore}
                onClick={() => setMobileOpen(false)}
              />
            ))
          )}
        </nav>

        {/* Archived section — admin only, collapsible */}
        {isAdmin && hiddenLists.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setArchivedOpen(!archivedOpen)}
              className="mb-1 flex w-full items-center gap-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors"
            >
              <svg
                className={cn('h-2.5 w-2.5 transition-transform', archivedOpen ? 'rotate-90' : '')}
                fill="currentColor" viewBox="0 0 8 12"
              >
                <path d="M2 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              Archived ({hiddenLists.length})
            </button>
            {archivedOpen && (
              <div className="space-y-0.5">
                {hiddenLists.map((list) => (
                  <ListItem
                    key={list.id}
                    list={list}
                    active={false}
                    isAdmin={isAdmin}
                    onHide={handleHide}
                    onRestore={handleRestore}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users link — admin only */}
        {isAdmin && (
          <>
            <div className="my-3 border-t border-white/[0.06]" />
            <Link
              href="/users"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                pathname === '/users' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              )}
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Users
            </Link>
          </>
        )}
      </div>

      {/* User footer */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-2.5">
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt={profile.full_name ?? 'User'} width={28} height={28} className="rounded-full" />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A6BFF]/20 text-xs font-semibold text-[#5B9BFF]">
              {(profile.full_name ?? profile.email).charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white">{profile.full_name ?? 'User'}</p>
            <p className="truncate text-[10px] text-white/40 capitalize">{profile.role}</p>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="flex h-6 w-6 items-center justify-center rounded text-white/30 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-[#0A0F1E] md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {mobileOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          }
        </svg>
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className="hidden md:flex md:w-[220px] md:shrink-0 md:flex-col md:border-r md:border-white/[0.06] md:bg-[#0A0F1E]">
        {navContent}
      </aside>

      <aside className={cn(
        'fixed left-0 top-0 z-50 h-full w-[220px] border-r border-white/[0.06] bg-[#0A0F1E] transition-transform duration-200 md:hidden',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {navContent}
      </aside>
    </>
  )
}
