'use client'

import { useState, type ReactNode } from 'react'
import type { ScreenId, Emergency } from '@/lib/lifeos'
import { emergencies, vehicles, mechanic } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { MapCanvas } from '@/components/lifeos/map-canvas'
import type { AuthUser } from '@/lib/firebase'
import { CallModal } from '@/components/lifeos/call-modal'
import {
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Compass,
  History,
  User,
  LayoutDashboard,
  Smartphone,
  Monitor,
  BatteryCharging,
  Gauge,
  PhoneCall,
  Share2,
  Flashlight,
  ChevronRight,
  LogOut,
  LogIn,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function WebsiteLayout({
  children,
  activeScreen,
  user,
  onNavigate,
  onEmergency,
  onSelectEmergency,
  onLogout,
  viewMode,
  onToggleViewMode,
}: {
  children: ReactNode
  activeScreen: ScreenId
  user?: AuthUser | null
  onNavigate: (s: ScreenId) => void
  onEmergency: () => void
  onSelectEmergency: (e: Emergency) => void
  onLogout?: () => void
  viewMode: 'website' | 'mobile'
  onToggleViewMode: (mode: 'website' | 'mobile') => void
}) {
  const activeVehicle = vehicles[0]
  const [calling, setCalling] = useState(false)

  const navItems: { id: ScreenId; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Tracking Radar', icon: Compass },
    { id: 'history', label: 'Service Logs', icon: History },
    { id: 'profile', label: 'Driver Profile', icon: User },
  ]

  return (
    <div className="relative min-h-screen w-full bg-[oklch(0.13_0.005_260)] text-foreground font-sans overflow-x-hidden">
      <AmbientBg tone="primary" />

      {/* Top Desktop Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[oklch(0.15_0.005_260)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="grid size-10 place-items-center rounded-2xl bg-primary/20 text-primary border border-primary/30 transition-transform group-hover:scale-105">
                <ShieldCheck className="size-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-foreground">
                    LifeOS
                  </span>
                  <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-accent border border-accent/20 uppercase tracking-wider">
                    Tamil Nadu Squad
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">Autonomous Emergency Platform</p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 surface-glass rounded-full px-3 py-1.5 border border-white/10 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeScreen === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden lg:flex items-center gap-2 surface-glass rounded-full pl-3 pr-1.5 py-1 text-xs">
                <span className="size-2 rounded-full bg-emerald-400" />
                <span className="font-bold max-w-[100px] truncate">{user.displayName || user.email?.split('@')[0]}</span>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-1 rounded-full text-muted-foreground hover:text-destructive transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="size-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer',
                  activeScreen === 'login'
                    ? 'bg-primary text-primary-foreground'
                    : 'surface-card text-primary hover:bg-primary/10'
                )}
              >
                <LogIn className="size-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Immediate SOS Trigger */}
            <button
              onClick={onEmergency}
              className="hidden sm:flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-xs font-bold text-destructive-foreground shadow-md hover:bg-destructive/90 active:scale-95 transition-all cursor-pointer"
            >
              <AlertTriangle className="size-4" />
              <span>EMERGENCY SOS</span>
            </button>

            {/* View Mode Toggle Pill */}
            <div className="flex items-center rounded-full surface-card p-1 border border-white/10">
              <button
                onClick={() => onToggleViewMode('website')}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer',
                  viewMode === 'website'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Monitor className="size-3.5" />
                <span className="hidden sm:inline">Desktop Hub</span>
              </button>
              <button
                onClick={() => onToggleViewMode('mobile')}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer',
                  viewMode === 'mobile'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Smartphone className="size-3.5" />
                <span className="hidden sm:inline">Mobile Frame</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Mobile Application Viewport */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="surface-card relative min-h-[680px] w-full rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col justify-between">
              {/* Screen Top Header Strip */}
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
                    Active View · {activeScreen}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-primary" /> GST Road NH-45 · Chengalpattu, TN
                  </span>
                </div>
              </div>

              {/* Dynamic Active Screen Content */}
              <div className="flex-1 w-full relative">{children}</div>
            </div>
          </div>

          {/* Telemetry & Sidebar */}
          <aside className="lg:col-span-4 space-y-5">
            {/* Live Vehicle Telemetry Card */}
            <div className="surface-card rounded-3xl p-5 space-y-4 shadow-xl border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/20 text-primary">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{activeVehicle.name}</h3>
                    <p className="text-xs text-muted-foreground">{activeVehicle.plate} · {activeVehicle.color}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                  Monitored
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="surface-card rounded-2xl p-3 flex items-center gap-3 border border-white/5">
                  <BatteryCharging className="size-5 text-accent shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Battery</p>
                    <p className="text-sm font-bold text-foreground">84%</p>
                  </div>
                </div>
                <div className="surface-card rounded-2xl p-3 flex items-center gap-3 border border-white/5">
                  <Gauge className="size-5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Tyre Pressure</p>
                    <p className="text-sm font-bold text-foreground">36 PSI</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tamil Nadu Live Radar Card */}
            <div className="surface-card rounded-3xl p-5 space-y-3 relative overflow-hidden shadow-xl border border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Tamil Nadu Live Radar</h3>
                <button
                  onClick={() => onNavigate('map')}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  Expand Map <ChevronRight className="size-3.5" />
                </button>
              </div>

              <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-white/10">
                <MapCanvas className="h-full w-full" showRoute progress={0.6} />
                <div className="absolute bottom-2 left-2 surface-glass rounded-full px-3 py-1 text-[10px] font-bold flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  {mechanic.name} (~{mechanic.etaMin}m ETA)
                </div>
              </div>
            </div>

            {/* Quick Dispatch Grid */}
            <div className="surface-card rounded-3xl p-5 space-y-3 shadow-xl border border-white/10">
              <h3 className="text-sm font-bold text-foreground">Quick Dispatch Services</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {emergencies.slice(0, 4).map((e) => {
                  const Icon = e.icon
                  return (
                    <button
                      key={e.id}
                      onClick={() => onSelectEmergency(e)}
                      className="surface-card hover:bg-secondary/70 rounded-2xl p-3 text-left transition-all cursor-pointer flex flex-col justify-between h-24 border border-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="grid size-8 place-items-center rounded-xl bg-primary/15 text-primary">
                          <Icon className="size-4" />
                        </div>
                        <span className="text-[10px] font-bold text-accent">~{e.eta}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{e.label}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{e.sub}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Emergency Actions Bar */}
            <div className="grid grid-cols-3 gap-2">
              <button className="surface-card rounded-2xl p-3 flex flex-col items-center gap-1 text-center hover:bg-secondary/70 transition-all cursor-pointer">
                <Flashlight className="size-4 text-amber-400" />
                <span className="text-[11px] font-semibold text-foreground">Flashlight</span>
              </button>
              <button className="surface-card rounded-2xl p-3 flex flex-col items-center gap-1 text-center hover:bg-secondary/70 transition-all cursor-pointer">
                <Share2 className="size-4 text-primary" />
                <span className="text-[11px] font-semibold text-foreground">Share GPS</span>
              </button>
              <button
                onClick={() => setCalling(true)}
                className="surface-card rounded-2xl p-3 flex flex-col items-center gap-1 text-center hover:bg-secondary/70 transition-all cursor-pointer"
              >
                <PhoneCall className="size-4 text-destructive" />
                <span className="text-[11px] font-semibold text-foreground">Call Tech</span>
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Live Call Modal */}
      <CallModal
        isOpen={calling}
        onClose={() => setCalling(false)}
        mechanicName={mechanic.name}
        mechanicPhone={mechanic.phone}
      />
    </div>
  )
}
