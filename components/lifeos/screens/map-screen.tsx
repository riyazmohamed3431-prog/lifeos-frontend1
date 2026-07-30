'use client'

import { MapCanvas } from '@/components/lifeos/map-canvas'
import { Search, Navigation, Layers, Star, Clock } from 'lucide-react'

const nearby = [
  { tag: 'A', name: 'Marcus Vale', rating: 4.97, eta: '9 min', km: '2.3 km' },
  { tag: 'B', name: 'Priya Anand', rating: 4.91, eta: '13 min', km: '3.8 km' },
  { tag: 'C', name: 'Diego Ruiz', rating: 4.88, eta: '16 min', km: '5.1 km' },
]

export function MapScreen({ onEmergency }: { onEmergency: () => void }) {
  return (
    <div className="relative h-full">
      <MapCanvas className="absolute inset-0 h-full w-full" />

      {/* Top floating search */}
      <div className="absolute inset-x-0 top-0 z-10 px-6 pt-2">
        <div className="glass-strong flex items-center gap-3 rounded-2xl px-4 py-3">
          <Search className="size-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Scanning nearby mechanics…</span>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" /> 8 live
          </span>
        </div>
      </div>

      {/* Side controls */}
      <div className="absolute right-6 top-24 z-10 flex flex-col gap-2">
        {[Navigation, Layers].map((Icon, i) => (
          <button key={i} className="glass-strong grid size-11 place-items-center rounded-2xl text-foreground/90">
            <Icon className="size-5" />
          </button>
        ))}
      </div>

      {/* ETA pill */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="glass-strong flex items-center gap-2 rounded-full px-4 py-2 shadow-xl">
          <Clock className="size-4 text-primary" />
          <span className="text-sm font-semibold">9 min away</span>
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="glass-strong rounded-t-[2rem] px-6 pb-28 pt-4">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Nearby specialists</h2>
            <span className="text-xs text-muted-foreground">Sorted by ETA</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {nearby.map((m) => (
              <div key={m.tag} className="grad-border flex items-center gap-3 rounded-2xl p-3">
                <div className="grid size-10 place-items-center rounded-xl bg-accent/15 text-sm font-bold text-accent">
                  {m.tag}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{m.name}</p>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Star className="size-3 fill-accent text-accent" /> {m.rating}
                    </span>
                    <span>·</span>
                    <span>{m.km}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">{m.eta}</p>
                  <p className="text-[10px] text-muted-foreground">arrival</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onEmergency}
            className="mt-4 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground glow-primary transition-transform active:scale-[0.98]"
          >
            Request nearest now
          </button>
        </div>
      </div>
    </div>
  )
}
