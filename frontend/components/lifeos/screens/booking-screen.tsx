'use client'

import { useState, useEffect } from 'react'
import { emergencies, vehicles, type Emergency, mechanic, nearbyMechanics, type Vehicle } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { useLocation } from '@/lib/use-location'
import { TemporaryMap } from '@/components/lifeos/temporary-map'
import {
  ArrowLeft,
  MapPin,
  Check,
  Car,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  X,
  Search,
  Wrench,
  Info,
  Clock,
  Plus,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Navigation,
  Zap,
  AlertTriangle,
  Fuel,
  Lock,
  Thermometer,
  Truck,
  Briefcase,
  SlidersHorizontal,
  RotateCw,
  Camera,
  Mic,
  Sparkles,
  PhoneCall,
  CreditCard,
} from 'lucide-react'
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

  // Real location integration hook with reverse geocoded address
  const { location: userCoords, address: geocodedAddress, loading: locationLoading, error: locationError, requestLocation } = useLocation()

  const initialSelected = Array.isArray(initial)
    ? initial.length > 0
      ? initial
      : [emergencies[0]]
    : initial
    ? [initial]
    : [emergencies[0]]

  const [emergencyList, setEmergencyList] = useState<Emergency[]>(emergencies)
  const [selectedIssues, setSelectedIssues] = useState<Emergency[]>(initialSelected)
  const [focusedIssue, setFocusedIssue] = useState<Emergency>(initialSelected[0] || emergencies[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  
  const [selectedVehicle, setSelectedVehicle] = useState(userVehicles[0]?.id || 'v1')
  const [providerTier, setProviderTier] = useState<'standard' | 'heavy'>('standard')
  const [notes, setNotes] = useState('')

  // Step 4 hold countdown timer state (starts at 4:55 = 295 seconds)
  const [holdSeconds, setHoldSeconds] = useState(295)

  useEffect(() => {
    if (step !== 4) return
    const interval = setInterval(() => {
      setHoldSeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [step])

  const formatHoldTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }

  // Media & expert notes state
  const [attachedPhotos, setAttachedPhotos] = useState<{ id: string; url: string; name: string }[]>([])
  const [isRecordingVoice, setIsRecordingVoice] = useState(false)
  const [voiceNoteAttached, setVoiceNoteAttached] = useState(false)

  // Custom issue modal state
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customTitle, setCustomTitle] = useState('')
  const [customSub, setCustomSub] = useState('')
  const [customDesc, setCustomDesc] = useState('')

  const [customFee, setCustomFee] = useState('800')

  const activeVehicleObj = userVehicles.find((v) => v.id === selectedVehicle) || userVehicles[0] || vehicles[0]

  const toggleIssue = (e: Emergency) => {
    setFocusedIssue(e)
    const exists = selectedIssues.some((item) => item.id === e.id)
    if (exists) {
      const updated = selectedIssues.filter((item) => item.id !== e.id)
      setSelectedIssues(updated)
      if (updated.length > 0) {
        setFocusedIssue(updated[updated.length - 1])
      }
    } else {
      setSelectedIssues((prev) => [...prev, e])
    }
  }

  const handleAddCustomIssue = () => {
    if (!customTitle.trim()) return
    const feeNum = parseInt(customFee) || 800
    const newIssue: Emergency = {
      id: 'custom-' + Date.now(),
      label: customTitle.trim(),
      sub: customSub.trim() || 'Custom Breakdown Issue',
      icon: Wrench,
      fee: feeNum,
      eta: '15 min',
      category: 'Service',
      image: '/images/issues/general-service.png',
      description: customDesc.trim() || 'Custom reported roadside issue. Expert will perform diagnostic upon arrival.',
      about: 'User reported custom issue requiring on-site inspection.',
      causes: ['Unspecified mechanical fault', 'Custom roadside concern'],
      symptoms: ['Vehicle reported non-operational or unsafe'],
      included: ['On-site diagnostic inspection', 'Custom repair or recovery assessment'],
    }
    setEmergencyList((prev) => [newIssue, ...prev])
    setSelectedIssues((prev) => [...prev, newIssue])
    setFocusedIssue(newIssue)
    setCustomTitle('')
    setCustomSub('')
    setCustomDesc('')
    setShowCustomModal(false)
  }

  const baseFee = selectedIssues.reduce((acc, item) => acc + item.fee, 0)
  const totalFee = baseFee + (providerTier === 'heavy' ? 400 : 0)

  const maxEtaMin = selectedIssues.reduce((max, item) => {
    const mins = parseInt(item.eta) || 10
    return mins > max ? mins : max
  }, 0)

  // Dynamic help summary and chips generator for Step 2
  const getHelpSummary = (issues: Emergency[]) => {
    if (!issues || issues.length === 0) {
      return {
        description: 'Our emergency team will perform an overall diagnostic and roadside assessment upon arrival.',
        chips: ['Diagnostic Check', 'Roadside Assist', 'Emergency Support'],
      }
    }

    const chipsSet = new Set<string>()
    const descriptions: string[] = []

    issues.forEach((issue) => {
      descriptions.push(issue.description)

      if (issue.category === 'Tyres') {
        chipsSet.add('Puncture')
        chipsSet.add('Tyre Inspection')
        chipsSet.add('Roadside Assistance')
      } else if (issue.category === 'Battery') {
        chipsSet.add('Jump Start')
        chipsSet.add('Voltage Diagnostic')
        chipsSet.add('Terminal Service')
      } else if (issue.category === 'Engine') {
        chipsSet.add('OBD-II Scan')
        chipsSet.add('Ignition Diagnostic')
        chipsSet.add('On-Site Repair')
      } else if (issue.category === 'Fuel') {
        chipsSet.add('5L Fuel Delivery')
        chipsSet.add('System Priming')
        chipsSet.add('Engine Restart')
      } else if (issue.category === 'Lockout') {
        chipsSet.add('Air-Wedge Lockpick')
        chipsSet.add('Key Retrieval')
        chipsSet.add('Zero Damage')
      } else if (issue.category === 'Cooling') {
        chipsSet.add('Coolant Refill')
        chipsSet.add('Radiator Inspection')
        chipsSet.add('Thermal Cool-Down')
      } else if (issue.category === 'Towing') {
        chipsSet.add('Flatbed Towing')
        chipsSet.add('Hydraulic Lift')
        chipsSet.add('Workshop Transport')
      } else {
        chipsSet.add('20-Point Check')
        chipsSet.add('On-Site Diagnostic')
        chipsSet.add('Roadside Assist')
      }

      if (issue.included) {
        issue.included.slice(0, 2).forEach((inc) => {
          if (inc.length < 24) chipsSet.add(inc)
        })
      }
    })

    return {
      description: descriptions.join(' '),
      chips: Array.from(chipsSet).slice(0, 6),
    }
  }


  // Filtered issues
  const filteredEmergencies = emergencyList.filter((e) => {
    const matchesSearch =
      e.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = ['All', 'Tyres', 'Battery', 'Engine', 'Fuel', 'Lockout', 'Cooling', 'Towing', 'Service']

  const getInfoIcon = (id: string) => {
    switch (id) {
      case 'battery':
        return { Icon: Zap, bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' }
      case 'engine':
        return { Icon: AlertTriangle, bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' }
      case 'fuel':
        return { Icon: Fuel, bg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' }
      case 'lockout':
        return { Icon: Lock, bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' }
      case 'overheat':
        return { Icon: Thermometer, bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' }
      case 'towing':
        return { Icon: Truck, bg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' }
      case 'other':
        return { Icon: Wrench, bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' }
      default:
        return { Icon: Info, bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' }
    }
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto no-scrollbar pb-36 font-sans text-[#0F172A] dark:text-[#F8FAFC] w-full select-none">
      <AmbientBg tone="primary" />

      {/* TOP HEADER BAR */}
      <div className="relative z-10 flex items-center justify-between px-6 lg:px-10 pt-4 pb-3 border-b border-neutral-200/60 dark:border-white/5 bg-white/30 dark:bg-black/20 backdrop-blur-sm w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 grid size-9 place-items-center rounded-xl text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer shadow-sm"
            aria-label="Back to Command Center"
          >
            <ArrowLeft className="size-4.5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                ACTIVE PORTAL: <span className="text-neutral-900 dark:text-white font-extrabold">BOOKING</span>
              </span>
            </div>
          </div>
        </div>

        <div className="text-center hidden sm:block">
          <span className="text-xs font-black uppercase tracking-wider block text-indigo-600 dark:text-indigo-400">
            Priority Rescue Dispatch
          </span>
          <span className="text-[10px] text-neutral-500 font-semibold">Tamil Nadu Highway Command</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium hidden md:inline">Logged in as</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
            VIP Member
          </span>
        </div>
      </div>

      {/* 4-STEP BOOKING PROGRESS STEPPER */}
      <div className="relative z-10 px-6 lg:px-10 pt-6 pb-4 w-full">
        <div className="w-full">
          <div className="grid grid-cols-4 gap-3 sm:gap-6 relative w-full">
            {[
              { s: 1, title: 'Issues', sub: 'Select Breakdown Issue(s)' },
              { s: 2, title: 'Location', sub: 'Share Your Location' },
              { s: 3, title: 'Squad', sub: 'Select Best Squad' },
              { s: 4, title: 'Confirm', sub: 'Review & Confirm' },
            ].map((item) => {
              const isActive = step === item.s
              const isDone = step > item.s
              return (
                <div
                  key={item.s}
                  onClick={() => setStep(item.s as any)}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-3 cursor-pointer z-10 select-none group w-full"
                >
                  <div
                    className={cn(
                      'grid size-10 place-items-center rounded-2xl text-xs font-black transition-all border shrink-0',
                      isActive
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-105'
                        : isDone
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 border-indigo-300 dark:border-indigo-800'
                        : 'bg-white dark:bg-[#151C2C] text-neutral-400 border-neutral-200 dark:border-white/10 group-hover:border-neutral-300'
                    )}
                  >
                    {isDone ? <Check className="size-4 stroke-[3]" /> : item.s}
                  </div>
                  <div className="text-center sm:text-left min-w-0 flex-1">
                    <span
                      className={cn(
                        'text-xs sm:text-sm font-black block truncate',
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-700 dark:text-neutral-300'
                      )}
                    >
                      {item.title}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-medium truncate hidden md:block mt-0.5">
                      {item.sub}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 px-6 lg:px-10 pt-2 space-y-6 w-full flex-1">
        {/* STEP 1: ISSUES SELECTION SCREEN */}
        {step === 1 && (
          <FadeIn key="step1" className="w-full">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full">
              {/* LEFT / MAIN CONTENT AREA */}
              <div className="flex-1 space-y-6 min-w-0 w-full">
                {/* HEADING HEADER WITH ICON & RIGHT SUMMARY PILL */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                      <Wrench className="size-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                        What&apos;s the issue with your vehicle?
                      </h1>
                      <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
                        Select one or more issues so we can send the right help.
                      </p>
                    </div>
                  </div>

                  {/* SUMMARY PILL (EXACT AS REFERENCE IMAGE 2) */}
                  <div className="bg-[#F5F3FF] dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-3.5 flex items-center justify-between gap-5 shadow-sm shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                        <Briefcase className="size-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-indigo-950 dark:text-indigo-200 block">
                          {selectedIssues.length} {selectedIssues.length === 1 ? 'Issue' : 'Issues'} Selected
                        </span>
                        <span className="text-xs font-mono font-bold text-indigo-600">
                          Subtotal: ₹{baseFee}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const panel = document.getElementById('right-details-panel')
                        panel?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Summary</span>
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* LIGHT LAVENDER INFORMATION BANNER */}
                <div className="bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 flex items-center gap-3 text-xs text-indigo-950 dark:text-indigo-200 shadow-sm w-full">
                  <div className="size-8 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                    <Info className="size-4.5" />
                  </div>
                  <p className="font-medium leading-relaxed">
                    Select all issues that apply. This helps our experts arrive with the right tools and fix it faster.
                  </p>
                </div>

                {/* SEARCH & POPULAR ISSUES FILTER BAR */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight uppercase">
                      🔥 Popular Issues
                    </span>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                    {/* Search Field */}
                    <div className="relative flex-1 sm:w-64">
                      <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search issues..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-[#151C2C] border border-neutral-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-neutral-800 dark:text-neutral-100 shadow-sm"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </div>

                    {/* Category Filter Dropdown */}
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#151C2C] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer shadow-sm"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === 'All' ? 'All Categories' : cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ISSUE CARDS RESPONSIVE GRID (MATCHING REFERENCE IMAGE 2 EXACTLY) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5 w-full">
                  {filteredEmergencies.map((e) => {
                    const isSelected = selectedIssues.some((item) => item.id === e.id)
                    const { Icon: InfoBoxIcon, bg: iconBg } = getInfoIcon(e.id)

                    return (
                      <div
                        key={e.id}
                        onClick={() => toggleIssue(e)}
                        className={cn(
                          'group bg-white dark:bg-[#151C2C] rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between shadow-sm relative select-none',
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-500/10'
                            : 'border-neutral-200/90 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
                        )}
                      >
                        {/* Top Image Container (Isolated product photo on light bg matching reference image 2) */}
                        <div className="relative h-36 w-full overflow-hidden bg-[#FAFAFC] dark:bg-neutral-900/80 p-3 flex items-center justify-center border-b border-neutral-100 dark:border-white/5">
                          <img
                            src={e.image || '/images/issues/general-service.png'}
                            alt={e.label}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-xl"
                          />

                          {/* Selection Checkmark Ring/Badge (Upper Right) */}
                          <div
                            className={cn(
                              'absolute top-3 right-3 size-6 rounded-full flex items-center justify-center transition-all shadow-sm',
                              isSelected
                                ? 'bg-indigo-600 text-white scale-105'
                                : 'bg-white/80 dark:bg-black/60 border border-neutral-300 dark:border-white/30 text-transparent'
                            )}
                          >
                            <Check className={cn('size-3.5 stroke-[3]', isSelected ? 'opacity-100' : 'opacity-0')} />
                          </div>

                          {/* Engine Alert icon for Engine Failure card */}
                          {e.id === 'engine' && (
                            <div className="absolute bottom-2 right-2 size-6 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-md">
                              <AlertTriangle className="size-3.5" />
                            </div>
                          )}
                        </div>

                        {/* Card Content Body */}
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight group-hover:text-indigo-600 transition-colors">
                              {e.label}
                            </h3>
                            <p className="text-[11px] text-neutral-400 font-bold mt-0.5">
                              {e.sub}
                            </p>

                            {/* Price & ETA Row */}
                            <div className="flex items-center gap-2 mt-2 text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                              <span className="text-neutral-900 dark:text-white font-black">₹{e.fee}</span>
                              <span className="text-neutral-300 dark:text-neutral-600">•</span>
                              <span className="text-neutral-500 font-medium">~ {e.eta}</span>
                            </div>
                          </div>

                          {/* Bottom Rounded Information Box (Matching Reference Image 2) */}
                          <div className="bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 rounded-xl p-2.5 flex items-start gap-2 text-[11px] text-neutral-600 dark:text-neutral-300 leading-normal">
                            <div className={cn('size-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5', iconBg)}>
                              <InfoBoxIcon className="size-3.5" />
                            </div>
                            <p className="line-clamp-3 text-[11px] font-medium leading-tight">{e.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* + ADD OTHER ISSUE CARD */}
                  <div
                    onClick={() => setShowCustomModal(true)}
                    className="bg-indigo-50/50 dark:bg-indigo-950/20 border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all hover:bg-indigo-50 min-h-[220px]"
                  >
                    <div className="size-11 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                      <Plus className="size-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-indigo-900 dark:text-indigo-200">+ Add Other Issue</h4>
                      <p className="text-[11px] text-indigo-600/80 dark:text-indigo-400 mt-1 max-w-[160px] mx-auto">
                        Can&apos;t find your issue? Add custom issue details
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT STICKY DETAILS PANEL (MATCHING REFERENCE IMAGE 2 EXACTLY) */}
              <div id="right-details-panel" className="w-full lg:w-[360px] xl:w-[400px] shrink-0 space-y-4 lg:sticky lg:top-4">
                <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200 dark:border-white/10 p-5 shadow-xl space-y-5">
                  {/* PANEL HEADER */}
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
                    <div>
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                        Issue Details
                      </span>
                      <h3 className="text-base font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
                        {focusedIssue.label}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/50">
                      ₹{focusedIssue.fee}
                    </span>
                  </div>

                  {/* FOCUSED ISSUE SUMMARY CARD (EXACT MATCH REFERENCE IMAGE 2) */}
                  <div className="bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 rounded-2xl p-3 flex items-center gap-3">
                    <div className="size-14 rounded-xl overflow-hidden bg-white dark:bg-neutral-800 shrink-0 border border-neutral-200 dark:border-white/10 p-1 flex items-center justify-center">
                      <img
                        src={focusedIssue.image || '/images/issues/general-service.png'}
                        alt={focusedIssue.label}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                        {focusedIssue.label}
                      </h4>
                      <p className="text-[10px] text-neutral-400 truncate">{focusedIssue.sub}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] font-mono font-bold">
                        <span className="text-indigo-600">₹{focusedIssue.fee}</span>
                        <span className="text-neutral-400">~{focusedIssue.eta}</span>
                      </div>
                    </div>
                  </div>

                  {/* ABOUT THIS ISSUE */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                      About This Issue
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed bg-neutral-50 dark:bg-white/5 p-3 rounded-xl">
                      {focusedIssue.about || focusedIssue.description}
                    </p>
                  </div>

                  {/* COMMON CAUSES */}
                  {focusedIssue.causes && focusedIssue.causes.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                        Common Causes
                      </h4>
                      <ul className="grid grid-cols-1 gap-1 text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                        {focusedIssue.causes.map((cause, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-indigo-500 shrink-0" />
                            <span>{cause}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* SYMPTOMS */}
                  {focusedIssue.symptoms && focusedIssue.symptoms.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                        Symptoms
                      </h4>
                      <ul className="grid grid-cols-1 gap-1 text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                        {focusedIssue.symptoms.map((symptom, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* WHAT'S INCLUDED (GREEN CHECKMARKS) */}
                  {focusedIssue.included && focusedIssue.included.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-white/5">
                      <h4 className="text-xs font-black text-[#0F766E] uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="size-4 text-[#0F766E]" /> What&apos;s Included
                      </h4>
                      <div className="space-y-1.5">
                        {focusedIssue.included.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-200 font-medium">
                            <Check className="size-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LOCATION CARD INTEGRATED WITH MAP GRAPHIC (REFERENCE IMAGE 2) */}
                  <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-black">Good choice!</span>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                        <Navigation className="size-2.5 animate-spin" /> Live GPS
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-900 dark:text-emerald-200 font-medium leading-normal">
                      Our nearest expert is just <span className="font-extrabold">{mechanic.distanceKm || 2.1} km away</span> from your location
                      {userCoords ? ` (${userCoords.latitude.toFixed(3)}°, ${userCoords.longitude.toFixed(3)}°)` : ` at ${mechanic.location || 'NH-45 GST Road'}`}.
                    </p>

                    {/* MAP GRAPHIC PREVIEW WITH PURPLE MARKER */}
                    <div className="relative h-28 w-full rounded-xl overflow-hidden bg-[#E5E9F0] dark:bg-neutral-800 flex items-center justify-center border border-emerald-200/60">
                      <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:12px_12px] opacity-70" />
                      <div className="size-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 z-10 animate-bounce">
                        <MapPin className="size-4 fill-white" />
                      </div>
                    </div>
                  </div>

                  {/* WHAT HAPPENS NEXT CARD */}
                  <div className="bg-neutral-50 dark:bg-white/5 rounded-2xl p-3.5 space-y-2.5 border border-neutral-200/60 dark:border-white/5">
                    <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                      What happens next?
                    </h4>
                    <div className="space-y-2 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                      {[
                        'Share your exact location',
                        'We find the best expert',
                        'Expert is on the way',
                        "We fix the issue & you're back on road",
                      ].map((stepText, idx) => (
                        <div key={idx} className="flex items-center gap-2.5">
                          <span className="size-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] grid place-items-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{stepText}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CONTINUE TO LOCATION BUTTON (EXACT PURPLE BUTTON AS REFERENCE IMAGE 2) */}
                  <button
                    disabled={selectedIssues.length === 0}
                    onClick={() => setStep(2)}
                    className={cn(
                      'w-full py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer',
                      selectedIssues.length > 0
                        ? 'bg-[#4F46E5] hover:bg-[#4338CA] shadow-indigo-500/25 active:scale-[0.99]'
                        : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed shadow-none'
                    )}
                  >
                    <span>
                      {selectedIssues.length > 0
                        ? `Continue to Location →`
                        : 'Select an Issue to Continue'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* STEP 2: LOCATION & VEHICLE */}
        {step === 2 && (
          <FadeIn key="step2" className="space-y-6 w-full max-w-none">
            {/* HEADING HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full border-b border-neutral-200/80 dark:border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                    Step 2 of 4
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">• Location & Vehicle Verification</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                  Step 2: Confirm Location & Vehicle
                </h2>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
                  Verify breakdown package details, real-time GPS coordinates, vehicle selection, and expert instructions.
                </p>
              </div>

              {/* TOP MINI SUMMARY BADGE */}
              <div className="bg-white dark:bg-[#151C2C] border border-neutral-200 dark:border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-sm shrink-0">
                <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                  {selectedIssues.length}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">
                    Total Package Fee
                  </span>
                  <span className="text-sm font-mono font-black text-indigo-600">₹{baseFee}</span>
                </div>
              </div>
            </div>

            {/* MAIN 2-COLUMN RESPONSIVE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
              {/* LEFT COLUMN: PACKAGE + GPS & MAP + TARGET VEHICLE (7 Cols on LG) */}
              <div className="lg:col-span-7 space-y-6 w-full">
                
                {/* 1. LIVE GPS SECTION & LIVE MAP PREVIEW */}
                <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                        <MapPin className="size-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                            Live Location
                          </h3>
                          <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Location Detected
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">Real browser/device GPS coordinates</p>
                      </div>
                    </div>

                    {/* Refresh GPS Button */}
                    <button
                      onClick={() => requestLocation()}
                      disabled={locationLoading}
                      className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/15 text-neutral-700 dark:text-neutral-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <RotateCw className={cn('size-3.5 text-indigo-600', locationLoading && 'animate-spin')} />
                      <span>{locationLoading ? 'Locating...' : 'Refresh GPS'}</span>
                    </button>
                  </div>

                  {/* Real Address Pill / Banner */}
                  <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/40 rounded-2xl p-4 flex items-center gap-3.5">
                    <div className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Navigation className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block">
                        Verified Device Location
                      </span>
                      <p className="text-xs sm:text-sm font-extrabold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                        {geocodedAddress || (userCoords ? `${userCoords.latitude.toFixed(4)}°, ${userCoords.longitude.toFixed(4)}° · GPS Locked` : 'NH-45 GST Road Corridor, Chengalpattu, Tamil Nadu')}
                      </p>
                      {userCoords && (
                        <p className="text-[10px] font-mono text-neutral-500 mt-0.5">
                          Accuracy: High · Lat: {userCoords.latitude.toFixed(5)}, Lng: {userCoords.longitude.toFixed(5)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Compact Map Tile Visualization using TemporaryMap */}
                  <div className="space-y-2">
                    <div className="h-56 w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 shadow-inner relative">
                      <TemporaryMap
                        userLocation={userCoords || { latitude: 12.9229, longitude: 80.1275 }}
                        progress={0}
                        className="h-full w-full"
                      />
                    </div>

                    {/* Nearby Responders overlay info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1 text-[11px] font-medium text-neutral-500">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-indigo-600" />
                        {nearbyMechanics.length} Active Rescue Squads nearby
                      </span>
                      <span className="font-bold text-indigo-600">
                        Nearest: {nearbyMechanics[0].name} ({nearbyMechanics[0].km})
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. SELECTED BREAKDOWN ISSUE (POSITIONED AFTER MAP, BEFORE TARGET VEHICLE) */}
                <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                        <Wrench className="size-4.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                          Selected Breakdown {selectedIssues.length > 1 ? 'Issues' : 'Issue'}
                        </h3>
                        <p className="text-[11px] text-neutral-400">
                          {selectedIssues.length === 0
                            ? 'No issues selected'
                            : `${selectedIssues.length} ${selectedIssues.length === 1 ? 'service' : 'services'} transferred from Step 1`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Change Issue</span>
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>

                  {/* CARDS FOR EVERY SELECTED ISSUE */}
                  {selectedIssues.length === 0 ? (
                    <div className="p-6 text-center bg-neutral-50 dark:bg-white/5 rounded-2xl space-y-2 border border-dashed border-neutral-200 dark:border-white/10">
                      <p className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                        No breakdown issue selected
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        Go back to Step 1 and select an issue to continue.
                      </p>
                      <button
                        onClick={() => setStep(1)}
                        className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold transition-all hover:bg-indigo-700"
                      >
                        ← Back to Step 1
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedIssues.map((issue) => (
                        <div
                          key={issue.id}
                          className="bg-neutral-50/80 dark:bg-white/5 border border-neutral-200/70 dark:border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-indigo-200 dark:hover:border-indigo-900/50 relative group"
                        >
                          {/* Issue Image */}
                          <div className="size-20 sm:size-24 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-2 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                            <img
                              src={issue.image || '/images/issues/general-service.png'}
                              alt={issue.label}
                              className="max-h-full max-w-full object-contain rounded-lg"
                            />
                          </div>

                          {/* Issue Info */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC]">
                                {issue.label}
                              </h4>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                                {issue.category}
                              </span>
                            </div>
                            
                            <p className="text-xs font-semibold text-neutral-500">{issue.sub}</p>

                            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
                              {issue.description}
                            </p>

                            {/* Checkmark Features List */}
                            {issue.included && issue.included.length > 0 && (
                              <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                                {issue.included.slice(0, 2).map((incItem, i) => (
                                  <div key={i} className="flex items-center gap-1">
                                    <Check className="size-3 text-emerald-600 shrink-0 stroke-[3]" />
                                    <span>{incItem}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Price & Arrival Tag + Remove Option */}
                          <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200/60">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-mono font-black text-indigo-600">
                                ₹{issue.fee}
                              </span>
                              <button
                                onClick={() => {
                                  const updated = selectedIssues.filter((i) => i.id !== issue.id)
                                  setSelectedIssues(updated)
                                }}
                                className="text-neutral-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                title="Remove this issue"
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1 mt-1">
                              <Clock className="size-3" />
                              ~{issue.eta} arrival
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 3. ISSUE SUMMARY: WHAT WE'LL HELP WITH */}
                  {selectedIssues.length > 0 && (() => {
                    const helpSummary = getHelpSummary(selectedIssues)
                    return (
                      <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 space-y-2.5">
                        <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
                          <Sparkles className="size-4 text-indigo-600 shrink-0" />
                          <h4 className="text-xs font-black uppercase tracking-wider">
                            What We&apos;ll Help With
                          </h4>
                        </div>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
                          {helpSummary.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {helpSummary.chips.map((chip, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 shadow-2xs"
                            >
                              ✓ {chip}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* 3. TARGET VEHICLE */}
                <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center">
                        <Car className="size-4.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                          Target Vehicle
                        </h3>
                        <p className="text-[11px] text-neutral-400">Select which vehicle requires emergency assistance</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200/50">
                      {userVehicles.length} Registered
                    </span>
                  </div>

                  {/* Registered Vehicle Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {userVehicles.map((v) => {
                      const active = selectedVehicle === v.id
                      return (
                        <div
                          key={v.id}
                          onClick={() => setSelectedVehicle(v.id)}
                          className={cn(
                            'group p-4 rounded-2xl cursor-pointer border transition-all duration-200 flex items-center justify-between gap-3 bg-white dark:bg-[#151C2C] shadow-sm relative overflow-hidden',
                            active
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-md'
                              : 'border-neutral-200/90 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-800'
                          )}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Vehicle Illustration / Icon Badge */}
                            <div
                              className={cn(
                                'size-12 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                                active
                                  ? 'bg-indigo-600 text-white shadow-md'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                              )}
                            >
                              <Car className="size-6" />
                            </div>

                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                                {v.name}
                              </h4>
                              <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                                {v.color} · <span className="font-mono font-bold text-neutral-700 dark:text-neutral-300">{v.plate}</span>
                              </p>
                            </div>
                          </div>

                          {/* Selected Checkmark Badge */}
                          <div
                            className={cn(
                              'size-6 rounded-full flex items-center justify-center shrink-0 transition-all',
                              active
                                ? 'bg-indigo-600 text-white scale-105 shadow-sm'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-transparent border border-neutral-300 dark:border-white/20'
                            )}
                          >
                            <Check className={cn('size-3.5 stroke-[3]', active ? 'opacity-100' : 'opacity-0')} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: TELL EXPERT MORE + SAFETY + LANDMARK + NAV (5 Cols on LG) */}
              <div className="lg:col-span-5 space-y-6 w-full">
                
                {/* 7. TELL THE EXPERT MORE */}
                <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                        Tell the Expert More
                      </h3>
                      <p className="text-[11px] text-neutral-400">Additional context, photos or audio for responder</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                      Optional
                    </span>
                  </div>

                  {/* Textarea description */}
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe what happened... (e.g. Engine started making metallic clanking noise after hitting a pot hole, smoke coming out)"
                    rows={3}
                    className="w-full rounded-2xl p-3.5 text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none shadow-2xs font-medium"
                  />

                  {/* Media Buttons: Add Photos & Voice Note */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    {/* Photo Upload Hidden Input */}
                    <input
                      type="file"
                      id="photo-upload-input"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (!e.target.files) return
                        const files = Array.from(e.target.files)
                        const newItems = files.map((f) => ({
                          id: Math.random().toString(36).substring(2, 9),
                          url: URL.createObjectURL(f),
                          name: f.name,
                        }))
                        setAttachedPhotos((prev) => [...prev, ...newItems])
                      }}
                      className="hidden"
                    />

                    <label
                      htmlFor="photo-upload-input"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/15 text-neutral-700 dark:text-neutral-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-neutral-200/60 dark:border-white/5"
                    >
                      <Camera className="size-4 text-indigo-600" />
                      <span>📷 Add Photos ({attachedPhotos.length})</span>
                    </label>

                    <button
                      onClick={() => {
                        if (voiceNoteAttached) {
                          setVoiceNoteAttached(false)
                        } else if (isRecordingVoice) {
                          setIsRecordingVoice(false)
                          setVoiceNoteAttached(true)
                        } else {
                          setIsRecordingVoice(true)
                          setTimeout(() => {
                            setIsRecordingVoice(false)
                            setVoiceNoteAttached(true)
                          }, 2500)
                        }
                      }}
                      className={cn(
                        'flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border',
                        voiceNoteAttached
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : isRecordingVoice
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-200 animate-pulse'
                          : 'bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/15 text-neutral-700 dark:text-neutral-200 border-neutral-200/60 dark:border-white/5'
                      )}
                    >
                      <Mic className={cn('size-4', voiceNoteAttached ? 'text-emerald-600' : isRecordingVoice ? 'text-rose-600 animate-bounce' : 'text-indigo-600')} />
                      <span>
                        {voiceNoteAttached
                          ? '✓ Voice Note Added'
                          : isRecordingVoice
                          ? 'Recording... (0:03)'
                          : '🎤 Voice Note'}
                      </span>
                    </button>
                  </div>

                  {/* Attached Photos Thumbnail Strip */}
                  {attachedPhotos.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {attachedPhotos.map((photo) => (
                        <div key={photo.id} className="relative size-14 rounded-xl overflow-hidden border border-neutral-200 dark:border-white/10 group">
                          <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
                          <button
                            onClick={() => setAttachedPhotos((prev) => prev.filter((p) => p.id !== photo.id))}
                            className="absolute top-0.5 right-0.5 size-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 9. LANDMARK / SITUATION DETAILS */}
                <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 shadow-sm space-y-3">
                  <label className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider block">
                    Landmark / Situation Details
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Parked near a toll plaza, highway exit, fuel station..."
                    className="w-full rounded-2xl p-3.5 text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-2xs font-medium"
                  />
                </div>

                {/* 8. BEFORE THE EXPERT ARRIVES */}
                <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-3xl p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                    <ShieldCheck className="size-4.5 text-amber-600 shrink-0" />
                    <h4 className="text-xs font-black uppercase tracking-wider">
                      Before the Expert Arrives
                    </h4>
                  </div>
                  <div className="space-y-2 text-xs font-medium text-amber-950 dark:text-amber-300">
                    {[
                      'Keep your vehicle accessible and hazard lights on',
                      'Keep your phone charged and available for driver call',
                      'Stay in a safe location (behind highway barrier if on road)',
                      'Have your vehicle registration & details ready',
                    ].map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 13. PRESERVE BOOKING FLOW & NAVIGATION BUTTONS */}
                <div className="flex items-center gap-4 pt-2 w-full">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 rounded-2xl bg-white dark:bg-[#151C2C] border border-neutral-200 dark:border-white/10 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer shadow-sm"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-2 py-4 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-extrabold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <span>Search Providers →</span>
                  </button>
                </div>

              </div>
            </div>
          </FadeIn>
        )}

        {/* STEP 3: PROVIDER TIER */}
        {step === 3 && (() => {
          const primaryIssue = selectedIssues[0] || emergencies[0]
          const isHeavyRecommended = selectedIssues.some((i) => i.recommendedTier === 'heavy' || i.id === 'towing')
          const issueCapabilities = primaryIssue.capabilities || [
            `${primaryIssue.label} Diagnostic & Repair`,
            'On-Site Troubleshooting',
            'Safety Clearance Inspection',
            'Emergency Assistance',
          ]

          return (
            <FadeIn key="step3" className="space-y-6 w-full max-w-none">
              {/* STEP HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full border-b border-neutral-200/80 dark:border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                      Step 3 of 4
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">• Priority Squad Dispatch Selection</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                    Step 3: Select Dispatch Tier
                  </h2>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
                    Compare available rescue options and select the most appropriate dispatch team for your issue.
                  </p>
                </div>

                {/* TOP MINI BADGE */}
                <div className="bg-white dark:bg-[#151C2C] border border-neutral-200 dark:border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-sm shrink-0">
                  <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                    {selectedIssues.length}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">
                      Estimated Total
                    </span>
                    <span className="text-sm font-mono font-black text-indigo-600">₹{totalFee}</span>
                  </div>
                </div>
              </div>

              {/* 4. TOP HORIZONTAL "CURRENT ASSISTANCE" SUMMARY CARD */}
              <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-4 lg:p-5 shadow-sm">
                <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                  Current Assistance Summary
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100 dark:divide-white/5">
                  {/* Item 1: Selected Issue */}
                  <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:pr-2">
                    <div className="size-14 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-2 flex items-center justify-center shrink-0 shadow-2xs">
                      <img
                        src={primaryIssue.image || '/images/issues/general-service.png'}
                        alt={primaryIssue.label}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">
                        Selected Issue
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                        {primaryIssue.label}
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-medium truncate">
                        {selectedIssues.length > 1 ? `+${selectedIssues.length - 1} additional issue` : primaryIssue.sub}
                      </p>
                    </div>
                  </div>

                  {/* Item 2: Vehicle */}
                  <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-3">
                    <div className="size-11 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200/50">
                      <Car className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">
                        Vehicle
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                        {activeVehicleObj.name}
                      </h4>
                      <p className="text-[11px] font-mono font-bold text-neutral-500 truncate">
                        {activeVehicleObj.plate}
                      </p>
                    </div>
                  </div>

                  {/* Item 3: Location */}
                  <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-3">
                    <div className="size-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/50">
                      <MapPin className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">
                        Location
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                        {geocodedAddress ? geocodedAddress.split(',')[0] : 'Current Detected Location'}
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-medium truncate">
                        {geocodedAddress ? geocodedAddress : userCoords ? `${userCoords.latitude.toFixed(4)}°, ${userCoords.longitude.toFixed(4)}°` : 'NH-45 GST Road, Chengalpattu'}
                      </p>
                    </div>
                  </div>

                  {/* Item 4: Estimated Cost */}
                  <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:pl-3">
                    <div className="size-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/50">
                      <Zap className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">
                        Estimated Cost
                      </span>
                      <h4 className="text-xs sm:text-sm font-mono font-black text-indigo-600 truncate">
                        ₹{baseFee} – ₹{baseFee + 400}
                      </h4>
                      <p className="text-[11px] text-emerald-600 font-bold truncate">
                        ✓ Cashless Insurance Cover
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6 & 7. DISPATCH TIER SELECTION + 8 & 9 SIDEBAR INFO */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT 7 COLS: SELECT DISPATCH TIER CARDS */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-2">
                    <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                      Select Your Dispatch Tier
                    </h3>
                    <span className="text-[11px] text-neutral-400 font-medium">Click card to change tier</span>
                  </div>

                  {/* CARD 1: STANDARD PRIORITY RESCUE SQUAD */}
                  <div
                    onClick={() => setProviderTier('standard')}
                    className={cn(
                      'group p-5 sm:p-6 rounded-3xl cursor-pointer border transition-all duration-200 bg-white dark:bg-[#151C2C] shadow-sm relative overflow-hidden space-y-4',
                      providerTier === 'standard'
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md bg-indigo-50/20 dark:bg-indigo-950/20'
                        : 'border-neutral-200/90 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-md'
                    )}
                  >
                    {/* Recommended Badge on Card 1 */}
                    {!isHeavyRecommended && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
                        ★ RECOMMENDED FOR YOUR ISSUE
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Squad SUV image thumbnail */}
                        <div className="size-20 rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 shrink-0 p-1 flex items-center justify-center shadow-2xs">
                          <img
                            src="/images/squad/standard-rescue-suv.jpg"
                            alt="Standard Priority Rescue Squad"
                            className="max-h-full max-w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-[#F8FAFC]">
                              STANDARD PRIORITY RESCUE SQUAD
                            </h4>
                          </div>
                          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            {primaryIssue.recommendedSquadText || 'Certified EV & Drivetrain Specialist'}
                          </p>
                          <div className="flex items-center gap-3 text-xs font-medium text-neutral-500 pt-0.5">
                            <span>ETA ~8 min</span>
                            <span>•</span>
                            <span>2.1 km away</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Selection Checkmark */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                        <div className="flex items-center gap-2">
                          <span className="text-lg sm:text-xl font-mono font-black text-indigo-600">
                            ₹{baseFee}
                          </span>
                          <div
                            className={cn(
                              'size-6 rounded-full flex items-center justify-center transition-all',
                              providerTier === 'standard'
                                ? 'bg-indigo-600 text-white scale-105 shadow-sm'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-transparent border border-neutral-300 dark:border-white/20'
                            )}
                          >
                            <Check className={cn('size-3.5 stroke-[3]', providerTier === 'standard' ? 'opacity-100' : 'opacity-0')} />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50 mt-1">
                          Standard Rate
                        </span>
                      </div>
                    </div>

                    {/* Standard Capabilities Checklist */}
                    <div className="pt-3 border-t border-neutral-100 dark:border-white/5 grid grid-cols-2 gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      <div className="flex items-center gap-2">
                        <Check className="size-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                        <span>On-site repair</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="size-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                        <span>Tyre change & puncture</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="size-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                        <span>Battery jump & boost</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="size-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                        <span>Minor mechanical fix</span>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: HEAVY RESCUE & TOWING RIG */}
                  <div
                    onClick={() => setProviderTier('heavy')}
                    className={cn(
                      'group p-5 sm:p-6 rounded-3xl cursor-pointer border transition-all duration-200 bg-white dark:bg-[#151C2C] shadow-sm relative overflow-hidden space-y-4',
                      providerTier === 'heavy'
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md bg-orange-50/20 dark:bg-orange-950/20'
                        : 'border-neutral-200/90 dark:border-white/10 hover:border-orange-300 dark:hover:border-orange-800 hover:shadow-md'
                    )}
                  >
                    {/* Recommended Badge on Card 2 if Heavy Recommended */}
                    {isHeavyRecommended && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
                        ★ RECOMMENDED FOR HEAVY RECOVERY
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Heavy tow truck thumbnail */}
                        <div className="size-20 rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 shrink-0 p-1 flex items-center justify-center shadow-2xs">
                          <img
                            src="/images/squad/heavy-towing-truck.png"
                            alt="Heavy Rescue & Towing Rig"
                            className="max-h-full max-w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-[#F8FAFC]">
                              HEAVY RESCUE & TOWING RIG
                            </h4>
                          </div>
                          <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                            Heavy Recovery Truck + Flatbed Hydraulic Rig
                          </p>
                          <div className="flex items-center gap-3 text-xs font-medium text-neutral-500 pt-0.5">
                            <span>ETA ~15 min</span>
                            <span>•</span>
                            <span>4.8 km away</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Selection Checkmark */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                        <div className="flex items-center gap-2">
                          <span className="text-lg sm:text-xl font-mono font-black text-orange-600">
                            ₹{baseFee + 400}
                          </span>
                          <div
                            className={cn(
                              'size-6 rounded-full flex items-center justify-center transition-all',
                              providerTier === 'heavy'
                                ? 'bg-orange-600 text-white scale-105 shadow-sm'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-transparent border border-neutral-300 dark:border-white/20'
                            )}
                          >
                            <Check className={cn('size-3.5 stroke-[3]', providerTier === 'heavy' ? 'opacity-100' : 'opacity-0')} />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-200/50 mt-1">
                          +₹400 Surcharge
                        </span>
                      </div>
                    </div>

                    {/* Heavy Capabilities Checklist */}
                    <div className="pt-3 border-t border-neutral-100 dark:border-white/5 grid grid-cols-2 gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      <div className="flex items-center gap-2">
                        <Check className="size-3.5 text-orange-600 shrink-0 stroke-[3]" />
                        <span>Heavy towing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="size-3.5 text-orange-600 shrink-0 stroke-[3]" />
                        <span>Accident recovery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="size-3.5 text-orange-600 shrink-0 stroke-[3]" />
                        <span>Vehicle transportation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="size-3.5 text-orange-600 shrink-0 stroke-[3]" />
                        <span>Winch & crane support</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT 5 COLS: DYNAMIC ISSUE CAPABILITIES */}
                <div className="lg:col-span-5 space-y-4">

                  {/* 9. DYNAMIC ISSUE-SPECIFIC CAPABILITIES CARD */}
                  <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-3xl p-5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
                        <Wrench className="size-4.5 text-indigo-600 shrink-0" />
                        <h4 className="text-xs font-black uppercase tracking-wider">
                          {primaryIssue.label} Capabilities
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600 bg-white dark:bg-indigo-900/50 px-2 py-0.5 rounded-md border border-indigo-200/60">
                        Auto-Selected
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">
                      Capabilities automatically assigned based on your Step 1 selection:
                    </p>

                    <div className="space-y-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      {issueCapabilities.map((cap, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 bg-white/80 dark:bg-neutral-900/60 p-2 rounded-xl border border-indigo-100/60 dark:border-white/5">
                          <Check className="size-3.5 text-indigo-600 shrink-0 stroke-[3]" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 10 & 11. NAVIGATION BUTTONS (BACK TO STEP 2, REVIEW & CONFIRM TO STEP 4) */}
              <div className="flex items-center gap-4 pt-4 w-full">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 rounded-2xl bg-white dark:bg-[#151C2C] border border-neutral-200 dark:border-white/10 text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                >
                  ← Back to Step 2
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-2 py-4 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-extrabold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <span>Review & Confirm (₹{totalFee}) →</span>
                </button>
              </div>
            </FadeIn>
          )
        })()}

        {/* STEP 4: CONFIRMATION */}
        {step === 4 && selectedIssues.length > 0 && (() => {
          const primaryIssue = selectedIssues[0] || emergencies[0]
          const isHighPriority = primaryIssue.category === 'Engine' || primaryIssue.category === 'Towing' || primaryIssue.id === 'engine' || primaryIssue.id === 'towing'
          const isHoldExpired = holdSeconds <= 0

          return (
            <FadeIn key="step4" className="space-y-6 w-full max-w-none">
              {/* STEP HEADER WITH TOP-RIGHT SECURE BADGE */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full border-b border-neutral-200/80 dark:border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                      Step 4 of 4
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">• Final Booking Confirmation</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                    Step 4: Final Dispatch Summary
                  </h2>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
                    Review booking details before initiating priority dispatch
                  </p>
                </div>

                {/* TOP RIGHT SECURE BOOKING BADGE */}
                <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/50 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-2xs shrink-0 self-start sm:self-auto">
                  <div className="size-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-sm">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-emerald-950 dark:text-emerald-200 block">
                      🛡 Secure Booking
                    </span>
                    <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                      Your data is 100% protected
                    </span>
                  </div>
                </div>
              </div>

              {/* 2-COLUMN RESPONSIVE MAIN CONTAINER */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
                {/* LEFT COLUMN: ISSUES + VEHICLE/LOCATION/SQUAD + WHAT YOU GET + ASSURANCE (7 Cols on LG) */}
                <div className="lg:col-span-7 space-y-6 w-full">
                  
                  {/* 2. SELECTED BREAKDOWN ISSUES CARD */}
                  <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 lg:p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-black text-sm">
                          <Wrench className="size-4.5" />
                        </div>
                        <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                          Selected Breakdown Issues ({selectedIssues.length})
                        </h3>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/50">
                        Transferred from Step 1
                      </span>
                    </div>

                    {/* MAIN PROMINENT ISSUE SHOWCASE */}
                    <div className="bg-neutral-50/80 dark:bg-white/5 rounded-2xl p-4 sm:p-5 border border-neutral-200/70 dark:border-white/5 flex flex-col sm:flex-row items-start gap-4 sm:gap-5 transition-all">
                      {/* Issue Image on the LEFT */}
                      <div className="size-28 sm:size-32 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-2 flex items-center justify-center shrink-0 shadow-sm overflow-hidden mx-auto sm:mx-0">
                        <img
                          src={primaryIssue.image || '/images/issues/general-service.png'}
                          alt={primaryIssue.label}
                          className="max-h-full max-w-full object-contain rounded-xl"
                        />
                      </div>

                      {/* Beside Image Info */}
                      <div className="flex-1 space-y-2 text-left min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h4 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-[#F8FAFC]">
                              {primaryIssue.label}
                            </h4>
                            <p className="text-xs font-semibold text-neutral-500">{primaryIssue.sub}</p>
                          </div>
                          {isHighPriority ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200/60">
                              HIGH PRIORITY
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60">
                              PRIORITY SERVICE
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed">
                          {primaryIssue.description}
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono font-bold border-t border-neutral-200/60 dark:border-white/5">
                          <div className="flex items-center gap-1.5 text-emerald-600">
                            <Clock className="size-3.5" />
                            <span>Estimated Arrival: ~{primaryIssue.eta || '10 min'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-indigo-600">
                            <span>Service Fee: ₹{primaryIssue.fee}.00</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* LIST ADDITIONAL ISSUES IF MULTIPLE SELECTED */}
                    {selectedIssues.length > 1 && (
                      <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-white/5">
                        <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider block">
                          Additional Selected Services:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedIssues.slice(1).map((issue) => (
                            <div
                              key={issue.id}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 text-xs font-bold border border-neutral-100 dark:border-white/5"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="size-2 rounded-full bg-indigo-600 shrink-0" />
                                <span className="truncate">{issue.label}</span>
                              </div>
                              <span className="font-mono text-indigo-600 shrink-0">₹{issue.fee}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3, 4. COMPACT 2-GRID CARDS (VEHICLE & LOCATION) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {/* 3. VEHICLE DETAILS CARD */}
                    <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-4 space-y-3 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center gap-2 text-purple-600 border-b border-neutral-100 dark:border-white/5 pb-2">
                        <Car className="size-4 shrink-0" />
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                          Vehicle
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="size-11 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200/50">
                          <Car className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                            {activeVehicleObj.name}
                          </h4>
                          <p className="text-[11px] font-mono font-extrabold text-neutral-500 truncate mt-0.5">
                            {activeVehicleObj.plate}
                          </p>
                          <p className="text-[10px] text-neutral-400 truncate font-medium">
                            Color: {activeVehicleObj.color || 'Silver'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 dark:border-white/5 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="size-3 stroke-[3]" /> Verified Vehicle
                      </div>
                    </div>

                    {/* 4. LOCATION CARD */}
                    <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-4 space-y-3 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center gap-2 text-blue-600 border-b border-neutral-100 dark:border-white/5 pb-2">
                        <MapPin className="size-4 shrink-0" />
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                          Location
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="size-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/50">
                          <Navigation className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                            {geocodedAddress ? geocodedAddress.split(',')[0] : 'NH-45 GST Road'}
                          </h4>
                          <p className="text-[11px] text-neutral-500 font-medium truncate mt-0.5">
                            {geocodedAddress || (userCoords ? `${userCoords.latitude.toFixed(3)}°, ${userCoords.longitude.toFixed(3)}°` : 'Chengalpattu, Tamil Nadu')}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 dark:border-white/5 text-[10px] font-bold text-blue-600 flex items-center gap-1">
                        <Navigation className="size-2.5 animate-spin" /> Live GPS Locked
                      </div>
                    </div>
                  </div>

                  {/* 8. "WHAT YOU GET" SECTION */}
                  <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-white/5 pb-3">
                      <Sparkles className="size-4.5 text-indigo-600 shrink-0" />
                      <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                        What You Get
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                      {[
                        { title: '24/7', sub: 'Emergency Support', icon: PhoneCall, bg: 'bg-indigo-50 text-indigo-600' },
                        { title: 'Verified', sub: 'Rescue Experts', icon: ShieldCheck, bg: 'bg-emerald-50 text-emerald-600' },
                        { title: 'Real-time', sub: 'GPS Tracking', icon: Navigation, bg: 'bg-blue-50 text-blue-600' },
                        { title: 'On-site', sub: 'Repair Support', icon: Wrench, bg: 'bg-amber-50 text-amber-600' },
                        { title: 'Secure &', sub: 'Cashless Payments', icon: CreditCard, bg: 'bg-purple-50 text-purple-600' },
                      ].map((item, idx) => {
                        const ItemIcon = item.icon
                        return (
                          <div key={idx} className="bg-neutral-50/80 dark:bg-white/5 p-3 rounded-2xl border border-neutral-100 dark:border-white/5 flex flex-col items-center justify-center space-y-1.5">
                            <div className={cn('size-9 rounded-xl flex items-center justify-center shadow-2xs', item.bg)}>
                              <ItemIcon className="size-4.5" />
                            </div>
                            <div>
                              <span className="text-xs font-black block text-[#0F172A] dark:text-[#F8FAFC]">{item.title}</span>
                              <span className="text-[10px] font-medium text-neutral-400 block leading-tight">{item.sub}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* 9. LIFEOS ASSURANCE SECTION */}
                  <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
                    <div className="space-y-3 z-10">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="size-5 text-indigo-400" />
                        <h3 className="text-base font-black uppercase tracking-wider">LifeOS Assurance</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-indigo-100">
                        <div className="flex items-center gap-2">
                          <Check className="size-3.5 text-emerald-400 shrink-0 stroke-[3]" />
                          <span>100% Secure & Verified Squads</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="size-3.5 text-emerald-400 shrink-0 stroke-[3]" />
                          <span>Quick Response Guarantee</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="size-3.5 text-emerald-400 shrink-0 stroke-[3]" />
                          <span>Transparent Pricing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="size-3.5 text-emerald-400 shrink-0 stroke-[3]" />
                          <span>No Hidden Charges</span>
                        </div>
                      </div>
                    </div>

                    {/* Rescue Vehicle Graphic on the Right */}
                    <div className="size-24 rounded-2xl overflow-hidden border border-white/20 shrink-0 shadow-lg z-10 bg-white/10 p-1 flex items-center justify-center">
                      <img src="/images/squad/standard-rescue-suv.jpg" alt="Rescue Vehicle" className="max-h-full max-w-full object-cover rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: BOOKING COST SUMMARY + TIMER & DISPATCH CTA (5 Cols on LG) */}
                <div className="lg:col-span-5 space-y-6 w-full">
                  
                  {/* 6. BOOKING COST SUMMARY CARD */}
                  <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                          <CreditCard className="size-4.5" />
                        </div>
                        <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                          Booking Cost Summary
                        </h3>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50">
                        Transparent Pricing
                      </span>
                    </div>

                    {/* ITEMIZED COST BREAKDOWN */}
                    <div className="space-y-3 text-xs sm:text-sm">
                      <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-300 font-medium">
                        <span>Base Service Fee</span>
                        <span className="font-mono font-bold text-neutral-800 dark:text-neutral-100">₹{baseFee}.00</span>
                      </div>
                      <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-300 font-medium">
                        <span>Priority Handling Fee</span>
                        <span className="font-mono font-bold text-neutral-800 dark:text-neutral-100">₹150.00</span>
                      </div>
                      <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-300 font-medium">
                        <span>{providerTier === 'heavy' ? 'Heavy Recovery Surcharge' : 'Night/Highway Assistance'}</span>
                        <span className="font-mono font-bold text-neutral-800 dark:text-neutral-100">
                          ₹{providerTier === 'heavy' ? 400 : 100}.00
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-300 font-medium">
                        <span>GST (18% Included)</span>
                        <span className="font-mono font-bold text-neutral-800 dark:text-neutral-100">
                          ₹{Math.round(totalFee * 0.18)}.00
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-emerald-600 font-bold">
                        <span>VIP Member Discount Applied</span>
                        <span className="font-mono">
                          -₹{150 + (providerTier === 'heavy' ? 0 : 100) + Math.round(totalFee * 0.18)}.00
                        </span>
                      </div>

                      <div className="pt-3 border-t border-neutral-100 dark:border-white/5 flex justify-between items-center text-neutral-800 dark:text-neutral-200 font-black">
                        <span>Combined Breakdown Fee</span>
                        <span className="font-mono text-base">₹{totalFee}.00</span>
                      </div>

                      <div className="pt-3 border-t-2 border-neutral-200 dark:border-white/10 flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                          TOTAL CASHLESS FEE
                        </span>
                        <span className="text-xl sm:text-2xl font-mono font-black text-indigo-600">
                          ₹{totalFee}.00
                        </span>
                      </div>
                    </div>

                    {/* 10. NO EXTRA CHARGES CONFIRMATION PANEL */}
                    <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/40 rounded-2xl p-3.5 flex items-center gap-3">
                      <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                      <div>
                        <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                          ✓ No extra charges
                        </h4>
                        <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                          Price locked. No hidden fees or cash required.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 11. BOOKING HOLD TIMER & FINAL DISPATCH CTA */}
                  <div className="bg-white dark:bg-[#151C2C] rounded-3xl border border-neutral-200/90 dark:border-white/10 p-6 shadow-sm space-y-4">
                    {/* COUNTDOWN TIMER BANNER */}
                    <div
                      className={cn(
                        'rounded-2xl p-4 border flex items-center justify-between transition-all',
                        isHoldExpired
                          ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50 text-rose-900 dark:text-rose-200'
                          : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200'
                      )}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Clock className={cn('size-4 shrink-0', isHoldExpired ? 'text-rose-600' : 'text-amber-600 animate-pulse')} />
                          <span className="text-xs font-black uppercase tracking-wider">
                            {isHoldExpired ? 'Booking Hold Expired' : 'Holding this booking for'}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium">
                          {isHoldExpired
                            ? 'Please refresh hold to proceed with dispatch.'
                            : 'Complete payment & dispatch before time runs out.'}
                        </p>
                      </div>

                      {isHoldExpired ? (
                        <button
                          onClick={() => setHoldSeconds(300)}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs transition-all hover:bg-rose-700 shadow-sm shrink-0"
                        >
                          Refresh Hold
                        </button>
                      ) : (
                        <div className="font-mono font-black text-lg sm:text-xl text-amber-600 dark:text-amber-400 bg-white dark:bg-neutral-900 px-3 py-1 rounded-xl border border-amber-200 dark:border-white/10 shadow-2xs shrink-0">
                          {formatHoldTime(holdSeconds)}
                        </div>
                      )}
                    </div>

                    {/* NAVIGATION BUTTONS: BACK & FINAL DISPATCH CTA */}
                    <div className="flex items-center gap-4 pt-1 w-full">
                      <button
                        onClick={() => setStep(3)}
                        className="flex-1 py-4 rounded-2xl bg-white dark:bg-[#151C2C] border border-neutral-200 dark:border-white/10 text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                      >
                        ← Back to Step 3
                      </button>
                      
                      <button
                        disabled={isHoldExpired || selectedIssues.length === 0}
                        onClick={() => {
                          if (isHoldExpired || selectedIssues.length === 0) return
                          onConfirm(selectedIssues, selectedVehicle, notes)
                        }}
                        className={cn(
                          'flex-2 py-4 rounded-2xl text-xs sm:text-sm font-extrabold text-white shadow-lg transition-all flex flex-col items-center justify-center cursor-pointer active:scale-[0.99]',
                          !isHoldExpired && selectedIssues.length > 0
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25'
                            : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed shadow-none'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="size-5" />
                          <span>Dispatch Rescue (₹{totalFee})</span>
                        </div>
                        <span className="text-[10px] font-normal text-indigo-100 opacity-90 mt-0.5">
                          Confirm & Send Squad
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )
        })()}
      </div>

      {/* MODAL FOR ADDING CUSTOM OTHER ISSUE */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#131316] border border-neutral-200 dark:border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                  <Plus className="size-5" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">Add Custom Breakdown Issue</h3>
              </div>
              <button onClick={() => setShowCustomModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">Issue Title *</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g., Strange Brake Squeal / Transmission Slip"
                  className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">Subtitle / Category Summary</label>
                <input
                  type="text"
                  value={customSub}
                  onChange={(e) => setCustomSub(e.target.value)}
                  placeholder="e.g., Mechanical / Noise inspection"
                  className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">Issue Description & Details</label>
                <textarea
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Describe what happened or what noise/behavior you noticed..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">Estimated Diagnostic Fee (₹)</label>
                <input
                  type="number"
                  value={customFee}
                  onChange={(e) => setCustomFee(e.target.value)}
                  className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomIssue}
                disabled={!customTitle.trim()}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-white font-extrabold text-xs transition-all shadow-md',
                  customTitle.trim() ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-neutral-300 cursor-not-allowed'
                )}
              >
                Add Issue & Select
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
