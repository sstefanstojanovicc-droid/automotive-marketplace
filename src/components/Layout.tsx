import { Link, NavLink, Outlet } from 'react-router-dom'
import { Gauge, LayoutDashboard, Scale, Search, Shield, User } from 'lucide-react'
import { useSession } from '../context/Session'

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-surface-2 text-accent shadow-[inset_0_0_0_1px_var(--color-border)]'
      : 'text-fg-soft hover:bg-surface-2 hover:text-fg',
  ].join(' ')

export function Layout() {
  const { workspaceMode, setWorkspaceMode, user, sellerPersona } = useSession()

  return (
    <div className="bg-app min-h-svh">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-surface-0/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold tracking-tight text-fg"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/30">
              <Gauge className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="hidden sm:inline">DriveDigital</span>
          </Link>

          <label className="relative hidden min-w-0 flex-1 basis-full md:basis-auto lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Search ECU files, maps, remote sessions…"
              className="w-full rounded-xl border border-border bg-surface-1 py-2.5 pl-10 pr-4 text-sm text-fg placeholder:text-muted outline-none ring-accent/0 transition-shadow focus:ring-2 focus:ring-accent/40"
              readOnly
              title="Search coming soon"
            />
          </label>

          <div className="ml-auto flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <div
              className="flex items-center gap-2 rounded-xl border border-border bg-surface-1 py-1 pl-1 pr-1"
              title="Switch buyer or seller workspace"
            >
              <span className="hidden items-center gap-1.5 px-2 text-xs text-fg-soft sm:flex">
                <User className="h-3.5 w-3.5 text-accent" />
                <span className="max-w-[140px] truncate">
                  {workspaceMode === 'buyer' ? `${user.name}` : `${sellerPersona.name}`}
                </span>
              </span>
              <div className="flex rounded-lg bg-surface-0 p-0.5">
                <button
                  type="button"
                  onClick={() => setWorkspaceMode('buyer')}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
                    workspaceMode === 'buyer'
                      ? 'bg-accent text-surface-0'
                      : 'text-fg-soft hover:text-fg'
                  }`}
                >
                  Buyer
                </button>
                <button
                  type="button"
                  onClick={() => setWorkspaceMode('seller')}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
                    workspaceMode === 'seller'
                      ? 'bg-accent text-surface-0'
                      : 'text-fg-soft hover:text-fg'
                  }`}
                >
                  Seller
                </button>
              </div>
            </div>

            <nav className="flex items-center gap-1">
              <NavLink to="/" end className={navClass}>
                <span className="flex items-center gap-1.5">
                  <Search className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Browse</span>
                </span>
              </NavLink>
              <NavLink to="/buyer" className={navClass}>
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Buyer</span>
                </span>
              </NavLink>
              <NavLink to="/seller" className={navClass}>
                <span className="flex items-center gap-1.5">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Seller</span>
                </span>
              </NavLink>
              <NavLink to="/admin" className={navClass}>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </span>
              </NavLink>
              <span
                className="hidden items-center gap-1.5 rounded-lg border border-border/80 bg-surface-2 px-3 py-2 text-xs font-medium text-fg-soft xl:flex"
                title="Escrow hold period"
              >
                <Scale className="h-3.5 w-3.5 text-accent" />
                Hold · 72h
              </span>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted">
        <p>
          DriveDigital · Escrow flow inspired by{' '}
          <a
            href="https://tunerfx.net/"
            className="text-accent hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            TunerFX
          </a>
          . Sellers from €30/mo · buyers free.
        </p>
      </footer>
    </div>
  )
}
