'use client'

import { useEffect, useState } from 'react'
import { mechanic } from '@/lib/lifeos'
import { MapCanvas } from '@/components/lifeos/map-canvas'
import { Phone, MessageSquare, ShieldAlert, Star, Navigation } from 'lucide-react'
import { CallModal } from '@/components/lifeos/call-modal'

export function TrackingScreen({ onArrived }: { onArrived: () => void }) {
  const [progress, setProgress] = useState(0.1)
  const [calling, setCalling] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        const next = p + 0.08
        if (next >= 1) {
          clearInterval(t)
          setTimeout(onArrived, 1000)
          return 1
        }
        return next
      })
    }, 1000)
    return () => clearInterval(t)
  }, [onArrived])

  const etaMin = Math.max(0, Math.round(mechanic.etaMin * (1 - progress)))
  const distance = (mechanic.distanceKm * (1 - progress)).toFixed(1)

  return (
    <div className="relative h-full overflow-hidden">
      {/* Map layer depicting Tamil Nadu NH-45 GST Road */}
      <MapCanvas className="absolute inset-0 h-full w-full" showRoute progress={progress} />

      {/* Top Header Card */}
      <div className="absolute inset-x-0 top-0 z-20 px-5 pt-3">
        <div className="surface-card flex items-center justify-between rounded-2xl p-4 shadow-xl border border-white/10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {progress >= 1 ? 'Responder Status' : 'Estimated Arrival'}
            </p>
            <p className="text-xl font-extrabold text-foreground tabular-nums">
              {progress >= 1 ? 'Arrived at Location' : `${etaMin} mins remaining`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Location</p>
            <p className="text-xs font-bold text-accent">NH-45 · {distance} km</p>
          </div>
        </div>
      </div>

      {/* Floating emergency hotline button */}
      <button
        onClick={() => setCalling(true)}
        aria-label="Contact Emergency Services"
        className="absolute right-5 top-24 z-20 grid size-12 place-items-center rounded-2xl bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-all cursor-pointer"
      >
        <ShieldAlert className="size-6" />
      </button>

      {/* Bottom Sheet Card */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-6">
        <div className="surface-card rounded-3xl p-5 space-y-4 shadow-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-primary/20 text-primary font-bold text-sm border border-primary/30">
                KS
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{mechanic.name}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <Star className="size-3.5 fill-amber-400 stroke-amber-400" />
                  <span className="font-semibold text-amber-400">{mechanic.rating}</span>
                  <span>· Tamil Nadu Squad</span>
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent border border-accent/20">
              <span className="size-1.5 rounded-full bg-accent" />
              En Route
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-3.5 py-2 text-xs text-muted-foreground">
            <span>Rig: {mechanic.vehicleRig}</span>
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Navigation className="size-3 text-primary" /> GST Road GPS
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setCalling(true)}
              className="rounded-xl bg-primary text-primary-foreground py-3 flex items-center justify-center gap-2 text-xs font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer"
            >
              <Phone className="size-4" />
              <span>Call {mechanic.name.split(' ')[0]}</span>
            </button>
            <button
              onClick={() => setCalling(true)}
              className="surface-card hover:bg-secondary/70 rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-bold text-foreground transition-all cursor-pointer"
            >
              <MessageSquare className="size-4 text-accent" />
              <span>Send Message</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Calling Modal */}
      <CallModal
        isOpen={calling}
        onClose={() => setCalling(false)}
        mechanicName={mechanic.name}
        mechanicPhone={mechanic.phone}
      />
    </div>
  )
}
