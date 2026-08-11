'use client'

import { useEffect, useState } from 'react'
import { mechanic } from '@/lib/lifeos'
import { MapCanvas } from '@/components/lifeos/map-canvas'
import { Phone, MessageSquare, ShieldAlert, Star, Navigation } from 'lucide-react'
import { CallModal } from '@/components/lifeos/call-modal'
import { CategoryIconBox, WarmBadge, WarmButton, WarmCard } from '@/components/ui/warm-components'

export function TrackingScreen({ onArrived }: { onArrived: () => void }) {
  const [progress, setProgress] = useState(0.1)
  const [calling, setCalling] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        const next = p + 0.08
        if (next >= 1) {
          clearInterval(t)
          setTimeout(onArrived, 1000)
          return 1
        }
        return next
      })
    }, 1000)
    return () => clearInterval(t)
  }, [onArrived])

  const etaMin = Math.max(0, Math.round(mechanic.etaMin * (1 - progress)))
  const distance = (mechanic.distanceKm * (1 - progress)).toFixed(1)

  return (
    <div className="relative h-full overflow-hidden font-sans text-[#0F172A] dark:text-[#F8FAFC]">
      {/* Royal Blue + Cyan Apple Maps Style Container */}
      <div className="absolute inset-0 size-full">
        <MapCanvas className="h-full w-full" showRoute progress={progress} />
      </div>

      {/* Top Header Card */}
      <div className="absolute inset-x-0 top-0 z-20 px-4 sm:px-6 pt-3">
        <WarmCard variant="blue" className="p-4 flex items-center justify-between shadow-lg border border-[#2563EB]/30 backdrop-blur-2xl bg-white/90 dark:bg-[#151C2C]/90">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB]">
              {progress >= 1 ? 'Dispatch Status' : 'Estimated Rescue Arrival'}
            </p>
            <p className="text-lg sm:text-xl font-black text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">
              {progress >= 1 ? 'Technician Arrived' : `${etaMin} mins remaining`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">Distance</p>
            <p className="text-xs sm:text-sm font-mono font-bold text-[#2563EB]">NH-45 · {distance} km</p>
          </div>
        </WarmCard>
      </div>

      {/* Floating Emergency Hotline Trigger */}
      <button
        onClick={() => setCalling(true)}
        aria-label="Contact Emergency Dispatcher"
        className="absolute right-5 top-24 z-20 grid size-12 place-items-center rounded-2xl bg-[#EF4444] text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
      >
        <ShieldAlert className="size-6" />
      </button>

      {/* Bottom Sheet Driver Profile Card */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-4 sm:px-6 pb-6">
        <WarmCard variant="white" className="p-5 space-y-4 shadow-2xl border border-[#E2E8F0] backdrop-blur-2xl bg-white/95 dark:bg-[#151C2C]/95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CategoryIconBox icon={Navigation} color="blue" />
              <div>
                <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC]">{mechanic.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
                  <Star className="size-3.5 fill-[#F59E0B] stroke-[#F59E0B]" />
                  <span className="font-bold text-[#F59E0B]">{mechanic.rating}</span>
                  <span>· Certified Responder</span>
                </div>
              </div>
            </div>
            <WarmBadge variant="blue">
              <span className="size-2 rounded-full bg-[#2563EB] animate-ping" />
              En Route
            </WarmBadge>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-[#F1F5F9] dark:bg-[#1E293B] px-4 py-2.5 text-xs text-[#475569] dark:text-[#94A3B8] border border-[#E2E8F0]">
            <span className="font-mono">Rig: {mechanic.vehicleRig}</span>
            <span className="font-bold text-[#2563EB] flex items-center gap-1">
              <Navigation className="size-3.5 text-[#2563EB]" /> Live GPS Stream
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <WarmButton variant="secondary" size="lg" className="shadow-md" onClick={() => setCalling(true)}>
              <Phone className="size-4" /> Call {mechanic.name.split(' ')[0]}
            </WarmButton>
            <WarmButton variant="ghost" size="lg" onClick={() => setCalling(true)}>
              <MessageSquare className="size-4 text-[#F59E0B]" /> Message Unit
            </WarmButton>
          </div>
        </WarmCard>
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
