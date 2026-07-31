'use client'

import { vehicles } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import type { AuthUser } from '@/lib/firebase'
import {
  Car,
  Crown,
  Phone,
  ShieldCheck,
  ChevronRight,
  Plus,
  LogOut,
  LogIn,
  Bell,
  Lock,
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
    <div className="relative h-full overflow-y-auto no-scrollbar px-5 pt-4 pb-32 space-y-6">
      <AmbientBg tone="calm" />

      <div className="relative z-10 space-y-6">
        {/* User Identity Card */}
        <div className="surface-card rounded-3xl p-5 flex items-center justify-between shadow-xl border border-white/10">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="grid size-14 place-items-center rounded-2xl bg-primary/20 text-primary font-bold text-lg border border-primary/30 shrink-0">
              {displayName.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-foreground truncate">{displayName}</h1>
                <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </div>
          {user ? (
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-destructive/15 text-destructive hover:bg-destructive/25 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="size-4" />
            </button>
          ) : (
            <button
              onClick={onLoginRedirect}
              className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer flex items-center gap-1"
            >
              <LogIn className="size-3.5" /> Sign In
            </button>
          )}
        </div>

        {/* Membership Tier Banner */}
        <div className="surface-card rounded-3xl p-5 border border-primary/30 bg-primary/10 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent">LifeOS Membership</p>
              <h2 className="text-base font-bold text-foreground">Priority Tier I · Unlimited</h2>
            </div>
            <Crown className="size-7 text-amber-400" />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-white/5">
            <span>24/7 Priority Emergency Dispatch</span>
            <span className="font-semibold text-emerald-400">Active</span>
          </div>
        </div>

        {/* Garage Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Garage</h2>
            <button className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
              <Plus className="size-3.5" /> Add Vehicle
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {vehicles.map((v) => (
              <div key={v.id} className="surface-card rounded-2xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary">
                    <Car className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground">{v.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{v.color} · {v.plate}</p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Emergency Contacts</h2>
          <div className="space-y-2">
            {[
              { n: 'Sarah Lin', r: 'Spouse · Primary SOS Contact' },
              { n: 'State Farm Insurance', r: 'Policy #SF-94028' },
            ].map((c) => (
              <div key={c.n} className="surface-card rounded-2xl p-3.5 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-xl bg-accent/15 text-accent">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{c.n}</p>
                    <p className="text-[11px] text-muted-foreground">{c.r}</p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Account & Preferences */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Preferences</h2>
          <div className="space-y-2">
            <div className="surface-card rounded-2xl p-3.5 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <Bell className="size-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Real-time Emergency Alerts</span>
              </div>
              <span className="text-xs font-bold text-accent">Enabled</span>
            </div>
            <div className="surface-card rounded-2xl p-3.5 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <Lock className="size-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Privacy & Satellite Telemetry</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
