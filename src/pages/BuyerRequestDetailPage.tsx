import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, EyeOff, MessageCircle, ShieldCheck } from 'lucide-react'
import { useSession } from '../context/Session'
import { categories, sellerById } from '../data/seed'

export function BuyerRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, fileRequests, blindOffers, acceptOffer } = useSession()
  const request = fileRequests.find((r) => r.id === id)
  const offers = blindOffers
    .filter((o) => o.requestId === id && o.status === 'pending')
    .slice()
    .sort((a, b) => a.priceEur - b.priceEur)

  const accepted = blindOffers.find(
    (o) => o.requestId === id && o.status === 'accepted',
  )

  if (!request || request.buyerId !== user.id) {
    return (
      <div className="rounded-2xl border border-border bg-surface-1 p-10 text-center">
        <p className="text-fg-soft">Request not found.</p>
        <Link to="/buyer" className="mt-4 inline-block text-accent hover:underline">
          Buyer hub
        </Link>
      </div>
    )
  }

  const cat = categories.find((c) => c.id === request.categoryId)

  const canPick = request.status === 'open' || request.status === 'offers'

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        to="/buyer"
        className="inline-flex items-center gap-2 text-sm text-fg-soft hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Your requests
      </Link>

      <div className="rounded-3xl border border-border bg-surface-1 p-6 sm:p-8">
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
            {cat?.short}
          </span>
          <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 text-xs text-fg-soft">
            {request.vehicle.fuel}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
          {request.vehicle.make} {request.vehicle.model}{' '}
          <span className="text-fg-soft">({request.vehicle.year})</span>
        </h1>
        <p className="mt-2 text-fg-soft">{request.summary}</p>

        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-surface-2/50 px-4 py-3">
            <dt className="text-muted">Engine</dt>
            <dd className="font-medium text-fg">{request.vehicle.engine}</dd>
          </div>
          <div className="rounded-xl bg-surface-2/50 px-4 py-3">
            <dt className="text-muted">ECU</dt>
            <dd className="font-mono text-fg">{request.vehicle.ecu}</dd>
          </div>
          {request.vehicle.powerKw != null && (
            <div className="rounded-xl bg-surface-2/50 px-4 py-3">
              <dt className="text-muted">Power</dt>
              <dd className="font-medium text-fg">{request.vehicle.powerKw} kW</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 rounded-2xl border border-border bg-surface-0/50 p-4">
          <p className="text-sm font-medium text-fg">Goal</p>
          <p className="mt-1 text-sm leading-relaxed text-fg-soft">{request.goal}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface-1 p-6 sm:p-8">
        <div className="mb-4 flex items-start gap-3">
          <EyeOff className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
          <div>
            <h2 className="text-lg font-semibold text-fg">Blind offers</h2>
            <p className="mt-1 text-sm text-fg-soft">
              Only you see all prices — tuners cannot see each other&apos;s bids (same idea as{' '}
              <a
                href="https://tunerfx.net/"
                className="text-accent hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                TunerFX
              </a>
              ).
            </p>
          </div>
        </div>

        {accepted && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="font-medium text-fg">Accepted offer</p>
              <p className="mt-1 text-sm text-fg-soft">
                {sellerById(accepted.sellerId)?.name} · €{accepted.priceEur} · ETA{' '}
                {accepted.etaHours}h
              </p>
              <p className="mt-2 flex items-center gap-2 text-xs text-muted">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Next: complete payment → funds in escrow → tuner uploads → you confirm → 72h
                auto-release if no dispute.
              </p>
            </div>
          </div>
        )}

        {offers.length === 0 && !accepted && (
          <p className="text-sm text-fg-soft">No pending offers yet. Tuners are notified.</p>
        )}

        <ul className="space-y-3">
          {offers.map((o) => {
            const seller = sellerById(o.sellerId)
            return (
              <li
                key={o.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-2/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-fg">{seller?.name ?? o.sellerId}</p>
                  <p className="mt-1 text-sm text-fg-soft">{o.pitch}</p>
                  <p className="mt-2 text-xs text-muted">
                    Posted {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                  <p className="font-mono text-xl font-bold text-fg">€{o.priceEur}</p>
                  <p className="text-xs text-muted">{o.etaHours}h ETA</p>
                  {canPick && (
                    <button
                      type="button"
                      onClick={() => acceptOffer(request.id, o.id)}
                      className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface-0 hover:bg-accent-dim"
                    >
                      Accept &amp; pay
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-surface-2/30 p-4">
        <p className="flex items-center gap-2 text-sm text-fg-soft">
          <MessageCircle className="h-4 w-4 text-accent" />
          Chat, revisions, and file handoff live in the order thread after checkout.
        </p>
      </div>
    </div>
  )
}
