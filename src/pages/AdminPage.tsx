import { Gavel, MessageSquareWarning } from 'lucide-react'
import { adminDisputes } from '../data/seed'

export function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-fg">Admin · Disputes</h1>
        <p className="mt-1 text-fg-soft">
          Review open disputes and trigger manual release when appropriate.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface-1 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Open</p>
          <p className="mt-1 font-mono text-2xl font-bold text-warn">1</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface-1 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">In review</p>
          <p className="mt-1 font-mono text-2xl font-bold text-accent">1</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface-1 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">SLA target</p>
          <p className="mt-1 font-mono text-2xl font-bold text-fg">48h</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-fg">
          <Gavel className="h-5 w-5 text-accent" />
          Active cases
        </h2>
        <ul className="space-y-3">
          {adminDisputes.map((d) => (
            <li
              key={d.id}
              className="rounded-2xl border border-border bg-surface-1 p-5 transition hover:border-accent/25"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm text-accent">{d.id}</p>
                  <p className="mt-1 font-medium text-fg">Order {d.orderId}</p>
                  <p className="mt-2 flex items-start gap-2 text-sm text-fg-soft">
                    <MessageSquareWarning className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
                    {d.reason}
                  </p>
                  <p className="mt-2 text-xs text-muted">{d.parties}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${
                      d.status === 'open'
                        ? 'bg-warn/15 text-warn ring-warn/25'
                        : 'bg-surface-3 text-fg-soft ring-border'
                    }`}
                  >
                    {d.status === 'open' ? 'Needs action' : 'Under review'}
                  </span>
                  <button
                    type="button"
                    disabled
                    className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-fg-soft"
                  >
                    Open case
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
