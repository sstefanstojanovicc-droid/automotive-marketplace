import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CreditCard,
  Euro,
  Gavel,
  Package,
  Plus,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import {
  categories,
  dashboardOrders,
  offerCountForRequest,
  sellerOfferForRequest,
  services,
  subscriptionPlans,
} from '../data/seed'
import { useSession } from '../context/Session'

function statusBadge(status: (typeof dashboardOrders)[0]['status']) {
  const map = {
    escrow: 'bg-warn/20 text-warn ring-warn/30',
    delivered: 'bg-accent/15 text-accent ring-accent/25',
    completed: 'bg-surface-3 text-fg-soft ring-border',
    dispute: 'bg-danger/15 text-danger ring-danger/30',
  } as const
  const label = {
    escrow: 'In escrow',
    delivered: 'Delivered',
    completed: 'Released',
    dispute: 'Dispute',
  }[status]
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${map[status]}`}
    >
      {label}
    </span>
  )
}

type Tab = 'overview' | 'requests'

export function SellerDashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  const { sellerPersona, fileRequests, blindOffers } = useSession()
  const seller = sellerPersona
  const myServices = services.filter((s) => s.sellerId === seller.id)
  const plan = subscriptionPlans.find((p) => p.id === seller.plan)!

  const escrowTotal = dashboardOrders
    .filter((o) => o.status === 'escrow' || o.status === 'delivered')
    .reduce((a, o) => a + o.amountEur, 0)

  const openJobs = fileRequests.filter(
    (r) => r.status === 'open' || r.status === 'offers',
  )

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-fg">Seller hub</h1>
        <p className="mt-1 text-fg-soft">
          Working as{' '}
          <span className="font-medium text-fg">
            {seller.name} · @{seller.handle}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface-1 p-1">
        <button
          type="button"
          onClick={() => setTab('overview')}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition sm:flex-none ${
            tab === 'overview'
              ? 'bg-accent text-surface-0'
              : 'text-fg-soft hover:bg-surface-2 hover:text-fg'
          }`}
        >
          Sales &amp; storefront
        </button>
        <button
          type="button"
          onClick={() => setTab('requests')}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition sm:flex-none ${
            tab === 'requests'
              ? 'bg-accent text-surface-0'
              : 'text-fg-soft hover:bg-surface-2 hover:text-fg'
          }`}
        >
          Open file requests
        </button>
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-surface-1 p-5">
              <div className="mb-2 flex items-center gap-2 text-muted">
                <Euro className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">On hold</span>
              </div>
              <p className="font-mono text-2xl font-bold text-fg">€{escrowTotal}</p>
              <p className="mt-1 text-xs text-fg-soft">Escrow + awaiting confirmation</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-1 p-5">
              <div className="mb-2 flex items-center gap-2 text-muted">
                <Wallet className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">This month</span>
              </div>
              <p className="font-mono text-2xl font-bold text-accent">€1,240</p>
              <p className="mt-1 text-xs text-fg-soft">Settled payouts (month to date)</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-1 p-5">
              <div className="mb-2 flex items-center gap-2 text-muted">
                <Package className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Listings</span>
              </div>
              <p className="font-mono text-2xl font-bold text-fg">{myServices.length}</p>
              <p className="mt-1 text-xs text-fg-soft">Fixed-price gigs</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-1 p-5">
              <div className="mb-2 flex items-center gap-2 text-muted">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Rating</span>
              </div>
              <p className="font-mono text-2xl font-bold text-fg">{seller.rating}</p>
              <p className="mt-1 text-xs text-fg-soft">{seller.completedOrders}+ orders</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-fg">Orders</h2>
                <span className="text-xs text-muted">Escrow · 72h auto-release</span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-surface-1">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-surface-2/50 text-xs uppercase tracking-wide text-muted">
                    <tr>
                      <th className="px-4 py-3 font-medium">Order</th>
                      <th className="hidden px-4 py-3 font-medium sm:table-cell">Service</th>
                      <th className="px-4 py-3 font-medium">€</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {dashboardOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-surface-2/30">
                        <td className="px-4 py-3 font-mono text-xs text-fg-soft">{o.id}</td>
                        <td className="hidden max-w-[200px] truncate px-4 py-3 text-fg-soft sm:table-cell">
                          {o.serviceTitle}
                        </td>
                        <td className="px-4 py-3 font-mono text-fg">{o.amountEur}</td>
                        <td className="px-4 py-3">{statusBadge(o.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-fg">Subscription</h2>
              <div className="rounded-2xl border border-accent/30 bg-gradient-to-b from-accent/10 to-transparent p-5 ring-1 ring-accent/20">
                <div className="mb-2 flex items-center gap-2 text-accent">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Current plan
                  </span>
                </div>
                <p className="text-lg font-bold text-fg">{plan.name}</p>
                <p className="mt-1 text-sm text-fg-soft">{plan.description}</p>
                <p className="mt-4 font-mono text-2xl font-bold text-fg">
                  €{plan.priceEur}
                  <span className="text-sm font-normal text-muted">/mo</span>
                </p>
                <button
                  type="button"
                  onClick={() => setTab('requests')}
                  className="mt-4 w-full rounded-xl border border-border bg-surface-2 py-2.5 text-sm font-medium text-fg-soft hover:text-fg"
                >
                  Go to active requests
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-surface-1 p-5">
                <h3 className="mb-3 text-sm font-semibold text-fg">Your listings</h3>
                <ul className="space-y-2">
                  {myServices.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-2 rounded-lg bg-surface-2/50 px-3 py-2 text-sm"
                    >
                      <span className="truncate text-fg-soft">{s.title}</span>
                      <span className="shrink-0 font-mono text-fg">€{s.priceEur}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-surface-0 hover:bg-accent-dim"
                >
                  <Plus className="h-4 w-4" />
                  Browse listing templates
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-1 p-5">
            <Gavel className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <h2 className="text-lg font-semibold text-fg">Bid on buyer requests</h2>
              <p className="mt-1 text-sm text-fg-soft">
                Tuners submit blind offers; buyers compare privately and continue through escrow.
              </p>
            </div>
          </div>

          <ul className="space-y-3">
            {openJobs.map((r) => {
              const cat = categories.find((c) => c.id === r.categoryId)
              const n = offerCountForRequest(r.id, blindOffers)
              const mine = sellerOfferForRequest(r.id, seller.id, blindOffers)
              return (
                <li key={r.id}>
                  <Link
                    to={`/seller/requests/${r.id}`}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-1 p-5 transition hover:border-accent/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-fg">
                        {r.vehicle.make} {r.vehicle.model}{' '}
                        <span className="text-fg-soft">({r.vehicle.year})</span>
                      </p>
                      <p className="mt-1 truncate text-sm text-fg-soft">{r.summary}</p>
                      <p className="mt-1 text-xs text-muted">
                        {cat?.short} · {r.vehicle.ecu}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                      <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-fg-soft">
                        {n} pending offer{n === 1 ? '' : 's'}
                      </span>
                      {mine && (
                        <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                          You: €{mine.priceEur}
                        </span>
                      )}
                      <span className="text-sm font-medium text-accent">Open →</span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>

          {openJobs.length === 0 && (
            <p className="rounded-2xl border border-border bg-surface-1 p-8 text-center text-sm text-fg-soft">
              No open requests right now.
            </p>
          )}
        </div>
      )}

      <p className="text-center text-xs text-muted">
        Use the header switch to move between your buyer account and your seller workspace.
      </p>
    </div>
  )
}
