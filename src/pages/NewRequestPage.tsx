import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload } from 'lucide-react'
import { useSession } from '../context/Session'
import { categories, type CategoryId, type VehicleSpec } from '../data/seed'

const fuelOptions: VehicleSpec['fuel'][] = ['Petrol', 'Diesel', 'Hybrid']

export function NewRequestPage() {
  const navigate = useNavigate()
  const { addFileRequest } = useSession()
  const [summary, setSummary] = useState('')
  const [goal, setGoal] = useState('')
  const [categoryId, setCategoryId] = useState<CategoryId>('ecu-tcu')
  const [make, setMake] = useState('Renault')
  const [model, setModel] = useState('Megane IV RS')
  const [year, setYear] = useState(2022)
  const [engine, setEngine] = useState('1.8 TCe 205 kW')
  const [ecu, setEcu] = useState('MG1CS016')
  const [fuel, setFuel] = useState<VehicleSpec['fuel']>('Petrol')
  const [powerKw, setPowerKw] = useState(205)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const vehicle: VehicleSpec = {
      make,
      model,
      year: Number(year),
      engine,
      ecu,
      fuel,
      powerKw: Number.isFinite(powerKw) ? powerKw : undefined,
    }
    const id = addFileRequest({ summary, goal, categoryId, vehicle })
    navigate(`/buyer/requests/${id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Link
        to="/buyer"
        className="inline-flex items-center gap-2 text-sm text-fg-soft hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to buyer hub
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-fg">New file request</h1>
        <p className="mt-2 text-fg-soft">
          Describe the European vehicle and upload your read. Tuners submit{' '}
          <span className="text-fg">blind offers</span> — you pick one, pay into escrow, then
          confirm delivery.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-6 rounded-3xl border border-border bg-surface-1 p-6 sm:p-8"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-fg">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value as CategoryId)}
            className="w-full rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm text-fg outline-none ring-accent/0 focus:ring-2 focus:ring-accent/40"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-fg">Make</label>
            <input
              required
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="e.g. Volkswagen"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-fg">Model</label>
            <input
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="e.g. Golf R"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-fg">Year</label>
            <input
              required
              type="number"
              min={1990}
              max={2030}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-fg">Fuel</label>
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value as VehicleSpec['fuel'])}
              className="w-full rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
            >
              {fuelOptions.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-fg">Power (kW)</label>
            <input
              type="number"
              min={40}
              max={500}
              value={powerKw}
              onChange={(e) => setPowerKw(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-fg">Engine / trim</label>
          <input
            required
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
            placeholder="e.g. B48B20O1"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-fg">ECU / TCU box</label>
          <input
            required
            value={ecu}
            onChange={(e) => setEcu(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
            placeholder="e.g. MG1CS201"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-fg">Short title</label>
          <input
            required
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
            placeholder="One line summary for tuners"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-fg">Goal & constraints</label>
          <textarea
            required
            rows={4}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full resize-y rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent/40"
            placeholder="What file do you need? Stock read attached? EU emissions notes?"
          />
        </div>

        <div className="rounded-xl border border-dashed border-border bg-surface-2/40 px-4 py-6 text-center text-sm text-fg-soft">
          <Upload className="mx-auto mb-2 h-8 w-8 text-muted" />
          <p>Attach stock read or log — drag and drop enabled after file storage is connected.</p>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-surface-0 shadow-lg shadow-accent/20 transition hover:bg-accent-dim"
        >
          Publish request
        </button>
      </form>
    </div>
  )
}
