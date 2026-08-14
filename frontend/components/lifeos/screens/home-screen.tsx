'use client'

import { useState, useEffect } from 'react'
import { emergencies, mechanic, vehicles as defaultVehicles, type Emergency, type Vehicle } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import {
  Car,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Clock,
  Navigation,
  Wrench,
  BatteryCharging,
  Gauge,
  Zap,
  MoreVertical,
  Activity,
  Award,
  CreditCard,
  Check,
  ChevronRight as ArrowIcon,
  Shield,
  Users,
  Zap as FlashIcon,
  MapPin,
  Star,
  RotateCcw,
} from 'lucide-react'
import { CallModal } from '@/components/lifeos/call-modal'
import { motion } from 'framer-motion'
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
  const [primaryVehicle, setPrimaryVehicle] = useState<Vehicle>(userVehicles[0] || defaultVehicles[0])
  const [calling, setCalling] = useState(false)

  useEffect(() => {
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
      if (found) {
        setPrimaryVehicle(found)
      } else if (userVehicles[0]) {
        setPrimaryVehicle(userVehicles[0])
      }
    }
  }, [userVehicles])

  const popularServices = [
    {
      id: 'tyre',
      label: 'Flat Tyre',
      sub: 'Puncture / Blowout',
      fee: 750,
      image: '/images/issues/flat-tyre.png',
      emergency: emergencies.find((e) => e.id === 'tyre') || emergencies[0],
    },
    {
      id: 'battery',
      label: 'Battery Dead',
      sub: 'Jump start / Replace',
      fee: 950,
      image: '/images/issues/battery-dead.png',
      emergency: emergencies.find((e) => e.id === 'battery') || emergencies[1],
    },
    {
      id: 'engine',
      label: 'Engine Failure',
      sub: "Won't start / Stalling",
      fee: 1450,
      image: '/images/issues/engine-failure.png',
      emergency: emergencies.find((e) => e.id === 'engine') || emergencies[2],
    },
    {
      id: 'fuel',
      label: 'Out of Fuel',
      sub: 'Fuel delivery',
      fee: 650,
      image: '/images/issues/out-of-fuel.png',
      emergency: emergencies.find((e) => e.id === 'fuel') || emergencies[3],
    },
  ]

  return (
    <div className="relative flex h-full flex-col overflow-y-auto no-scrollbar px-4 sm:px-8 pt-4 pb-28 font-sans text-foreground select-none w-full space-y-6">
      <AmbientBg tone="calm" />

      {/* 1. TOP HERO BANNER & MY VEHICLE CARD */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
        
        {/* HERO BANNER WITH INTEGRATED LANDSCAPE IMAGE (7 COLS ON LG) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden min-h-[220px]">
          {/* Background Landscape Image */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src="/images/squad/standard-rescue-suv.jpg"
              alt="Automotive Hero"
              className="w-full h-full object-cover object-center opacity-25 dark:opacity-20 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#151C2C] dark:via-[#151C2C]/80 dark:to-transparent" />
          </div>

          {/* Floating Status Badge Top-Right */}
          <div className="absolute top-5 right-5 z-20 bg-white/90 dark:bg-[#1C2436]/90 backdrop-blur-md border border-neutral-200/90 dark:border-white/10 rounded-2xl px-3.5 py-2 flex items-center gap-2.5 shadow-sm">
            <div className="size-6 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-black text-neutral-800 dark:text-neutral-100 leading-none">
                All Systems Normal
              </h4>
              <p className="text-[9px] font-medium text-neutral-400 mt-0.5 leading-none">
                No active alerts
              </p>
            </div>
          </div>

          {/* Hero Content Left */}
          <div className="relative z-10 space-y-2 max-w-sm pt-1">
            <h3 className="text-base font-bold text-neutral-500 dark:text-neutral-400">
              Hello,
            </h3>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              Mohamed Riyaz 👋
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed pt-1">
              All systems are good. Your vehicle is safe and your journey is our priority.
            </p>
          </div>
        </div>

        {/* MY VEHICLE CARD (5 COLS ON LG) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-2.5">
            <h3 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">
              My Vehicle
            </h3>
            <button
              onClick={onNavigateProfile}
              className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
            >
              <MoreVertical className="size-4" />
            </button>
          </div>

          {/* Vehicle Info */}
          <div className="flex items-center gap-4">
            <div className="size-16 sm:size-20 rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 shrink-0 p-1 flex items-center justify-center shadow-2xs">
              <img
                src={primaryVehicle.image || primaryVehicle.photoUrl || '/images/squad/standard-rescue-suv.jpg'}
                alt={primaryVehicle.name}
                className="max-h-full max-w-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                  {primaryVehicle.name || 'Tata Nexon EV'}
                </h4>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200/50">
                  EV
                </span>
              </div>
              <p className="text-xs font-mono font-bold text-neutral-400 truncate">
                {primaryVehicle.plate || 'TN 01 AK 1118'}
              </p>
            </div>
          </div>

          {/* Battery Charge Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-neutral-500 font-medium">Battery Charge</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-neutral-800 dark:text-neutral-100">84 %</span>
                <span className="text-[11px] font-mono text-neutral-400 font-normal">268 km</span>
              </div>
            </div>

            <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-emerald-500 rounded-full w-[84%]" />
            </div>

            <div className="flex items-center justify-between text-[10px] text-neutral-400 font-medium pt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="size-3" /> Last Updated: 2 min ago
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THREE MIDDLE DASHBOARD CARDS */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch w-full">
        
        {/* CARD 1 — SAFETY SCORE (MINT GREEN) */}
        <div className="md:col-span-4 bg-[#F0FDF4] dark:bg-emerald-950/30 rounded-3xl border border-emerald-200/80 dark:border-emerald-800/40 p-5 flex flex-col justify-between space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-emerald-200/50 dark:border-emerald-800/30 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="size-3.5" />
              </div>
              <h3 className="text-xs font-black text-emerald-950 dark:text-emerald-200 uppercase tracking-wider">
                Safety Score
              </h3>
            </div>
            <button className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200/80 hover:bg-emerald-50 shadow-2xs transition-colors cursor-pointer">
              View Details
            </button>
          </div>

          <div className="space-y-1 my-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-950 dark:text-emerald-100 font-mono tracking-tight flex items-baseline gap-1">
              98 <span className="text-base text-neutral-400 font-medium">/100</span>
            </div>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Star className="size-3 fill-emerald-600 text-emerald-600" /> Excellent
            </p>

            <div className="h-2 w-full bg-emerald-200/60 dark:bg-emerald-950 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-emerald-500 rounded-full w-[98%]" />
            </div>
          </div>

          {/* Metrics */}
          <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-800/30 space-y-2">
            <div className="grid grid-cols-4 gap-1 text-center text-[10px] text-emerald-900 dark:text-emerald-200 font-medium">
              <div>
                <span className="text-neutral-400 block text-[9px]">Braking</span>
                <strong className="font-mono text-emerald-700 dark:text-emerald-300 font-bold text-xs">97</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px]">Acceleration</span>
                <strong className="font-mono text-emerald-700 dark:text-emerald-300 font-bold text-xs">95</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px]">Speeding</span>
                <strong className="font-mono text-emerald-700 dark:text-emerald-300 font-bold text-xs">100</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px]">Distractions</span>
                <strong className="font-mono text-emerald-700 dark:text-emerald-300 font-bold text-xs">98</strong>
              </div>
            </div>

            <div className="pt-1 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold rounded-full border border-emerald-200/60 shadow-2xs">
                🏆 Top 1% Safe Driver
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2 — NEED ROADSIDE ASSISTANCE? (WARM PEACH) */}
        <div className="md:col-span-4 bg-[#FFFBEB] dark:bg-amber-950/30 rounded-3xl border border-amber-200/80 dark:border-amber-800/40 p-5 flex flex-col justify-between space-y-4 shadow-2xs relative overflow-hidden">
          <div className="border-b border-amber-200/50 dark:border-amber-800/30 pb-2.5">
            <h3 className="text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider">
              Need Roadside Assistance?
            </h3>
          </div>

          <div className="flex items-center justify-center my-1">
            <div className="h-24 w-full rounded-2xl overflow-hidden bg-amber-100/50 dark:bg-amber-950/50 flex items-center justify-center p-2">
              <img
                src="/images/squad/standard-rescue-suv.jpg"
                alt="Roadside Tow Truck"
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            </div>
          </div>

          <p className="text-[11px] text-amber-900 dark:text-amber-300 font-medium leading-tight">
            Get instant help for any roadside emergency in just a tap.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEmergency}
            className="w-full py-3 rounded-2xl bg-[#FF4D00] hover:bg-[#E04400] text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Request SOS</span>
            <AlertTriangle className="size-3.5 fill-white text-[#FF4D00]" />
          </motion.button>
        </div>

        {/* CARD 3 — LIVE VEHICLE HEALTH (PALE BLUE) */}
        <div className="md:col-span-4 bg-[#F0F9FF] dark:bg-blue-950/30 rounded-3xl border border-blue-200/80 dark:border-blue-800/40 p-5 flex flex-col justify-between space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-blue-200/50 dark:border-blue-800/30 pb-2.5">
            <h3 className="text-xs font-black text-blue-950 dark:text-blue-200 uppercase tracking-wider">
              Live Vehicle Health
            </h3>
            <button className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white text-blue-700 border border-blue-200/80 hover:bg-blue-50 shadow-2xs transition-colors cursor-pointer">
              View All
            </button>
          </div>

          <div className="grid grid-cols-12 gap-3 items-center my-1">
            {/* Top-Down Car Outline Graphic */}
            <div className="col-span-5 flex items-center justify-center">
              <div className="relative size-20 rounded-2xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-950/60 flex items-center justify-center shadow-2xs">
                <Car className="size-10 text-blue-500" />
                <div className="absolute top-2 left-2 size-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="absolute top-2 right-2 size-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="absolute bottom-2 left-2 size-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="absolute bottom-2 right-2 size-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* Diagnostics List */}
            <div className="col-span-7 space-y-1.5 text-[11px] text-blue-950 dark:text-blue-200 font-medium">
              {[
                { label: 'Battery', status: 'Good' },
                { label: 'Motor', status: 'Good' },
                { label: 'Tyres', status: 'Good' },
                { label: 'Brakes', status: 'Good' },
                { label: 'Systems', status: 'Normal' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-neutral-500">{item.label}</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    {item.status} <Check className="size-3 text-emerald-600 stroke-[3]" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. POPULAR SERVICES */}
      <div className="relative z-10 bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4 w-full">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-2.5">
          <div>
            <h3 className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
              Popular Services
            </h3>
            <p className="text-[11px] text-neutral-400 font-medium">
              We've got you covered
            </p>
          </div>
          <button
            onClick={onEmergency}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            View All Services <ChevronRight className="size-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {popularServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelect(service.emergency)}
              className="bg-neutral-50/70 dark:bg-white/5 hover:bg-neutral-100/80 dark:hover:bg-white/10 p-4 rounded-2xl border border-neutral-200/70 dark:border-white/5 transition-all cursor-pointer space-y-3 group shadow-2xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-12 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                  <img
                    src={service.image}
                    alt={service.label}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h4 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                    {service.label}
                  </h4>
                  <p className="text-[10px] text-neutral-400 truncate">
                    {service.sub}
                  </p>
                  <p className="text-xs font-mono font-black text-emerald-600">
                    ₹{service.fee}
                  </p>
                </div>
              </div>

              <div className="size-7 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-emerald-600 group-hover:border-emerald-300 transition-colors shrink-0">
                <ChevronRight className="size-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. TRUST / BENEFIT FOOTER STRIP (5 ITEMS) */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
        {[
          { title: "You're in Safe Hands", desc: 'Trusted by thousands of drivers. We ensure your safety, always.', icon: Shield },
          { title: 'Certified Experts', desc: 'Background verified professionals', icon: Users },
          { title: 'Quick Response', desc: 'Avg. response time under 15 mins', icon: FlashIcon },
          { title: 'Cashless Payments', desc: 'Secure & hassle-free transactions', icon: CreditCard },
          { title: 'Live Tracking', desc: 'Track your squad in real-time', icon: MapPin },
        ].map((item, idx) => {
          const ItemIcon = item.icon
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#151C2C] p-4 rounded-2xl border border-neutral-200/80 dark:border-white/10 space-y-1 text-center flex flex-col items-center justify-center shadow-2xs"
            >
              <div className="size-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shadow-2xs mb-1">
                <ItemIcon className="size-4" />
              </div>
              <h4 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">
                {item.title}
              </h4>
              <p className="text-[10px] font-medium text-neutral-400 leading-tight">
                {item.desc}
              </p>
            </div>
          )
        })}
      </div>

      {/* CALL MODAL */}
      <CallModal
        isOpen={calling}
        onClose={() => setCalling(false)}
        mechanicName={mechanic.name}
        mechanicPhone={mechanic.phone}
      />
    </div>
  )
}
