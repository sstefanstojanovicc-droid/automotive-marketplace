import { useMemo, useState } from 'react'
import { Download, Plus } from 'lucide-react'
import { useSession } from '../context/Session'
import type { VehicleSpec } from '../data/seed'

type OwnerFilter = 'all' | 'personal' | 'client'

export function GaragePage() {
  const { garageCars, garageFiles, addGarageCar } = useSession()
  const [filter, setFilter] = useState<OwnerFilter>('all')
  const [ownerType, setOwnerType] = useState<'personal' | 'client'>('personal')
  const [clientName, setClientName] = useState('')
  const [label, setLabel] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState(2021)
  const [engine, setEngine] = useState('')
  const [ecu, setEcu] = useState('')
  const [fuel, setFuel] = useState<VehicleSpec['fuel']>('Petrol')
  const [powerKw, setPowerKw] = useState<number>(0)

  const visibleCars = useMemo(() => {
    if (filter === 'all') return garageCars
    return garageCars.filter((c) => c.ownerType === filter)
  }, [garageCars, filter])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-fg">Garage</h1>
        <p className="mt-1 text-fg-soft">
          Save personal or client cars. Completed purchases are automatically filed here.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          addGarageCar({
            ownerType,
            clientName: ownerType === 'client' ? clientName : undefined,
            label,
            vehicle: {
              make,
              model,
              year,
              engine,
              ecu,
              fuel,
              powerKw: powerKw > 0 ? powerKw : undefined,
            },
          })
          setLabel('')
          setClientName('')
          setMake('')
          setModel('')
          setYear(2021)
          setEngine('')
          setEcu('')
          setPowerKw(0)
        }}
        className="space-y-4 rounded-2xl border border-border bg-surface-1 p-5"
      >
        <h2 className="text-lg font-semibold text-fg">Add car</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <select
            value={ownerType}
            onChange={(e) => setOwnerType(e.target.value as 'personal' | 'client')}
            className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-fg"
          >
            <option value="personal">Personal</option>
            <option value="client">Client</option>
          </select>
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Client name (optional)"
            className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-fg disabled:opacity-40"
            disabled={ownerType !== 'client'}
          />
          <input
            required
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="Make"
            className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-fg"
          />
          <input
            required
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model"
            className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-fg"
          />
          <input
            required
            type="number"
            min={1980}
            max={2035}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            placeholder="Year"
            className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-fg"
          />
          <input
            required
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
            placeholder="Engine"
            className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-fg"
          />
          <input
            required
            value={ecu}
            onChange={(e) => setEcu(e.target.value)}
            placeholder="ECU"
            className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-fg"
          />
          <select
            value={fuel}
            onChange={(e) => setFuel(e.target.value as VehicleSpec['fuel'])}
            className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-fg"
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <input
            type="number"
            min={0}
            value={powerKw}
            onChange={(e) => setPowerKw(Number(e.target.value))}
            placeholder="Power (kW)"
            className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-fg"
          />
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Custom label (optional)"
            className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-fg sm:col-span-2"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface-0 sm:col-span-2"
          >
            <Plus className="h-4 w-4" />
            Add to garage
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        {(['all', 'personal', 'client'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setFilter(v)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              filter === v
                ? 'bg-accent text-surface-0'
                : 'border border-border bg-surface-2 text-fg-soft'
            }`}
          >
            {v === 'all' ? 'All cars' : v === 'personal' ? 'Personal' : 'Client'}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {visibleCars.map((car) => {
          const carFiles = garageFiles.filter((f) => f.carId === car.id)
          return (
            <li key={car.id} className="rounded-2xl border border-border bg-surface-1 p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-fg">{car.label}</p>
                  <p className="text-sm text-fg-soft">
                    {car.vehicle.make} {car.vehicle.model} ({car.vehicle.year}) · {car.vehicle.ecu}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {car.ownerType === 'client'
                      ? `Client car${car.clientName ? ` · ${car.clientName}` : ''}`
                      : 'Personal car'}
                  </p>
                </div>
                <p className="text-xs text-accent">{carFiles.length} purchased file(s)</p>
              </div>
              {carFiles.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {carFiles.map((f) => (
                    <li
                      key={f.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-2/30 px-3 py-2"
                    >
                      <p className="text-sm text-fg-soft">{f.name}</p>
                      <a
                        href={f.dataUrl}
                        download={f.name}
                        className="inline-flex items-center gap-1 rounded-md bg-surface-0 px-3 py-1.5 text-xs font-medium text-accent"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>

      {visibleCars.length === 0 && (
        <p className="rounded-2xl border border-border bg-surface-1 p-8 text-center text-sm text-fg-soft">
          No cars in this view yet. Add one manually or complete a file purchase to auto-save.
        </p>
      )}
    </div>
  )
}
