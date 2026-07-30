'use client'

import type { ReactNode } from 'react'
import type { ScreenId, Emergency } from '@/lib/lifeos'
import { emergencies, vehicles, mechanic } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { MapCanvas } from '@/components/lifeos/map-canvas'
import {
  ShieldCheck,
  Zap,
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
  Clock,
  Radio,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function WebsiteLayout({
  children,
  activeScreen,
  onNavigate,
  onEmergency,
  onSelectEmergency,
  viewMode,
  onToggleViewMode,
}: {
  children: ReactNode
  activeScreen: ScreenId
  onNavigate: (s: ScreenId) => void
  onEmergency: () => void
  onSelectEmergency: (e: Emergency) => void
  viewMode: 'website' | 'mobile'
  onToggleViewMode: (mode: 'website' | 'mobile') => void
}) {
  const activeVehicle = vehicles[0]

  const navItems: { id: ScreenId; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Live Radar', icon: Compass },
    { id: 'history', label: 'Dispatch History', icon: History },
    { id: 'profile', label: 'Driver Profile', icon: User },
  ]

  return (
    <div className="relative min-h-screen w-full bg-[oklch(0.12_0.02_264)] text-foreground font-sans overflow-x-hidden">
      <AmbientBg tone="primary" />

      {/* Top Desktop Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[oklch(0.14_0.02_264)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo & Status */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="grid size-10 place-items-center rounded-2xl bg-primary/20 text-primary ring-1 ring-primary/40 transition-transform group-hover:scale-105">
                <ShieldCheck className="size-6 text-primary glow-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    LifeOS
                  </span>
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent border border-accent/25">
                    RESPONSE HUB
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">Autonomous Emergency Assistance</p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 glass rounded-full px-3 py-1.5 border border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeScreen === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Right Actions: SOS Trigger & View Switcher */}
          <div className="flex items-center gap-3">
            {/* Immediate SOS Button */}
            <button
              onClick={onEmergency}
              className="hidden sm:flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-xs font-bold text-destructive-foreground glow-emergency hover:bg-destructive/90 active:scale-95 transition-all"
            >
              <Zap className="size-4 animate-pulse" />
              <span>EMERGENCY SOS</span>
            </button>

            {/* Model Switcher Pill */}
            <div className="flex items-center rounded-full bg-slate-900/90 p-1 border border-white/15 shadow-inner">
              <button
                onClick={() => onToggleViewMode('website')}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                  viewMode === 'website'
                    ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                title="Desktop Web Layout"
              >
                <Monitor className="size-3.5" />
                <span className="hidden sm:inline">Website</span>
              </button>
              <button
                onClick={() => onToggleViewMode('mobile')}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                  viewMode === 'mobile'
                    ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                title="Mobile Smartphone Frame Layout"
              >
                <Smartphone className="size-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar for smaller viewports when in website mode */}
        <div className="md:hidden flex items-center justify-around border-t border-white/5 py-2 px-2 bg-black/40">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeScreen === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'flex flex-col items-center gap-1 text-[11px] font-medium px-3 py-1 rounded-xl transition-all',
                  isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* Main Layout Body */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Active Screen Window (Left / Center Column) */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Desktop Screen Frame Card */}
            <div className="glass-strong relative min-h-[680px] w-full rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col justify-between">
              {/* Screen Top Header Strip */}
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-accent animate-ping" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    System Mode · {activeScreen.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-primary" /> Route 9 · Mile 42
                  </span>
                  <span className="hidden sm:inline">|</span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-accent">
                    <Sparkles className="size-3.5" /> Satellite Linked
                  </span>
                </div>
              </div>

              {/* Dynamic Screen View */}
              <div className="flex-1 w-full relative">{children}</div>
            </div>
          </div>

          {/* Sidebar & Live Telemetry Panel (Right Column) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Live Vehicle Telemetry Card */}
            <div className="grad-border rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/20 text-primary">
                    <ShieldCheck className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{activeVehicle.name}</h3>
                    <p className="text-xs text-muted-foreground">{activeVehicle.plate} · {activeVehicle.color}</p>
                  </div>
                </div>
                <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent">
                  Connected
                </span>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="glass rounded-2xl p-3 flex items-center gap-3">
                  <BatteryCharging className="size-5 text-accent shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">Battery</p>
                    <p className="text-sm font-bold">84% <span className="text-[10px] text-accent">Charging</span></p>
                  </div>
                </div>
                <div className="glass rounded-2xl p-3 flex items-center gap-3">
                  <Gauge className="size-5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">Tyres</p>
                    <p className="text-sm font-bold">36 PSI <span className="text-[10px] text-emerald-400">Optimal</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Radar Map Preview Widget */}
            <div className="glass-strong rounded-3xl p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="size-4 text-accent animate-pulse" />
                  <h3 className="text-sm font-bold">Live Fleet Radar</h3>
                </div>
                <button
                  onClick={() => onNavigate('map')}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Expand <ChevronRight className="size-3.5" />
                </button>
              </div>

              <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-white/10">
                <MapCanvas className="h-full w-full" showRoute progress={0.6} />
                <div className="absolute bottom-2 left-2 glass rounded-full px-2.5 py-1 text-[10px] font-medium flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                  3 Responders Nearby (~{mechanic.etaMin}m ETA)
                </div>
              </div>
            </div>

            {/* Quick Dispatch Services Grid */}
            <div className="glass-strong rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">Instant Dispatch</h3>
                <span className="text-xs text-muted-foreground">Select to trigger</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {emergencies.slice(0, 4).map((e) => {
                  const Icon = e.icon
                  return (
                    <button
                      key={e.id}
                      onClick={() => onSelectEmergency(e)}
                      className="glass hover:bg-white/10 rounded-2xl p-3 text-left transition-all group flex flex-col justify-between h-24 border border-white/5 hover:border-primary/40"
                    >
                      <div className="flex items-center justify-between">
                        <div className="grid size-8 place-items-center rounded-xl bg-primary/15 text-primary group-hover:scale-105 transition-transform">
                          <Icon className="size-4" />
                        </div>
                        <span className="text-[10px] font-medium text-accent">~{e.eta}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{e.label}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{e.sub}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Emergency Shortcuts Bar */}
            <div className="grid grid-cols-3 gap-2">
              <button className="glass rounded-2xl p-3 flex flex-col items-center gap-1 text-center hover:bg-white/10 transition-colors">
                <Flashlight className="size-4 text-accent" />
                <span className="text-[11px] font-medium">Flashlight</span>
              </button>
              <button className="glass rounded-2xl p-3 flex flex-col items-center gap-1 text-center hover:bg-white/10 transition-colors">
                <Share2 className="size-4 text-primary" />
                <span className="text-[11px] font-medium">Share GPS</span>
              </button>
              <button className="glass rounded-2xl p-3 flex flex-col items-center gap-1 text-center hover:bg-white/10 transition-colors">
                <PhoneCall className="size-4 text-destructive" />
                <span className="text-[11px] font-medium">Call 911</span>
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
