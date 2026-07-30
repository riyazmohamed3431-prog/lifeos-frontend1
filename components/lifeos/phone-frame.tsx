import type { ReactNode } from 'react'
import { Monitor, Smartphone } from 'lucide-react'

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
    <div className="flex min-h-screen flex-col w-full items-center justify-center bg-[oklch(0.11_0.02_264)] p-0 sm:py-6 sm:px-4">
      {/* View Switcher Bar on top of phone frame */}
      {onToggleViewMode && (
        <div className="z-50 mb-3 hidden sm:flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-1.5 border border-white/15 backdrop-blur-md shadow-lg">
          <span className="text-xs font-semibold text-muted-foreground mr-1">View Mode:</span>
          <button
            onClick={() => onToggleViewMode('website')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
              viewMode === 'website'
                ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Monitor className="size-3.5" />
            Website Model
          </button>
          <button
            onClick={() => onToggleViewMode('mobile')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
              viewMode === 'mobile'
                ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="size-3.5" />
            Mobile Model
          </button>
        </div>
      )}

      {/* Desktop ambient glow behind the device */}
      <div aria-hidden className="pointer-events-none fixed inset-0 hidden sm:block">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[420px]">
        <div className="relative mx-auto aspect-auto h-[100dvh] w-full overflow-hidden bg-background sm:h-[860px] sm:rounded-[3rem] sm:border sm:border-white/10 sm:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]">
          {children}
        </div>
      </div>
    </div>
  )
}

