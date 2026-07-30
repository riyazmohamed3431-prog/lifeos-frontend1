'use client'

import { useState } from 'react'
import { emergencies, vehicles, type Emergency } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { ArrowLeft, MapPin, Mic, Sparkles, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BookingScreen({
  initial,
  onBack,
  onConfirm,
}: {
  initial: Emergency | null
  onBack: () => void
  onConfirm: (e: Emergency) => void
}) {
  const [selected, setSelected] = useState<Emergency | null>(initial)
  const [vehicle, setVehicle] = useState(vehicles[0].id)

  return (
    <div className="relative flex h-full flex-col overflow-y-auto no-scrollbar pb-32">
      <AmbientBg tone="primary" />

      <div className="relative z-10 flex items-center gap-3 px-6 pt-3">
        <button onClick={onBack} className="glass grid size-9 place-items-center rounded-full" aria-label="Back">
          <ArrowLeft className="size-4.5" />
        </button>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" /> LifeOS Assist
        </div>
      </div>

      <div className="relative z-10 px-6 pt-6">
        {/* AI conversation */}
        <div className="space-y-3">
          <Bubble>
            <p className="text-sm leading-relaxed">
              I&apos;ve got your location on <span className="text-accent">Route 9, Mile 42</span>. Take a breath — I&apos;ll
              handle this.
            </p>
          </Bubble>

          <div className="glass flex items-center gap-2 self-start rounded-2xl rounded-tl-md px-4 py-2.5">
            <MapPin className="size-4 text-primary" />
            <span className="text-xs">Live location locked</span>
            <span className="ml-1 flex items-center gap-1 text-[11px] text-accent">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" /> sharing
            </span>
          </div>

          <Bubble>
            <p className="text-sm font-medium">What&apos;s wrong with the vehicle?</p>
          </Bubble>
        </div>

        {/* Repair chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {emergencies.map((e) => {
            const active = selected?.id === e.id
            const Icon = e.icon
            return (
              <button
                key={e.id}
                onClick={() => setSelected(e)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition-all active:scale-95',
                  active
                    ? 'bg-primary text-primary-foreground glow-primary'
                    : 'glass text-foreground/85 hover:text-foreground',
                )}
              >
                <Icon className="size-4" />
                {e.label}
                {active && <Check className="size-3.5" />}
              </button>
            )
          })}
        </div>

        {/* Vehicle selection */}
        <div className="mt-8">
          <p className="text-sm font-medium">Which vehicle?</p>
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6">
            {vehicles.map((v) => {
              const active = vehicle === v.id
              return (
                <button
                  key={v.id}
                  onClick={() => setVehicle(v.id)}
                  className={cn(
                    'w-40 shrink-0 rounded-3xl p-4 text-left transition-all active:scale-95',
                    active ? 'grad-border glow-primary' : 'glass',
                  )}
                >
                  <p className="text-sm font-semibold">{v.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{v.color}</p>
                  <p className="mt-3 font-mono text-xs text-primary">{v.plate}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Voice input */}
        <button className="glass mt-6 flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left">
          <span className="grid size-9 place-items-center rounded-full bg-primary/15">
            <Mic className="size-4.5 text-primary" />
          </span>
          <span className="text-sm text-muted-foreground">Or describe it out loud…</span>
          <span className="ml-auto flex items-end gap-0.5">
            {[3, 6, 4, 8, 5].map((h, i) => (
              <span
                key={i}
                className="w-0.5 rounded-full bg-primary/60 animate-breathe"
                style={{ height: h * 2, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        </button>
      </div>

      {/* Confirm bar */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-6">
        <button
          disabled={!selected}
          onClick={() => selected && onConfirm(selected)}
          className={cn(
            'w-full rounded-2xl py-4 text-sm font-semibold transition-all active:scale-[0.98]',
            selected
              ? 'bg-destructive text-destructive-foreground glow-emergency'
              : 'glass cursor-not-allowed text-muted-foreground',
          )}
        >
          {selected ? `Dispatch help for ${selected.label}` : 'Select what happened'}
        </button>
      </div>
    </div>
  )
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="grad-border max-w-[85%] self-start rounded-3xl rounded-tl-md px-4 py-3 animate-fade-up">
      {children}
    </div>
  )
}
