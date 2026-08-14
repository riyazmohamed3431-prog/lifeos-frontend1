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
  ArrowRight,
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
      icon: Wrench,
      emergency: emergencies.find((e) => e.id === 'tyre') || emergencies[0],
    },
    {
      id: 'battery',
      label: 'Battery Dead',
      sub: 'Jump start / Replace',
      fee: 950,
      icon: Zap,
      emergency: emergencies.find((e) => e.id === 'battery') || emergencies[1],
    },
    {
      id: 'engine',
      label: 'Engine Failure',
      sub: "Won't start / Stalling",
      fee: 1450,
      icon: Activity,
      emergency: emergencies.find((e) => e.id === 'engine') || emergencies[2],
    },
    {
      id: 'fuel',
      label: 'Out of Fuel',
      sub: 'Fuel delivery',
      fee: 650,
      icon: Gauge,
      emergency: emergencies.find((e) => e.id === 'fuel') || emergencies[3],
    },
  ]

  return (
    <div className="relative flex h-full flex-col overflow-y-auto no-scrollbar px-4 sm:px-8 pt-6 pb-28 font-sans text-foreground select-none w-full space-y-6">
      <AmbientBg tone="calm" />

      {/* 1. COMPACT HERO SECTION WITH "Hello," GREETING & MY VEHICLE CARD */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
        {/* HERO LEFT GREETING (7 COLS ON LG) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="space-y-3 z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Protected
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-500 dark:text-neutral-400">
                Hello,
              </h2>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                Mohamed Riyaz 👋
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-medium max-w-md leading-relaxed">
              All systems are good. Your vehicle is safe and your journey is our priority.
            </p>
          </div>

          {/* SYSTEM STATUS MINI CARD */}
          <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/50 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs z-10 max-w-sm">
            <div className="size-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-sm shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-950 dark:text-emerald-200">
                All Systems Normal
              </h4>
              <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                No active alerts · Live highway telemetry active
              </p>
            </div>
          </div>
        </div>

        {/* HERO RIGHT: MY VEHICLE CARD (5 COLS ON LG) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between space-y-5 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Car className="size-4.5 text-indigo-600 shrink-0" />
              <h3 className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                MY VEHICLE
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/50">
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

          {/* Vehicle Info Row */}
          <div className="flex items-center gap-4">
            {/* Dynamic Vehicle Image */}
            <div className="size-20 rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 shrink-0 p-1 flex items-center justify-center shadow-sm">
              <img
                src={primaryVehicle.image || primaryVehicle.photoUrl || '/images/squad/standard-rescue-suv.jpg'}
                alt={primaryVehicle.name}
                className="max-h-full max-w-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <h4 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                {primaryVehicle.name || 'Tata Nexon EV'}
              </h4>
              <p className="text-xs font-mono font-bold text-neutral-500 truncate">
                {primaryVehicle.plate || 'TN 01 AK 1118'}
              </p>
              <p className="text-[10px] text-neutral-400 font-medium">
                Color: {primaryVehicle.color || 'Glacier White'}
              </p>
            </div>
          </div>

          {/* EV Battery Charge Progress Bar & Range */}
          <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span className="text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                <BatteryCharging className="size-4 text-emerald-600" />
                Battery Charge
              </span>
              <span className="font-mono text-emerald-600">84%</span>
            </div>

            <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-neutral-200/60 dark:border-white/5">
              <div className="h-full bg-emerald-500 rounded-full w-[84%] transition-all duration-500" />
            </div>

            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-400 pt-1">
              <span>Remaining Range: <strong className="text-neutral-800 dark:text-neutral-100 font-mono font-bold">268 km</strong></span>
              <span className="font-mono text-[10px]">Last Updated: 2 min ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THREE MAIN DASHBOARD CARDS ROW (COMPACT COMPOSITION) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch w-full">
        
        {/* CARD 1 — SAFETY SCORE (PALE GREEN) */}
        <div className="md:col-span-4 bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] dark:from-emerald-950/40 dark:to-emerald-900/20 rounded-3xl border border-emerald-200 dark:border-emerald-800/40 p-6 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-800/40 pb-3">
            <div className="flex items-center gap-2">
              <Award className="size-4 text-emerald-600 shrink-0" />
              <h3 className="text-xs font-black text-emerald-950 dark:text-emerald-200 uppercase tracking-wider">
                SAFETY SCORE
              </h3>
            </div>
            <button className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 shadow-2xs transition-colors cursor-pointer">
              View Details
            </button>
          </div>

          <div className="space-y-1.5 text-center my-1">
            <div className="text-4xl font-black text-emerald-950 dark:text-emerald-100 font-mono tracking-tight">
              98 <span className="text-lg text-emerald-600 font-bold">/100</span>
            </div>
            <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
              Status: Excellent
            </p>

            {/* Horizontal Progress Bar */}
            <div className="h-2.5 w-full bg-emerald-200/60 dark:bg-emerald-950/80 rounded-full overflow-hidden mt-2 p-0.5">
              <div className="h-full bg-emerald-600 rounded-full w-[98%]" />
            </div>
          </div>

          {/* Four Metrics Breakdown */}
          <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 space-y-2 text-xs text-emerald-950 dark:text-emerald-200">
            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium">
              <div className="flex justify-between items-center bg-white/60 dark:bg-emerald-900/40 p-1.5 rounded-lg">
                <span>Braking</span> <strong className="font-mono text-emerald-700">97</strong>
              </div>
              <div className="flex justify-between items-center bg-white/60 dark:bg-emerald-900/40 p-1.5 rounded-lg">
                <span>Acceleration</span> <strong className="font-mono text-emerald-700">95</strong>
              </div>
              <div className="flex justify-between items-center bg-white/60 dark:bg-emerald-900/40 p-1.5 rounded-lg">
                <span>Speeding</span> <strong className="font-mono text-emerald-700">100</strong>
              </div>
              <div className="flex justify-between items-center bg-white/60 dark:bg-emerald-900/40 p-1.5 rounded-lg">
                <span>Distractions</span> <strong className="font-mono text-emerald-700">98</strong>
              </div>
            </div>

            <div className="pt-1 text-center">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                Top 1% Safe Driver
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2 — NEED ROADSIDE ASSISTANCE? (WARM PALE YELLOW/ORANGE) */}
        <div className="md:col-span-4 bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] dark:from-amber-950/40 dark:to-amber-900/20 rounded-3xl border border-amber-200 dark:border-amber-800/40 p-6 flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-amber-800/40 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4.5 text-amber-600 shrink-0" />
              <h3 className="text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                NEED ROADSIDE ASSISTANCE?
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="size-16 rounded-2xl overflow-hidden border border-amber-200 shrink-0 bg-white p-1 flex items-center justify-center shadow-2xs">
              <img
                src="/images/squad/standard-rescue-suv.jpg"
                alt="Tow Truck Assistance"
                className="max-h-full max-w-full object-cover rounded-xl"
              />
            </div>
            <p className="text-xs text-amber-950 dark:text-amber-300 font-medium leading-relaxed">
              Get instant help for any roadside emergency in just a tap.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEmergency}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-black shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <AlertTriangle className="size-4 animate-pulse text-white" />
            <span>Request SOS</span>
          </motion.button>
        </div>

        {/* CARD 3 — LIVE VEHICLE HEALTH (PALE BLUE) */}
        <div className="md:col-span-4 bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] dark:from-blue-950/40 dark:to-blue-900/20 rounded-3xl border border-blue-200 dark:border-blue-800/40 p-6 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-blue-200/60 dark:border-blue-800/40 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="size-4.5 text-blue-600 shrink-0" />
              <h3 className="text-xs font-black text-blue-950 dark:text-blue-200 uppercase tracking-wider">
                LIVE VEHICLE HEALTH
              </h3>
            </div>
            <button className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 shadow-2xs transition-colors cursor-pointer">
              View All
            </button>
          </div>

          <div className="space-y-2 text-xs font-medium text-blue-950 dark:text-blue-200">
            {[
              { label: 'Battery', status: 'Good' },
              { label: 'Motor', status: 'Good' },
              { label: 'Tyres', status: 'Good' },
              { label: 'Brakes', status: 'Good' },
              { label: 'Systems', status: 'Normal' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/70 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/40 text-[11px]">
                <span className="font-semibold">{item.label}</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="size-3 stroke-[3]" /> {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. POPULAR SERVICES SECTION */}
      <div className="relative z-10 bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-6 shadow-sm space-y-5 w-full">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
              POPULAR SERVICES
            </h3>
            <p className="text-xs text-neutral-400 font-medium">
              We've got you covered
            </p>
          </div>
          <button
            onClick={onEmergency}
            className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer"
          >
            View All Services →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {popularServices.map((service) => {
            const ServiceIcon = service.icon
            return (
              <div
                key={service.id}
                onClick={() => onSelect(service.emergency)}
                className="bg-neutral-50/80 dark:bg-white/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 p-5 rounded-2xl border border-neutral-200/80 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer space-y-4 group shadow-2xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="size-11 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-indigo-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <ServiceIcon className="size-5" />
                  </div>
                  <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400 bg-white dark:bg-neutral-900 px-3 py-1 rounded-xl border border-neutral-200 dark:border-white/10 shadow-2xs">
                    ₹{service.fee}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-indigo-600 transition-colors">
                    {service.label}
                  </h4>
                  <p className="text-xs text-neutral-500 font-medium">
                    {service.sub}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 border-t border-neutral-200/60 dark:border-white/5">
                  <span>Select Service</span>
                  <div className="size-6 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. TRUST / BENEFITS FOOTER (5 ITEMS) */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
        {[
          { title: "You're in Safe Hands", desc: 'Trusted by thousands of drivers. We ensure your safety, always.', icon: ShieldCheck },
          { title: 'Certified Experts', desc: 'Background verified professionals.', icon: Award },
          { title: 'Quick Response', desc: 'Avg. response time under 15 mins.', icon: Clock },
          { title: 'Cashless Payments', desc: 'Secure & hassle-free transactions.', icon: CreditCard },
          { title: 'Live Tracking', desc: 'Track your squad in real-time.', icon: Navigation },
        ].map((item, idx) => {
          const ItemIcon = item.icon
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#151C2C] p-4 rounded-2xl border border-neutral-200/90 dark:border-white/10 space-y-1.5 text-center flex flex-col items-center justify-center shadow-2xs"
            >
              <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shadow-2xs mb-1">
                <ItemIcon className="size-4.5" />
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
