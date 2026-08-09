'use client'

import { useEffect, useState } from 'react'
import type { Emergency } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { WarmBadge, WarmCard } from '@/components/ui/warm-components'
import { Car, CheckCircle2, Loader2, ShieldCheck, Radio } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  'Verifying GPS coordinates on NH-45 GST Road…',
  'Scanning 42 active certified rescue units…',
  'Matching EV & Drivetrain master specialist…',
  'Dispatching Karthik Subramanian (~8m ETA)…',
]

export function WaitingScreen({
  emergency,
  emergencies,
  vehicleName = 'Tesla Model 3',
  onFound,
}: {
  emergency?: Emergency | null
  emergencies?: Emergency[] | null
  vehicleName?: string
  onFound: () => void
}) {
  const [step, setStep] = useState(0)

  const issueList = emergencies && emergencies.length > 0
    ? emergencies
    : emergency
    ? [emergency]
    : []

  const titleText = issueList.length > 0
    ? issueList.map((e) => e.label).join(' + ')
    : 'Emergency'

  useEffect(() => {
    const s = setInterval(() => setStep((p) => Math.min(p + 1, steps.length - 1)), 1200)
    const done = setTimeout(onFound, 5000)
    return () => {
      clearInterval(s)
      clearTimeout(done)
    }
  }, [onFound])

  return (
    <div className="relative flex h-full flex-col items-center justify-between overflow-hidden px-6 pt-8 pb-10 text-center font-sans text-foreground">
      <AmbientBg tone="emergency" />

      {/* Header status */}
      <div className="relative z-10 space-y-3 max-w-sm">
        <WarmBadge variant="rose">
          <Radio className="size-3.5 animate-pulse text-[#E11D48]" />
          {titleText} Dispatch Active
        </WarmBadge>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          Assigning Rescue Squad
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Stay in a safe location near your vehicle. LifeOS is matching the closest certified technician.
        </p>
      </div>

      {/* Central Vehicle Graphic with Sleek Progress Ring */}
      <div className="relative z-10 my-4 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute size-48 rounded-full border border-[#0F766E]/30 animate-pulse pointer-events-none" />

          <WarmCard className="relative flex flex-col items-center justify-center size-40 rounded-full border border-border space-y-2 backdrop-blur-2xl">
            <div className="grid size-12 place-items-center rounded-2xl bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20 shadow-sm">
              <Car className="size-6 text-[#0F766E]" />
            </div>
            <p className="text-xs font-black text-foreground">{vehicleName}</p>
            <span className="text-[10px] text-[#0F766E] font-bold flex items-center gap-1">
              <Loader2 className="size-3 animate-spin text-[#0F766E]" /> Matching Squad
            </span>
          </WarmCard>
        </div>
      </div>

      {/* Step Progress Checklist */}
      <div className="relative z-10 w-full max-w-xs space-y-2">
        {steps.map((s, i) => {
          const isDone = i < step
          const isActive = i === step
          return (
            <div
              key={s}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all text-left border bg-card/80',
                isDone ? 'border-[#0F766E]/30 bg-[#0F766E]/10' : isActive ? 'border-[#F97316] bg-[#F97316]/10 shadow-sm' : 'border-border opacity-40',
              )}
            >
              {isDone ? (
                <CheckCircle2 className="size-4 text-[#0F766E] shrink-0" />
              ) : isActive ? (
                <Loader2 className="size-4 animate-spin text-[#F97316] shrink-0" />
              ) : (
                <span className="size-4 rounded-full border border-muted-foreground/30 shrink-0" />
              )}
              <span className={isDone ? 'text-muted-foreground' : 'text-foreground'}>{s}</span>
            </div>
          )
        })}
      </div>

      {/* Safety assurance footer */}
      <div className="relative z-10 flex items-center gap-1.5 text-xs font-bold text-muted-foreground pt-2">
        <ShieldCheck className="size-4 text-[#0F766E]" />
        <span>24/7 Monitored Dispatch Command Center</span>
      </div>
    </div>
  )
}
