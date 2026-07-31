'use client'

import { Home, Compass, Clock, User, AlertCircle } from 'lucide-react'
import type { ScreenId } from '@/lib/lifeos'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'home' as const, label: 'Home', icon: Home },
  { id: 'map' as const, label: 'Tracking', icon: Compass },
  { id: 'history' as const, label: 'History', icon: Clock },
  { id: 'profile' as const, label: 'Profile', icon: User },
]

export function BottomNav({
  active,
  onNavigate,
  onEmergency,
}: {
  active: ScreenId
  onNavigate: (id: ScreenId) => void
  onEmergency: () => void
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center pb-5 px-4">
      <nav className="surface-glass pointer-events-auto flex items-center justify-between w-full max-w-[370px] rounded-full px-3 py-2 shadow-2xl border border-white/10">
        {/* First two tabs: Home & Tracking */}
        <div className="flex items-center gap-1">
          {tabs.slice(0, 2).map((t) => (
            <NavButton key={t.id} {...t} active={active === t.id} onClick={() => onNavigate(t.id)} />
          ))}
        </div>

        {/* Center Primary SOS Button */}
        <button
          onClick={onEmergency}
          aria-label="Emergency SOS"
          className="mx-1 flex flex-col items-center justify-center size-12 rounded-full bg-destructive text-destructive-foreground font-bold shadow-md hover:bg-destructive/90 active:scale-95 transition-all cursor-pointer"
        >
          <AlertCircle className="size-6" strokeWidth={2.4} />
        </button>

        {/* Last two tabs: History & Profile */}
        <div className="flex items-center gap-1">
          {tabs.slice(2).map((t) => (
            <NavButton key={t.id} {...t} active={active === t.id} onClick={() => onNavigate(t.id)} />
          ))}
        </div>
      </nav>
    </div>
  )
}

function NavButton({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string
  icon: typeof Home
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'flex flex-col items-center justify-center gap-0.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all cursor-pointer',
        active
          ? 'text-primary bg-primary/10 font-bold'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
      )}
    >
      <Icon className="size-4.5" strokeWidth={active ? 2.2 : 1.8} />
      <span>{label}</span>
    </button>
  )
}
