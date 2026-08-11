'use client'

import { Home, Car, History, User, AlertTriangle } from 'lucide-react'
import type { ScreenId } from '@/lib/lifeos'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const tabs = [
  { id: 'home' as const, label: 'Home', icon: Home, color: '#0F766E' },
  { id: 'map' as const, label: 'Vehicle', icon: Car, color: '#4338CA' },
  { id: 'history' as const, label: 'Records', icon: History, color: '#F59E0B' },
  { id: 'profile' as const, label: 'Profile', icon: User, color: '#8B5CF6' },
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
  const isEmergencyActive = ['booking', 'waiting', 'found', 'tracking', 'payment'].includes(active)

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center pb-5 px-4">
      <nav className="pointer-events-auto flex items-center justify-between w-full max-w-[380px] rounded-full px-3 py-2 bg-white/90 dark:bg-[#18181B]/90 backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-[#E2E8F0] dark:border-white/10">
        {/* First two tabs: Home & Vehicle */}
        <div className="flex items-center gap-1">
          {tabs.slice(0, 2).map((t) => (
            <NavButton key={t.id} {...t} active={active === t.id} onClick={() => onNavigate(t.id)} />
          ))}
        </div>

        {/* Center Primary Emergency SOS Button */}
        {!isEmergencyActive && (
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={onEmergency}
            aria-label="Emergency SOS"
            className="mx-1 flex flex-col items-center justify-center size-12 rounded-full bg-gradient-to-tr from-[#E11D48] via-[#F97316] to-[#F59E0B] text-white font-extrabold shadow-lg shadow-[#E11D48]/30 hover:shadow-[#E11D48]/50 transition-all cursor-pointer border-2 border-white/20"
          >
            <AlertTriangle className="size-5" strokeWidth={2.4} />
          </motion.button>
        )}

        {/* Last two tabs: Records & Profile */}
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
  id,
  label,
  icon: Icon,
  color,
  active,
  onClick,
}: {
  id: string
  label: string
  icon: typeof Home
  color: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'relative flex flex-col items-center justify-center gap-0.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all cursor-pointer select-none',
        active ? 'font-black' : 'text-[#475569] dark:text-[#94A3B8] hover:text-foreground hover:bg-muted/60',
      )}
      style={{ color: active ? color : undefined }}
    >
      {active && (
        <motion.div
          layoutId="activeBentoMobileTab"
          className="absolute inset-0 rounded-full opacity-15 border"
          style={{ backgroundColor: color, borderColor: color }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className="relative z-10 size-4.5" strokeWidth={active ? 2.3 : 1.8} />
      <span className="relative z-10">{label}</span>
    </button>
  )
}
