'use client'

import { useState } from 'react'
import { MapCanvas } from '@/components/lifeos/map-canvas'
import { nearbyMechanics, mechanic } from '@/lib/lifeos'
import { Navigation, Star, Clock, ShieldCheck, Phone } from 'lucide-react'
import { CallModal } from '@/components/lifeos/call-modal'

export function MapScreen({ onEmergency }: { onEmergency: () => void }) {
  const [calling, setCalling] = useState(false)
  const [selectedMechanic, setSelectedMechanic] = useState(mechanic.name)
  const [selectedPhone, setSelectedPhone] = useState(mechanic.phone)

  const handleCall = (name: string, phone: string) => {
    setSelectedMechanic(name)
    setSelectedPhone(phone)
    setCalling(true)
  }

  return (
    <div className="relative h-full overflow-hidden">
      {/* Tamil Nadu Map Canvas */}
      <MapCanvas className="absolute inset-0 h-full w-full" />

      {/* Top Bar Status */}
      <div className="absolute inset-x-0 top-0 z-20 px-5 pt-3">
        <div className="surface-card flex items-center justify-between rounded-2xl p-3.5 shadow-xl border border-white/10">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-foreground">4 Tamil Nadu Units Active</span>
          </div>
          <span className="text-xs font-semibold text-accent flex items-center gap-1">
            <Clock className="size-3.5" /> Nearest ~8m ETA
          </span>
        </div>
      </div>

      {/* Floating Center Badge */}
      <div className="absolute left-1/2 top-1/3 z-20 -translate-x-1/2">
        <div className="surface-card flex items-center gap-2 rounded-full px-4 py-2 shadow-2xl border border-white/10">
          <Navigation className="size-4 text-primary fill-primary" />
          <span className="text-xs font-bold text-foreground">NH-45 GST Road · Chengalpattu, TN</span>
        </div>
      </div>

      {/* Bottom Sheet Card */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-28">
        <div className="surface-card rounded-3xl p-5 space-y-4 shadow-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Tamil Nadu Rescue Responders</h2>
            <span className="text-[11px] font-semibold text-muted-foreground">Sorted by ETA</span>
          </div>

          <div className="space-y-2.5 max-h-48 overflow-y-auto no-scrollbar pr-1">
            {nearbyMechanics.map((m) => (
              <div key={m.tag} className="surface-card rounded-2xl p-3 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-xl bg-accent text-accent-foreground font-bold text-xs shrink-0">
                    {m.tag}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-foreground truncate">{m.name}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                        <Star className="size-3 fill-amber-400 stroke-amber-400" /> {m.rating}
                      </span>
                      <span>·</span>
                      <span className="truncate">{m.km}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCall(m.name, m.phone)}
                    className="p-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-all cursor-pointer"
                    title={`Call ${m.name}`}
                  >
                    <Phone className="size-3.5" />
                  </button>
                  <div className="text-right">
                    <span className="text-xs font-bold text-primary">~{m.eta}</span>
                    <p className="text-[9px] text-muted-foreground">ETA</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onEmergency}
            className="w-full rounded-2xl bg-destructive text-destructive-foreground py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-destructive/90 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="size-4" />
            <span>Request Immediate Dispatch</span>
          </button>
        </div>
      </div>

      {/* Live Calling Modal */}
      <CallModal
        isOpen={calling}
        onClose={() => setCalling(false)}
        mechanicName={selectedMechanic}
        mechanicPhone={selectedPhone}
      />
    </div>
  )
}
