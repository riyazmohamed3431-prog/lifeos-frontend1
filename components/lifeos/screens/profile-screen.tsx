'use client'

import { vehicles } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import type { AuthUser } from '@/lib/firebase'
import {
  Car,
  Crown,
  Phone,
  Trophy,
  BatteryCharging,
  WifiOff,
  ChevronRight,
  Plus,
  ShieldCheck,
  LogOut,
  LogIn,
} from 'lucide-react'

export function ProfileScreen({
  user,
  onLogout,
  onLoginRedirect,
}: {
  user?: AuthUser | null
  onLogout?: () => void
  onLoginRedirect?: () => void
}) {
  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Alex Lin')
  const email = user?.email || 'alex.lin@lifeos.app'

  return (
    <div className="relative h-full overflow-y-auto no-scrollbar px-6 pt-4 pb-28">
      <AmbientBg tone="calm" />

      <div className="relative z-10">
        {/* Identity */}
        <div className="grad-border flex items-center gap-4 rounded-3xl p-5">
          <div className="relative grid size-16 place-items-center rounded-full bg-gradient-to-br from-primary/40 to-accent/20 text-2xl font-bold uppercase">
            {displayName.substring(0, 2)}
            <span className="absolute -bottom-0.5 -right-0.5 grid size-6 place-items-center rounded-full bg-accent text-accent-foreground">
              <ShieldCheck className="size-3.5" />
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">{displayName}</h1>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
          {user ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/25 transition-colors"
              title="Sign Out"
            >
              <LogOut className="size-3.5" /> Log Out
            </button>
          ) : (
            <button
              onClick={onLoginRedirect}
              className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/25 transition-colors"
            >
              <LogIn className="size-3.5" /> Sign In
            </button>
          )}
        </div>

        {/* Membership */}
        <div className="mt-5 overflow-hidden rounded-3xl glass-strong p-5 glow-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">LifeOS Membership</p>
              <p className="text-lg font-bold">Unlimited Rescue</p>
            </div>
            <Crown className="size-7 text-primary" />
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Rescues used</span>
            <span className="font-medium">14 / ∞</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full w-2/3 rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
        </div>

        {/* Garage */}
        <Section title="Your garage" action="Add">
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6">
            {vehicles.map((v) => (
              <div key={v.id} className="w-44 shrink-0 grad-border rounded-3xl p-4">
                <div className="grid size-11 place-items-center rounded-2xl bg-primary/15">
                  <Car className="size-6 text-primary" />
                </div>
                <p className="mt-3 text-sm font-semibold">{v.name}</p>
                <p className="text-[11px] text-muted-foreground">{v.color}</p>
                <p className="mt-2 font-mono text-xs text-primary">{v.plate}</p>
              </div>
            ))}
            <button className="grid w-44 shrink-0 place-items-center rounded-3xl border border-dashed border-white/15 text-muted-foreground hover:bg-white/5 transition-colors">
              <Plus className="size-6" />
            </button>
          </div>
        </Section>

        {/* Emergency contacts */}
        <Section title="Emergency contacts">
          <div className="space-y-2">
            {[
              { n: 'Sam Lin', r: 'Partner' },
              { n: 'Roadside Line', r: '24/7 hotline' },
            ].map((c) => (
              <div key={c.n} className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
                <span className="grid size-9 place-items-center rounded-full bg-accent/15">
                  <Phone className="size-4 text-accent" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.n}</p>
                  <p className="text-[11px] text-muted-foreground">{c.r}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </Section>

        {/* Achievements */}
        <Section title="Achievements">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Trophy, l: 'Road Warrior' },
              { icon: ShieldCheck, l: 'Safe Driver' },
              { icon: BatteryCharging, l: 'Power Saver' },
            ].map((a) => (
              <div key={a.l} className="glass flex flex-col items-center gap-2 rounded-2xl py-4 text-center">
                <a.icon className="size-6 text-primary" />
                <span className="text-[10px] font-medium text-muted-foreground">{a.l}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Toggles */}
        <Section title="Preferences">
          <div className="space-y-2">
            <Toggle icon={BatteryCharging} label="Battery saver mode" on />
            <Toggle icon={WifiOff} label="Offline request queue" />
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({
  title,
  action,
  children,
}: {
  title: string
  action?: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-7">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        {action && <button className="text-xs text-primary font-medium">{action}</button>}
      </div>
      {children}
    </div>
  )
}

function Toggle({
  icon: Icon,
  label,
  on,
}: {
  icon: typeof BatteryCharging
  label: string
  on?: boolean
}) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
      <span className="grid size-9 place-items-center rounded-full bg-white/5">
        <Icon className="size-4 text-foreground/80" />
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <span
        className={
          'relative h-6 w-11 rounded-full transition-colors ' + (on ? 'bg-primary' : 'bg-white/15')
        }
      >
        <span
          className={
            'absolute top-0.5 size-5 rounded-full bg-white transition-all ' +
            (on ? 'left-[22px]' : 'left-0.5')
          }
        />
      </span>
    </div>
  )
}
