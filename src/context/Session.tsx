import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { BlindOffer, CategoryId, FileRequest, VehicleSpec } from '../data/seed'
import {
  adminDisputes,
  initialBlindOffers,
  initialFileRequests,
  primaryUser,
  sellerWorkspace,
} from '../data/seed'

export type WorkspaceMode = 'buyer' | 'seller'

const STORAGE_KEY = 'dd-workspace-mode'
const STATE_KEY = 'dd-demo-state-v1'

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
  requestFiles: RequestFile[]
  requestMessages: RequestMessage[]
  requestOrders: RequestOrder[]
  disputes: DemoDispute[]
  garageCars: GarageCar[]
  garageFiles: GarageFile[]
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
  uploadRequestFile: (input: {
    requestId: string
    file: File
    kind: DemoFile['kind']
  }) => Promise<void>
  addMessage: (input: { requestId: string; author: MessageAuthor; body: string }) => void
  startDemoCheckout: (requestId: string, offerId: string) => void
  markDelivered: (requestId: string) => void
  confirmDelivered: (requestId: string) => void
  openDispute: (requestId: string, reason: string) => void
  setDisputeStatus: (disputeId: string, status: DemoDispute['status']) => void
  addGarageCar: (input: {
    ownerType: GarageOwnerType
    vehicle: VehicleSpec
    label?: string
    clientName?: string
  }) => string
}

const SessionContext = createContext<SessionValue | null>(null)

type MessageAuthor = 'buyer' | 'seller' | 'system'

type DemoFile = {
  id: string
  requestId: string
  uploadedBy: 'buyer' | 'seller'
  kind: 'input' | 'delivery'
  name: string
  mimeType: string
  size: number
  dataUrl: string
  createdAt: string
}

type RequestFile = DemoFile

type RequestMessage = {
  id: string
  requestId: string
  author: MessageAuthor
  body: string
  createdAt: string
}

type RequestOrder = {
  id: string
  requestId: string
  offerId: string
  amountEur: number
  status: 'in_escrow' | 'delivered' | 'completed' | 'disputed'
  createdAt: string
  updatedAt: string
}

type DemoDispute = {
  id: string
  requestId: string
  orderId?: string
  reason: string
  parties: string
  openedAt: string
  status: 'open' | 'review' | 'resolved'
}

type GarageOwnerType = 'personal' | 'client'

type GarageCar = {
  id: string
  ownerType: GarageOwnerType
  label: string
  clientName?: string
  vehicle: VehicleSpec
  createdAt: string
}

type GarageFile = {
  id: string
  carId: string
  requestId: string
  requestFileId: string
  name: string
  dataUrl: string
  mimeType: string
  purchasedAt: string
}

type PersistedState = {
  fileRequests: FileRequest[]
  blindOffers: BlindOffer[]
  requestFiles: RequestFile[]
  requestMessages: RequestMessage[]
  requestOrders: RequestOrder[]
  disputes: DemoDispute[]
  garageCars: GarageCar[]
  garageFiles: GarageFile[]
}

function vehicleKey(v: VehicleSpec): string {
  return `${v.make}::${v.model}::${v.year}::${v.ecu}`.toLowerCase()
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function initialState(): PersistedState {
  const seededDisputes: DemoDispute[] = adminDisputes.map((d) => ({
    id: d.id,
    requestId: '',
    orderId: d.orderId,
    reason: d.reason,
    parties: d.parties,
    openedAt: d.openedAt,
    status: d.status === 'open' ? 'open' : 'review',
  }))
  return {
    fileRequests: [...initialFileRequests],
    blindOffers: [...initialBlindOffers],
    requestFiles: [],
    requestMessages: [],
    requestOrders: [],
    disputes: seededDisputes,
    garageCars: [],
    garageFiles: [],
  }
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return initialState()
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    if (!parsed.fileRequests || !parsed.blindOffers) return initialState()
    return {
      fileRequests: parsed.fileRequests,
      blindOffers: parsed.blindOffers,
      requestFiles: parsed.requestFiles ?? [],
      requestMessages: parsed.requestMessages ?? [],
      requestOrders: parsed.requestOrders ?? [],
      disputes: parsed.disputes ?? initialState().disputes,
      garageCars: parsed.garageCars ?? [],
      garageFiles: parsed.garageFiles ?? [],
    }
  } catch {
    return initialState()
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [boot] = useState<PersistedState>(() => loadState())
  const [workspaceMode, setWorkspaceModeState] = useState<WorkspaceMode>(loadMode)
  const [fileRequests, setFileRequests] = useState<FileRequest[]>(() => boot.fileRequests)
  const [blindOffers, setBlindOffers] = useState<BlindOffer[]>(() => boot.blindOffers)
  const [requestFiles, setRequestFiles] = useState<RequestFile[]>(() => boot.requestFiles)
  const [requestMessages, setRequestMessages] = useState<RequestMessage[]>(
    () => boot.requestMessages,
  )
  const [requestOrders, setRequestOrders] = useState<RequestOrder[]>(() => boot.requestOrders)
  const [disputes, setDisputes] = useState<DemoDispute[]>(() => boot.disputes)
  const [garageCars, setGarageCars] = useState<GarageCar[]>(() => boot.garageCars)
  const [garageFiles, setGarageFiles] = useState<GarageFile[]>(() => boot.garageFiles)

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
              status: 'offers' as const,
              selectedOfferId: offerId,
            }
          : r,
      ),
    )
  }, [])

  const uploadRequestFile = useCallback(
    async (input: { requestId: string; file: File; kind: DemoFile['kind'] }) => {
      const dataUrl = await fileToDataUrl(input.file)
      const next: RequestFile = {
        id: `rf-${Date.now()}`,
        requestId: input.requestId,
        uploadedBy: workspaceMode,
        kind: input.kind,
        name: input.file.name,
        mimeType: input.file.type || 'application/octet-stream',
        size: input.file.size,
        dataUrl,
        createdAt: new Date().toISOString(),
      }
      setRequestFiles((prev) => [next, ...prev])
    },
    [workspaceMode],
  )

  const addMessage = useCallback(
    (input: { requestId: string; author: MessageAuthor; body: string }) => {
      const body = input.body.trim()
      if (!body) return
      const next: RequestMessage = {
        id: `msg-${Date.now()}`,
        requestId: input.requestId,
        author: input.author,
        body,
        createdAt: new Date().toISOString(),
      }
      setRequestMessages((prev) => [...prev, next])
    },
    [],
  )

  const startDemoCheckout = useCallback(
    (requestId: string, offerId: string) => {
      const offer = blindOffers.find((o) => o.id === offerId)
      if (!offer) return
      const now = new Date().toISOString()
      setRequestOrders((prev) => {
        const existing = prev.find((o) => o.requestId === requestId)
        const next: RequestOrder = {
          id: existing?.id ?? `ord-${Date.now()}`,
          requestId,
          offerId,
          amountEur: offer.priceEur,
          status: 'in_escrow',
          createdAt: existing?.createdAt ?? now,
          updatedAt: now,
        }
        return existing ? prev.map((o) => (o.requestId === requestId ? next : o)) : [next, ...prev]
      })
      setFileRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'in_progress' as const } : r)),
      )
      addMessage({
        requestId,
        author: 'system',
        body: 'Demo checkout completed (no charge). Funds are now in escrow.',
      })
    },
    [addMessage, blindOffers],
  )

  const markDelivered = useCallback(
    (requestId: string) => {
      setRequestOrders((prev) =>
        prev.map((o) =>
          o.requestId === requestId
            ? { ...o, status: 'delivered' as const, updatedAt: new Date().toISOString() }
            : o,
        ),
      )
      addMessage({
        requestId,
        author: 'system',
        body: 'Seller marked delivery as ready. Buyer can now download and confirm.',
      })
    },
    [addMessage],
  )

  const confirmDelivered = useCallback(
    (requestId: string) => {
      setRequestOrders((prev) =>
        prev.map((o) =>
          o.requestId === requestId
            ? { ...o, status: 'completed' as const, updatedAt: new Date().toISOString() }
            : o,
        ),
      )
      setFileRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'completed' as const } : r)),
      )
      const request = fileRequests.find((r) => r.id === requestId)
      if (request) {
        const existingCar = garageCars.find(
          (c) => vehicleKey(c.vehicle) === vehicleKey(request.vehicle),
        )
        const carId =
          existingCar?.id ??
          (() => {
            const id = `car-${Date.now()}`
            const created: GarageCar = {
              id,
              ownerType: 'personal',
              label: `${request.vehicle.make} ${request.vehicle.model} (${request.vehicle.year})`,
              vehicle: request.vehicle,
              createdAt: new Date().toISOString(),
            }
            setGarageCars((prev) => [created, ...prev])
            return id
          })()
        const deliveryFiles = requestFiles.filter(
          (f) => f.requestId === requestId && f.kind === 'delivery',
        )
        if (deliveryFiles.length > 0) {
          setGarageFiles((prev) => {
            const next = [...prev]
            for (const f of deliveryFiles) {
              const exists = next.some(
                (g) => g.requestFileId === f.id && g.requestId === requestId && g.carId === carId,
              )
              if (!exists) {
                next.unshift({
                  id: `gfile-${Date.now()}-${f.id}`,
                  carId,
                  requestId,
                  requestFileId: f.id,
                  name: f.name,
                  dataUrl: f.dataUrl,
                  mimeType: f.mimeType,
                  purchasedAt: new Date().toISOString(),
                })
              }
            }
            return next
          })
        }
      }
      addMessage({
        requestId,
        author: 'system',
        body: 'Buyer confirmed delivery. Escrow released in demo mode and files saved to Garage.',
      })
    },
    [addMessage, fileRequests, garageCars, requestFiles],
  )

  const openDispute = useCallback(
    (requestId: string, reason: string) => {
      const request = fileRequests.find((r) => r.id === requestId)
      const order = requestOrders.find((o) => o.requestId === requestId)
      if (!request || !order) return
      setFileRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'disputed' as const } : r)),
      )
      setRequestOrders((prev) =>
        prev.map((o) =>
          o.requestId === requestId
            ? { ...o, status: 'disputed' as const, updatedAt: new Date().toISOString() }
            : o,
        ),
      )
      setDisputes((prev) => [
        {
          id: `dsp-${Date.now()}`,
          requestId,
          orderId: order.id,
          reason: reason.trim() || 'Buyer requested review for delivery quality.',
          parties: `${primaryUser.handle} ↔ ${sellerWorkspace.name}`,
          openedAt: new Date().toISOString(),
          status: 'open',
        },
        ...prev,
      ])
      addMessage({
        requestId,
        author: 'system',
        body: 'Dispute opened. Admin review required.',
      })
    },
    [addMessage, fileRequests, requestOrders],
  )

  const setDisputeStatus = useCallback((disputeId: string, status: DemoDispute['status']) => {
    setDisputes((prev) => prev.map((d) => (d.id === disputeId ? { ...d, status } : d)))
  }, [])

  const addGarageCar = useCallback(
    (input: {
      ownerType: GarageOwnerType
      vehicle: VehicleSpec
      label?: string
      clientName?: string
    }) => {
      const id = `car-${Date.now()}`
      const next: GarageCar = {
        id,
        ownerType: input.ownerType,
        label:
          input.label?.trim() || `${input.vehicle.make} ${input.vehicle.model} (${input.vehicle.year})`,
        clientName: input.clientName?.trim() || undefined,
        vehicle: input.vehicle,
        createdAt: new Date().toISOString(),
      }
      setGarageCars((prev) => [next, ...prev])
      return id
    },
    [],
  )

  useEffect(() => {
    try {
      const payload: PersistedState = {
        fileRequests,
        blindOffers,
        requestFiles,
        requestMessages,
        requestOrders,
        disputes,
        garageCars,
        garageFiles,
      }
      localStorage.setItem(STATE_KEY, JSON.stringify(payload))
    } catch {
      /* ignore */
    }
  }, [
    fileRequests,
    blindOffers,
    requestFiles,
    requestMessages,
    requestOrders,
    disputes,
    garageCars,
    garageFiles,
  ])

  const value = useMemo(
    () => ({
      workspaceMode,
      setWorkspaceMode,
      user: primaryUser,
      sellerPersona: sellerWorkspace,
      fileRequests,
      blindOffers,
      requestFiles,
      requestMessages,
      requestOrders,
      disputes,
      garageCars,
      garageFiles,
      addFileRequest,
      submitBlindOffer,
      acceptOffer,
      uploadRequestFile,
      addMessage,
      startDemoCheckout,
      markDelivered,
      confirmDelivered,
      openDispute,
      setDisputeStatus,
      addGarageCar,
    }),
    [
      workspaceMode,
      setWorkspaceMode,
      fileRequests,
      blindOffers,
      requestFiles,
      requestMessages,
      requestOrders,
      disputes,
      garageCars,
      garageFiles,
      addFileRequest,
      submitBlindOffer,
      acceptOffer,
      uploadRequestFile,
      addMessage,
      startDemoCheckout,
      markDelivered,
      confirmDelivered,
      openDispute,
      setDisputeStatus,
      addGarageCar,
    ],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
