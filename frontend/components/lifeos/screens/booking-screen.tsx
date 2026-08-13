'use client'

import { useState } from 'react'
import { emergencies, vehicles, type Emergency, mechanic, type Vehicle } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { useLocation } from '@/lib/use-location'
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

  // Real location integration hook
  const { location: userCoords, loading: locationLoading, error: locationError } = useLocation()

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
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                Step 2: Confirm Location & Vehicle
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Verify exact GPS coordinates and vehicle registration
              </p>
            </div>

            {/* Selected Breakdown Summary Pill */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 flex items-center justify-between gap-3 text-xs shadow-sm w-full">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-indigo-600 block uppercase tracking-wider">
                  Breakdown Package ({selectedIssues.length})
                </span>
                <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate text-sm">
                  {selectedIssues.map((i) => i.label).join(', ')}
                </p>
              </div>
              <span className="font-mono font-bold text-indigo-600 text-lg shrink-0">₹{baseFee}</span>
            </div>

            {/* Live Location Pill */}
            <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 flex items-center gap-4 w-full shadow-sm">
              <div className="size-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <MapPin className="size-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">GPS Coordinates Verified</p>
                <p className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                  {userCoords ? `${userCoords.latitude.toFixed(4)}°, ${userCoords.longitude.toFixed(4)}° · GPS Locked` : (mechanic.location || 'NH-45 GST Road · Chengalpattu, Tamil Nadu')}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-sm">
                Live GPS
              </span>
            </div>

            {/* Select Registered Vehicle */}
            <div className="space-y-3 w-full">
              <label className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                Target Vehicle
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {userVehicles.map((v) => {
                  const active = selectedVehicle === v.id
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVehicle(v.id)}
                      className={cn(
                        'flex items-center justify-between p-4 rounded-2xl cursor-pointer border transition-all bg-white dark:bg-[#151C2C] shadow-sm',
                        active
                          ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                          : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                          <Car className="size-5" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">{v.name}</p>
                          <p className="text-[11px] font-mono text-neutral-500">{v.color} · {v.plate}</p>
                        </div>
                      </div>
                      {active && <Check className="size-5 text-indigo-600" />}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Landmark notes */}
            <div className="space-y-2 w-full">
              <label className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                Landmark / Situation Details
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Parked near Paranur Toll Plaza, GST Road Highway southbound lane..."
                rows={3}
                className="w-full rounded-2xl p-4 text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-neutral-400 bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none shadow-sm"
              />
            </div>

            <div className="flex gap-4 pt-2 w-full">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-xl bg-white dark:bg-[#151C2C] border border-neutral-200 dark:border-white/10 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Select Provider</span>
                <ChevronRight className="size-4" />
              </button>
            </div>
          </FadeIn>
        )}

        {/* STEP 3: PROVIDER TIER */}
        {step === 3 && (
          <FadeIn key="step3" className="space-y-6 w-full max-w-none">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                Step 3: Select Dispatch Tier
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Choose standard certified responder or heavy recovery rig
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div
                onClick={() => setProviderTier('standard')}
                className={cn(
                  'p-6 rounded-2xl cursor-pointer border space-y-3 min-w-0 bg-white dark:bg-[#151C2C] transition-all shadow-sm',
                  providerTier === 'standard'
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                    : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300'
                )}
              >
                <div className="flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-4 min-w-0 flex-1 mr-2">
                    <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="size-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                        Standard Priority Rescue Squad
                      </h4>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">
                        Certified EV & Drivetrain Specialist (~{maxEtaMin || 8} min ETA)
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-indigo-600 shrink-0">Standard Rate</span>
                </div>
              </div>

              <div
                onClick={() => setProviderTier('heavy')}
                className={cn(
                  'p-6 rounded-2xl cursor-pointer border space-y-3 min-w-0 bg-white dark:bg-[#151C2C] transition-all shadow-sm',
                  providerTier === 'heavy'
                    ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/30 ring-2 ring-orange-500/20'
                    : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300'
                )}
              >
                <div className="flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-4 min-w-0 flex-1 mr-2">
                    <div className="size-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                      <ShieldAlert className="size-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                        Heavy Rescue & Towing Rig
                      </h4>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">
                        Heavy Recovery Truck + Flatbed Hydraulic Rig
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-orange-600 shrink-0">+₹400 Surcharge</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-2 w-full">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3.5 rounded-xl bg-white dark:bg-[#151C2C] border border-neutral-200 dark:border-white/10 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Review & Confirm</span>
                <ChevronRight className="size-4" />
              </button>
            </div>
          </FadeIn>
        )}

        {/* STEP 4: CONFIRMATION */}
        {step === 4 && selectedIssues.length > 0 && (
          <FadeIn key="step4" className="space-y-6 w-full max-w-none">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                Step 4: Final Dispatch Summary
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Review booking details before initiating priority dispatch
              </p>
            </div>

            <div className="p-6 lg:p-8 rounded-3xl bg-white dark:bg-[#151C2C] border border-neutral-200 dark:border-white/10 space-y-6 shadow-xl min-w-0 w-full">
              <div className="border-b border-neutral-100 dark:border-white/10 pb-5 space-y-4">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div>
                    <h3 className="text-base font-black text-[#0F172A] dark:text-[#F8FAFC]">
                      Selected Breakdown Issues ({selectedIssues.length})
                    </h3>
                    <p className="text-xs text-neutral-500">Combined Priority Service Package</p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
                    ~{maxEtaMin || 10} min Arrival
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {selectedIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex justify-between items-center gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-white/5 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="size-2.5 rounded-full bg-indigo-600 shrink-0" />
                        <span className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC] truncate text-xs sm:text-sm">
                          {issue.label}
                        </span>
                        <span className="text-xs text-neutral-400 truncate hidden sm:inline">
                          ({issue.sub})
                        </span>
                      </div>
                      <span className="font-mono font-black text-indigo-600 text-sm shrink-0">₹{issue.fee}.00</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center gap-2 text-neutral-500 min-w-0">
                  <span className="shrink-0">Vehicle</span>
                  <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate text-right">
                    {activeVehicleObj.name} ({activeVehicleObj.plate})
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2 text-neutral-500 min-w-0">
                  <span className="shrink-0">Location</span>
                  <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate text-right">
                    NH-45 GST Road Corridor
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2 text-neutral-500 min-w-0">
                  <span className="shrink-0">Assigned Squad</span>
                  <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate text-right">
                    {mechanic.name}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2 text-neutral-500 min-w-0 pt-3 border-t border-neutral-100 dark:border-white/10">
                  <span className="shrink-0">Combined Breakdown Fee</span>
                  <span className="font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC] shrink-0 text-sm">
                    ₹{baseFee}.00
                  </span>
                </div>
                {providerTier === 'heavy' && (
                  <div className="flex justify-between items-center gap-2 text-neutral-500 min-w-0">
                    <span className="shrink-0">Heavy Flatbed Surcharge</span>
                    <span className="font-mono font-bold text-orange-600 shrink-0 text-sm">₹400.00</span>
                  </div>
                )}
                <div className="flex justify-between items-center gap-2 pt-4 border-t border-neutral-200 dark:border-white/10 font-black text-base min-w-0">
                  <span className="shrink-0">Total Cashless Fee</span>
                  <span className="text-indigo-600 font-mono text-xl shrink-0">₹{totalFee}.00</span>
                </div>
              </div>

              <div className="flex gap-4 pt-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 rounded-xl bg-white dark:bg-[#151C2C] border border-neutral-200 dark:border-white/10 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => onConfirm(selectedIssues, selectedVehicle, notes)}
                  className="flex-2 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="size-5" />
                  <span>Dispatch Rescue (₹{totalFee})</span>
                </button>
              </div>
            </div>
          </FadeIn>
        )}
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
