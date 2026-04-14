'use client'

import { createContext, useContext, useState } from 'react'
import type { List } from '@/types/app'

interface ListNamesContextValue {
  getName: (listId: string) => string | undefined
  setName: (listId: string, name: string) => void
}

const ListNamesContext = createContext<ListNamesContextValue>({
  getName: () => undefined,
  setName: () => {},
})

export function ListNamesProvider({
  initialLists,
  children,
}: {
  initialLists: List[]
  children: React.ReactNode
}) {
  const [names, setNames] = useState<Record<string, string>>(
    () => Object.fromEntries(initialLists.map((l) => [l.id, l.name]))
  )

  const getName = (id: string) => names[id]
  const setName = (id: string, name: string) =>
    setNames((prev) => ({ ...prev, [id]: name }))

  return (
    <ListNamesContext.Provider value={{ getName, setName }}>
      {children}
    </ListNamesContext.Provider>
  )
}

export function useListNames() {
  return useContext(ListNamesContext)
}
