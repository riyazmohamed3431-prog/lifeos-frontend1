import type { ReactNode } from 'react'
import { Monitor, Smartphone, ShieldCheck, Radio } from 'lucide-react'

export function PhoneFrame({
  children,
  viewMode = 'mobile',
  onToggleViewMode,
}: {
  children: ReactNode
  viewMode?: 'website' | 'mobile'
  onToggleViewMode?: (mode: 'website' | 'mobile') => void
}) {
  return (
    <div className="flex min-h-screen flex-col w-full items-center justify-center bg-[oklch(0.10_0.012_260)] p-0 sm:py-8 sm:px-4 selection:bg-primary/30 font-sans">
      {/* View Switcher Bar on top of phone frame */}
      {onToggleViewMode && (
        <div className="z-50 mb-5 hidden sm:flex items-center gap-3 rounded-full surface-glass px-4 py-2 border border-white/15 shadow-2xl backdrop-blur-2xl">
          <span className="text-xs font-bold text-muted-foreground mr-1 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>Display Mode:</span>
          </span>
          <button
            onClick={() => onToggleViewMode('website')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'website'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Monitor className="size-3.5" />
            <span>Desktop Dashboard</span>
          </button>
          <button
            onClick={() => onToggleViewMode('mobile')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="size-3.5" />
            <span>iPhone 16 Pro View</span>
          </button>
        </div>
      )}

      <div className="relative w-full max-w-[425px]">
        {/* Smartphone Frame Outer Shell with Metallic Edge Highlights */}
        <div className="relative mx-auto aspect-auto h-[100dvh] w-full overflow-hidden bg-background sm:h-[860px] sm:rounded-[3.25rem] sm:border-[10px] sm:border-[#1e2230] sm:ring-1 sm:ring-white/20 sm:shadow-[0_50px_120px_-20px_rgba(0,0,0,0.95)]">
          
          {/* Hardware Dynamic Island Notch Bar */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 hidden sm:flex items-center justify-between w-[130px] h-[30px] rounded-full bg-black border border-white/10 px-3 shadow-md">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-white tracking-tight">LifeOS</span>
            </div>
            <div className="size-2.5 rounded-full bg-blue-900/60 border border-blue-500/40" />
          </div>

          {/* Phone Frame Content Container */}
          <div className="relative h-full w-full overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

