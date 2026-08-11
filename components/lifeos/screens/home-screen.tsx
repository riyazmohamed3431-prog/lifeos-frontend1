'use client'

import { useState } from 'react'
import { emergencies, mechanic, vehicles, nearbyMechanics, type Emergency, type Vehicle } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { BentoCard, BentoGrid, CategoryIconBox, HealthRadialGauge, WarmButton, WarmCard } from '@/components/ui/warm-components'
import {
  MapPin,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  PhoneCall,
  Share2,
  Flashlight,
  Star,
  Clock,
  Car,
  CheckCircle2,
  Navigation,
  Sparkles,
  Wrench,
  BatteryCharging,
  Gauge,
  Phone,
  Crown,
  Award,
  Shield,
  Zap,
  SunMedium,
  FileCheck,
  SlidersHorizontal,
  CreditCard,
  Lock,
  User,
  Settings,
} from 'lucide-react'
import { CallModal } from '@/components/lifeos/call-modal'
import { motion } from 'framer-motion'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui/framer-wrapper'
import { cn } from '@/lib/utils'

export function HomeScreen({
  vehicles: userVehicles,
  onEmergency,
  onSelect,
  onNavigateProfile,
}: {
  vehicles: Vehicle[]
  onEmergency: () => void
  onSelect: (e: Emergency) => void
  onNavigateProfile?: () => void
}) {
  const primaryVehicle = (() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('lifeos_demo_user')
      let emailStr = 'guest'
      if (storedUser) {
        try {
          emailStr = JSON.parse(storedUser).email || 'guest'
        } catch (e) {}
      }
      const primaryId = localStorage.getItem(`lifeos_primary_vehicle_${emailStr}`)
      const found = userVehicles.find((v) => v.id === primaryId)
      return found || userVehicles[0] || vehicles[0]
    }
    return userVehicles[0] || vehicles[0]
  })()
  const [calling, setCalling] = useState(false)
  const [activeSymptom, setActiveSymptom] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'telemetry' | 'responders' | 'rates' | 'garage'>('telemetry')

  const getCategoryColor = (id: string): 'indigo' | 'amber' | 'emerald' | 'coral' | 'rose' | 'purple' => {
    switch (id) {
      case 'tyre': return 'indigo'
      case 'battery': return 'amber'
      case 'engine': return 'emerald'
      case 'fuel': return 'coral'
      case 'accident': return 'rose'
      case 'lockout': return 'purple'
      default: return 'emerald'
    }
  }

  const symptomChips = [
    { label: 'Clicking sound on start', emergencyId: 'battery' },
    { label: 'Tire flat / blowout', emergencyId: 'tyre' },
    { label: 'Smoke under hood', emergencyId: 'overheat' },
    { label: 'Key locked inside', emergencyId: 'lockout' },
    { label: 'Ran out of fuel', emergencyId: 'fuel' },
    { label: 'Engine stalled', emergencyId: 'engine' },
  ]

  const handleSymptomClick = (emId: string, label: string) => {
    setActiveSymptom(label)
    const target = emergencies.find((e) => e.id === emId) || emergencies[0]
    setTimeout(() => {
      onSelect(target)
    }, 350)
  }

  return (
    <div className="w-full space-y-6">
      
      {/* EXECUTIVE GREETING HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Good Morning, <span className="bg-gradient-to-r from-[#F59E0B] to-[#E2833B] bg-clip-text text-transparent font-black">Riyaz</span>
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E9EFFF] text-[#2563EB] border border-[#D5E2FF] shrink-0">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Protected by LifeOS VIP
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1.5 font-semibold">
            Chengalpattu Hub · GST Road NH-45 Highway Corridor
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          {/* Settings button */}
          <button 
            onClick={onNavigateProfile}
            className="bg-white hover:bg-neutral-50 border border-neutral-200 px-4 py-2 rounded-xl text-xs font-bold text-neutral-700 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="size-3.5 text-neutral-500" />
            <span>Settings</span>
          </button>
          {/* Request Rescue button */}
          <button 
            onClick={onEmergency}
            className="bg-[#181922] hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wide shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="size-3.5 text-white animate-pulse" />
            <span>+ Request SOS Rescue</span>
          </button>
        </div>
      </div>

      {/* PILL NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
            activeTab === 'telemetry' 
              ? "bg-[#181922] text-white shadow-sm" 
              : "bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-600 hover:text-neutral-900"
          )}
        >
          Telemetry Summary
        </button>
        <button
          onClick={() => setActiveTab('responders')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
            activeTab === 'responders' 
              ? "bg-[#181922] text-white shadow-sm" 
              : "bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-600 hover:text-neutral-900"
          )}
        >
          Active Fleet Radar
        </button>
        <button
          onClick={() => setActiveTab('rates')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
            activeTab === 'rates' 
              ? "bg-[#181922] text-white shadow-sm" 
              : "bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-600 hover:text-neutral-900"
          )}
        >
          Fixed Rates
        </button>
        <button
          onClick={onNavigateProfile}
          className="bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-600 hover:text-neutral-900 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Garage Management
        </button>
      </div>

      {/* BENTO GRID */}
      <BentoGrid className="gap-5">
        
        {/* TILE 1: Connected Vehicle Telemetry (Blue pastel style) */}
        <BentoCard
          colSpan={8}
          hover={false}
          className="bg-gradient-to-br from-[#EBF1FF] to-[#DCE7FF] border border-[#ADC8FF] rounded-3xl p-6 flex flex-col justify-between shadow-sm min-w-0"
        >
          <div className="flex items-center justify-between gap-2 border-b border-[#C5D7FF]/60 pb-3 min-w-0">
            <div className="flex items-center min-w-0">
              <div className="size-9 rounded-full bg-white flex items-center justify-center text-[#2563EB] shadow-sm shrink-0">
                <Car className="size-4.5" />
              </div>
              <span className="text-xs font-bold text-neutral-800 ml-2.5 truncate">Vehicle Telemetry</span>
            </div>
            <span className="bg-[#181922] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0">
              84% Battery Charge
            </span>
          </div>

          <div className="my-6">
            <div className="flex items-baseline text-[#0F172A] tracking-tight">
              <span className="text-4xl font-black">420</span>
              <span className="text-neutral-500 text-sm font-semibold ml-1">/ 500 km Max Range</span>
            </div>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-1.5">
              {primaryVehicle.name} · {primaryVehicle.plate} · Midnight Silver
            </p>
          </div>

          {/* Segmented Range Indicator */}
          <div className="grid grid-cols-8 gap-2">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-6 rounded-lg transition-all shadow-inner",
                  idx < 6
                    ? "bg-[#A3BEFF]"
                    : "border border-dashed border-[#A3BEFF]/60 bg-transparent"
                )}
              />
            ))}
          </div>
        </BentoCard>

        {/* TILE 2: Safety Rating (Teal/Green pastel style) */}
        <BentoCard
          colSpan={4}
          hover={false}
          className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#BBF7D0] rounded-3xl p-6 flex flex-col justify-between shadow-sm min-w-0"
        >
          <div className="flex items-center justify-between gap-2 border-b border-[#CFEAE3]/60 pb-3 min-w-0">
            <div className="flex items-center min-w-0">
              <div className="size-9 rounded-full bg-white flex items-center justify-center text-[#0D9488] shadow-sm shrink-0">
                <Wrench className="size-4.5" />
              </div>
              <span className="text-xs font-bold text-neutral-800 ml-2.5 truncate">Safety Score</span>
            </div>
            <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0">
              Optimal
            </span>
          </div>

          <div className="flex justify-center my-3 shrink-0">
            <HealthRadialGauge score={98} size={92} strokeWidth={8} label="" />
          </div>

          <span className="inline-flex justify-center items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200 text-neutral-700 text-[11px] font-bold rounded-full mt-2 shadow-sm shrink-0 self-center">
            Top 1% Safe Driver
          </span>
        </BentoCard>

        {/* TILE 3: Climate capsule (Purple pastel style) */}
        <BentoCard
          colSpan={4}
          hover={false}
          className="bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] border border-[#FDE68A] rounded-3xl p-5 space-y-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="size-8.5 rounded-full bg-white flex items-center justify-center text-[#D97706] shadow-sm shrink-0">
              <SunMedium className="size-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#D97706]">Weather</span>
          </div>
          <div>
            <p className="text-base font-extrabold text-neutral-800">29°C Clear Weather</p>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">NH-45 GST Road Traffic Flow Normal</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 shrink-0 self-start mt-2">
            All Patrol Units Ready
          </span>
        </BentoCard>

        {/* TILE 4: Emergency SOS (Callout dark card style) */}
        <BentoCard
          colSpan={8}
          hover={false}
          className="bg-gradient-to-br from-[#1C1618] to-[#140F11] text-white rounded-3xl p-6 flex flex-col justify-between border border-red-500/25 shadow-xl min-w-0"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E11D48]/10 text-[#FB7185] border-[#E11D48]/20 shrink-0">
                Priority Dispatch
              </span>
              <h3 className="text-base font-black text-white">Experiencing a Highway Emergency?</h3>
              <p className="text-xs text-neutral-400">1-tap SOS connects you directly to master mechanics.</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEmergency}
              className="flex flex-col items-center justify-center size-24 rounded-full bg-gradient-to-tr from-[#E11D48] via-[#F97316] to-[#F59E0B] text-white font-black shadow-lg shadow-[#E11D48]/20 transition-all cursor-pointer border-3 border-white/25 shrink-0 self-center"
            >
              <AlertTriangle className="size-6 mb-0.5 text-white" strokeWidth={2.4} />
              <span className="text-[9px] font-black tracking-wider">REQUEST SOS</span>
            </motion.button>
          </div>

          <div className="pt-2 border-t border-white/5 space-y-2 mt-4">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Symptom Quick-Triage:</p>
            <div className="flex flex-wrap gap-1.5">
              {symptomChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSymptomClick(chip.emergencyId, chip.label)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer border",
                    activeSymptom === chip.label
                      ? "bg-[#E11D48] text-white border-[#E11D48] shadow-sm"
                      : "bg-[#2A2B36] hover:bg-neutral-800 text-neutral-300 hover:text-white border-white/5"
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* TILE 5: Fixed Rates Services (White card layout) */}
        <BentoCard
          colSpan={12}
          hover={false}
          className="bg-gradient-to-br from-[#F0FDFA] to-[#CCFBF1] border border-[#99F6E4] rounded-3xl p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500">Fixed Rate Roadside Services</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Cashless digital receipt payments with upfront quotes</p>
            </div>
            <WarmButton variant="ghost" size="sm" onClick={onEmergency} className="text-xs border-neutral-200 hover:bg-neutral-50">
              View All ({emergencies.length}) <ChevronRight className="size-3.5" />
            </WarmButton>
          </div>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {emergencies.slice(0, 4).map((e) => {
              const color = getCategoryColor(e.id)
              const Icon = e.icon
              return (
                <StaggerItem key={e.id}>
                  <WarmCard
                    onClick={() => onSelect(e)}
                    className="bg-[#F4F6F5] hover:bg-[#EAECEB] border border-neutral-200/40 flex flex-col justify-between min-h-[135px] sm:min-h-[140px] p-4 rounded-2xl group min-w-0 transition-colors shadow-sm cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
                      <CategoryIconBox icon={Icon} color={color} className="shrink-0 size-9 sm:size-10 bg-white" />
                      <span className="text-[11px] font-mono font-bold bg-[#181922] text-white px-2.5 py-0.5 rounded-full shadow-sm shrink-0">
                        ₹{e.fee}
                      </span>
                    </div>
                    <div className="min-w-0 mt-3">
                      <h4 className="text-xs font-black text-neutral-800 group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">{e.label}</h4>
                      <p className="text-[9px] text-neutral-500 truncate mt-0.5">{e.sub}</p>
                    </div>
                  </WarmCard>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </BentoCard>
      </ BentoGrid>

      {/* Live Calling Modal */}
      <CallModal
        isOpen={calling}
        onClose={() => setCalling(false)}
        mechanicName={mechanic.name}
        mechanicPhone={mechanic.phone}
      />
    </div>
  )
}
