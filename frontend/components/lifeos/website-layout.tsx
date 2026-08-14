'use client'

import { useState, type ReactNode } from 'react'
import type { ScreenId, Emergency } from '@/lib/lifeos'
import type { AuthUser } from '@/lib/firebase'
import { useTheme } from '@/components/theme-provider'
import {
  ShieldCheck,
  Compass,
  History,
  User,
  LogOut,
  SunMedium,
  Moon,
  ChevronDown,
  CreditCard,
  Car,
  Phone,
  Home,
  Wrench,
  Navigation,
  Award,
  Settings,
  Headset,
  HelpCircle,
  ChevronLeft,
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
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { id: 'home' as ScreenId, label: 'Home', icon: Home },
    { id: 'profile' as ScreenId, label: 'My Vehicles', icon: Car },
    { id: 'booking' as ScreenId, label: 'Services', icon: Wrench },
    { id: 'map' as ScreenId, label: 'Trips', icon: Navigation },
    { id: 'history' as ScreenId, label: 'Payments', icon: CreditCard },
    { id: 'history' as ScreenId, label: 'Support', icon: Headset },
    { id: 'home' as ScreenId, label: 'Rewards', icon: Award },
    { id: 'profile' as ScreenId, label: 'Settings', icon: Settings },
  ]

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={cn(
      "relative w-full bg-[#F8FAF9] dark:bg-[#0F172A] bg-[radial-gradient(#E2E8F0_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#1E293B_1.2px,transparent_1.2px)] bg-[size:24px_24px] text-[#0F172A] dark:text-[#F8FAFC] font-sans overflow-hidden flex select-none",
      viewMode === 'mobile' ? 'h-full' : 'min-h-screen'
    )}>
      
      {/* LEFT NAVIGATION SIDEBAR (#0D1420 Dark Sidebar) */}
      <div className={cn(
        "flex flex-col justify-between bg-[#0D1420] text-neutral-300 shrink-0 border-r border-white/5 z-40 transition-all duration-300 p-4",
        collapsed ? 'w-20' : 'w-52',
        viewMode === 'mobile' ? 'h-full' : 'hidden md:flex h-screen'
      )}>
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 px-2 pt-1">
            <div className="size-8 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 flex items-center justify-center text-white shadow-md font-black text-xs shrink-0">
              <ShieldCheck className="size-4 text-white" />
            </div>
            {!collapsed && (
              <span className="text-base font-extrabold text-white tracking-tight">
                LifeOS
              </span>
            )}
          </div>

          {/* Navigation Items Group */}
          <div className="space-y-1.5 pt-2">
            {navItems.map((item, idx) => {
              const Icon = item.icon
              const isActive = (item.id === 'home' && activeScreen === 'home') ||
                               (item.id === 'profile' && activeScreen === 'profile') ||
                               (item.id === 'booking' && activeScreen === 'booking') ||
                               (item.id === 'history' && activeScreen === 'history') ||
                               (item.id === 'map' && activeScreen === 'map')

              // Make 'Home' explicitly active when activeScreen is home
              const isHomeActive = item.label === 'Home' && activeScreen === 'home'

              return (
                <div
                  key={idx}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    isHomeActive
                      ? "bg-[#0D9488] text-white shadow-md ring-1 ring-emerald-400/40"
                      : isActive
                      ? "bg-white/10 text-white"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  )}
                  title={item.label}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Lower Sidebar: Support Card & Settings Controls */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          {!collapsed && (
            <div className="bg-[#151D2A] rounded-2xl p-3 space-y-2 border border-white/5 text-center">
              <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <Headset className="size-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">24/7 Support</h4>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  We're always here to help you
                </p>
              </div>
              <button
                onClick={() => alert("LifeOS Hotline: +91 98765 43210")}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-mono font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Phone className="size-3" />
                <span>+91 98765 43210</span>
              </button>
            </div>
          )}

          {/* Night Mode Toggle & Collapse Arrow */}
          <div className="flex items-center justify-between px-1">
            {!collapsed && (
              <div className="flex items-center justify-between w-full pr-2 text-xs font-bold text-neutral-400">
                <span className="flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="size-3.5 text-indigo-400" /> : <SunMedium className="size-3.5 text-amber-400" />}
                  Night Mode
                </span>
                <button
                  onClick={toggleTheme}
                  className="w-8 h-4 rounded-full bg-neutral-700 p-0.5 transition-colors relative cursor-pointer"
                >
                  <div className={cn(
                    "size-3 rounded-full bg-white transition-transform",
                    theme === 'dark' ? 'translate-x-4' : 'translate-x-0'
                  )} />
                </button>
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="size-7 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer ml-auto"
              title="Toggle Sidebar"
            >
              <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT PANEL */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 relative",
        viewMode === 'mobile' ? 'h-full' : 'h-screen'
      )}>
        {/* Top Header Toolbar (75px) */}
        <div className={cn(
          "flex items-center justify-between border-b border-neutral-200/80 dark:border-white/10 shrink-0 bg-white/80 dark:bg-[#151C2C]/80 backdrop-blur-md z-30 w-full h-16 sm:h-20 px-4 sm:px-8",
        )}>
          {/* Header Left: Active Portal */}
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-neutral-400">
              ACTIVE PORTAL: <strong className="text-neutral-900 dark:text-white font-extrabold uppercase ml-1">{activeScreen}</strong>
            </span>
          </div>

          {/* Header Right: User Account Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("LifeOS Priority Hotline: +91 98400 32145\n24/7 Roadside Assistance Command Center.")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 bg-neutral-100 dark:bg-neutral-800 transition-colors cursor-pointer"
            >
              <HelpCircle className="size-3.5 text-indigo-500" />
              <span>Need Help?</span>
            </button>

            <div
              className="flex items-center gap-2.5 pl-2 border-l border-neutral-200 dark:border-white/10 cursor-pointer"
              onClick={() => onNavigate('profile')}
            >
              <div className="size-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 flex items-center justify-center text-white text-xs font-black shadow-sm">
                MO
              </div>
              <span className="text-xs sm:text-sm font-black text-neutral-800 dark:text-neutral-100 hidden sm:inline">
                Mohamed Riyaz
              </span>
              <ChevronDown className="size-4 text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Scrollable Main Content Container */}
        <div className={cn(
          "flex-1 overflow-y-auto no-scrollbar w-full",
          viewMode === 'mobile' ? 'p-3' : 'p-4 lg:p-6'
        )}>
          {children}
        </div>
      </div>
    </div>
  )
}
