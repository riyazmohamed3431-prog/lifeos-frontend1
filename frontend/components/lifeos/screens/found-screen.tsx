'use client'

import { useState } from 'react'
import { mechanic } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { WarmBadge, WarmButton, WarmCard } from '@/components/ui/warm-components'
import { CheckCircle2, Phone, MessageSquare, Navigation, Star, ShieldCheck } from 'lucide-react'
import { CallModal } from '@/components/lifeos/call-modal'

export function FoundScreen({ onTrack }: { onTrack: () => void }) {
  const [calling, setCalling] = useState(false)

  return (
    <div className="relative flex h-full flex-col justify-between overflow-y-auto no-scrollbar px-6 pt-8 pb-28 text-left font-sans text-foreground">
      <AmbientBg tone="calm" />

      {/* Top Banner */}
      <div className="relative z-10 space-y-2">
        <WarmBadge variant="emerald">
          <CheckCircle2 className="size-4 text-[#0F766E]" /> Dispatch Confirmed · Verified Squad
        </WarmBadge>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          Technician Dispatched
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-bold">{mechanic.name}</span> has accepted your request and is en route on GST Road NH-45.
        </p>
      </div>

      {/* Responder Profile Card */}
      <WarmCard className="relative z-10 p-5 space-y-5 border border-border shadow-2xl my-4 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="grid size-13 place-items-center rounded-2xl bg-[#0F766E]/10 text-[#0F766E] font-black text-base border border-[#0F766E]/20 shadow-sm">
              KS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-foreground">{mechanic.name}</h3>
                <ShieldCheck className="size-4 text-[#0F766E]" />
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">{mechanic.specialty}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-border text-center">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Rating</p>
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#F59E0B]">
              <Star className="size-3.5 fill-[#F59E0B] stroke-[#F59E0B]" />
              <span>{mechanic.rating}</span>
            </div>
          </div>
          <div className="space-y-0.5 border-x border-border">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Experience</p>
            <p className="text-xs font-black text-foreground">{mechanic.years} Years</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Arrival ETA</p>
            <p className="text-xs font-mono font-bold text-[#0F766E]">~{mechanic.etaMin} mins</p>
          </div>
        </div>

        {/* Location & Rig details */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="font-medium">Dispatch Hub</span>
            <span className="font-bold text-foreground truncate max-w-[200px]">{mechanic.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Service Vehicle Rig</span>
            <span className="font-mono font-bold text-[#0F766E]">{mechanic.vehicleRig}</span>
          </div>
        </div>

        {/* Contact buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <WarmButton variant="primary" size="md" onClick={() => setCalling(true)}>
            <Phone className="size-4" /> Call {mechanic.name.split(' ')[0]}
          </WarmButton>
          <WarmButton variant="ghost" size="md" onClick={() => setCalling(true)}>
            <MessageSquare className="size-4 text-[#F97316]" /> Message
          </WarmButton>
        </div>
      </WarmCard>

      {/* Bottom Track Action */}
      <div className="relative z-10">
        <WarmButton variant="gold" size="lg" className="w-full shadow-xl" onClick={onTrack}>
          <Navigation className="size-4 fill-current" /> Track Live Arrival on Map
        </WarmButton>
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
