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
  CheckCircle2,
  Navigation,
  Wrench,
  BatteryCharging,
  Gauge,
  Phone,
  Shield,
  Zap,
  MoreVertical,
  Activity,
  Award,
  CreditCard,
  User,
  Check,
  ArrowRight,
  TrendingUp,
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

      {/* 1. HERO SECTION WITH GREETING & LANDSCAPE GRAPHIC */}
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
                Hey,
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
                My Vehicle
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
              <span className="font-mono text-[10px]">Updated: Just now</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: SAFETY SCORE + ROADSIDE SOS + LIVE VEHICLE HEALTH */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch w-full">
        {/* SAFETY SCORE CARD (4 COLS ON MD/LG) */}
        <div className="md:col-span-4 bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] dark:from-emerald-950/40 dark:to-emerald-900/20 rounded-3xl border border-emerald-200 dark:border-emerald-800/40 p-6 flex flex-col justify-between space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-800/40 pb-3">
            <div className="flex items-center gap-2">
              <Award className="size-4 text-emerald-600 shrink-0" />
              <h3 className="text-xs font-black text-emerald-950 dark:text-emerald-200 uppercase tracking-wider">
                Safety Score
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
              Top 1% Safe
            </span>
          </div>

          <div className="space-y-2 text-center my-2">
            <div className="text-4xl font-black text-emerald-950 dark:text-emerald-100 font-mono tracking-tight">
              98<span className="text-lg text-emerald-600 font-bold">/100</span>
            </div>
            <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
              Excellent Driving Behavior
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 text-xs font-medium text-emerald-900 dark:text-emerald-200">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>• Braking: <strong className="text-emerald-700">Optimal</strong></div>
              <div>• Acceleration: <strong className="text-emerald-700">Smooth</strong></div>
              <div>• Speeding: <strong className="text-emerald-700">Zero</strong></div>
              <div>• Distractions: <strong className="text-emerald-700">None</strong></div>
            </div>
          </div>
        </div>

        {/* ROADSIDE ASSISTANCE SOS CARD (4 COLS ON MD/LG) */}
        <div className="md:col-span-4 bg-gradient-to-br from-[#1E1B2E] to-[#120F1D] text-white rounded-3xl border border-rose-500/30 p-6 flex flex-col justify-between space-y-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4.5 text-rose-500 animate-pulse shrink-0" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Roadside Assistance
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              24/7 Active
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-black text-white">
              Need Emergency SOS?
            </h4>
            <p className="text-xs text-neutral-300 font-medium leading-relaxed">
              Experiencing a breakdown on the highway? 1-tap SOS dispatches master technicians immediately.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEmergency}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-black shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <AlertTriangle className="size-4 animate-pulse text-white" />
            <span>Request SOS Rescue</span>
          </motion.button>
        </div>

        {/* LIVE VEHICLE HEALTH CARD (4 COLS ON MD/LG) */}
        <div className="md:col-span-4 bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-6 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="size-4.5 text-blue-600 shrink-0" />
              <h3 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                Live Vehicle Health
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50">
              ✓ All Healthy
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            {[
              { label: 'Battery Health', status: '100% Normal' },
              { label: 'Motor Drivetrain', status: '100% Normal' },
              { label: 'Tyre Pressure', status: '100% Normal' },
              { label: 'Brake System', status: '100% Normal' },
              { label: 'Safety Sensors', status: '100% Normal' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 text-[11px]">
                <span>{item.label}</span>
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
              Popular Services
            </h3>
            <p className="text-xs text-neutral-400 font-medium">
              Upfront quotes with guaranteed certified roadside assistance
            </p>
          </div>
          <button
            onClick={onEmergency}
            className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer"
          >
            View All Services <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {popularServices.map((service) => {
            const ServiceIcon = service.icon
            return (
              <div
                key={service.id}
                onClick={() => onSelect(service.emergency)}
                className="bg-neutral-50/80 dark:bg-white/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 p-5 rounded-2xl border border-neutral-200/80 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer space-y-4 group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="size-11 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-indigo-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <ServiceIcon className="size-5" />
                  </div>
                  <span className="text-sm font-mono font-black text-indigo-600 dark:text-indigo-400 bg-white dark:bg-neutral-900 px-3 py-1 rounded-xl border border-neutral-200 dark:border-white/10 shadow-2xs">
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
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. BOTTOM TRUST / FEATURE STRIP (5 ITEMS) */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
        {[
          { title: "You're in Safe Hands", desc: 'Trusted by thousands of drivers.', icon: ShieldCheck },
          { title: 'Certified Experts', desc: 'Background verified professionals.', icon: Award },
          { title: 'Quick Response', desc: 'Average response under 15 mins.', icon: Clock },
          { title: 'Cashless Payments', desc: 'Secure & hassle-free transactions.', icon: CreditCard },
          { title: 'Live Tracking', desc: 'Track squad arrival in real-time.', icon: Navigation },
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
