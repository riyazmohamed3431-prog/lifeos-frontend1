'use client'

import { useState } from 'react'
import { mechanic, emergencies as defaultEmergencies, vehicles as defaultVehicles, type Emergency, type Vehicle } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { useLocation } from '@/lib/use-location'
import { TemporaryMap } from '@/components/lifeos/temporary-map'
import { CallModal } from '@/components/lifeos/call-modal'
import {
  CheckCircle2,
  Phone,
  MessageSquare,
  Navigation,
  Star,
  ShieldCheck,
  Clock,
  MapPin,
  Car,
  Wrench,
  Check,
  Shield,
  PhoneCall,
  Sparkles,
  AlertTriangle,
  Info,
  ChevronRight,
  RotateCw,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FadeIn } from '@/components/ui/framer-wrapper'

export function FoundScreen({
  emergencies: selectedEmergencies,
  vehicle: selectedVehicle,
  onTrack,
}: {
  emergencies?: Emergency[]
  vehicle?: Vehicle
  onTrack: () => void
}) {
  const [calling, setCalling] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [messageSent, setMessageSent] = useState(false)

  // Real device location
  const { location: userCoords, address: geocodedAddress } = useLocation()

  const primaryIssue = selectedEmergencies && selectedEmergencies.length > 0 ? selectedEmergencies[0] : defaultEmergencies[0]
  const activeVehicle = selectedVehicle || defaultVehicles[0]

  const handleSendMessage = () => {
    if (!messageText.trim()) return
    setMessageSent(true)
    setTimeout(() => {
      setMessageSent(false)
      setMessageText('')
      setShowMessageModal(false)
    }, 1800)
  }

  const scrollToMap = () => {
    onTrack()
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto no-scrollbar px-4 sm:px-8 pt-6 pb-36 text-left font-sans text-foreground select-none w-full">
      <AmbientBg tone="calm" />

      {/* 1. PAGE HEADER BAR */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full border-b border-neutral-200/80 dark:border-white/10 pb-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              🟢 TECHNICIAN EN ROUTE
            </span>
            <span className="text-xs text-neutral-400 font-medium hidden sm:inline">• Dispatch Confirmed</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Technician Dispatched
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{mechanic.name}</span> is heading to your location.
          </p>
        </div>

        {/* TOP RIGHT LIVE ETA & DISTANCE BADGE */}
        <div className="bg-white dark:bg-[#151C2C] border border-neutral-200 dark:border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-3.5 shadow-sm shrink-0 self-start sm:self-auto">
          <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
            <Clock className="size-5 animate-pulse text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                ETA ~{mechanic.etaMin || 8} min
              </span>
              <span className="text-neutral-300">•</span>
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {mechanic.distanceKm || 2.1} km
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
              Last updated: Just now
            </span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN RESPONSIVE DASHBOARD LAYOUT */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* LEFT COLUMN: LIVE MAP + STATUS TIMELINE + SAFETY (7 COLS ON LG) */}
        <div className="lg:col-span-7 space-y-6 w-full">
          
          {/* 2. LIVE RESCUE MAP — PRIMARY FEATURE */}
          <div
            id="live-rescue-map-section"
            className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-black text-sm">
                  <Navigation className="size-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                      Live Tracking Map
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200/50 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Live GPS
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">Real-time technician route transmission</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600">
                <span>Technician 🚙 ──── 📍 You</span>
              </div>
            </div>

            {/* MAP GRAPHIC CANVAS */}
            <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 shadow-inner">
              <TemporaryMap
                userLocation={userCoords || { latitude: 12.9229, longitude: 80.1275 }}
                progress={0.35}
                className="h-full w-full"
              />

              {/* OVERLAY STATUS BANNER */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-neutral-200 dark:border-white/10 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Navigation className="size-4 animate-spin" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">
                      En Route on NH-45 Highway
                    </span>
                    <h4 className="text-xs font-extrabold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                      {mechanic.name} is {mechanic.distanceKm || 2.1} km away
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-mono font-black text-indigo-600 shrink-0">
                  ETA ~{mechanic.etaMin || 8} min
                </span>
              </div>
            </div>
          </div>

          {/* 4 & 9. RESCUE STATUS TIMELINE */}
          <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                  <Clock className="size-4.5" />
                </div>
                <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                  Rescue Status Timeline
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                Stage 3 of 5
              </span>
            </div>

            {/* TIMELINE PROGRESS ITEMS */}
            <div className="space-y-4 relative pl-2 pt-1">
              {[
                { title: 'Request Confirmed', desc: 'Your rescue request was accepted', status: 'done', time: '12:41 PM' },
                { title: 'Squad Assigned', desc: `Verified specialist ${mechanic.name} assigned`, status: 'done', time: '12:42 PM' },
                { title: 'Technician En Route', desc: `Karthik is travelling to your location (~${mechanic.etaMin || 8} min)`, status: 'active', time: 'Live' },
                { title: 'Technician Arrives', desc: 'On-site vehicle inspection & setup', status: 'pending', time: 'Upcoming' },
                { title: 'Service Completed', desc: 'Safety clearance & issue resolved', status: 'pending', time: 'Upcoming' },
              ].map((stepItem, idx) => (
                <div key={idx} className="flex items-start gap-3.5 relative group">
                  {/* Status Dot / Icon */}
                  <div
                    className={cn(
                      'size-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all shadow-2xs mt-0.5',
                      stepItem.status === 'done'
                        ? 'bg-emerald-600 text-white'
                        : stepItem.status === 'active'
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 animate-pulse'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border border-neutral-300 dark:border-white/10'
                    )}
                  >
                    {stepItem.status === 'done' ? (
                      <Check className="size-4 stroke-[3]" />
                    ) : stepItem.status === 'active' ? (
                      <span className="size-2 rounded-full bg-white animate-ping" />
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0 bg-neutral-50/70 dark:bg-white/5 p-3 rounded-2xl border border-neutral-100 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <h4
                        className={cn(
                          'text-xs sm:text-sm font-extrabold',
                          stepItem.status === 'active'
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-[#0F172A] dark:text-[#F8FAFC]'
                        )}
                      >
                        {stepItem.title}
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-400">{stepItem.time}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
                      {stepItem.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 10. SAFETY / PRE-ARRIVAL CARD */}
          <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-3xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 border-b border-amber-200/60 pb-2">
              <ShieldCheck className="size-4.5 text-amber-600 shrink-0" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Before Your Technician Arrives
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-amber-950 dark:text-amber-300">
              {[
                'Turn on hazard lights if safe to signal location',
                'Stay inside the vehicle when roadside conditions are unsafe',
                'Keep your phone available for technician driver call',
                'Have your vehicle registration details ready',
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white/60 dark:bg-amber-900/30 p-2.5 rounded-xl border border-amber-100 dark:border-amber-800/40">
                  <CheckCircle2 className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-tight text-[11px]">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TECHNICIAN + VEHICLE & ISSUE + RESCUE VEHICLE + SUMMARY (5 COLS ON LG) */}
        <div className="lg:col-span-5 space-y-6 w-full">
          
          {/* 3. TECHNICIAN PROFILE CARD & CONTACT ACTIONS */}
          <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="size-4.5" />
                </div>
                <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                  Assigned Technician
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 text-indigo-300 border border-indigo-200/50">
                ✓ Verified Tech
              </span>
            </div>

            {/* Profile Info */}
            <div className="flex items-start gap-4">
              <div className="size-20 rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shrink-0 shadow-sm relative">
                <img src="/mechanic.png" alt={mechanic.name} className="h-full w-full object-cover object-top" />
                <span className="absolute bottom-0.5 right-0.5 px-1 py-0.5 rounded text-[8px] font-black bg-emerald-600 text-white">
                  PRO
                </span>
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <h4 className="text-base font-black text-[#0F172A] dark:text-[#F8FAFC]">
                  {mechanic.name}
                </h4>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {mechanic.specialty}
                </p>

                <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    ★ {mechanic.rating}
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span>{mechanic.years} Yrs Exp</span>
                  <span className="text-neutral-300">•</span>
                  <span>256 Rescues</span>
                </div>
              </div>
            </div>

            {/* 8. EMERGENCY CONTACT ACTIONS */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setCalling(true)}
                className="py-3 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <PhoneCall className="size-4" />
                <span>Call {mechanic.name.split(' ')[0]}</span>
              </button>

              <button
                onClick={() => setShowMessageModal(true)}
                className="py-3 px-3 rounded-2xl bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/15 text-neutral-800 dark:text-neutral-200 text-xs font-extrabold transition-all border border-neutral-200 dark:border-white/10 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <MessageSquare className="size-4 text-orange-500" />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* 7. YOUR VEHICLE / BREAKDOWN CARD */}
          <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center">
                  <Car className="size-4.5" />
                </div>
                <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                  Vehicle & Issue
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/50">
                {activeVehicle.plate}
              </span>
            </div>

            {/* Vehicle & Issue Details */}
            <div className="bg-neutral-50/80 dark:bg-white/5 rounded-2xl p-4 border border-neutral-100 dark:border-white/5 flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src={primaryIssue.image || '/images/issues/general-service.png'}
                  alt={primaryIssue.label}
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">
                  {activeVehicle.name} ({activeVehicle.color})
                </span>
                <h4 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                  {primaryIssue.label}
                </h4>
                <p className="text-[11px] text-neutral-500 font-medium truncate">
                  {primaryIssue.sub}
                </p>
              </div>
            </div>
          </div>

          {/* 6. RESCUE VEHICLE CARD */}
          <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                  <Wrench className="size-4.5" />
                </div>
                <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                  Rescue Vehicle
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50">
                🟢 Active
              </span>
            </div>

            <div className="flex items-center gap-4 bg-neutral-50/80 dark:bg-white/5 p-3.5 rounded-2xl border border-neutral-100 dark:border-white/5">
              <div className="size-16 rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shrink-0 p-1 flex items-center justify-center shadow-2xs">
                <img
                  src="/images/squad/standard-rescue-suv.jpg"
                  alt="LifeOS Rescue Unit"
                  className="max-h-full max-w-full object-cover rounded-lg"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <h4 className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                  LifeOS Rescue Unit
                </h4>
                <p className="text-[11px] font-mono font-bold text-indigo-600 truncate">
                  TN 07 SOS
                </p>
                <p className="text-[10px] text-neutral-400 truncate font-medium">
                  Equipment: Full Roadside Rescue Kit & Diagnostic OBD
                </p>
              </div>
            </div>
          </div>

          {/* 11, 14, 15. DISPATCH SUMMARY & SUPPORT PANEL */}
          <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
              <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                Dispatch Summary
              </h3>
              <span className="text-[10px] font-bold text-indigo-600">Ref #SOS-{Date.now().toString().slice(-5)}</span>
            </div>

            <div className="space-y-2 text-xs font-medium text-neutral-600 dark:text-neutral-300">
              <div className="flex justify-between items-center">
                <span>Issue</span>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{primaryIssue.label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Vehicle</span>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{activeVehicle.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Squad Lead</span>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{mechanic.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Location</span>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  {geocodedAddress ? geocodedAddress.split(',')[0] : 'NH-45 GST Road'}
                </span>
              </div>
            </div>

            {/* 14. 24/7 SUPPORT LINK */}
            <div className="pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs">
              <div>
                <span className="font-black text-[#0F172A] dark:text-[#F8FAFC] block">NEED HELP?</span>
                <span className="text-[10px] text-neutral-400">LifeOS Support available 24/7</span>
              </div>
              <button
                onClick={() => setCalling(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 12. FULL-WIDTH TRACK LIVE ARRIVAL CTA (ANCHORED AT BOTTOM) */}
      <div className="relative z-10 pt-6 w-full">
        <button
          onClick={scrollToMap}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-extrabold shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <Navigation className="size-5 fill-current animate-pulse" />
          <span>Track Live Arrival on Map (ETA ~{mechanic.etaMin || 8} min)</span>
        </button>
      </div>

      {/* CALL MODAL */}
      <CallModal
        isOpen={calling}
        onClose={() => setCalling(false)}
        mechanicName={mechanic.name}
        mechanicPhone={mechanic.phone}
      />

      {/* QUICK MESSAGE MODAL */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#131316] border border-neutral-200 dark:border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-5 text-orange-500" />
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                  Message {mechanic.name.split(' ')[0]}
                </h3>
              </div>
              <button onClick={() => setShowMessageModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="size-5" />
              </button>
            </div>

            {messageSent ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="size-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-black text-emerald-950 dark:text-emerald-200">Message Sent to Driver</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  {mechanic.name.split(' ')[0]} will receive your instructions shortly.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-neutral-500 font-medium">
                  Send quick instructions or landmark details directly to the technician:
                </p>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="e.g. Parked near the HP Fuel Station exit with hazard lights on..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-medium resize-none"
                />

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl text-white font-extrabold text-xs transition-all shadow-md',
                      messageText.trim() ? 'bg-orange-500 hover:bg-orange-600' : 'bg-neutral-300 cursor-not-allowed'
                    )}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
