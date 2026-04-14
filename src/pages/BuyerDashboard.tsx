import { Link } from 'react-router-dom'
import { ArrowRight, FileStack, Inbox, Plus, Shield } from 'lucide-react'
import { useSession } from '../context/Session'
import { categories } from '../data/seed'

function statusLabel(status: string) {
  const map: Record<string, string> = {
    open: 'Open · tuners can bid',
    offers: 'Offers received',
    in_progress: 'In progress · escrow',
    completed: 'Completed',
    disputed: 'Dispute',
  }
  return map[status] ?? status
}

function statusStyle(status: string) {
  const map: Record<string, string> = {
    open: 'bg-surface-3 text-fg-soft ring-border',
    offers: 'bg-warn/15 text-warn ring-warn/25',
    in_progress: 'bg-accent/15 text-accent ring-accent/25',
    completed: 'bg-surface-3 text-muted ring-border',
    disputed: 'bg-danger/15 text-danger ring-danger/30',
  }
  return map[status] ?? 'bg-surface-3 text-fg-soft ring-border'
}

export function BuyerDashboard() {
  const { user, fileRequests, blindOffers } = useSession()
  const mine = fileRequests.filter((r) => r.buyerId === user.id)

  const openCount = mine.filter((r) => r.status === 'open' || r.status === 'offers').length
  const activeCount = mine.filter((r) => r.status === 'in_progress').length

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fg">Buyer hub</h1>
          <p className="mt-1 text-fg-soft">
            Signed in as{' '}
            <span className="font-medium text-fg">
              {user.name} · @{user.handle}
            </span>
          </p>
        </div>
        <Link
          to="/buyer/requests/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-surface-0 shadow-lg shadow-accent/20 transition hover:bg-accent-dim"
        >
          <Plus className="h-4 w-4" />
          New file request
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface-1 p-5">
          <div className="mb-2 flex items-center gap-2 text-muted">
            <Inbox className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Awaiting offers</span>
          </div>
          <p className="font-mono text-2xl font-bold text-fg">{openCount}</p>
          <p className="mt-1 text-xs text-fg-soft">Open requests you can review</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface-1 p-5">
          <div className="mb-2 flex items-center gap-2 text-muted">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium uppercase tracking-wide">In escrow</span>
          </div>
          <p className="font-mono text-2xl font-bold text-accent">{activeCount}</p>
          <p className="mt-1 text-xs text-fg-soft">Funds released after you confirm</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface-1 p-5">
          <div className="mb-2 flex items-center gap-2 text-muted">
            <FileStack className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Total requests</span>
          </div>
          <p className="font-mono text-2xl font-bold text-fg">{mine.length}</p>
          <p className="mt-1 text-xs text-fg-soft">European vehicle jobs on your account</p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-fg">Your file requests</h2>
        <ul className="space-y-3">
          {mine.map((r) => {
            const cat = categories.find((c) => c.id === r.categoryId)
            const n = blindOffers.filter(
              (o) => o.requestId === r.id && o.status === 'pending',
            ).length
            return (
              <li key={r.id}>
                <Link
                  to={`/buyer/requests/${r.id}`}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-1 p-5 transition hover:border-accent/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-fg">
                      {r.vehicle.make} {r.vehicle.model}{' '}
                      <span className="text-fg-soft">({r.vehicle.year})</span>
                    </p>
                    <p className="mt-1 truncate text-sm text-fg-soft">{r.summary}</p>
                    <p className="mt-1 text-xs text-muted">
                      {cat?.short} · ECU {r.vehicle.ecu} · {r.vehicle.fuel}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    {(r.status === 'open' || r.status === 'offers') && (
                      <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-fg-soft">
                        {n} blind offer{n === 1 ? '' : 's'}
                      </span>
                    )}
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${statusStyle(r.status)}`}
                    >
                      {statusLabel(r.status)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                      View
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <p className="text-center text-xs text-muted">
        Marketplace flow: blind bids → accept → escrow → chat → delivery.
      </p>
    </div>
  )
}
