'use client'

import { useState } from 'react'
import { emergencies, vehicles, type Emergency, mechanic, type Vehicle } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { CategoryIconBox, WarmBadge, WarmButton, WarmCard } from '@/components/ui/warm-components'
import { ArrowLeft, MapPin, Check, Car, ShieldCheck, ShieldAlert, ChevronRight, X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FadeIn } from '@/components/ui/framer-wrapper'

export function BookingScreen({
  vehicles: userVehicles,
  initial,
  onBack,
  onConfirm,
}: {
  vehicles: Vehicle[]
  initial?: Emergency | Emergency[] | null
  onBack: () => void
  onConfirm: (selectedIssues: Emergency[], vehicleId: string, notes: string) => void
}) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  const initialSelected = Array.isArray(initial)
    ? initial.length > 0
      ? initial
      : [emergencies[0]]
    : initial
    ? [initial]
    : [emergencies[0]]

  const [selectedIssues, setSelectedIssues] = useState<Emergency[]>(initialSelected)
  const [selectedVehicle, setSelectedVehicle] = useState(userVehicles[0]?.id || 'v1')
  const [providerTier, setProviderTier] = useState<'standard' | 'heavy'>('standard')
  const [notes, setNotes] = useState('')

  const activeVehicleObj = userVehicles.find((v) => v.id === selectedVehicle) || userVehicles[0] || vehicles[0]

  const getCategoryColor = (id: string): 'blue' | 'amber' | 'emerald' | 'orange' | 'red' | 'purple' | 'rose' => {
    switch (id) {
      case 'tyre': return 'blue'
      case 'battery': return 'amber'
      case 'engine': return 'emerald'
      case 'fuel': return 'orange'
      case 'accident': return 'red'
      case 'lockout': return 'purple'
      case 'overheat': return 'rose'
      default: return 'emerald'
    }
  }

  const toggleIssue = (e: Emergency) => {
    const exists = selectedIssues.some((item) => item.id === e.id)
    if (exists) {
      setSelectedIssues((prev) => prev.filter((item) => item.id !== e.id))
    } else {
      setSelectedIssues((prev) => [...prev, e])
    }
  }

  const selectAllIssues = () => {
    if (selectedIssues.length === emergencies.length) {
      setSelectedIssues([emergencies[0]])
    } else {
      setSelectedIssues([...emergencies])
    }
  }

  const baseFee = selectedIssues.reduce((acc, item) => acc + item.fee, 0)
  const totalFee = baseFee + (providerTier === 'heavy' ? 400 : 0)

  const maxEtaMin = selectedIssues.reduce((max, item) => {
    const mins = parseInt(item.eta) || 10
    return mins > max ? mins : max
  }, 0)

  return (
    <div className="relative flex h-full flex-col overflow-y-auto no-scrollbar pb-36 font-sans text-[#0F172A] dark:text-[#F8FAFC]">
      <AmbientBg tone="primary" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 pt-4 pb-2">
        <button
          onClick={onBack}
          className="bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 grid size-10 place-items-center rounded-full text-foreground hover:bg-muted transition-all cursor-pointer shadow-sm"
          aria-label="Back to Command Center"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-wider block text-[#0F766E]">
            Priority Rescue Dispatch
          </span>
          <span className="text-[10px] text-[#475569] dark:text-[#94A3B8] font-semibold">Tamil Nadu Highway Command</span>
        </div>
        <div className="size-10" />
      </div>

      {/* Step Indicator Progress Bar */}
      <div className="relative z-10 px-4 sm:px-6 pt-2 pb-4">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          {[
            { s: 1, label: 'Issues' },
            { s: 2, label: 'Location' },
            { s: 3, label: 'Squad' },
            { s: 4, label: 'Confirm' },
          ].map((item) => (
            <div
              key={item.s}
              onClick={() => setStep(item.s as any)}
              className="flex flex-col items-center gap-1 cursor-pointer z-10 select-none"
            >
              <div
                className={cn(
                  'grid size-8 place-items-center rounded-full text-xs font-black transition-all border',
                  step === item.s
                    ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-md scale-110'
                    : step > item.s
                    ? 'bg-[#0F766E]/20 text-[#0F766E] border-[#0F766E]/40'
                    : 'bg-white dark:bg-[#151C2C] text-[#475569] dark:text-[#94A3B8] border-[#E2E8F0]'
                )}
              >
                {step > item.s ? <Check className="size-4" /> : item.s}
              </div>
              <span className={cn('text-[10px] font-bold', step === item.s ? 'text-[#0F766E]' : 'text-[#475569] dark:text-[#94A3B8]')}>
                {item.label}
              </span>
            </div>
          ))}
          {/* Connector Line */}
          <div className="absolute top-4 inset-x-4 h-0.5 bg-[#E2E8F0] dark:bg-white/10 -z-0" />
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 pt-2 space-y-6 max-w-2xl mx-auto flex-1">

        {/* STEP 1: CHOOSE ISSUES (MULTI-SELECT) */}
        {step === 1 && (
          <FadeIn key="step1" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                  Step 1: Select Breakdown Issue(s)
                </h2>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  Select one or multiple emergency categories for combined priority rescue
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <WarmBadge variant={selectedIssues.length > 0 ? 'emerald' : 'rose'}>
                  {selectedIssues.length} {selectedIssues.length === 1 ? 'Issue' : 'Issues'} Selected
                </WarmBadge>
                <button
                  onClick={selectAllIssues}
                  className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer px-2 py-1 rounded-lg hover:bg-[#0F766E]/10 transition-all"
                >
                  {selectedIssues.length === emergencies.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>

            {/* Selected Issues Quick Chips Bar */}
            {selectedIssues.length > 0 ? (
              <div className="p-3 rounded-2xl bg-[#0F766E]/10 dark:bg-[#0F766E]/20 border border-[#0F766E]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0F766E]">
                    Selected Breakdown List ({selectedIssues.length})
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0F766E]">
                    Subtotal: ₹{baseFee}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedIssues.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#1E293B] border border-[#0F766E]/30 text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] shadow-sm"
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] text-[#0F766E] font-mono">₹{item.fee}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleIssue(item)
                        }}
                        className="hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                        aria-label={`Remove ${item.label}`}
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
                <AlertCircle className="size-4 text-amber-500 shrink-0" />
                <span>Please select at least one breakdown issue to proceed with dispatch.</span>
              </div>
            )}

            {/* Grid of Emergency Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {emergencies.map((e) => {
                const isSelected = selectedIssues.some((item) => item.id === e.id)
                const color = getCategoryColor(e.id)
                const Icon = e.icon
                return (
                  <WarmCard
                    key={e.id}
                    onClick={() => toggleIssue(e)}
                    className={cn(
                      'flex items-center gap-3.5 p-4 cursor-pointer transition-all border relative overflow-hidden select-none',
                      isSelected
                        ? 'border-[#0F766E] bg-[#0F766E]/10 shadow-md ring-2 ring-[#0F766E]/30'
                        : 'border-[#E2E8F0] hover:bg-muted/40 opacity-90 hover:opacity-100'
                    )}
                  >
                    <CategoryIconBox icon={Icon} color={color} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">{e.label}</p>
                      <p className="text-[10px] text-[#475569] dark:text-[#94A3B8] truncate mt-0.5">{e.sub}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono font-bold text-[#0F766E]">₹{e.fee}</span>
                        <span className="text-[10px] text-[#475569] dark:text-[#94A3B8] font-mono">• ~{e.eta}</span>
                      </div>
                    </div>

                    {/* Custom Multi-select Checkbox */}
                    <div
                      className={cn(
                        'size-6 rounded-lg flex items-center justify-center transition-all border shrink-0',
                        isSelected
                          ? 'bg-[#0F766E] border-[#0F766E] text-white shadow-sm scale-105'
                          : 'border-[#CBD5E1] dark:border-white/20 bg-white/50 dark:bg-white/5'
                      )}
                    >
                      {isSelected && <Check className="size-4 stroke-[3]" />}
                    </div>
                  </WarmCard>
                )
              })}
            </div>

            <WarmButton
              variant="primary"
              size="lg"
              className="w-full mt-4"
              disabled={selectedIssues.length === 0}
              onClick={() => setStep(2)}
            >
              Continue to Location ({selectedIssues.length} {selectedIssues.length === 1 ? 'Issue' : 'Issues'} · ₹{baseFee}) <ChevronRight className="size-4" />
            </WarmButton>
          </FadeIn>
        )}

        {/* STEP 2: LOCATION & VEHICLE */}
        {step === 2 && (
          <FadeIn key="step2" className="space-y-4">
            <div>
              <h2 className="text-lg font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">Step 2: Confirm Location & Vehicle</h2>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">Verify exact GPS coordinates and vehicle registration</p>
            </div>

            {/* Selected Breakdown Summary Pill */}
            <div className="p-3 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-[#0F766E] block uppercase tracking-wider">Breakdown Package ({selectedIssues.length})</span>
                <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                  {selectedIssues.map((i) => i.label).join(', ')}
                </p>
              </div>
              <span className="font-mono font-bold text-[#0F766E] text-sm shrink-0">₹{baseFee}</span>
            </div>

            {/* Live Location Pill */}
            <WarmCard variant="slate" className="p-4 flex items-center gap-3">
              <CategoryIconBox icon={MapPin} color="blue" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-[#2563EB] uppercase">GPS Coordinates Verified</p>
                <p className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">NH-45 GST Road · Chengalpattu, Tamil Nadu</p>
              </div>
              <WarmBadge variant="blue">Live GPS</WarmBadge>
            </WarmCard>

            {/* Select Registered Vehicle */}
            <div className="space-y-2">
              <label className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">Target Vehicle</label>
              <div className="grid grid-cols-1 gap-2.5">
                {userVehicles.map((v) => {
                  const active = selectedVehicle === v.id
                  return (
                    <WarmCard
                      key={v.id}
                      onClick={() => setSelectedVehicle(v.id)}
                      className={cn(
                        'flex items-center justify-between p-3.5 cursor-pointer border',
                        active ? 'border-[#2563EB] bg-[#2563EB]/10' : 'border-[#E2E8F0] hover:bg-muted/40'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <CategoryIconBox icon={Car} color="blue" />
                        <div>
                          <p className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">{v.name}</p>
                          <p className="text-[11px] font-mono text-[#475569] dark:text-[#94A3B8]">{v.color} · {v.plate}</p>
                        </div>
                      </div>
                      {active && <Check className="size-5 text-[#2563EB]" />}
                    </WarmCard>
                  )
                })}
              </div>
            </div>

            {/* Landmark notes */}
            <div className="space-y-2">
              <label className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">Landmark / Situation Details</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Parked near Paranur Toll Plaza, GST Road Highway southbound lane..."
                rows={3}
                className="w-full rounded-2xl p-3.5 text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#475569] dark:placeholder:text-[#94A3B8] bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 resize-none shadow-sm"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <WarmButton variant="ghost" size="lg" className="flex-1" onClick={() => setStep(1)}>
                Back
              </WarmButton>
              <WarmButton variant="primary" size="lg" className="flex-1" onClick={() => setStep(3)}>
                Select Provider <ChevronRight className="size-4" />
              </WarmButton>
            </div>
          </FadeIn>
        )}

        {/* STEP 3: PROVIDER TIER */}
        {step === 3 && (
          <FadeIn key="step3" className="space-y-4">
            <div>
              <h2 className="text-lg font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">Step 3: Select Dispatch Tier</h2>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">Choose standard certified responder or heavy recovery rig</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <WarmCard
                onClick={() => setProviderTier('standard')}
                className={cn(
                  'p-4 cursor-pointer border space-y-2 min-w-0',
                  providerTier === 'standard' ? 'border-[#0F766E] bg-[#0F766E]/10' : 'border-[#E2E8F0] hover:bg-muted/40'
                )}
              >
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <CategoryIconBox icon={ShieldCheck} color="emerald" className="shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">Standard Priority Rescue Squad</h4>
                      <p className="text-[10px] text-[#475569] dark:text-[#94A3B8] truncate">Certified EV & Drivetrain Specialist (~{maxEtaMin || 8} min ETA)</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-[#0F766E] shrink-0">Standard Rate</span>
                </div>
              </WarmCard>

              <WarmCard
                onClick={() => setProviderTier('heavy')}
                className={cn(
                  'p-4 cursor-pointer border space-y-2 min-w-0',
                  providerTier === 'heavy' ? 'border-[#F97316] bg-[#F97316]/10' : 'border-[#E2E8F0] hover:bg-muted/40'
                )}
              >
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <CategoryIconBox icon={ShieldAlert} color="orange" className="shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">Heavy Rescue & Towing Rig</h4>
                      <p className="text-[10px] text-[#475569] dark:text-[#94A3B8] truncate">Heavy Recovery Truck + Flatbed Hydraulic Rig</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-[#F97316] shrink-0">+₹400 Surcharge</span>
                </div>
              </WarmCard>
            </div>

            <div className="flex gap-3 pt-2">
              <WarmButton variant="ghost" size="lg" className="flex-1" onClick={() => setStep(2)}>
                Back
              </WarmButton>
              <WarmButton variant="primary" size="lg" className="flex-1" onClick={() => setStep(4)}>
                Review & Confirm <ChevronRight className="size-4" />
              </WarmButton>
            </div>
          </FadeIn>
        )}

        {/* STEP 4: CONFIRMATION */}
        {step === 4 && selectedIssues.length > 0 && (
          <FadeIn key="step4" className="space-y-4">
            <div>
              <h2 className="text-lg font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">Step 4: Final Dispatch Summary</h2>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">Review booking details before initiating priority dispatch</p>
            </div>

            <WarmCard variant="white" className="p-5 space-y-4 border border-[#E2E8F0] min-w-0">
              {/* Selected issues header & itemized breakdown */}
              <div className="border-b border-[#E2E8F0] dark:border-white/10 pb-3 space-y-2.5">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div>
                    <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC]">
                      Selected Breakdown Issues ({selectedIssues.length})
                    </h3>
                    <p className="text-[11px] text-[#475569] dark:text-[#94A3B8]">Combined Priority Service Package</p>
                  </div>
                  <WarmBadge variant="emerald" className="shrink-0">~{maxEtaMin || 10} min Arrival</WarmBadge>
                </div>

                {/* Itemized List */}
                <div className="space-y-1.5 pt-1">
                  {selectedIssues.map((issue) => (
                    <div key={issue.id} className="flex justify-between items-center gap-2 p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B]/60 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="size-2 rounded-full bg-[#0F766E] shrink-0" />
                        <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">{issue.label}</span>
                        <span className="text-[10px] text-[#475569] dark:text-[#94A3B8] truncate hidden sm:inline">({issue.sub})</span>
                      </div>
                      <span className="font-mono font-bold text-[#0F766E] shrink-0">₹{issue.fee}.00</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center gap-2 text-[#475569] dark:text-[#94A3B8] min-w-0">
                  <span className="shrink-0">Vehicle</span>
                  <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate text-right">{activeVehicleObj.name} ({activeVehicleObj.plate})</span>
                </div>
                <div className="flex justify-between items-center gap-2 text-[#475569] dark:text-[#94A3B8] min-w-0">
                  <span className="shrink-0">Location</span>
                  <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate text-right">NH-45 GST Road Corridor</span>
                </div>
                <div className="flex justify-between items-center gap-2 text-[#475569] dark:text-[#94A3B8] min-w-0">
                  <span className="shrink-0">Assigned Squad</span>
                  <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate text-right">{mechanic.name}</span>
                </div>
                <div className="flex justify-between items-center gap-2 text-[#475569] dark:text-[#94A3B8] min-w-0 pt-1 border-t border-[#E2E8F0]/60 dark:border-white/10">
                  <span className="shrink-0">Combined Breakdown Fee</span>
                  <span className="font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC] shrink-0">₹{baseFee}.00</span>
                </div>
                {providerTier === 'heavy' && (
                  <div className="flex justify-between items-center gap-2 text-[#475569] dark:text-[#94A3B8] min-w-0">
                    <span className="shrink-0">Heavy Flatbed Surcharge</span>
                    <span className="font-mono font-bold text-[#F97316] shrink-0">₹400.00</span>
                  </div>
                )}
                <div className="flex justify-between items-center gap-2 pt-2 border-t border-[#E2E8F0] dark:border-white/10 font-black text-sm min-w-0">
                  <span className="shrink-0">Total Cashless Fee</span>
                  <span className="text-[#0F766E] font-mono text-base shrink-0">₹{totalFee}.00</span>
                </div>
              </div>
            </WarmCard>

            <div className="flex gap-3 pt-2">
              <WarmButton variant="ghost" size="lg" className="flex-1" onClick={() => setStep(3)}>
                Back
              </WarmButton>
              <WarmButton
                variant="danger"
                size="lg"
                className="flex-2 shadow-lg"
                onClick={() => onConfirm(selectedIssues, selectedVehicle, notes)}
              >
                <ShieldCheck className="size-5" /> Dispatch Rescue (₹{totalFee})
              </WarmButton>
            </div>
          </FadeIn>
        )}

      </div>
    </div>
  )
}

