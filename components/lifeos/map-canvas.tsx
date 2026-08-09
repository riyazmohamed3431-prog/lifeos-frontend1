'use client'

import { cn } from '@/lib/utils'

export function MapCanvas({
  className,
  showRoute = false,
  progress = 0,
}: {
  className?: string
  showRoute?: boolean
  progress?: number
}) {
  return (
    <div className={cn('relative overflow-hidden bg-slate-900 dark:bg-[#0B0F19]', className)}>
      {/* Base Map Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#0E1526] to-slate-950" />

      {/* Vector Map Canvas depicting Tamil Nadu NH-45 Highway & Coastline */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="tnCoast" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.55 0.22 250)" stopOpacity="0.30" />
            <stop offset="100%" stopColor="oklch(0.78 0.16 215)" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* Bay of Bengal Coastline Boundary (East Coast Tamil Nadu) */}
        <path
          d="M290 -20 Q310 100 330 200 T370 420 L420 420 L420 -20 Z"
          fill="url(#tnCoast)"
          stroke="oklch(0.78 0.16 215 / 30%)"
          strokeWidth="1.5"
        />

        {/* Secondary Tamil Nadu Roads Grid (Inner Ring Road, OMR, ECR) */}
        <g stroke="oklch(1 0 0 / 8%)" strokeWidth="6" fill="none">
          <path d="M-20 80 H350" />
          <path d="M-20 220 H360" />
          <path d="M-20 340 H380" />
          <path d="M80 -20 V420" />
          <path d="M220 -20 V420" />
          {/* ECR Coastal Road */}
          <path d="M270 -20 C280 120, 310 240, 340 420" />
        </g>

        {/* Primary Highway: NH-45 (GST Road, Chennai - Chengalpattu - Trichy) */}
        <g stroke="oklch(0.55 0.22 250 / 60%)" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M40 -20 L130 140 L210 270 L260 420" />
        </g>

        {/* Active Emergency Dispatch Route along NH-45 */}
        {showRoute && (
          <>
            <path
              d="M40 -20 L130 140 L210 270 L260 420"
              fill="none"
              stroke="oklch(0.55 0.22 250)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="1000"
              strokeDashoffset={1000 - progress * 1000}
            />
            <path
              d="M40 -20 L130 140 L210 270 L260 420"
              fill="none"
              stroke="oklch(0.78 0.16 215 / 60%)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>

      {/* Map Labels for Tamil Nadu Towns */}
      <div className="absolute top-6 left-12 text-[10px] font-extrabold text-muted-foreground/70 uppercase tracking-widest pointer-events-none">
        Chennai City Hub
      </div>
      <div className="absolute top-[32%] left-[28%] text-[10px] font-extrabold text-accent uppercase tracking-wider pointer-events-none">
        Tambaram
      </div>
      <div className="absolute top-[64%] left-[48%] text-[10px] font-extrabold text-primary uppercase tracking-wider pointer-events-none">
        NH-45 Chengalpattu
      </div>
      <div className="absolute top-1/2 right-4 text-[10px] font-bold text-sky-400/50 uppercase tracking-widest pointer-events-none rotate-90">
        Bay of Bengal
      </div>

      {/* User Location Pin */}
      <div className="absolute" style={{ left: '52.5%', top: '67.5%' }}>
        <span className="block size-5 rounded-full bg-primary ring-4 ring-primary/40 shadow-[0_0_20px_#2563eb] animate-pulse" />
        <span className="absolute left-6 -top-1 surface-card rounded-lg px-2 py-0.5 text-[10px] font-extrabold text-foreground whitespace-nowrap shadow-lg border border-white/15">
          Your Vehicle (NH-45)
        </span>
      </div>

      {/* Tamil Mechanics Pins */}
      {[
        { l: '33%', t: '35%', label: 'Karthik S. (Tech A)', main: true },
        { l: '20%', t: '20%', label: 'Mugan R. (Tech B)' },
        { l: '68%', t: '82%', label: 'Priya S. (Tech C)' },
      ].map((m, i) => (
        <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: m.l, top: m.t }}>
          <span
            className={cn(
              'grid size-8 place-items-center rounded-full text-xs font-black shadow-xl border border-white/20 transition-transform hover:scale-110 cursor-pointer',
              m.main ? 'bg-accent text-accent-foreground ring-4 ring-accent/40 shadow-[0_0_20px_#06b6d4]' : 'bg-secondary text-foreground',
            )}
          >
            {String.fromCharCode(65 + i)}
          </span>
        </div>
      ))}

      {/* Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_40%,oklch(0.10_0.012_260)_100%)]" />
    </div>
  )
}

