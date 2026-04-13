import { Link } from 'react-router-dom'
import { Clock, Star } from 'lucide-react'
import type { Service } from '../data/seed'
import { categories, sellerById } from '../data/seed'

type Props = { service: Service }

export function ServiceCard({ service }: Props) {
  const seller = sellerById(service.sellerId)
  const cat = categories.find((c) => c.id === service.categoryId)

  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-surface-1/90 p-5 shadow-lg shadow-black/20 ring-1 ring-white/[0.03] transition hover:border-accent/35 hover:shadow-accent/5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-surface-3 px-2 py-0.5 text-xs font-medium text-accent">
          {cat?.short}
        </span>
        {service.tags.slice(0, 2).map((t) => (
          <span
            key={t}
            className="rounded-md border border-border/80 bg-surface-2 px-2 py-0.5 text-xs text-fg-soft"
          >
            {t}
          </span>
        ))}
      </div>
      <h3 className="mb-2 text-lg font-semibold leading-snug tracking-tight text-fg group-hover:text-accent">
        <Link to={`/s/${service.id}`} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          {service.title}
        </Link>
      </h3>
      <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-fg-soft">
        {service.description}
      </p>
      <div className="flex items-end justify-between gap-3 border-t border-border/80 pt-4">
        <div>
          <p className="text-xs text-muted">From</p>
          <p className="font-mono text-xl font-semibold text-fg">
            €{service.priceEur}
          </p>
        </div>
        <div className="text-right text-xs text-fg-soft">
          <p className="flex items-center justify-end gap-1">
            <Star className="h-3.5 w-3.5 fill-warn text-warn" />
            <span className="font-medium text-fg">{service.rating}</span>
            <span className="text-muted">({service.reviews})</span>
          </p>
          <p className="mt-1 flex items-center justify-end gap-1 text-muted">
            <Clock className="h-3.5 w-3.5" />
            {service.deliveryHours}h delivery
          </p>
        </div>
      </div>
      {seller && (
        <p className="mt-3 text-xs text-muted">
          <span className="text-fg-soft">{seller.name}</span> · {seller.country}
          {seller.plan === 'multi' && (
            <span className="ml-1 rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
              Pro seller
            </span>
          )}
        </p>
      )}
    </article>
  )
}
