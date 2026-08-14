'use client'

import { useEffect, useState } from 'react'
import { emergencies as defaultEmergencies, vehicles as defaultVehicles, type Emergency, type Vehicle } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { useLocation } from '@/lib/use-location'
import {
  Radio,
  MapPin,
  ShieldCheck,
  Navigation,
  Shield,
  Headset,
  Clock,
  Check,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const progressStages = [
  {
    title: 'VERIFYING LOCATION',
    icon: MapPin,
    desc: 'Verifying GPS coordinates on NH-45 GST Road...',
  },
  {
    title: 'SCANNING NEARBY UNITS',
    icon: Radio,
    desc: 'Scanning 42 active certified rescue units...',
  },
  {
    title: 'MATCHING SPECIALIST',
    icon: ShieldCheck,
    desc: 'Matching EV & Drivetrain master specialist...',
  },
  {
    title: 'DISPATCHING SQUAD',
    icon: Navigation,
    desc: 'Dispatching rescue squad...',
  },
]

export function WaitingScreen({
  emergency,
  emergencies,
  vehicle,
  vehicleName = 'Tesla Model 3',
  onFound,
}: {
  emergency?: Emergency | null
  emergencies?: Emergency[] | null
  vehicle?: Vehicle
  vehicleName?: string
  onFound: () => void
}) {
  const [step, setStep] = useState(0)

  // Real device GPS location
  const { location: userCoords, address: geocodedAddress } = useLocation()

  const issueList = emergencies && emergencies.length > 0
    ? emergencies
    : emergency
    ? [emergency]
    : []

  const primaryIssue = issueList.length > 0 ? issueList[0] : defaultEmergencies[0]
  const activeVehicle = vehicle || defaultVehicles[0]

  useEffect(() => {
    const s = setInterval(() => setStep((p) => Math.min(p + 1, progressStages.length - 1)), 1250)
    const done = setTimeout(onFound, 5200)
    return () => {
      clearInterval(s)
      clearTimeout(done)
    }
  }, [onFound])

  return (
    <div className="relative flex h-full flex-col justify-between overflow-y-auto no-scrollbar px-4 sm:px-8 pt-6 pb-12 text-left font-sans text-foreground select-none w-full">
      <AmbientBg tone="emergency" />

      <div className="relative z-10 space-y-6 w-full max-w-4xl mx-auto">
        {/* 1. SCREEN TITLE & STATUS BADGE */}
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40">
            <Radio className="size-3.5 animate-pulse text-rose-600" />
            <span>{primaryIssue.label} Dispatch Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Assigning Rescue Squad
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed">
            Stay in a safe location near your vehicle.
            <br className="hidden sm:inline" /> LifeOS is matching you with the closest certified technician.
          </p>
          <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
            We've got you covered.
          </p>
        </div>

        {/* 2. MECHANIC / RESCUE SQUAD VEHICLE CARD */}
        <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
            {/* Left: Vehicle Image */}
            <div className="size-16 sm:size-20 rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 shrink-0 p-1 flex items-center justify-center shadow-2xs">
              <img
                src={activeVehicle.image || activeVehicle.photoUrl || '/images/squad/standard-rescue-suv.jpg'}
                alt={activeVehicle.name}
                className="max-h-full max-w-full object-cover rounded-xl"
              />
            </div>

            {/* Center: Details */}
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                {activeVehicle.name}
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Loader2 className="size-3 animate-spin" /> Matching Squad
                </span>
                <span className="text-neutral-300">•</span>
                <span className="font-mono text-neutral-400 font-medium">{activeVehicle.plate}</span>
              </div>
              <p className="text-[11px] text-neutral-500 font-medium truncate flex items-center gap-1">
                <MapPin className="size-3 text-indigo-500 shrink-0" />
                <span>{geocodedAddress ? geocodedAddress.split(',')[0] : 'NH-45 GST Road, Tamil Nadu'}</span>
              </p>
            </div>
          </div>

          {/* Right: ETA Card */}
          <div className="bg-neutral-50/80 dark:bg-white/5 rounded-2xl px-5 py-3 border border-neutral-200/80 dark:border-white/5 text-center shrink-0 w-full sm:w-auto">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
              ETA
            </span>
            <span className="text-lg sm:text-xl font-mono font-black text-indigo-600 block">
              8 min
            </span>
            <span className="text-[10px] font-medium text-neutral-500 block">
              To Your Location
            </span>
          </div>
        </div>

        {/* 3. DISPATCH PROGRESS — HORIZONTAL 4-STEP SYSTEM */}
        <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 lg:p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="size-4 text-indigo-600 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                Dispatch Progress
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold text-indigo-600">
              Stage {step + 1} of {progressStages.length}
            </span>
          </div>

          {/* Progress Bar Connector */}
          <div className="relative w-full hidden md:block">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-200 dark:bg-white/10 -translate-y-1/2 rounded-full" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 rounded-full transition-all duration-500"
              style={{ width: `${(step / (progressStages.length - 1)) * 100}%` }}
            />
          </div>

          {/* 4 Stage Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
            {progressStages.map((stage, idx) => {
              const StageIcon = stage.icon
              const isDone = idx < step
              const isActive = idx === step

              return (
                <div
                  key={idx}
                  className={cn(
                    'p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 relative',
                    isDone
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200'
                      : isActive
                      ? 'bg-orange-50/70 dark:bg-orange-950/30 border-orange-400 dark:border-orange-600/60 ring-2 ring-orange-500/20 text-orange-950 dark:text-orange-200 shadow-md'
                      : 'bg-neutral-50/60 dark:bg-white/5 border-neutral-200/80 dark:border-white/5 opacity-50 text-neutral-400'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        'size-9 rounded-xl flex items-center justify-center shadow-2xs',
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-orange-500 text-white'
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                      )}
                    >
                      {isDone ? (
                        <Check className="size-4 stroke-[3]" />
                      ) : isActive ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <StageIcon className="size-4" />
                      )}
                    </div>
                    <span className="text-[10px] font-mono font-extrabold uppercase">
                      0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h4
                      className={cn(
                        'text-xs font-black uppercase tracking-wider',
                        isDone
                          ? 'text-emerald-900 dark:text-emerald-200'
                          : isActive
                          ? 'text-orange-900 dark:text-orange-200'
                          : 'text-neutral-500'
                      )}
                    >
                      {stage.title}
                    </h4>
                    <p className="text-[11px] font-medium mt-1 leading-snug opacity-90">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 4. INFORMATION / TRUST BAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Section 1: Safety First */}
          <div className="bg-white dark:bg-[#151C2C] rounded-2xl border border-neutral-200/90 dark:border-white/10 p-4 flex items-start gap-3 shadow-2xs">
            <div className="size-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
              <Shield className="size-4.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">
                Safety First
              </h4>
              <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mt-0.5">
                Your safety is our top priority. Stay inside your vehicle.
              </p>
            </div>
          </div>

          {/* Section 2: 24/7 Support */}
          <div className="bg-white dark:bg-[#151C2C] rounded-2xl border border-neutral-200/90 dark:border-white/10 p-4 flex items-start gap-3 shadow-2xs">
            <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
              <Headset className="size-4.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">
                24/7 Support
              </h4>
              <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mt-0.5">
                Our team is monitoring your request round the clock.
              </p>
            </div>
          </div>

          {/* Section 3: Live Updates */}
          <div className="bg-white dark:bg-[#151C2C] rounded-2xl border border-neutral-200/90 dark:border-white/10 p-4 flex items-start gap-3 shadow-2xs">
            <div className="size-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="size-4.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">
                Live Updates
              </h4>
              <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mt-0.5">
                You'll receive real-time updates on your squad's arrival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
