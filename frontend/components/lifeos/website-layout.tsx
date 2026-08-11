'use client'

import { useState, type ReactNode } from 'react'
import type { ScreenId, Emergency } from '@/lib/lifeos'
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
  Home,
  GitBranch,
  Puzzle,
  Link2,
  Globe,
  MoreHorizontal,
  BookOpen,
  Rocket,
  HelpCircle,
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

  const navItems = [
    { id: 'home' as ScreenId, label: 'Command Center', icon: Home },
    { id: 'map' as ScreenId, label: 'Vehicle Command', icon: Compass },
    { id: 'history' as ScreenId, label: 'Service Records', icon: History },
    { id: 'profile' as ScreenId, label: 'Garage & Account', icon: User },
  ]

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={cn(
      "relative w-full bg-[#F8FAF9] bg-[radial-gradient(#E2E8F0_1.2px,transparent_1.2px)] bg-[size:24px_24px] text-[#0F172A] font-sans overflow-hidden flex select-none",
      viewMode === 'mobile' ? 'h-full' : 'min-h-screen'
    )}>
      
      {/* LEFT NAVIGATION SIDEBAR (Mocking reference sidebar) */}
      <div className={cn(
        "flex flex-col justify-between items-center w-18 bg-[#181922] py-6 text-neutral-400 shrink-0 border-r border-white/5 z-40",
        viewMode === 'mobile' ? 'h-full' : 'hidden md:flex h-screen'
      )}>
        <div className="flex flex-col items-center gap-6">
          {/* Navigation group */}
          <div className="flex flex-col gap-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeScreen === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "size-9 rounded-xl flex items-center justify-center cursor-pointer transition-all",
                    isActive 
                      ? "bg-neutral-800 text-white shadow-sm scale-105" 
                      : "hover:bg-neutral-800/80 hover:text-white"
                  )}
                  title={item.label}
                >
                  <Icon className="size-4.5" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Lower Navigation Group */}
        <div className="flex flex-col items-center gap-3">
          {/* Theme Toggle inside Sidebar */}
          <div 
            onClick={toggleTheme}
            className="size-9 rounded-xl flex items-center justify-center hover:bg-neutral-800/80 text-neutral-400 hover:text-white cursor-pointer transition-colors" 
            title={`Toggle Theme Mode`}
          >
            {theme === 'dark' ? <SunMedium className="size-4.5 text-[#FBBF24]" /> : <Moon className="size-4.5 text-neutral-400" />}
          </div>

          {/* LogOut Action inside Sidebar */}
          {onLogout && (
            <div 
              onClick={onLogout}
              className="size-9 rounded-xl flex items-center justify-center hover:bg-red-500/10 text-neutral-400 hover:text-red-400 cursor-pointer transition-colors" 
              title="Logout Account"
            >
              <LogOut className="size-4.5" />
            </div>
          )}

          {/* Driver Avatar */}
          <div 
            onClick={() => onNavigate('profile')}
            className="size-9 rounded-full overflow-hidden border border-white/20 bg-neutral-800 flex items-center justify-center cursor-pointer mt-2 transition-transform hover:scale-105"
            title="My Account"
          >
            <User className="size-4.5 text-neutral-300" />
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT PANEL */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 relative",
        viewMode === 'mobile' ? 'h-full' : 'h-screen'
      )}>
        {/* Top Header Toolbar */}
        <div className={cn(
          "flex items-center justify-between border-b border-neutral-200/80 shrink-0 bg-white/40 backdrop-blur-md z-30",
          viewMode === 'mobile' ? 'px-3 pt-9 pb-2.5' : 'px-6 py-4'
        )}>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#0F766E] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
              {viewMode === 'mobile' ? (
                <span className="text-neutral-800 font-extrabold">{activeScreen}</span>
              ) : (
                <>Active Portal: <span className="text-neutral-800 font-extrabold">{activeScreen}</span></>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Elements removed as requested */}
          </div>
        </div>

        {/* Scrollable Children Content Container */}
        <div className={cn(
          "flex-1 overflow-y-auto no-scrollbar",
          viewMode === 'mobile' ? 'p-3' : 'p-6'
        )}>
          {children}
        </div>
      </div>
    </div>
  )
}
