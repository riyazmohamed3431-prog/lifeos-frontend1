'use client'

import { useEffect, useState } from 'react'
import type { Emergency } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { Car, Radar, CheckCircle2, Loader2 } from 'lucide-react'

const steps = [
  'Securing your live location…',
  'Scanning nearby specialists…',
  'Matching skill to your issue…',
  'Confirming the best responder…',
]

export function WaitingScreen({
  emergency,
  onFound,
}: {
  emergency: Emergency | null
  onFound: () => void
}) {
  const [step, setStep] = useState(0)
  const [found, setFound] = useState(0)

  useEffect(() => {
    const s = setInterval(() => setStep((p) => Math.min(p + 1, steps.length - 1)), 1300)
    const f = setInterval(() => setFound((p) => Math.min(p + 1, 6)), 700)
    const done = setTimeout(onFound, 5600)
    return () => {
      clearInterval(s)
      clearInterval(f)
      clearTimeout(done)
    }
  }, [onFound])

  return (
    <div className="relative flex h-full flex-col items-center overflow-hidden px-6 pt-10">
      <AmbientBg tone="emergency" />

      <div className="relative z-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1 text-xs font-medium text-destructive">
          <span className="size-1.5 animate-pulse rounded-full bg-destructive" />
          {emergency?.label ?? 'Emergency'} · dispatching
        </span>
        <h1 className="mt-5 text-balance text-3xl font-bold leading-tight">
          Finding help
          <br />
          near you
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">You are not alone. Stay where you are.</p>
      </div>

      {/* Radar scanner */}
      <div className="relative z-10 mt-8 grid size-64 place-items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute rounded-full border border-primary/30"
            style={{ inset: `${i * 26}px` }}
          />
        ))}
        <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
        <span
          className="absolute inset-0 rounded-full bg-primary/15 animate-pulse-ring"
          style={{ animationDelay: '1.5s' }}
        />

        {/* rotating sweep */}
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, oklch(0.68 0.17 245 / 35%) 40deg, transparent 80deg)',
            animation: 'orbit 3s linear infinite',
          }}
        />

        {/* orbiting mechanic dots appearing one by one */}
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="absolute size-3 rounded-full bg-accent transition-all duration-500"
            style={{
              opacity: found > i ? 1 : 0,
              transform: `rotate(${i * 72}deg) translateX(${90 + (i % 2) * 20}px)`,
              boxShadow: '0 0 12px oklch(0.75 0.14 195)',
            }}
          />
        ))}

        {/* center vehicle */}
        <div className="relative z-10 grid size-24 place-items-center rounded-full glass-strong animate-breathe">
          <Car className="size-11 text-primary" />
        </div>
      </div>

      <div className="relative z-10 mt-6 flex items-center gap-2 text-sm font-medium text-accent">
        <Radar className="size-4 animate-spin" style={{ animationDuration: '3s' }} />
        {found} specialists in range
      </div>

      {/* Status steps */}
      <div className="relative z-10 mt-8 w-full max-w-xs space-y-2.5">
        {steps.map((s, i) => {
          const state = i < step ? 'done' : i === step ? 'active' : 'idle'
          return (
            <div
              key={s}
              className={cn(
                'glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all',
                state === 'idle' && 'opacity-40',
              )}
            >
              {state === 'done' ? (
                <CheckCircle2 className="size-4.5 text-accent" />
              ) : state === 'active' ? (
                <Loader2 className="size-4.5 animate-spin text-primary" />
              ) : (
                <span className="size-4.5 rounded-full border border-muted-foreground/40" />
              )}
              <span className={state === 'done' ? 'text-muted-foreground' : ''}>{s}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function cn(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(' ')
}
