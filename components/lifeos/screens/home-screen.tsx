'use client'

import { useState } from 'react'
import { emergencies, mechanic, vehicles, nearbyMechanics, history, type Emergency } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { BentoCard, BentoGrid, CategoryIconBox, HealthRadialGauge, WarmBadge, WarmButton, WarmCard, WarmProgress } from '@/components/ui/warm-components'
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
} from 'lucide-react'
import { CallModal } from '@/components/lifeos/call-modal'
import { motion } from 'framer-motion'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui/framer-wrapper'

export function HomeScreen({
  onEmergency,
  onSelect,
  onNavigateProfile,
}: {
  onEmergency: () => void
  onSelect: (e: Emergency) => void
  onNavigateProfile?: () => void
}) {
  const primaryVehicle = vehicles[0]
  const [calling, setCalling] = useState(false)
  const [flashlightOn, setFlashlightOn] = useState(false)
  const [shared, setShared] = useState(false)
  const [activeSymptom, setActiveSymptom] = useState<string | null>(null)

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

  const handleShareGps = () => {
    setShared(true)
    setTimeout(() => setShared(false), 2500)
  }

  return (
    <div className="relative h-full overflow-y-auto no-scrollbar pb-32 font-sans text-[#0F172A] dark:text-[#F8FAFC]">
      <AmbientBg tone="primary" />

      <div className="relative z-10 px-4 sm:px-6 pt-3 space-y-6 max-w-5xl mx-auto">
        
        {/* EXECUTIVE GREETING HEADER */}
        <FadeIn delay={0.05} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-white/10 pb-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                Good Morning, <span className="text-[#0F766E]">Riyaz</span>
              </h1>
              <WarmBadge variant="emerald" className="shrink-0">
                <span className="size-1.5 rounded-full bg-[#0F766E] animate-pulse" />
                Protected by LifeOS
              </WarmBadge>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 font-medium break-words">
              Autonomous Roadside Command Center · GST Road NH-45 Highway Corridor
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <div className="bg-white/80 dark:bg-[#18181B]/80 backdrop-blur-md flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
              <Navigation className="size-3.5 text-[#4338CA] animate-pulse" />
              <span>Chengalpattu Hub</span>
            </div>
          </div>
        </FadeIn>

        {/* BENTO GRID LAYOUT SYSTEM */}
        <BentoGrid>
          
          {/* BENTO TILE 1: Large Deep Emerald Hero Card (colSpan 8) */}
          <BentoCard colSpan={8} variant="emerald" className="p-5 sm:p-7 space-y-5 shadow-xl min-w-0">
            <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-4 min-w-0">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/70 block truncate">Connected Vehicle Telemetry</span>
                <h2 className="text-xl font-black text-white truncate">{primaryVehicle.name}</h2>
                <p className="text-xs text-white/80 font-mono mt-0.5 truncate">{primaryVehicle.plate} · Midnight Silver</p>
              </div>
              <WarmBadge variant="amber" className="bg-white/20 text-white border-white/30 shrink-0">
                84% Battery Charge
              </WarmBadge>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-white">
              <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3 border border-white/15 backdrop-blur-md text-center min-w-0">
                <p className="text-[9px] sm:text-[10px] font-bold uppercase text-white/70 truncate">Max Range</p>
                <p className="text-sm sm:text-base font-black mt-0.5 truncate">420 km</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3 border border-white/15 backdrop-blur-md text-center min-w-0">
                <p className="text-[9px] sm:text-[10px] font-bold uppercase text-white/70 truncate">Tyre Pressure</p>
                <p className="text-sm sm:text-base font-black mt-0.5 truncate">36 PSI</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3 border border-white/15 backdrop-blur-md text-center min-w-0">
                <p className="text-[9px] sm:text-[10px] font-bold uppercase text-white/70 truncate">Fastest Rescue</p>
                <p className="text-sm sm:text-base font-black mt-0.5 text-[#F59E0B] truncate">~8 Mins</p>
              </div>
            </div>
          </BentoCard>

          {/* BENTO TILE 2: Safety Radial Gauge Tile (colSpan 4) */}
          <BentoCard colSpan={4} variant="white" className="p-5 flex flex-col items-center justify-center text-center border border-[#E2E8F0]">
            <HealthRadialGauge score={98} size={115} strokeWidth={9} label="Vehicle Health Score" />
            <WarmBadge variant="green" className="mt-3">Top 1% Safe Driver</WarmBadge>
          </BentoCard>

          {/* BENTO TILE 3: Climate & Location Capsule (colSpan 4) */}
          <BentoCard colSpan={4} variant="indigo" className="p-5 space-y-3 border border-[#4338CA]/25">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#4338CA]">Highway Corridor</span>
              <SunMedium className="size-4 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-base font-black text-[#0F172A] dark:text-[#F8FAFC]">29°C Clear Weather</p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-medium mt-0.5">NH-45 GST Road Traffic Flow Normal</p>
            </div>
            <WarmBadge variant="indigo">All Patrol Units Ready</WarmBadge>
          </BentoCard>

          {/* BENTO TILE 4: Quick Emergency Actions & SOS Trigger (colSpan 8) */}
          <BentoCard colSpan={8} variant="rose" className="p-6 space-y-5 border border-[#E11D48]/30 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <WarmBadge variant="rose">Priority Dispatch</WarmBadge>
                <h3 className="text-lg font-black text-[#0F172A] dark:text-[#F8FAFC]">Experiencing a Highway Emergency?</h3>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8]">1-tap dispatch sends certified rescue squads with live GPS telemetry.</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={onEmergency}
                className="flex flex-col items-center justify-center size-28 rounded-full bg-gradient-to-tr from-[#E11D48] via-[#F97316] to-[#F59E0B] text-white font-black shadow-xl shadow-[#E11D48]/30 transition-all cursor-pointer border-3 border-white/20 shrink-0 self-center"
              >
                <AlertTriangle className="size-7 mb-0.5" strokeWidth={2.4} />
                <span className="text-xs font-black tracking-wider">REQUEST SOS</span>
              </motion.button>
            </div>

            {/* Quick Symptom Chips Carousel */}
            <div className="pt-2 border-t border-[#E11D48]/20 space-y-2">
              <p className="text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] uppercase">Quick Symptom Triage:</p>
              <div className="flex flex-wrap gap-2">
                {symptomChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSymptomClick(chip.emergencyId, chip.label)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                      activeSymptom === chip.label
                        ? 'bg-[#E11D48] text-white border-[#E11D48] shadow-sm'
                        : 'bg-white dark:bg-[#18181B] text-[#475569] dark:text-[#94A3B8] hover:text-foreground border-[#E2E8F0]'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* BENTO TILE 5: Services Grid (colSpan 12) */}
          <BentoCard colSpan={12} variant="white" className="p-4 sm:p-6 space-y-4 border border-[#E2E8F0]">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0F766E] truncate">Roadside Services & Fixed Rates</h3>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] truncate">Certified responders on stand-by with 24/7 coverage</p>
              </div>
              <WarmButton variant="ghost" size="sm" onClick={onEmergency} className="shrink-0">
                View All ({emergencies.length}) <ChevronRight className="size-3.5" />
              </WarmButton>
            </div>

            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {emergencies.slice(0, 4).map((e) => {
                const color = getCategoryColor(e.id)
                const Icon = e.icon
                return (
                  <StaggerItem key={e.id}>
                    <WarmCard
                      onClick={() => onSelect(e)}
                      className="hover:border-[#0F766E]/40 flex flex-col justify-between min-h-[135px] sm:min-h-[140px] p-3 sm:p-4 border border-[#E2E8F0] group min-w-0 overflow-hidden"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
                        <CategoryIconBox icon={Icon} color={color} className="shrink-0 size-9 sm:size-11" />
                        <span className="text-[10px] font-mono font-bold text-[#0F766E] bg-[#0F766E]/10 dark:bg-[#0F766E]/20 px-2 py-0.5 rounded-full border border-[#0F766E]/20 shrink-0">
                          ₹{e.fee}
                        </span>
                      </div>
                      <div className="min-w-0 mt-2">
                        <h4 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#0F766E] transition-colors line-clamp-2 leading-snug">{e.label}</h4>
                        <p className="text-[10px] text-[#475569] dark:text-[#94A3B8] truncate mt-0.5">{e.sub}</p>
                      </div>
                    </WarmCard>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </BentoCard>

          {/* BENTO TILE 6: Profile Options Dashboard Quick Grid (colSpan 6) */}
          <BentoCard colSpan={6} variant="purple" className="p-4 sm:p-5 space-y-4 border border-[#8B5CF6]/30 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#8B5CF6] truncate">Dashboard Profile Options</h3>
              <WarmBadge variant="purple" className="shrink-0">Executive VIP</WarmBadge>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onNavigateProfile}
                className="p-3 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E2E8F0] dark:border-white/10 flex flex-col items-start gap-1 cursor-pointer transition-all hover:scale-[1.02] text-left"
              >
                <CategoryIconBox icon={Car} color="blue" className="size-8" />
                <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">My Garage</p>
                <p className="text-[10px] text-[#475569] dark:text-[#94A3B8]">3 Registered Vehicles</p>
              </button>

              <button
                onClick={onNavigateProfile}
                className="p-3 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E2E8F0] dark:border-white/10 flex flex-col items-start gap-1 cursor-pointer transition-all hover:scale-[1.02] text-left"
              >
                <CategoryIconBox icon={CreditCard} color="emerald" className="size-8" />
                <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">Payments</p>
                <p className="text-[10px] text-[#475569] dark:text-[#94A3B8]">HDFC Visa & UPI</p>
              </button>

              <button
                onClick={onNavigateProfile}
                className="p-3 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E2E8F0] dark:border-white/10 flex flex-col items-start gap-1 cursor-pointer transition-all hover:scale-[1.02] text-left"
              >
                <CategoryIconBox icon={Phone} color="coral" className="size-8" />
                <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">SOS Contacts</p>
                <p className="text-[10px] text-[#475569] dark:text-[#94A3B8]">2 Verified Receivers</p>
              </button>

              <button
                onClick={onNavigateProfile}
                className="p-3 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E2E8F0] dark:border-white/10 flex flex-col items-start gap-1 cursor-pointer transition-all hover:scale-[1.02] text-left"
              >
                <CategoryIconBox icon={Lock} color="purple" className="size-8" />
                <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">Security</p>
                <p className="text-[10px] text-[#475569] dark:text-[#94A3B8]">256-Bit SSL Telemetry</p>
              </button>
            </div>
          </BentoCard>

          {/* BENTO TILE 7: Nearby Rescue Squads (colSpan 6) */}
          <BentoCard colSpan={6} variant="white" className="p-4 sm:p-5 space-y-4 border border-[#E2E8F0] min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0F766E] truncate">Active Certified Rescue Fleet</h3>
              <WarmBadge variant="emerald" className="shrink-0">4 Responders</WarmBadge>
            </div>

            <div className="space-y-3">
              {nearbyMechanics.slice(0, 2).map((m) => (
                <div key={m.tag} className="p-3 rounded-2xl bg-[#F1F5F9] dark:bg-[#27272A] border border-[#E2E8F0] dark:border-white/10 space-y-2 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <CategoryIconBox icon={ShieldCheck} color="emerald" className="shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">{m.name}</h4>
                        <p className="text-[10px] text-[#475569] dark:text-[#94A3B8] truncate w-full">{m.spec}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-[#F59E0B] text-xs font-bold justify-end">
                        <Star className="size-3.5 fill-[#F59E0B] stroke-[#F59E0B]" />
                        <span>{m.rating}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#0F766E] block">{m.eta} ETA</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

        </BentoGrid>

      </div>

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
