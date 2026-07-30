'use client'

import { emergencies, type Emergency } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import {
  CloudMoon,
  MapPin,
  Flashlight,
  Share2,
  Phone,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'

export function HomeScreen({
  onEmergency,
  onSelect,
}: {
  onEmergency: () => void
  onSelect: (e: Emergency) => void
}) {
  return (
    <div className="relative h-full overflow-y-auto no-scrollbar pb-28">
      <AmbientBg tone="primary" />

      <div className="relative z-10 px-6 pt-2">
        {/* Context row */}
        <div className="mt-2 flex items-center justify-between">
          <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5">
            <CloudMoon className="size-4 text-accent" />
            <span className="text-sm font-medium">12°</span>
            <span className="text-xs text-muted-foreground">Clear night</span>
          </div>
          <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5">
            <MapPin className="size-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">Route 9 · Mile 42</span>
          </div>
        </div>

        {/* Vehicle status */}
        <div className="mt-5 grad-border flex items-center justify-between rounded-3xl p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-primary/15">
              <ShieldCheck className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Tesla Model 3</p>
              <p className="text-xs text-muted-foreground">All systems nominal</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            <span className="text-xs font-medium text-accent">Protected</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="mt-8 text-balance text-5xl font-bold leading-[0.95] tracking-tight text-glow">
          What
          <br />
          happened?
        </h1>
        <p className="mt-3 max-w-[16rem] text-pretty text-sm leading-relaxed text-muted-foreground">
          Tap the button and stay calm. Help is dispatched the moment you do.
        </p>

        {/* Emergency button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onEmergency}
            className="relative grid size-44 place-items-center rounded-full"
            aria-label="Trigger emergency"
          >
            <span className="absolute inset-0 rounded-full bg-destructive/40 animate-pulse-ring" />
            <span
              className="absolute inset-0 rounded-full bg-destructive/30 animate-pulse-ring"
              style={{ animationDelay: '1.2s' }}
            />
            <span className="absolute inset-3 rounded-full bg-destructive glow-emergency animate-breathe" />
            <span className="relative z-10 flex flex-col items-center text-destructive-foreground">
              <Zap className="size-9" strokeWidth={2.4} />
              <span className="mt-1 text-sm font-semibold tracking-wide">GET HELP</span>
              <span className="text-[10px] opacity-80">Hold nothing back</span>
            </span>
          </button>
        </div>

        {/* Emergency cards */}
        <div className="mt-9 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Quick dispatch</h2>
          <button
            onClick={onEmergency}
            className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground"
          >
            All services <ChevronRight className="size-3.5" />
          </button>
        </div>

        <div className="mt-3 -mx-6 flex gap-3 overflow-x-auto no-scrollbar px-6 pb-1">
          {emergencies.slice(0, 5).map((e) => {
            const Icon = e.icon
            return (
              <button
                key={e.id}
                onClick={() => onSelect(e)}
                className="grad-border group relative w-36 shrink-0 rounded-3xl p-4 text-left transition-transform active:scale-95"
              >
                <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/10 transition-transform group-hover:scale-105">
                  <Icon className="size-6 text-primary" />
                </div>
                <p className="mt-4 text-sm font-semibold leading-tight">{e.label}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{e.sub}</p>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-accent">
                  <span className="size-1.5 rounded-full bg-accent" /> ~{e.eta}
                </div>
              </button>
            )
          })}
        </div>

        {/* Quick shortcuts */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: Flashlight, label: 'Flashlight' },
            { icon: Share2, label: 'Share Live' },
            { icon: Phone, label: 'SOS Call' },
          ].map((s) => (
            <button
              key={s.label}
              className="glass flex flex-col items-center gap-2 rounded-2xl py-4 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <s.icon className="size-5 text-foreground/80" />
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
