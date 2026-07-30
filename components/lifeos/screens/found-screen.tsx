'use client'

import Image from 'next/image'
import { mechanic } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { Star, Award, MapPin, Clock, BadgeCheck, ShieldCheck } from 'lucide-react'

export function FoundScreen({ onTrack }: { onTrack: () => void }) {
  return (
    <div className="relative flex h-full flex-col overflow-y-auto no-scrollbar px-6 pt-10 pb-8">
      <AmbientBg tone="calm" />

      {/* Celebration */}
      <div className="relative z-10 text-center animate-fade-up">
        <span className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
          <BadgeCheck className="size-4" /> Matched in 5 seconds
        </span>
        <h1 className="mt-4 text-balance text-3xl font-bold">Help is on the way</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">A certified specialist accepted your request.</p>
      </div>

      {/* Mechanic card */}
      <div className="relative z-10 mt-7 animate-rise">
        <div className="grad-border overflow-hidden rounded-[2rem] glow-accent">
          <div className="relative h-52">
            <Image
              src="/mechanic.png"
              alt={`Portrait of ${mechanic.name}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{mechanic.name}</h2>
                  <ShieldCheck className="size-5 text-accent" />
                </div>
                <p className="text-xs text-muted-foreground">{mechanic.specialty}</p>
              </div>
              <div className="glass-strong flex items-center gap-1 rounded-full px-2.5 py-1">
                <Star className="size-3.5 fill-accent text-accent" />
                <span className="text-sm font-semibold">{mechanic.rating}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10">
            <Stat icon={Award} value={`${mechanic.years} yrs`} label="Experience" />
            <Stat icon={MapPin} value={`${mechanic.distanceKm} km`} label="Distance" />
            <Stat icon={Clock} value={`${mechanic.etaMin} min`} label="ETA" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl glass px-4 py-3">
          <span className="text-sm text-muted-foreground">Inspection fee</span>
          <span className="text-lg font-bold">
            ₹250 <span className="text-xs font-normal text-muted-foreground">· waived if repaired</span>
          </span>
        </div>
      </div>

      {/* animated approaching line */}
      <div className="relative z-10 mt-6 flex items-center gap-3 rounded-2xl glass px-4 py-3">
        <span className="grid size-9 place-items-center rounded-full bg-primary/15">
          <div
            className="size-2 rounded-full bg-primary"
            style={{ boxShadow: '0 0 10px var(--color-primary)' }}
          />
        </span>
        <div className="flex-1">
          <div className="relative h-1 overflow-hidden rounded-full bg-white/10">
            <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-primary to-accent animate-shimmer bg-[length:200%_100%]" />
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">{mechanic.name.split(' ')[0]} is heading to you now</p>
        </div>
      </div>

      <button
        onClick={onTrack}
        className="relative z-10 mt-auto w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground glow-primary transition-transform active:scale-[0.98]"
      >
        Track live arrival
      </button>
    </div>
  )
}

function Stat({ icon: Icon, value, label }: { icon: typeof Award; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-4">
      <Icon className="size-4 text-primary" />
      <span className="text-sm font-bold">{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  )
}
