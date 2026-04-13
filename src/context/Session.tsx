import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { BlindOffer, CategoryId, FileRequest, VehicleSpec } from '../data/seed'
import {
  initialBlindOffers,
  initialFileRequests,
  primaryUser,
  sellerWorkspace,
} from '../data/seed'

export type WorkspaceMode = 'buyer' | 'seller'

const STORAGE_KEY = 'dd-workspace-mode'

function loadMode(): WorkspaceMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'buyer' || v === 'seller') return v
  } catch {
    /* ignore */
  }
  return 'buyer'
}

type SessionValue = {
  workspaceMode: WorkspaceMode
  setWorkspaceMode: (m: WorkspaceMode) => void
  user: typeof primaryUser
  sellerPersona: typeof sellerWorkspace
  fileRequests: FileRequest[]
  blindOffers: BlindOffer[]
  addFileRequest: (input: {
    summary: string
    vehicle: VehicleSpec
    categoryId: CategoryId
    goal: string
  }) => string
  submitBlindOffer: (input: {
    requestId: string
    priceEur: number
    etaHours: number
    pitch: string
  }) => void
  acceptOffer: (requestId: string, offerId: string) => void
}

const SessionContext = createContext<SessionValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [workspaceMode, setWorkspaceModeState] = useState<WorkspaceMode>(loadMode)
  const [fileRequests, setFileRequests] = useState<FileRequest[]>(() => [
    ...initialFileRequests,
  ])
  const [blindOffers, setBlindOffers] = useState<BlindOffer[]>(() => [
    ...initialBlindOffers,
  ])

  const setWorkspaceMode = useCallback((m: WorkspaceMode) => {
    setWorkspaceModeState(m)
    try {
      localStorage.setItem(STORAGE_KEY, m)
    } catch {
      /* ignore */
    }
  }, [])

  const addFileRequest = useCallback(
    (input: {
      summary: string
      vehicle: VehicleSpec
      categoryId: CategoryId
      goal: string
    }) => {
      const id = `req-${Date.now()}`
      const row: FileRequest = {
        id,
        buyerId: primaryUser.id,
        summary: input.summary,
        vehicle: input.vehicle,
        categoryId: input.categoryId,
        goal: input.goal,
        status: 'open',
        createdAt: new Date().toISOString(),
      }
      setFileRequests((prev) => [row, ...prev])
      return id
    },
    [],
  )

  const submitBlindOffer = useCallback(
    (input: {
      requestId: string
      priceEur: number
      etaHours: number
      pitch: string
    }) => {
      const sellerId = sellerWorkspace.id
      setBlindOffers((prev) => {
        const filtered = prev.filter(
          (o) =>
            !(
              o.requestId === input.requestId &&
              o.sellerId === sellerId &&
              o.status === 'pending'
            ),
        )
        const next: BlindOffer = {
          id: `off-${Date.now()}`,
          requestId: input.requestId,
          sellerId,
          priceEur: input.priceEur,
          etaHours: input.etaHours,
          pitch: input.pitch,
          createdAt: new Date().toISOString(),
          status: 'pending',
        }
        return [...filtered, next]
      })
      setFileRequests((prev) =>
        prev.map((r) =>
          r.id === input.requestId && r.status === 'open'
            ? { ...r, status: 'offers' as const }
            : r,
        ),
      )
    },
    [],
  )

  const acceptOffer = useCallback((requestId: string, offerId: string) => {
    setBlindOffers((prev) =>
      prev.map((o) => {
        if (o.requestId !== requestId) return o
        if (o.id === offerId) return { ...o, status: 'accepted' as const }
        if (o.status === 'pending') return { ...o, status: 'declined' as const }
        return o
      }),
    )
    setFileRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'in_progress' as const,
              selectedOfferId: offerId,
            }
          : r,
      ),
    )
  }, [])

  const value = useMemo(
    () => ({
      workspaceMode,
      setWorkspaceMode,
      user: primaryUser,
      sellerPersona: sellerWorkspace,
      fileRequests,
      blindOffers,
      addFileRequest,
      submitBlindOffer,
      acceptOffer,
    }),
    [
      workspaceMode,
      setWorkspaceMode,
      fileRequests,
      blindOffers,
      addFileRequest,
      submitBlindOffer,
      acceptOffer,
    ],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
