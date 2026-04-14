import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download, EyeOff, Gavel } from 'lucide-react'
import { useSession } from '../context/Session'
import { categories, sellerOfferForRequest } from '../data/seed'

export function SellerRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const {
    fileRequests,
    blindOffers,
    submitBlindOffer,
    sellerPersona,
    requestFiles,
    requestMessages,
    requestOrders,
    uploadRequestFile,
    addMessage,
    markDelivered,
  } = useSession()
  const request = fileRequests.find((r) => r.id === id)

  const [price, setPrice] = useState(69)
  const [eta, setEta] = useState(6)
  const [pitch, setPitch] = useState('')
  const [deliveryFile, setDeliveryFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')

  if (!request) {
    return (
      <div className="rounded-2xl border border-border bg-surface-1 p-10 text-center">
        <p className="text-fg-soft">Request not found.</p>
        <Link to="/seller" className="mt-4 inline-block text-accent hover:underline">
          Seller hub
        </Link>
      </div>
    )
  }

  const requestId = request.id
  const cat = categories.find((c) => c.id === request.categoryId)
  const myOffer = sellerOfferForRequest(requestId, sellerPersona.id, blindOffers)
  const acceptedOffer = blindOffers.find(
    (o) => o.requestId === requestId && o.status === 'accepted',
  )
  const isSelectedSeller = acceptedOffer?.sellerId === sellerPersona.id
  const order = requestOrders.find((o) => o.requestId === requestId)
  const files = requestFiles.filter((f) => f.requestId === requestId)
  const messages = requestMessages.filter((m) => m.requestId === requestId)
  const peerPending = blindOffers.filter(
    (o) =>
      o.requestId === requestId &&
      o.status === 'pending' &&
      o.sellerId !== sellerPersona.id,
  ).length
  const biddingOpen = request.status === 'open' || request.status === 'offers'

  function onSubmitOffer(e: React.FormEvent) {
    e.preventDefault()
    submitBlindOffer({
      requestId,
      priceEur: price,
      etaHours: eta,
      pitch: pitch || 'Ready to start after read confirmation.',
    })
    setPitch('')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        to="/seller"
        className="inline-flex items-center gap-2 text-sm text-fg-soft hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Open requests
      </Link>

      <div className="rounded-3xl border border-border bg-surface-1 p-6 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Marketplace job</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-fg">
          {request.vehicle.make} {request.vehicle.model}{' '}
          <span className="text-fg-soft">({request.vehicle.year})</span>
        </h1>
        <p className="mt-2 text-fg-soft">{request.summary}</p>
        <p className="mt-4 text-sm text-muted">
          {cat?.label} · {request.vehicle.engine} · {request.vehicle.ecu}
        </p>
        <div className="mt-6 rounded-2xl border border-border bg-surface-0/50 p-4">
          <p className="text-sm font-medium text-fg">Buyer goal</p>
          <p className="mt-1 text-sm text-fg-soft">{request.goal}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-warn/25 bg-warn/5 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <EyeOff className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
          <div>
            <h2 className="text-lg font-semibold text-fg">Blind bidding</h2>
            <p className="mt-1 text-sm text-fg-soft">
              You cannot see other tuners&apos; prices. Buyers see every offer privately and pick
              one.
            </p>
            <p className="mt-3 text-sm text-fg">
              Other tuners with a pending offer:{' '}
              <span className="font-mono font-semibold text-accent">{peerPending}</span>.
              {myOffer && (
                <span className="text-fg-soft"> You already submitted yours.</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {!biddingOpen && (
        <div className="rounded-2xl border border-border bg-surface-2/40 p-5 text-sm text-fg-soft">
          Bidding closed — buyer selected a tuner or job finished.
        </div>
      )}

      {biddingOpen && myOffer && (
        <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5">
          <div className="flex items-center gap-2 text-accent">
            <Gavel className="h-4 w-4" />
            <span className="text-sm font-semibold">Your offer</span>
          </div>
          <p className="mt-2 font-mono text-lg font-bold text-fg">
            €{myOffer.priceEur} · {myOffer.etaHours}h
          </p>
          <p className="mt-1 text-sm text-fg-soft">{myOffer.pitch}</p>
        </div>
      )}

      {biddingOpen && !myOffer && (
        <form
          onSubmit={onSubmitOffer}
          className="space-y-4 rounded-3xl border border-border bg-surface-1 p-6 sm:p-8"
        >
          <h2 className="text-lg font-semibold text-fg">Submit offer as {sellerPersona.name}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-fg-soft">Price (EUR)</label>
              <input
                type="number"
                min={10}
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-surface-0 px-4 py-3 font-mono text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-fg-soft">ETA (hours)</label>
              <input
                type="number"
                min={1}
                required
                value={eta}
                onChange={(e) => setEta(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-surface-0 px-4 py-3 font-mono text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm text-fg-soft">Note to buyer</label>
            <textarea
              rows={3}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="What’s included, revision policy, required reads…"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-surface-0 hover:bg-accent-dim"
          >
            Submit blind offer
          </button>
        </form>
      )}

      {isSelectedSeller && order && (
        <div className="space-y-4 rounded-3xl border border-border bg-surface-1 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-fg">Delivery workspace</h2>
          <p className="text-sm text-fg-soft">
            Order status: <span className="font-semibold text-accent">{order.status}</span>
          </p>
          <div className="rounded-xl border border-dashed border-border bg-surface-2/30 p-4">
            <input
              type="file"
              onChange={(e) => setDeliveryFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-border bg-surface-0 px-3 py-2 text-xs text-fg"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!deliveryFile}
                onClick={async () => {
                  if (!deliveryFile) return
                  await uploadRequestFile({
                    requestId,
                    file: deliveryFile,
                    kind: 'delivery',
                  })
                  setDeliveryFile(null)
                }}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface-0 disabled:opacity-50"
              >
                Upload delivery file
              </button>
              <button
                type="button"
                onClick={() => markDelivered(requestId)}
                className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-fg-soft"
              >
                Mark delivered
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface-1 p-5">
        <h2 className="mb-3 text-lg font-semibold text-fg">Files</h2>
        {files.length === 0 && <p className="text-sm text-fg-soft">No files shared yet.</p>}
        <ul className="space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-2/30 px-3 py-2"
            >
              <p className="text-sm text-fg-soft">
                {f.name} · {f.kind} · {f.uploadedBy}
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
            addMessage({ requestId, author: 'seller', body: message })
            setMessage('')
          }}
          className="flex gap-2"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-fg"
            placeholder="Write message to buyer..."
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
