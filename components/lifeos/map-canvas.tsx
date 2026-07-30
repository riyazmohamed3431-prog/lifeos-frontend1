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
    <div className={cn('relative overflow-hidden bg-[oklch(0.14_0.02_264)]', className)}>
      {/* base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,oklch(0.22_0.04_255)_0%,transparent_60%)]" />

      {/* neon road network */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="road" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="oklch(0.68 0.17 245)" stopOpacity="0.55" />
            <stop offset="1" stopColor="oklch(0.75 0.14 195)" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <g stroke="oklch(1 0 0 / 8%)" strokeWidth="10" fill="none">
          <path d="M-20 120 H420" />
          <path d="M-20 280 H420" />
          <path d="M120 -20 V420" />
          <path d="M280 -20 V420" />
          <path d="M-20 40 L200 200 L420 360" />
        </g>
        <g stroke="url(#road)" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M-20 120 H420" />
          <path d="M280 -20 V420" />
          <path d="M-20 40 L200 200 L420 360" />
        </g>

        {showRoute && (
          <>
            <path
              d="M90 320 C 150 260, 180 220, 240 150 S 300 90, 320 70"
              fill="none"
              stroke="oklch(0.68 0.17 245)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="1000"
              strokeDashoffset={1000 - progress * 1000}
              className="drop-shadow-[0_0_8px_oklch(0.68_0.17_245)]"
            />
            <path
              d="M90 320 C 150 260, 180 220, 240 150 S 300 90, 320 70"
              fill="none"
              stroke="oklch(1 0 0 / 15%)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>

      {/* your location */}
      <div className="absolute" style={{ left: '22%', top: '80%' }}>
        <span className="absolute -inset-4 rounded-full bg-primary/30 animate-pulse-ring" />
        <span className="block size-3.5 rounded-full bg-primary ring-4 ring-primary/25" />
      </div>

      {/* mechanic markers */}
      {[
        { l: '80%', t: '17%', main: true },
        { l: '58%', t: '44%' },
        { l: '35%', t: '30%' },
      ].map((m, i) => (
        <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: m.l, top: m.t }}>
          <span
            className={cn(
              'absolute -inset-3 rounded-full animate-pulse-ring',
              m.main ? 'bg-accent/40' : 'bg-accent/20',
            )}
            style={{ animationDelay: `${i * 0.6}s` }}
          />
          <span
            className={cn(
              'grid size-6 place-items-center rounded-full text-[10px] font-bold',
              m.main
                ? 'bg-accent text-accent-foreground glow-accent'
                : 'bg-accent/70 text-accent-foreground',
            )}
          >
            {String.fromCharCode(65 + i)}
          </span>
        </div>
      ))}

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_55%,oklch(0.14_0.02_264)_100%)]" />
    </div>
  )
}
