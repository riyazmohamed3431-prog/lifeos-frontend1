'use client'

import { useState } from 'react'
import { mechanic } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { CheckCircle2, Phone, MessageSquare, Navigation, Star, ShieldCheck } from 'lucide-react'
import { CallModal } from '@/components/lifeos/call-modal'

export function FoundScreen({ onTrack }: { onTrack: () => void }) {
  const [calling, setCalling] = useState(false)

  return (
    <div className="relative flex h-full flex-col justify-between overflow-y-auto no-scrollbar px-6 pt-10 pb-28 text-left">
      <AmbientBg tone="calm" />

      {/* Top Banner */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
          <CheckCircle2 className="size-4" /> Dispatch Confirmed · Tamil Nadu Squad
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Technician Dispatched
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {mechanic.name} has accepted your emergency request and is driving on GST Road NH-45.
        </p>
      </div>

      {/* Responder Profile Card */}
      <div className="relative z-10 surface-card rounded-3xl p-5 space-y-5 border border-white/10 shadow-2xl my-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="grid size-14 place-items-center rounded-2xl bg-primary/20 text-primary font-bold text-base border border-primary/30">
              KS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{mechanic.name}</h3>
                <ShieldCheck className="size-4 text-emerald-400" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{mechanic.specialty}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-center">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-semibold text-muted-foreground">Rating</p>
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-400">
              <Star className="size-3.5 fill-amber-400 stroke-amber-400" />
              <span>{mechanic.rating}</span>
            </div>
          </div>
          <div className="space-y-0.5 border-x border-white/5">
            <p className="text-[10px] uppercase font-semibold text-muted-foreground">Experience</p>
            <p className="text-xs font-bold text-foreground">{mechanic.years} Years</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-semibold text-muted-foreground">ETA</p>
            <p className="text-xs font-bold text-accent">~{mechanic.etaMin} mins</p>
          </div>
        </div>

        {/* Location & Rig details */}
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Location Hub</span>
            <span className="font-semibold text-foreground">{mechanic.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Service Rig</span>
            <span className="font-semibold text-foreground">{mechanic.vehicleRig}</span>
          </div>
        </div>

        {/* Contact buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setCalling(true)}
            className="surface-card hover:bg-secondary/70 rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-semibold text-foreground transition-all cursor-pointer border border-primary/40 bg-primary/10"
          >
            <Phone className="size-4 text-primary" />
            <span>Call {mechanic.name.split(' ')[0]}</span>
          </button>
          <button
            onClick={() => setCalling(true)}
            className="surface-card hover:bg-secondary/70 rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-semibold text-foreground transition-all cursor-pointer"
          >
            <MessageSquare className="size-4 text-accent" />
            <span>Send Message</span>
          </button>
        </div>
      </div>

      {/* Bottom Track Action */}
      <div className="relative z-10">
        <button
          onClick={onTrack}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-bold py-4 text-sm shadow-xl hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Navigation className="size-4 fill-current" />
          <span>Track Live Arrival on Tamil Nadu Map</span>
        </button>
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
