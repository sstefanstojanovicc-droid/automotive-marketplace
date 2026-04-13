export type CategoryId =
  | 'ecu-tcu'
  | 'diesel'
  | 'maps'
  | 'remote'
  | 'technical'

export const categories: {
  id: CategoryId
  label: string
  short: string
}[] = [
  { id: 'ecu-tcu', label: 'ECU / TCU tuning files', short: 'ECU / TCU' },
  { id: 'diesel', label: 'Diesel solutions (DPF, EGR, AdBlue)', short: 'Diesel' },
  { id: 'maps', label: 'Navigation maps & updates', short: 'Maps' },
  { id: 'remote', label: 'Remote coding', short: 'Remote' },
  { id: 'technical', label: 'Technical files (Damos, pinout)', short: 'Technical' },
]

export type Service = {
  id: string
  title: string
  sellerId: string
  categoryId: CategoryId
  priceEur: number
  deliveryHours: number
  rating: number
  reviews: number
  tags: string[]
  description: string
}

export type Seller = {
  id: string
  name: string
  handle: string
  country: string
  plan: 'single' | 'multi'
  activeListings: number
  completedOrders: number
  rating: number
  joined: string
}

/** Primary signed-in account (buyer workspace) */
export const primaryUser = {
  id: 'u-stefan-1',
  name: 'Stefan Stojanovic',
  handle: 'stefanstojanovic',
  country: 'RS',
  city: 'Belgrade',
  memberSince: '2025-09',
}

export const sellers: Seller[] = [
  {
    id: 's1',
    name: 'NordTune Labs',
    handle: 'nordtune',
    country: 'DE',
    plan: 'multi',
    activeListings: 12,
    completedOrders: 1840,
    rating: 4.9,
    joined: '2022-03',
  },
  {
    id: 's2',
    name: 'ACJ Tune',
    handle: 'acjtune',
    country: 'RS',
    plan: 'single',
    activeListings: 6,
    completedOrders: 620,
    rating: 4.8,
    joined: '2023-01',
  },
  {
    id: 's3',
    name: 'MapRoute Pro',
    handle: 'maproute',
    country: 'NL',
    plan: 'multi',
    activeListings: 9,
    completedOrders: 2100,
    rating: 5.0,
    joined: '2021-11',
  },
]

export const services: Service[] = [
  {
    id: 'svc-1',
    title: 'Stage 1 ECU — VW Golf 8 GTI 2.0 TSI (MG1CS008)',
    sellerId: 's1',
    categoryId: 'ecu-tcu',
    priceEur: 95,
    deliveryHours: 4,
    rating: 4.9,
    reviews: 214,
    tags: ['VW', 'MG1', 'TSI'],
    description:
      'Dyno-safe Stage 1 for European-spec GTI. Checksum handled; includes torque cap options for manual DSG.',
  },
  {
    id: 'svc-2',
    title: 'DPF + EGR off — BMW F30 320d B47 (EDC17C50)',
    sellerId: 's2',
    categoryId: 'diesel',
    priceEur: 72,
    deliveryHours: 6,
    rating: 4.8,
    reviews: 98,
    tags: ['BMW', 'B47', 'EDC17'],
    description:
      'Motorsport / export-oriented package. Map change log + restore instructions included.',
  },
  {
    id: 'svc-3',
    title: 'Mercedes NTG6x maps — EU 2026.1 pack',
    sellerId: 's3',
    categoryId: 'maps',
    priceEur: 118,
    deliveryHours: 2,
    rating: 5.0,
    reviews: 412,
    tags: ['NTG6', 'MBUX', 'EU'],
    description:
      'Latest EU routing with activation notes for W177 / W206 / V297 head units (common part numbers).',
  },
  {
    id: 'svc-4',
    title: 'Remote VO coding — BMW G-series (ESYS +ENET)',
    sellerId: 's1',
    categoryId: 'remote',
    priceEur: 48,
    deliveryHours: 24,
    rating: 4.7,
    reviews: 156,
    tags: ['BMW', 'ESYS', 'Remote'],
    description:
      'AnyDesk session: retrofits, FA/VO updates, module activation. You supply cable + stable laptop.',
  },
  {
    id: 'svc-5',
    title: 'Damos bundle — Bosch EDC17CP14 (VAG 2.0 TDI)',
    sellerId: 's2',
    categoryId: 'technical',
    priceEur: 38,
    deliveryHours: 12,
    rating: 4.6,
    reviews: 44,
    tags: ['Damos', 'Bosch', 'TDI'],
    description:
      'Labeled maps + connector pinout cheat sheet for WinOLS / similar. Matches common CR family reads.',
  },
  {
    id: 'svc-6',
    title: 'TCU remap — ZF 8HP70 (BMW B58 / European SW)',
    sellerId: 's1',
    categoryId: 'ecu-tcu',
    priceEur: 115,
    deliveryHours: 8,
    rating: 4.95,
    reviews: 88,
    tags: ['ZF', '8HP', 'TCU'],
    description:
      'Shift maps aligned to Stage 2 torque. Comfort & Sport preserved; no flair on cold trans.',
  },
  {
    id: 'svc-7',
    title: 'AdBlue / SCR dev — Volvo VEA D4 (Euro 6)',
    sellerId: 's2',
    categoryId: 'diesel',
    priceEur: 62,
    deliveryHours: 5,
    rating: 4.5,
    reviews: 31,
    tags: ['Volvo', 'SCR', 'Euro 6'],
    description:
      'Requires original read + SW number. Off-highway / export use documentation only.',
  },
  {
    id: 'svc-8',
    title: 'Audi MMI MIB2+ high maps — EU + UK',
    sellerId: 's3',
    categoryId: 'maps',
    priceEur: 99,
    deliveryHours: 3,
    rating: 4.9,
    reviews: 267,
    tags: ['MIB2', 'Audi', 'EU'],
    description:
      'SD / SSD prep checklist + post-update coding hints for common A4/A5/Q5 clusters.',
  },
]

export function sellerById(id: string): Seller | undefined {
  return sellers.find((s) => s.id === id)
}

export function serviceById(id: string): Service | undefined {
  return services.find((s) => s.id === id)
}

/** Seller workspace account (ACJ Tune) */
export const sellerWorkspace: Seller = sellers[1]!

export type RequestStatus =
  | 'open'
  | 'offers'
  | 'in_progress'
  | 'completed'
  | 'disputed'

export type VehicleSpec = {
  make: string
  model: string
  year: number
  engine: string
  ecu: string
  fuel: 'Diesel' | 'Petrol' | 'Hybrid'
  powerKw?: number
}

export type FileRequest = {
  id: string
  buyerId: string
  summary: string
  vehicle: VehicleSpec
  categoryId: CategoryId
  goal: string
  status: RequestStatus
  createdAt: string
  selectedOfferId?: string
}

export type BlindOffer = {
  id: string
  requestId: string
  sellerId: string
  priceEur: number
  etaHours: number
  pitch: string
  createdAt: string
  status: 'pending' | 'accepted' | 'declined'
}

export const initialFileRequests: FileRequest[] = [
  {
    id: 'req-gti',
    buyerId: primaryUser.id,
    summary: 'Stage 1 + pops on overrun (EU fuel)',
    vehicle: {
      make: 'Volkswagen',
      model: 'Golf 8 GTI',
      year: 2023,
      engine: '2.0 TSI 180 kW',
      ecu: 'MG1CS008',
      fuel: 'Petrol',
      powerKw: 180,
    },
    categoryId: 'ecu-tcu',
    goal: 'Stage 1 file with safe lambda on98 RON; light burble on overrun.',
    status: 'offers',
    createdAt: '2026-04-11T08:00:00Z',
  },
  {
    id: 'req-bmw-dpf',
    buyerId: primaryUser.id,
    summary: 'B47 DPF pressure issue — need revised maps',
    vehicle: {
      make: 'BMW',
      model: '320d Touring (G21)',
      year: 2021,
      engine: 'B47D20O1',
      ecu: 'EDC17C50',
      fuel: 'Diesel',
      powerKw: 140,
    },
    categoryId: 'diesel',
    goal: 'DPF/EGR solutions for export chassis; include swirl flap handling if needed.',
    status: 'in_progress',
    createdAt: '2026-04-09T11:30:00Z',
    selectedOfferId: 'off-bmw-s2',
  },
  {
    id: 'req-audi-adblue',
    buyerId: primaryUser.id,
    summary: 'AdBlue fault after refill — EU6 A4 Avant',
    vehicle: {
      make: 'Audi',
      model: 'A4 Avant (B9)',
      year: 2019,
      engine: '2.0 TDI 140 kW',
      ecu: 'EDC17CP54',
      fuel: 'Diesel',
      powerKw: 140,
    },
    categoryId: 'diesel',
    goal: 'SCR / AdBlue calibration for off-road use; send checksum-safe file.',
    status: 'completed',
    createdAt: '2026-03-28T09:00:00Z',
    selectedOfferId: 'off-audi-s2',
  },
  {
    id: 'req-peugeot',
    buyerId: primaryUser.id,
    summary: 'EGR cooler delete file — DV5RC',
    vehicle: {
      make: 'Peugeot',
      model: '3008 II',
      year: 2020,
      engine: '1.5 BlueHDi 96 kW',
      ecu: 'MD1CS003',
      fuel: 'Diesel',
      powerKw: 96,
    },
    categoryId: 'diesel',
    goal: 'EGR off + mild smoke fix; stock power target.',
    status: 'open',
    createdAt: '2026-04-13T07:15:00Z',
  },
]

export const initialBlindOffers: BlindOffer[] = [
  {
    id: 'off-gti-s1',
    requestId: 'req-gti',
    sellerId: 's1',
    priceEur: 118,
    etaHours: 3,
    pitch: 'Stage 1 with dyno log from identical HW/SW. Two revision rounds included.',
    createdAt: '2026-04-11T09:12:00Z',
    status: 'pending',
  },
  {
    id: 'off-gti-s2',
    requestId: 'req-gti',
    sellerId: 's2',
    priceEur: 94,
    etaHours: 5,
    pitch: 'Conservative timing for hot EU summers; overrun burble subtle (track-safe).',
    createdAt: '2026-04-11T10:40:00Z',
    status: 'pending',
  },
  {
    id: 'off-gti-s3',
    requestId: 'req-gti',
    sellerId: 's3',
    priceEur: 105,
    etaHours: 4,
    pitch: 'File within 4h if read matches. Includes one datalog review.',
    createdAt: '2026-04-11T11:05:00Z',
    status: 'pending',
  },
  {
    id: 'off-bmw-s2',
    requestId: 'req-bmw-dpf',
    sellerId: 's2',
    priceEur: 72,
    etaHours: 6,
    pitch: 'Full solution for your SW; includes cold-start smoke patch.',
    createdAt: '2026-04-09T14:00:00Z',
    status: 'accepted',
  },
  {
    id: 'off-audi-s2',
    requestId: 'req-audi-adblue',
    sellerId: 's2',
    priceEur: 58,
    etaHours: 8,
    pitch: 'SCR dev matching your exact SW; escrow until you confirm no MIL.',
    createdAt: '2026-03-28T10:30:00Z',
    status: 'accepted',
  },
]

export type CompletedJob = {
  id: string
  vehicle: string
  outcome: string
  completedAt: string
  sellerName: string
}

export const recentlyCompletedJobs: CompletedJob[] = [
  {
    id: 'c1',
    vehicle: 'Mercedes-AMG A35 (W177) — MG1',
    outcome: 'Stage 1 delivered · buyer confirmed',
    completedAt: '2026-04-12T16:20:00Z',
    sellerName: 'NordTune Labs',
  },
  {
    id: 'c2',
    vehicle: 'Skoda Octavia RS 2.0 TDI — EDC17',
    outcome: 'DPF solution +1 revision',
    completedAt: '2026-04-12T14:05:00Z',
    sellerName: 'ACJ Tune',
  },
  {
    id: 'c3',
    vehicle: 'Volvo XC60 D5 — Denso',
    outcome: 'EGR off + smoke correction',
    completedAt: '2026-04-11T21:40:00Z',
    sellerName: 'ACJ Tune',
  },
]

export type DashboardOrder = {
  id: string
  buyer: string
  serviceTitle: string
  amountEur: number
  status: 'escrow' | 'delivered' | 'completed' | 'dispute'
  createdAt: string
  autoReleaseAt?: string
  requestId?: string
}

export const dashboardOrders: DashboardOrder[] = [
  {
    id: 'ord-1042',
    buyer: 'buyer_***7f',
    serviceTitle: 'DPF + EGR off — BMW F30 320d B47 (EDC17C50)',
    amountEur: 72,
    status: 'escrow',
    createdAt: '2026-04-12T14:20:00Z',
    autoReleaseAt: '2026-04-15T14:20:00Z',
    requestId: 'req-bmw-dpf',
  },
  {
    id: 'ord-1041',
    buyer: 'buyer_***a2',
    serviceTitle: 'Damos bundle — Bosch EDC17CP14 (VAG 2.0 TDI)',
    amountEur: 38,
    status: 'delivered',
    createdAt: '2026-04-11T09:00:00Z',
    autoReleaseAt: '2026-04-14T09:00:00Z',
  },
  {
    id: 'ord-1038',
    buyer: 'buyer_***91',
    serviceTitle: 'AdBlue / SCR dev — Volvo VEA D4 (Euro 6)',
    amountEur: 62,
    status: 'completed',
    createdAt: '2026-04-08T11:30:00Z',
  },
  {
    id: 'ord-1035',
    buyer: 'buyer_***3c',
    serviceTitle: 'Stage 1 ECU — VW Golf 8 GTI 2.0 TSI (MG1CS008)',
    amountEur: 95,
    status: 'dispute',
    createdAt: '2026-04-05T16:00:00Z',
  },
]

export type Dispute = {
  id: string
  orderId: string
  openedAt: string
  reason: string
  parties: string
  status: 'open' | 'review'
}

export const adminDisputes: Dispute[] = [
  {
    id: 'dsp-01',
    orderId: 'ord-1035',
    openedAt: '2026-04-06T10:00:00Z',
    reason: 'Buyer claims file checksum failed after flash.',
    parties: 'buyer_***3c ↔ ACJ Tune',
    status: 'open',
  },
  {
    id: 'dsp-02',
    orderId: 'ord-998',
    openedAt: '2026-04-02T08:00:00Z',
    reason: 'Delivery SLA exceeded by 6h; partial refund requested.',
    parties: 'buyer_***22 ↔ NordTune Labs',
    status: 'review',
  },
]

export const subscriptionPlans = [
  {
    id: 'single',
    name: 'Single category',
    priceEur: 30,
    description: 'Sell in one category. Unlimited listings in that category.',
  },
  {
    id: 'multi',
    name: 'Multi category',
    priceEur: 50,
    description: 'Sell across two or more categories. Unlimited listings per category.',
  },
] as const

export function offersForRequest(
  requestId: string,
  offers: BlindOffer[],
): BlindOffer[] {
  return offers.filter((o) => o.requestId === requestId)
}

export function sellerOfferForRequest(
  requestId: string,
  sellerId: string,
  offers: BlindOffer[],
): BlindOffer | undefined {
  return offers.find(
    (o) => o.requestId === requestId && o.sellerId === sellerId && o.status !== 'declined',
  )
}

export function offerCountForRequest(requestId: string, offers: BlindOffer[]): number {
  return offers.filter((o) => o.requestId === requestId && o.status === 'pending').length
}
