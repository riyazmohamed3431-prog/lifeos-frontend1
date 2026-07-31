'use client'

import { useState } from 'react'
import { emergencies, vehicles, type Emergency } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { ArrowLeft, MapPin, Check, Car, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BookingScreen({
  initial,
  onBack,
  onConfirm,
}: {
  initial: Emergency | null
  onBack: () => void
  onConfirm: (e: Emergency, vehicleId: string, notes: string) => void
}) {
  const [selected, setSelected] = useState<Emergency | null>(initial ?? emergencies[0])
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0].id)
  const [notes, setNotes] = useState('')


  return (
    <div className="relative flex h-full flex-col overflow-y-auto no-scrollbar pb-36">
      <AmbientBg tone="primary" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={onBack}
          className="surface-card grid size-10 place-items-center rounded-full text-foreground hover:bg-secondary transition-all cursor-pointer"
          aria-label="Back to Home"
        >
          <ArrowLeft className="size-5" />
        </button>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          TN Highway Rescue
        </span>
        <div className="size-10" />
      </div>

      <div className="relative z-10 px-5 pt-3 space-y-6">
        {/* Location Banner */}
        <div className="surface-card rounded-2xl p-4 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary shrink-0">
            <MapPin className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-muted-foreground">Tamil Nadu GPS Location</p>
            <p className="text-xs font-bold text-foreground truncate">NH-45 GST Road · Chengalpattu, Tamil Nadu</p>
          </div>
          <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            GPS Locked
          </span>
        </div>

        {/* Vehicle Selector */}
        <div className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            1. Select Registered Vehicle
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {vehicles.map((v) => {
              const active = selectedVehicle === v.id
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className={cn(
                    'surface-card flex items-center justify-between rounded-2xl p-3.5 text-left transition-all cursor-pointer',
                    active ? 'border-primary/60 bg-primary/10' : 'hover:bg-secondary/50',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('grid size-9 place-items-center rounded-xl', active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground')}>
                      <Car className="size-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{v.name}</p>
                      <p className="text-[11px] text-muted-foreground">{v.color} · {v.plate}</p>
                    </div>
                  </div>
                  {active && <Check className="size-5 text-primary" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Emergency Issue Selection Chips */}
        <div className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            2. Select Roadside Emergency
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {emergencies.map((e) => {
              const active = selected?.id === e.id
              const Icon = e.icon
              return (
                <button
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className={cn(
                    'surface-card flex items-center gap-3 rounded-2xl p-3 text-left transition-all cursor-pointer border',
                    active
                      ? 'border-primary bg-primary/15 text-foreground'
                      : 'border-white/5 hover:bg-secondary/40 text-muted-foreground',
                  )}
                >
                  <div className={cn('grid size-9 place-items-center rounded-xl shrink-0', active ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground')}>
                    <Icon className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className={cn('text-xs font-bold truncate', active ? 'text-foreground' : 'text-foreground/90')}>{e.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">~{e.eta}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Additional Notes input */}
        <div className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            3. Landmark / Notes
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Parked near Paranur Toll Plaza on GST Road..."
            rows={2}
            className="surface-card w-full rounded-2xl p-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
          />
        </div>

        {/* Summary Details */}
        {selected && (
          <div className="surface-card rounded-2xl p-4 space-y-2 border border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Standard Rescue Fee</span>
              <span className="font-semibold text-foreground">₹{selected.fee}.00</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">TN Rescue Squad ETA</span>
              <span className="font-semibold text-accent">~{selected.eta}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
              <span className="font-bold text-foreground">Total Fee</span>
              <span className="font-extrabold text-sm text-foreground">₹{selected.fee}.00</span>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Action */}
      <div className="absolute inset-x-0 bottom-0 z-30 p-5 surface-glass border-t border-white/10">
        <button
          disabled={!selected}
          onClick={() => selected && onConfirm(selected, selectedVehicle, notes)}
          className={cn(
            'w-full rounded-2xl py-4 text-sm font-bold transition-all active:scale-[0.98] shadow-lg cursor-pointer flex items-center justify-center gap-2',
            selected
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : 'bg-secondary text-muted-foreground cursor-not-allowed',
          )}
        >
          <ShieldCheck className="size-5" />
          <span>{selected ? `Dispatch Assistance for ${selected.label}` : 'Select Service'}</span>
        </button>
      </div>
    </div>
  )
}
