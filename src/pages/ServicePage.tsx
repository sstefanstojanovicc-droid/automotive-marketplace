import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, ShieldCheck, Star } from 'lucide-react'
import { categories, sellerById, serviceById } from '../data/seed'

export function ServicePage() {
  const { id } = useParams<{ id: string }>()
  const service = id ? serviceById(id) : undefined
  const seller = service ? sellerById(service.sellerId) : undefined
  const cat = service
    ? categories.find((c) => c.id === service.categoryId)
    : undefined

  if (!service || !seller) {
    return (
      <div className="rounded-2xl border border-border bg-surface-1 p-10 text-center">
        <p className="text-fg-soft">Listing not found.</p>
        <Link to="/" className="mt-4 inline-block text-accent hover:underline">
          Back to browse
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-fg-soft hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        All listings
      </Link>

      <div className="overflow-hidden rounded-3xl border border-border bg-surface-1 shadow-xl shadow-black/30">
        <div className="border-b border-border bg-surface-2/50 px-6 py-5 sm:px-8">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
              {cat?.short}
            </span>
            {service.tags.map((t) => (
              <span
                key={t}
                className="rounded-md border border-border bg-surface-1 px-2 py-0.5 text-xs text-fg-soft"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            {service.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-fg-soft">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warn text-warn" />
              {service.rating} · {service.reviews} reviews
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Typical delivery: {service.deliveryHours}h
            </span>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <p className="leading-relaxed text-fg-soft">{service.description}</p>

          <div className="mt-8 rounded-2xl border border-border bg-surface-2/40 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Price</p>
                <p className="font-mono text-3xl font-bold text-fg">€{service.priceEur}</p>
              </div>
              <button
                type="button"
                disabled
                title="Complete checkout to place order"
                className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-surface-0 opacity-60"
              >
                Order with escrow
              </button>
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Payment held in escrow until you confirm receipt. Auto-release after 72h if no
              dispute (concept).
            </p>
          </div>

          <div className="mt-8 border-t border-border pt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Seller
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-3 font-semibold text-accent">
                {seller.name.slice(0, 1)}
              </div>
              <div>
                <p className="font-medium text-fg">{seller.name}</p>
                <p className="text-sm text-fg-soft">
                  @{seller.handle} · {seller.country} · {seller.completedOrders}+ orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
