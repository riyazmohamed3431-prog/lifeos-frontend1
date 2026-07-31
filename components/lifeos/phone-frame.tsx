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
    <div className="flex min-h-screen flex-col w-full items-center justify-center bg-[oklch(0.12_0.005_260)] p-0 sm:py-6 sm:px-4 selection:bg-primary/30">
      {/* View Switcher Bar on top of phone frame */}
      {onToggleViewMode && (
        <div className="z-50 mb-4 hidden sm:flex items-center gap-2 rounded-full surface-glass px-4 py-2 border border-white/10 shadow-2xl">
          <span className="text-xs font-bold text-muted-foreground mr-1 uppercase tracking-wider">Preview Mode:</span>
          <button
            onClick={() => onToggleViewMode('website')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'website'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Monitor className="size-3.5" />
            <span>Desktop Hub</span>
          </button>
          <button
            onClick={() => onToggleViewMode('mobile')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="size-3.5" />
            <span>Mobile Device</span>
          </button>
        </div>
      )}

      <div className="relative w-full max-w-[420px]">
        {/* Smartphone Frame */}
        <div className="relative mx-auto aspect-auto h-[100dvh] w-full overflow-hidden bg-background sm:h-[860px] sm:rounded-[3rem] sm:border sm:border-white/10 sm:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)]">
          {children}
        </div>
      </div>
    </div>
  )
}
