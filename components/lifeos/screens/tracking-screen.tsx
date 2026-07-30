'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { mechanic } from '@/lib/lifeos'
import { MapCanvas } from '@/components/lifeos/map-canvas'
import { Phone, MessageSquare, ShieldAlert, Star, ChevronUp } from 'lucide-react'

export function TrackingScreen({ onArrived }: { onArrived: () => void }) {
  const [progress, setProgress] = useState(0.08)

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        const next = p + 0.06
        if (next >= 1) {
          clearInterval(t)
          setTimeout(onArrived, 900)
          return 1
        }
        return next
      })
    }, 900)
    return () => clearInterval(t)
  }, [onArrived])

  const etaMin = Math.max(0, Math.round(mechanic.etaMin * (1 - progress)))
  const distance = (mechanic.distanceKm * (1 - progress)).toFixed(1)

  return (
    <div className="relative h-full">
      <MapCanvas className="absolute inset-0 h-full w-full" showRoute progress={progress} />

      {/* Top status */}
      <div className="absolute inset-x-0 top-0 z-10 px-6 pt-2">
        <div className="glass-strong flex items-center justify-between rounded-2xl px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">
              {progress >= 1 ? 'Specialist has arrived' : 'Arriving in'}
            </p>
            <p className="text-2xl font-bold tabular-nums">
              {progress >= 1 ? 'Now' : `${etaMin} min`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Distance</p>
            <p className="text-lg font-semibold tabular-nums text-primary">{distance} km</p>
          </div>
        </div>
      </div>

      {/* Floating emergency control */}
      <button className="absolute right-6 top-28 z-10 grid size-12 place-items-center rounded-2xl bg-destructive text-destructive-foreground glow-emergency">
        <ShieldAlert className="size-5.5" />
      </button>

      {/* Bottom sheet */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="glass-strong rounded-t-[2rem] px-6 pb-8 pt-4">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />

          <div className="flex items-center gap-3">
            <div className="relative size-14 overflow-hidden rounded-2xl">
              <Image src="/mechanic.png" alt={mechanic.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{mechanic.name}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3 fill-accent text-accent" /> {mechanic.rating} · {mechanic.specialty}
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-medium text-accent">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" /> en route
            </span>
          </div>

          {/* Vehicle status line */}
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-2.5 text-xs">
            <span className="text-muted-foreground">Service van · LFV-88</span>
            <span className="font-medium text-accent">Live GPS</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <Action icon={Phone} label="Call" primary />
            <Action icon={MessageSquare} label="Message" />
            <Action icon={ChevronUp} label="Details" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Action({
  icon: Icon,
  label,
  primary,
}: {
  icon: typeof Phone
  label: string
  primary?: boolean
}) {
  return (
    <button
      className={
        'flex flex-col items-center gap-1.5 rounded-2xl py-3 text-xs font-medium transition-transform active:scale-95 ' +
        (primary ? 'bg-primary text-primary-foreground glow-primary' : 'glass text-foreground/90')
      }
    >
      <Icon className="size-5" />
      {label}
    </button>
  )
}
