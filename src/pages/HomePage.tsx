import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  MessageSquare,
  Shield,
  Sparkles,
} from 'lucide-react'
import { categories, recentlyCompletedJobs, services } from '../data/seed'
import type { CategoryId } from '../data/seed'
import { ServiceCard } from '../components/ServiceCard'

export function HomePage() {
  const [filter, setFilter] = useState<CategoryId | 'all'>('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return services
    return services.filter((s) => s.categoryId === filter)
  }, [filter])

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface-1 via-surface-1 to-surface-2 px-6 py-12 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-48 w-48 rounded-full bg-warn/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            European cars · digital calibrations
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            File exchange for tuners — blind bids, escrow, delivery
          </h1>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-fg-soft sm:text-lg">
            Post a request with your VIN / ECU details, receive private offers from independent
            tuners, then pay into <span className="text-fg">escrow</span> while files are delivered
            — same core loop as{' '}
            <a
              href="https://tunerfx.net/"
              className="text-accent underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              TunerFX
            </a>
            , with our UI.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/buyer/requests/new"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-surface-0 shadow-lg shadow-accent/25 transition hover:bg-accent-dim"
            >
              New file request
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#listings"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2/80 px-5 py-3 text-sm font-medium text-fg-soft transition hover:border-accent/40 hover:text-fg"
            >
              Browse fixed-price gigs
            </a>
            <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2/80 px-4 py-3 text-sm text-fg-soft">
              <Lock className="h-4 w-4 text-accent" />
              Signed in · switch Buyer or Seller above
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-surface-1 p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-xl font-bold text-fg">
            <Sparkles className="h-5 w-5 text-accent" />
            How it works
          </h2>
          <ol className="mt-6 space-y-5">
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 font-mono text-sm font-bold text-accent">
                1
              </span>
              <div>
                <p className="font-medium text-fg">New request</p>
                <p className="mt-1 text-sm text-fg-soft">
                  Add vehicle (e.g. VW, BMW, Audi, Volvo), ECU box, and goal. Attach your stock read
                  before publishing when you submit the request.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 font-mono text-sm font-bold text-accent">
                2
              </span>
              <div>
                <p className="font-medium text-fg">Blind offers</p>
                <p className="mt-1 text-sm text-fg-soft">
                  Multiple tuners bid; they don&apos;t see each other&apos;s prices. You compare
                  everything in one place.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 font-mono text-sm font-bold text-accent">
                3
              </span>
              <div>
                <p className="font-medium text-fg">Pay · escrow · delivery</p>
                <p className="mt-1 text-sm text-fg-soft">
                  Accept an offer, funds stay on hold until you confirm satisfaction; auto-release
                  after 72h if no dispute (concept).
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 font-mono text-sm font-bold text-accent">
                4
              </span>
              <div>
                <p className="font-medium text-fg">Feedback</p>
                <p className="mt-1 text-sm text-fg-soft">
                  Rate the tuner to keep quality high — refunds/disputes go through support in real
                  product.
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-surface-1 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-bold text-fg">
              <Clock className="h-5 w-5 text-warn" />
              Recently completed
            </h2>
            <p className="mt-1 text-sm text-fg-soft">Latest closed jobs — European marques.</p>
            <ul className="mt-5 space-y-3">
              {recentlyCompletedJobs.map((j) => (
                <li
                  key={j.id}
                  className="flex items-start gap-3 rounded-xl border border-border/80 bg-surface-2/40 px-4 py-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-fg">{j.vehicle}</p>
                    <p className="text-xs text-fg-soft">{j.outcome}</p>
                    <p className="mt-1 text-xs text-muted">
                      {j.sellerName} · {new Date(j.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface-1 p-4">
              <Shield className="h-5 w-5 text-accent" />
              <p className="mt-2 text-sm font-medium text-fg">Escrow</p>
              <p className="mt-1 text-xs text-fg-soft">Platform holds payout until release rules pass.</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-1 p-4">
              <MessageSquare className="h-5 w-5 text-accent" />
              <p className="mt-2 text-sm font-medium text-fg">Thread</p>
              <p className="mt-1 text-xs text-fg-soft">Chat + revisions after accept (UI later).</p>
            </div>
          </div>
        </div>
      </section>

      <section id="listings" className="scroll-mt-24">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-fg">Fixed-price storefront</h2>
            <p className="mt-1 text-sm text-fg-soft">
              Parallel to requests — tuners also publish ready-made EU-market services.
            </p>
          </div>
          <Link
            to="/buyer"
            className="text-sm font-medium text-accent hover:underline"
          >
            Go to buyer hub →
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-accent text-surface-0'
                : 'border border-border bg-surface-2 text-fg-soft hover:border-accent/40 hover:text-fg'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === c.id
                  ? 'bg-accent text-surface-0'
                  : 'border border-border bg-surface-2 text-fg-soft hover:border-accent/40 hover:text-fg'
              }`}
            >
              {c.short}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>
    </div>
  )
}
