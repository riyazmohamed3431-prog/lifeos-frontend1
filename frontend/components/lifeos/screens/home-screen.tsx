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
  Wrench,
  BatteryCharging,
  Gauge,
  Zap,
  MoreVertical,
  Activity,
  Award,
  CreditCard,
  Check,
  Shield,
  Users,
  Zap as FlashIcon,
  MapPin,
  Star,
  Cpu,
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
        
        {/* HERO BANNER WITH INTEGRATED RESCUE SUV IMAGE (7 COLS ON LG) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden min-h-[260px]">
          
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

          {/* Background Landscape & Rescue SUV Image */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-end">
            <img
              src="/images/squad/standard-rescue-suv.jpg"
              alt="Roadside Rescue SUV"
              className="h-full w-3/5 object-cover object-center opacity-30 dark:opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent dark:from-[#151C2C] dark:via-[#151C2C]/85 dark:to-transparent" />
          </div>

          {/* Hero Content Left */}
          <div className="relative z-10 space-y-2 max-w-xs sm:max-w-sm pt-1">
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

          {/* Bottom Hero Status Pills */}
          <div className="relative z-10 flex flex-wrap items-center gap-2 pt-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 flex items-center gap-1.5 shadow-2xs">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Roadside Ready
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 shadow-2xs">
              All Systems Good
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200/60 shadow-2xs">
              No Active Alerts
            </span>
          </div>
        </div>

        {/* MY VEHICLE CARD (5 COLS ON LG) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-2.5">
            <div className="flex items-center gap-2">
              <Car className="size-4 text-blue-600 shrink-0" />
              <h3 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">
                MY VEHICLE
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/50">
                EV
              </span>
              <button
                onClick={onNavigateProfile}
                className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
              >
                <MoreVertical className="size-4" />
              </button>
            </div>
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
              <h4 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                {primaryVehicle.name || 'Tata Nexon EV'}
              </h4>
              <p className="text-xs font-mono font-bold text-neutral-400 truncate">
                {primaryVehicle.plate || 'TN 01 AK 1118'}
              </p>
              <p className="text-[10px] text-neutral-400 font-medium">
                Color: {primaryVehicle.color || 'Glacier White'}
              </p>
            </div>
          </div>

          {/* Battery Charge Progress Bar */}
          <div className="space-y-1.5 pt-1 border-t border-neutral-100 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-neutral-500 font-medium">Battery Charge</span>
              <span className="font-mono font-black text-neutral-800 dark:text-neutral-100">84%</span>
            </div>

            <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-emerald-500 rounded-full w-[84%]" />
            </div>

            <div className="flex items-center justify-between text-[10px] text-neutral-400 font-medium pt-0.5">
              <span>Remaining Range: <strong className="text-neutral-800 dark:text-neutral-100 font-mono font-bold">268 km</strong></span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="size-3" /> Last Updated: 2 min ago
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THREE MIDDLE DASHBOARD CARDS */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch w-full">
        
        {/* CARD 1 — SAFETY SCORE (PALE GREEN) */}
        <div className="md:col-span-4 bg-[#F0FDF4] dark:bg-emerald-950/30 rounded-3xl border border-emerald-200/80 dark:border-emerald-800/40 p-5 flex flex-col justify-between space-y-4 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-emerald-200/50 dark:border-emerald-800/30 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="size-3.5" />
              </div>
              <h3 className="text-xs font-black text-emerald-950 dark:text-emerald-200 uppercase tracking-wider">
                SAFETY SCORE
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

        {/* CARD 2 — NEED ROADSIDE ASSISTANCE? (PALE WARM CREAM/ORANGE) */}
        <div className="md:col-span-4 bg-[#FFFBEB] dark:bg-amber-950/30 rounded-3xl border border-amber-200/80 dark:border-amber-800/40 p-5 flex flex-col justify-between space-y-4 shadow-2xs relative overflow-hidden text-center">
          <div className="flex items-center justify-between border-b border-amber-200/50 dark:border-amber-800/30 pb-2.5 text-left">
            <h3 className="text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider">
              NEED ROADSIDE ASSISTANCE?
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-200/60 text-amber-900 border border-amber-300/50">
              Fast Response
            </span>
          </div>

          {/* Central Round Glowing SOS Button */}
          <div className="flex flex-col items-center justify-center my-1">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={onEmergency}
              className="relative flex flex-col items-center justify-center size-20 rounded-full bg-gradient-to-tr from-[#FF4D00] via-[#E11D48] to-[#F59E0B] text-white font-black shadow-lg shadow-orange-500/30 border-4 border-white dark:border-amber-900 cursor-pointer group"
            >
              <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping pointer-events-none" />
              <AlertTriangle className="size-5 text-white mb-0.5 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-black tracking-widest text-white">SOS</span>
            </motion.button>
          </div>

          <p className="text-[11px] text-amber-900 dark:text-amber-300 font-medium leading-tight text-center">
            Get instant help for any roadside emergency in just a tap.
          </p>

          {/* Three Bottom Statistics */}
          <div className="pt-2 border-t border-amber-200/50 dark:border-amber-800/30 grid grid-cols-3 gap-1 text-center text-[10px] text-amber-950 dark:text-amber-200">
            <div>
              <strong className="font-mono text-amber-900 dark:text-amber-100 font-extrabold block text-xs">10,000+</strong>
              <span className="text-[9px] text-amber-800/70 dark:text-amber-300/70">Drivers Helped</span>
            </div>
            <div>
              <strong className="font-mono text-amber-900 dark:text-amber-100 font-extrabold block text-xs">4.8 ★</strong>
              <span className="text-[9px] text-amber-800/70 dark:text-amber-300/70">Avg Rating</span>
            </div>
            <div>
              <strong className="font-mono text-amber-900 dark:text-amber-100 font-extrabold block text-xs">15 mins</strong>
              <span className="text-[9px] text-amber-800/70 dark:text-amber-300/70">Avg Response</span>
            </div>
          </div>
        </div>

        {/* CARD 3 — LIVE VEHICLE HEALTH (PALE BLUE) */}
        <div className="md:col-span-4 bg-[#F0F9FF] dark:bg-blue-950/30 rounded-3xl border border-blue-200/80 dark:border-blue-800/40 p-5 flex flex-col justify-between space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-blue-200/50 dark:border-blue-800/30 pb-2.5">
            <div className="flex items-center gap-2">
              <Cpu className="size-4 text-blue-600 shrink-0" />
              <h3 className="text-xs font-black text-blue-950 dark:text-blue-200 uppercase tracking-wider">
                LIVE VEHICLE HEALTH
              </h3>
            </div>
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

            {/* Diagnostics Checklist Rows */}
            <div className="col-span-7 space-y-1.5 text-[11px] text-blue-950 dark:text-blue-200 font-medium">
              {[
                { label: 'Battery', status: 'Good' },
                { label: 'Motor', status: 'Good' },
                { label: 'Tyres', status: 'Good' },
                { label: 'Brakes', status: 'Good' },
                { label: 'Systems', status: 'Normal' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-white/70 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/40">
                  <span className="text-neutral-600 dark:text-neutral-300">{item.label}</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    {item.status} <Check className="size-3 text-emerald-600 stroke-[3]" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-blue-200/50 dark:border-blue-800/30 flex items-center justify-between text-[10px] text-blue-800 dark:text-blue-300 font-medium">
            <span>Diagnostics updated 2 min ago</span>
          </div>
        </div>
      </div>

      {/* 3. POPULAR SERVICES */}
      <div className="relative z-10 bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4 w-full">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-2.5">
          <div>
            <h3 className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
              POPULAR SERVICES
            </h3>
            <p className="text-[11px] text-neutral-400 font-medium">
              We've got you covered
            </p>
          </div>
          <button
            onClick={onEmergency}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            View All Services &gt;
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
