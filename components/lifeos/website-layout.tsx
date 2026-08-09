'use client'

import { useState, type ReactNode } from 'react'
import type { ScreenId, Emergency } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import type { AuthUser } from '@/lib/firebase'
import { useTheme } from '@/components/theme-provider'
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
  LogOut,
  LogIn,
  SunMedium,
  Moon,
  ChevronDown,
  CreditCard,
  Car,
  Phone,
  Lock,
  Menu,
  X,
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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [navMenuOpen, setNavMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const isEmergencyActive = ['booking', 'waiting', 'found', 'tracking', 'payment'].includes(activeScreen)

  const navItems: { id: ScreenId; label: string; icon: typeof LayoutDashboard; accent: string }[] = [
    { id: 'home', label: 'Command Center', icon: LayoutDashboard, accent: '#0F766E' },
    { id: 'map', label: 'Vehicle Command', icon: Compass, accent: '#2563EB' },
    { id: 'history', label: 'Service Records', icon: History, accent: '#F59E0B' },
    { id: 'profile', label: 'Garage & Account', icon: User, accent: '#8B5CF6' },
  ]

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground font-sans overflow-x-hidden transition-colors duration-300">
      <AmbientBg tone="primary" />

      {/* Top Bars (Ticker & Header Navigation) */}
      {!isEmergencyActive && (
        <>
          {/* Ticker Bar: Status & Priority Hotline */}
          <div className="w-full bg-[#0F766E]/5 border-b border-border px-4 py-2 text-xs text-[#475569] dark:text-[#94A3B8] flex items-center justify-between overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-4 shrink-0">
              <span className="flex items-center gap-1.5 font-bold text-[#0F766E]">
                <span className="size-2 rounded-full bg-[#0F766E] animate-ping" />
                <span>Verified Rescue Fleet Active</span>
              </span>
              <span className="opacity-30">•</span>
              <span className="flex items-center gap-1 text-foreground/80 font-medium">
                <SunMedium className="size-3.5 text-[#F59E0B]" />
                <span>29°C Clear · NH-45 GST Road Corridor</span>
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#475569] dark:text-[#94A3B8] shrink-0">
              <span className="flex items-center gap-1 font-semibold">
                <ShieldCheck className="size-3.5 text-[#0F766E]" />
                <span>24/7 Unlimited Priority Protection</span>
              </span>
              <span className="opacity-30">•</span>
              <span className="text-[#2563EB] font-bold">Hotline: 1800-425-SOS</span>
            </div>
          </div>

          {/* Top Desktop Navigation Header */}
          <header className="sticky top-0 z-40 w-full border-b border-border bg-card/85 backdrop-blur-2xl transition-colors">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              {/* Left Side: 3-Bars Hamburger Menu + Brand Logo */}
              <div className="flex items-center gap-3">
                {/* 3-Bars Hamburger Menu Button */}
                <div className="relative">
                  <button
                    onClick={() => setNavMenuOpen(!navMenuOpen)}
                    className="grid size-10 place-items-center rounded-2xl bg-card border border-border text-foreground hover:bg-muted transition-all cursor-pointer shadow-sm select-none"
                    title="Open Navigation Menu"
                    aria-label="Toggle Navigation Menu"
                  >
                    {navMenuOpen ? <X className="size-5 text-foreground" /> : <Menu className="size-5 text-foreground" strokeWidth={2.4} />}
                  </button>

                  {/* Left-Side Navigation Dropdown Popover */}
                  {navMenuOpen && (
                    <div className="absolute left-0 mt-3 w-64 rounded-3xl bg-card/95 border border-border shadow-2xl backdrop-blur-2xl p-3 z-50 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground px-3 py-1">
                        Navigation Menu
                      </p>

                      {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeScreen === item.id
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              onNavigate(item.id)
                              setNavMenuOpen(false)
                            }}
                            className={cn(
                              'w-full flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold transition-all cursor-pointer text-left select-none',
                              isActive
                                ? 'text-white shadow-md'
                                : 'text-[#475569] dark:text-[#94A3B8] hover:text-foreground hover:bg-muted/80'
                            )}
                            style={{ backgroundColor: isActive ? item.accent : undefined }}
                          >
                            <Icon className="size-4 shrink-0" />
                            <span>{item.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Logo */}
                <button
                  onClick={() => onNavigate(user ? 'home' : 'landing')}
                  className="flex items-center gap-3 text-left group cursor-pointer"
                >
                  <div className="relative grid size-11 place-items-center rounded-2xl bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20 shadow-sm transition-transform group-hover:scale-105">
                    <ShieldCheck className="size-6 text-[#0F766E]" />
                    <span className="absolute -top-1 -right-1 size-3 rounded-full bg-[#F59E0B] animate-ping opacity-75" />
                    <span className="absolute -top-1 -right-1 size-3 rounded-full bg-[#F59E0B]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                        LifeOS
                      </span>
                      <span className="rounded-full bg-[#0F766E]/10 px-2.5 py-0.5 text-[10px] font-extrabold text-[#0F766E] border border-[#0F766E]/20 uppercase tracking-wider">
                        Executive Protection
                      </span>
                    </div>
                    <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] font-medium">Intelligent Mobility Platform</p>
                  </div>
                </button>
              </div>

              {/* Right Header Actions */}
              <div className="flex items-center gap-3">
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-card border border-border text-foreground hover:bg-muted transition-all cursor-pointer shadow-sm"
                  title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <SunMedium className="size-4 text-[#F59E0B]" /> : <Moon className="size-4 text-[#2563EB]" />}
                </button>

                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="hidden lg:flex items-center gap-2 bg-card hover:bg-muted/80 rounded-full pl-3 pr-2.5 py-1.5 text-xs border border-border shadow-sm transition-all cursor-pointer select-none"
                    >
                      <span className="size-2 rounded-full bg-[#0F766E] animate-pulse" />
                      <span className="font-bold max-w-[110px] truncate text-[#0F172A] dark:text-[#F8FAFC]">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className={cn('size-3.5 text-muted-foreground transition-transform', profileMenuOpen && 'rotate-180')} />
                    </button>

                    {/* Profile Options Dropdown Popover */}
                    {profileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-card/95 border border-border shadow-2xl backdrop-blur-2xl p-4 z-50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-3 pb-3 border-b border-border">
                          <div className="grid size-11 place-items-center rounded-2xl bg-[#0F766E]/15 text-[#0F766E] font-black text-sm border border-[#0F766E]/30 shrink-0">
                            {(user.displayName || user.email || 'RM').substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-black text-foreground truncate">{user.displayName || 'LifeOS Driver'}</h4>
                            <p className="text-[10px] text-muted-foreground font-mono truncate">{user.email}</p>
                            <span className="inline-block mt-1 rounded-full bg-[#0F766E]/10 border border-[#0F766E]/20 px-2 py-0.5 text-[9px] font-extrabold text-[#0F766E]">
                              Executive VIP Member
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground px-2 py-1">Dashboard Profile Options</p>
                          
                          <button
                            onClick={() => {
                              onNavigate('profile')
                              setProfileMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-bold text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                          >
                            <User className="size-4 text-[#8B5CF6]" />
                            <span>Driver Profile Details</span>
                          </button>

                          <button
                            onClick={() => {
                              onNavigate('profile')
                              setProfileMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-bold text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                          >
                            <Car className="size-4 text-[#2563EB]" />
                            <span>My Registered Vehicles</span>
                          </button>

                          <button
                            onClick={() => {
                              onNavigate('profile')
                              setProfileMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-bold text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                          >
                            <CreditCard className="size-4 text-[#0F766E]" />
                            <span>Payments & Stored Wallet</span>
                          </button>

                          <button
                            onClick={() => {
                              onNavigate('profile')
                              setProfileMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-bold text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                          >
                            <Phone className="size-4 text-[#F59E0B]" />
                            <span>Emergency SOS Contacts</span>
                          </button>

                          <button
                            onClick={() => {
                              onNavigate('profile')
                              setProfileMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-bold text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                          >
                            <Lock className="size-4 text-[#E11D48]" />
                            <span>Security & Privacy Options</span>
                          </button>
                        </div>

                        <div className="pt-2 border-t border-border">
                          <button
                            onClick={() => {
                              setProfileMenuOpen(false)
                              if (onLogout) onLogout()
                            }}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive py-2 text-xs font-extrabold transition-colors cursor-pointer"
                          >
                            <LogOut className="size-3.5" />
                            <span>Sign Out Account</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigate('login')}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer',
                      activeScreen === 'login'
                        ? 'bg-[#0F766E] text-white shadow-md'
                        : 'bg-card text-[#0F766E] hover:bg-[#0F766E]/10 border border-[#0F766E]/30'
                    )}
                  >
                    <LogIn className="size-3.5" />
                    <span>Sign In</span>
                  </button>
                )}

                {/* Immediate SOS Trigger */}
                <button
                  onClick={onEmergency}
                  className="hidden sm:flex items-center gap-2 rounded-full bg-gradient-to-r from-[#EF4444] to-[#F97316] px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-[#EF4444]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <AlertTriangle className="size-4" />
                  <span>EMERGENCY SOS</span>
                </button>

                {/* View Mode Toggle Pill */}
                <div className="flex items-center rounded-full bg-card p-1 border border-border shadow-inner">
                  <button
                    onClick={() => onToggleViewMode('website')}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer',
                      viewMode === 'website'
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'text-[#475569] dark:text-[#94A3B8] hover:text-foreground'
                    )}
                  >
                    <Monitor className="size-3.5" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    onClick={() => onToggleViewMode('mobile')}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer',
                      viewMode === 'mobile'
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'text-[#475569] dark:text-[#94A3B8] hover:text-foreground'
                    )}
                  >
                    <Smartphone className="size-3.5" />
                    <span className="hidden sm:inline">Phone Frame</span>
                  </button>
                </div>
              </div>
            </div>
          </header>
        </>
      )}

      {/* Main Body Grid */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Full-width Active Application Viewport */}
        <div className="w-full flex flex-col transition-all duration-300">
          <div className="bg-card/90 relative min-h-[720px] w-full rounded-3xl border border-border p-4 sm:p-6 shadow-[0_12px_36px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col justify-between backdrop-blur-2xl transition-all">
            {/* Screen Top Header Strip */}
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#0F766E] animate-pulse" />
                <span className="text-xs font-extrabold tracking-wider uppercase text-[#475569] dark:text-[#94A3B8]">
                  Active Screen · <span className="text-[#0F172A] dark:text-[#F8FAFC]">{activeScreen}</span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-foreground/80">
                  <MapPin className="size-3.5 text-[#2563EB] shrink-0" /> GST Road NH-45 · Chengalpattu, TN
                </span>
              </div>
            </div>

            {/* Dynamic Active Screen Content */}
            <div className="flex-1 w-full relative">{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
