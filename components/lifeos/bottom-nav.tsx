'use client'

import { Home, Map, Clock, User, Plus } from 'lucide-react'
import type { ScreenId } from '@/lib/lifeos'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'home' as const, label: 'Home', icon: Home },
  { id: 'map' as const, label: 'Map', icon: Map },
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
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center pb-4">
      <nav className="glass-strong pointer-events-auto flex items-center gap-1 rounded-full px-2.5 py-2 shadow-2xl">
        {tabs.slice(0, 2).map((t) => (
          <NavButton key={t.id} {...t} active={active === t.id} onClick={() => onNavigate(t.id)} />
        ))}

        <button
          onClick={onEmergency}
          aria-label="New emergency"
          className="mx-0.5 grid size-12 place-items-center rounded-full bg-destructive text-destructive-foreground glow-emergency transition-transform active:scale-90"
        >
          <Plus className="size-6" strokeWidth={2.6} />
        </button>

        {tabs.slice(2).map((t) => (
          <NavButton key={t.id} {...t} active={active === t.id} onClick={() => onNavigate(t.id)} />
        ))}
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
        'flex flex-col items-center gap-0.5 rounded-full px-4 py-2 text-[10px] font-medium transition-colors',
        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <Icon className={cn('size-5 transition-all', active && 'drop-shadow-[0_0_10px_var(--color-primary)]')} />
      {label}
    </button>
  )
}
