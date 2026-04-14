import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Download, EyeOff, MessageCircle, ShieldCheck } from 'lucide-react'
import { useSession } from '../context/Session'
import { categories, sellerById } from '../data/seed'

export function BuyerRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const {
    user,
    fileRequests,
    blindOffers,
    acceptOffer,
    requestFiles,
    requestMessages,
    requestOrders,
    addMessage,
    startDemoCheckout,
    confirmDelivered,
    openDispute,
  } = useSession()
  const [message, setMessage] = useState('')
  const request = fileRequests.find((r) => r.id === id)
  const offers = blindOffers
    .filter((o) => o.requestId === id && o.status === 'pending')
    .slice()
    .sort((a, b) => a.priceEur - b.priceEur)

  const accepted = blindOffers.find(
    (o) => o.requestId === id && o.status === 'accepted',
  )
  const order = requestOrders.find((o) => o.requestId === id)
  const files = useMemo(
    () => requestFiles.filter((f) => f.requestId === id),
    [requestFiles, id],
  )
  const messages = useMemo(
    () => requestMessages.filter((m) => m.requestId === id),
    [requestMessages, id],
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
              Only you see all prices — tuners cannot see each other&apos;s bids.
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
                Next: run demo checkout (no charge) to start escrow and unlock delivery flow.
              </p>
              {!order && (
                <button
                  type="button"
                  onClick={() => startDemoCheckout(request.id, accepted.id)}
                  className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface-0 hover:bg-accent-dim"
                >
                  Start demo checkout (no payment)
                </button>
              )}
            </div>
          </div>
        )}

        {order && (
          <div className="mb-6 rounded-2xl border border-border bg-surface-2/40 p-4 text-sm">
            <p className="font-medium text-fg">
              Demo order {order.id} · €{order.amountEur}
            </p>
            <p className="mt-1 text-fg-soft">
              Status:{' '}
              <span className="font-semibold text-accent">{order.status.replace('_', ' ')}</span>
            </p>
            {order.status === 'delivered' && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => confirmDelivered(request.id)}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface-0 hover:bg-accent-dim"
                >
                  Confirm delivery
                </button>
                <button
                  type="button"
                  onClick={() => openDispute(request.id, 'Delivery needs revision')}
                  className="rounded-lg border border-border bg-surface-1 px-4 py-2 text-sm font-medium text-fg-soft"
                >
                  Open dispute
                </button>
              </div>
            )}
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
          Chat, revisions, and file handoff are active for this request.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface-1 p-5">
        <h2 className="mb-3 text-lg font-semibold text-fg">Files</h2>
        {files.length === 0 && <p className="text-sm text-fg-soft">No files uploaded yet.</p>}
        <ul className="space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-2/30 px-3 py-2"
            >
              <p className="text-sm text-fg-soft">
                {f.name} · {Math.ceil(f.size / 1024)} KB · {f.uploadedBy}
              </p>
              <a
                href={f.dataUrl}
                download={f.name}
                className="inline-flex items-center gap-1 rounded-lg bg-surface-1 px-3 py-1.5 text-xs font-medium text-accent"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-surface-1 p-5">
        <h2 className="mb-3 text-lg font-semibold text-fg">Thread</h2>
        <ul className="mb-4 space-y-2">
          {messages.map((m) => (
            <li key={m.id} className="rounded-lg border border-border bg-surface-2/30 px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-muted">{m.author}</p>
              <p className="text-sm text-fg-soft">{m.body}</p>
            </li>
          ))}
          {messages.length === 0 && <p className="text-sm text-fg-soft">No messages yet.</p>}
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addMessage({ requestId: request.id, author: 'buyer', body: message })
            setMessage('')
          }}
          className="flex gap-2"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-fg"
            placeholder="Write message to seller..."
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface-0"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
