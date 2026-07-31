'use client'

import { useEffect, useState } from 'react'
import type { Emergency } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { Car, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  'Verifying GPS location on NH-45 GST Road…',
  'Locating nearest certified technician…',
  'Matching vehicle specialty…',
  'Confirming priority responder dispatch…',
]

export function WaitingScreen({
  emergency,
  vehicleName = 'Tesla Model 3',
  onFound,
}: {
  emergency: Emergency | null
  vehicleName?: string
  onFound: () => void
}) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const s = setInterval(() => setStep((p) => Math.min(p + 1, steps.length - 1)), 1200)
    const done = setTimeout(onFound, 5000)
    return () => {
      clearInterval(s)
      clearTimeout(done)
    }
  }, [onFound])

  return (
    <div className="relative flex h-full flex-col items-center justify-between overflow-hidden px-6 pt-10 pb-12 text-center">
      <AmbientBg tone="emergency" />

      {/* Header status */}
      <div className="relative z-10 space-y-3 max-w-xs">
        <span className="inline-flex items-center gap-2 rounded-full bg-destructive/15 px-3.5 py-1 text-xs font-bold text-destructive border border-destructive/20">
          <span className="size-2 rounded-full bg-destructive" />
          {emergency?.label ?? 'Emergency'} Dispatch Active
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Help is being assigned
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Please remain in a safe location near your vehicle. A technician is confirming your dispatch now.
        </p>
      </div>

      {/* Reassuring central graphic */}
      <div className="relative z-10 my-6 flex items-center justify-center">
        <div className="surface-card flex flex-col items-center justify-center size-48 rounded-full border border-white/10 shadow-2xl space-y-2">
          <div className="grid size-14 place-items-center rounded-2xl bg-primary/20 text-primary">
            <Car className="size-7" />
          </div>
          <p className="text-xs font-bold text-foreground">{vehicleName}</p>
          <span className="text-[11px] text-accent font-semibold flex items-center gap-1">
            <Loader2 className="size-3 animate-spin" /> Live Dispatch
          </span>
        </div>
      </div>

      {/* Step Progress Checklist */}
      <div className="relative z-10 w-full max-w-xs space-y-2.5">
        {steps.map((s, i) => {
          const isDone = i < step
          const isActive = i === step
          return (
            <div
              key={s}
              className={cn(
                'surface-card flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-medium transition-all text-left',
                i > step && 'opacity-40',
              )}
            >
              {isDone ? (
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              ) : isActive ? (
                <Loader2 className="size-4 animate-spin text-primary shrink-0" />
              ) : (
                <span className="size-4 rounded-full border border-muted-foreground/30 shrink-0" />
              )}
              <span className={isDone ? 'text-muted-foreground' : 'text-foreground'}>{s}</span>
            </div>
          )
        })}
      </div>

      {/* Safety assurance footer */}
      <div className="relative z-10 flex items-center gap-1.5 text-xs text-muted-foreground pt-2">
        <ShieldCheck className="size-4 text-emerald-400" />
        <span>24/7 Monitored Dispatch Center</span>
      </div>
    </div>
  )
}
