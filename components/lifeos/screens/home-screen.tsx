'use client'

import { useState } from 'react'
import { emergencies, mechanic, vehicles, type Emergency } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
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
} from 'lucide-react'
import { CallModal } from '@/components/lifeos/call-modal'

export function HomeScreen({
  onEmergency,
  onSelect,
}: {
  onEmergency: () => void
  onSelect: (e: Emergency) => void
}) {
  const primaryVehicle = vehicles[0]
  const [calling, setCalling] = useState(false)

  return (
    <div className="relative h-full overflow-y-auto no-scrollbar pb-32">
      <AmbientBg tone="primary" />

      <div className="relative z-10 px-5 pt-3 space-y-6">
        {/* Header Bar: Tamil Nadu Location */}
        <div className="flex items-center justify-between">
          <div className="surface-glass flex items-center gap-2 rounded-full px-3.5 py-1.5 shadow-subtle">
            <Navigation className="size-3.5 text-primary shrink-0 fill-primary/20" />
            <span className="text-xs font-semibold text-foreground truncate max-w-[210px]">
              GST Road NH-45 · Chengalpattu, TN
            </span>
          </div>

          <div className="surface-glass flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-subtle">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold text-muted-foreground">TN Squad Active</span>
          </div>
        </div>

        {/* Vehicle Garage Card */}
        <div className="surface-card rounded-2xl p-4 flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary shrink-0">
              <Car className="size-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">{primaryVehicle.name}</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
                  {primaryVehicle.plate}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Coverage Active · Tamil Nadu Tier I</p>
            </div>
          </div>
          <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
        </div>

        {/* Primary Question & SOS Hero Action */}
        <div className="surface-card rounded-3xl p-6 text-center space-y-5 border border-white/10 shadow-xl">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              How can we assist you?
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
              Tap for immediate priority dispatch across Tamil Nadu highways.
            </p>
          </div>

          {/* Primary SOS Emergency Button */}
          <div className="py-2 flex justify-center">
            <button
              onClick={onEmergency}
              className="group relative flex flex-col items-center justify-center size-40 rounded-full bg-destructive text-destructive-foreground font-bold shadow-2xl transition-all duration-200 active:scale-95 hover:bg-destructive/90 cursor-pointer"
              aria-label="Request Instant Emergency Roadside Assistance"
            >
              <AlertTriangle className="size-10 mb-1 transition-transform group-hover:scale-110" strokeWidth={2.2} />
              <span className="text-base font-extrabold tracking-wider">REQUEST HELP</span>
              <span className="text-[10px] font-medium opacity-85 mt-0.5">1-Tap TN Emergency Dispatch</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-medium text-muted-foreground pt-1 border-t border-white/5">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5 text-accent" /> ~8 min avg arrival
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-400" /> TN Highway Squad
            </span>
          </div>
        </div>

        {/* Quick Roadside Assistance Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-foreground">Roadside Services</h2>
            <button
              onClick={onEmergency}
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight className="size-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {emergencies.slice(0, 6).map((e) => {
              const Icon = e.icon
              return (
                <button
                  key={e.id}
                  onClick={() => onSelect(e)}
                  className="surface-card hover:bg-secondary/70 rounded-2xl p-4 text-left transition-all duration-150 active:scale-[0.98] cursor-pointer flex flex-col justify-between h-32 border border-white/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-accent px-2 py-0.5 rounded-full bg-accent/10">
                      ~{e.eta}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground">{e.label}</h3>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{e.sub}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Nearby Tamil Mechanics Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-foreground">Assigned Tamil Nadu Responder</h2>
            <span className="text-xs text-muted-foreground">GST Road Squad</span>
          </div>

          <div className="surface-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-full bg-primary/20 text-primary font-bold text-sm border border-primary/30">
                  KS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{mechanic.name}</h3>
                  <p className="text-xs text-muted-foreground">{mechanic.specialty}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold justify-end">
                  <Star className="size-3.5 fill-amber-400 stroke-amber-400" />
                  <span>{mechanic.rating}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{mechanic.jobs} jobs</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5 text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5 text-primary" /> {mechanic.distanceKm} km away (GST Road)
              </span>
              <button
                onClick={() => setCalling(true)}
                className="font-bold text-primary hover:underline"
              >
                Call {mechanic.name.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Emergency Contacts & Tools Bar */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-foreground px-1">Emergency Actions</h2>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => setCalling(true)}
              className="surface-card hover:bg-secondary/60 rounded-2xl p-3.5 flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer"
            >
              <PhoneCall className="size-5 text-destructive" />
              <span className="text-xs font-semibold text-foreground">Call Responder</span>
            </button>
            <button className="surface-card hover:bg-secondary/60 rounded-2xl p-3.5 flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer">
              <Share2 className="size-5 text-primary" />
              <span className="text-xs font-semibold text-foreground">Share Live</span>
            </button>
            <button className="surface-card hover:bg-secondary/60 rounded-2xl p-3.5 flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer">
              <Flashlight className="size-5 text-amber-400" />
              <span className="text-xs font-semibold text-foreground">Flashlight</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Calling Overlay Modal */}
      <CallModal
        isOpen={calling}
        onClose={() => setCalling(false)}
        mechanicName={mechanic.name}
        mechanicPhone={mechanic.phone}
      />
    </div>
  )
}
