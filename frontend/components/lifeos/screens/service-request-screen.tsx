'use client'

import { useState } from 'react'
import { Disc3, BatteryCharging, Cog, Fuel, Wrench, ArrowLeft, MapPin, User as UserIcon, ShieldAlert, CheckCircle2, Loader2, AlertCircle, ChevronRight, Star } from 'lucide-react'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { CategoryIconBox, WarmBadge, WarmButton, WarmCard } from '@/components/ui/warm-components'
import { FadeIn } from '@/components/ui/framer-wrapper'
import { cn } from '@/lib/utils'
import { API_BASE_URL, authFetch } from '@/lib/lifeos'

const SERVICE_TYPES = [
  { id: 'Flat Tyre', label: 'Flat Tyre', icon: Disc3, color: 'blue' as const },
  { id: 'Battery Jump Start', label: 'Battery Jump Start', icon: BatteryCharging, color: 'amber' as const },
  { id: 'Engine Problem', label: 'Engine Problem', icon: Cog, color: 'emerald' as const },
  { id: 'Fuel Delivery', label: 'Fuel Delivery', icon: Fuel, color: 'orange' as const },
  { id: 'Towing', label: 'Towing', icon: Wrench, color: 'rose' as const },
]

const DB_MECHANICS = [
  { id: '6a74bc4a2e4003101b330f78', name: 'Arun Kumar (Active)', specialty: 'EV & Drivetrain Specialist', rating: 4.98 },
  { id: '6a74b8be74c4e9e3507b1985', name: 'John Doe (Secondary)', specialty: 'Heavy Rig & Engine Recovery', rating: 4.85 },
  { id: 'custom', name: 'Other Mechanic', specialty: 'Enter custom ID manually', rating: null },
]

const DB_USERS = [
  { id: '6a75f398a9509d0e2bf433c3', name: 'Riyaz (riyazmohamed3431@gmail.com)' },
  { id: '6a75f295a9509d0e2bf433bf', name: 'John Doe (john.doe@example.com)' },
  { id: '6a71f56b4a02d8862505046c', name: 'Riyaz 123 (riyaz123@gmail.com)' },
  { id: 'custom', name: 'Other User' },
]

export function ServiceRequestScreen({
  onBack,
}: {
  onBack: () => void
}) {
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center select-none font-sans bg-slate-950 text-white">
        <h1 className="text-lg font-black text-rose-500">Developer Console Disabled</h1>
        <p className="text-xs text-[#94A3B8] mt-2">Mock request generation is restricted in production environments.</p>
        <button onClick={onBack} className="mt-4 text-xs font-bold text-teal-400 hover:text-teal-300 underline cursor-pointer">Go Back</button>
      </div>
    )
  }
  const [serviceType, setServiceType] = useState('Flat Tyre')
  const [issueDescription, setIssueDescription] = useState('')
  const [latitude, setLatitude] = useState('11.0168')
  const [longitude, setLongitude] = useState('76.9558')

  // Mechanic selector states
  const [selectedMechanic, setSelectedMechanic] = useState('6a74bc4a2e4003101b330f78')
  const [customMechanicId, setCustomMechanicId] = useState('')

  // User selector states
  const [selectedUser, setSelectedUser] = useState('6a75f398a9509d0e2bf433c3')
  const [customUserId, setCustomUserId] = useState('')

  // API Call state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<{ id: string; status: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessData(null)

    const finalMechanicId = selectedMechanic === 'custom' ? customMechanicId.trim() : selectedMechanic
    const finalUserId = selectedUser === 'custom' ? customUserId.trim() : selectedUser

    // Client-side validations
    if (!finalUserId) {
      setError('Please select or enter a User ID.')
      setLoading(false)
      return
    }
    if (!finalMechanicId) {
      setError('Please select or enter a Mechanic ID.')
      setLoading(false)
      return
    }
    if (!issueDescription.trim()) {
      setError('Please provide an issue description.')
      setLoading(false)
      return
    }

    const latVal = parseFloat(latitude)
    const lngVal = parseFloat(longitude)
    if (isNaN(latVal) || isNaN(lngVal)) {
      setError('GPS Coordinates must be valid numeric values.')
      setLoading(false)
      return
    }

    try {
      const response = await authFetch(`${API_BASE_URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: finalUserId,
          mechanicId: finalMechanicId,
          serviceType,
          issueDescription: issueDescription.trim(),
          location: {
            latitude: latVal,
            longitude: lngVal,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit service request.')
      }

      setSuccessData({
        id: data._id || data.id,
        status: data.status,
      })
    } catch (err: any) {
      setError(err?.message || 'A network error occurred. Please make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto no-scrollbar pb-36 font-sans text-[#0F172A] dark:text-[#F8FAFC]">
      <AmbientBg tone="primary" />

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 pt-4 pb-2">
        <button
          onClick={onBack}
          className="bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 grid size-10 place-items-center rounded-full text-foreground hover:bg-muted transition-all cursor-pointer shadow-sm"
          aria-label="Back"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-wider block text-[#0F766E]">
            API Service Dispatch
          </span>
          <span className="text-[10px] text-[#475569] dark:text-[#94A3B8] font-semibold">
            Next-Gen Rescue Operations
          </span>
        </div>
        <div className="size-10" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 pt-2 space-y-6 max-w-2xl mx-auto flex-1 w-full">
        {/* Title */}
        <div>
          <h2 className="text-xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Step 1: Dispatch Service Request
          </h2>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Configure and trigger a direct rescue request using the backend API
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* User Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider block">
              Target User (Customer)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {DB_USERS.map((u) => {
                const isSelected = selectedUser === u.id
                return (
                  <WarmCard
                    key={u.id}
                    onClick={() => setSelectedUser(u.id)}
                    className={cn(
                      'flex items-center gap-3.5 p-3 cursor-pointer border select-none',
                      isSelected ? 'border-[#0F766E] bg-[#0F766E]/10 shadow-sm' : 'border-[#E2E8F0] hover:bg-muted/40'
                    )}
                  >
                    <CategoryIconBox icon={UserIcon} color="indigo" className="size-8" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-foreground block truncate">{u.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground block truncate">{u.id}</span>
                    </div>
                  </WarmCard>
                )
              })}
            </div>

            {selectedUser === 'custom' && (
              <FadeIn>
                <div className="space-y-1 mt-2">
                  <label className="text-[10px] font-bold text-[#475569] dark:text-[#94A3B8] uppercase block">Custom User ObjectId</label>
                  <input
                    type="text"
                    value={customUserId}
                    onChange={(e) => setCustomUserId(e.target.value)}
                    placeholder="Enter 24-character hexadecimal User ID..."
                    required
                    className="w-full rounded-2xl px-3.5 py-3 text-xs text-[#0F172A] dark:text-[#F8FAFC] bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 font-mono shadow-sm"
                  />
                </div>
              </FadeIn>
            )}
          </div>

          {/* Service Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider block">
              Service Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SERVICE_TYPES.map((service) => {
                const isSelected = serviceType === service.id
                const Icon = service.icon
                return (
                  <WarmCard
                    key={service.id}
                    onClick={() => setServiceType(service.id)}
                    className={cn(
                      'flex items-center gap-3.5 p-3.5 cursor-pointer transition-all border select-none',
                      isSelected
                        ? 'border-[#0F766E] bg-[#0F766E]/10 shadow-md ring-2 ring-[#0F766E]/30'
                        : 'border-[#E2E8F0] hover:bg-muted/40 opacity-90'
                    )}
                  >
                    <CategoryIconBox icon={Icon} color={service.color} className="size-9" />
                    <span className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                      {service.label}
                    </span>
                  </WarmCard>
                )
              })}
            </div>
          </div>

          {/* Mechanic Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider block">
              Assigned Mechanic
            </label>
            <div className="grid grid-cols-1 gap-2">
              {DB_MECHANICS.map((m) => {
                const isSelected = selectedMechanic === m.id
                return (
                  <WarmCard
                    key={m.id}
                    onClick={() => setSelectedMechanic(m.id)}
                    className={cn(
                      'flex items-center justify-between p-3.5 cursor-pointer border select-none',
                      isSelected ? 'border-[#0F766E] bg-[#0F766E]/10 shadow-sm' : 'border-[#E2E8F0] hover:bg-muted/40'
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-2">
                      <CategoryIconBox icon={Wrench} color="emerald" className="size-8" />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-black text-foreground block truncate">{m.name}</span>
                        <span className="text-[10px] text-muted-foreground block truncate">{m.specialty}</span>
                        <span className="text-[9px] font-mono text-muted-foreground block truncate">{m.id}</span>
                      </div>
                    </div>
                    {m.rating && (
                      <div className="flex items-center gap-1 text-[#F59E0B] text-xs font-bold shrink-0">
                        <Star className="size-3.5 fill-[#F59E0B] stroke-[#F59E0B]" />
                        <span>{m.rating}</span>
                      </div>
                    )}
                  </WarmCard>
                )
              })}
            </div>

            {selectedMechanic === 'custom' && (
              <FadeIn>
                <div className="space-y-1 mt-2">
                  <label className="text-[10px] font-bold text-[#475569] dark:text-[#94A3B8] uppercase block">Custom Mechanic ObjectId</label>
                  <input
                    type="text"
                    value={customMechanicId}
                    onChange={(e) => setCustomMechanicId(e.target.value)}
                    placeholder="Enter 24-character hexadecimal Mechanic ID..."
                    required
                    className="w-full rounded-2xl px-3.5 py-3 text-xs text-[#0F172A] dark:text-[#F8FAFC] bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 font-mono shadow-sm"
                  />
                </div>
              </FadeIn>
            )}
          </div>

          {/* Issue Description */}
          <div className="space-y-2">
            <label className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider block">
              Issue Description
            </label>
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="e.g., Car engine started overheating, parked on shoulder GST Road near toll booth..."
              rows={3}
              required
              className="w-full rounded-2xl p-3.5 text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#475569] dark:placeholder:text-[#94A3B8] bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 resize-none shadow-sm"
            />
          </div>

          {/* Location fields */}
          <div className="space-y-2">
            <label className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider block">
              GPS Coordinates
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">Lat</span>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                  className="w-full rounded-2xl pl-10 pr-3.5 py-3 text-xs text-[#0F172A] dark:text-[#F8FAFC] bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 shadow-sm font-mono"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">Lng</span>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                  className="w-full rounded-2xl pl-10 pr-3.5 py-3 text-xs text-[#0F172A] dark:text-[#F8FAFC] bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 shadow-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Feedback & Submission States */}
          {loading && (
            <div className="p-4 rounded-2xl bg-[#0F766E]/5 border border-[#0F766E]/20 flex items-center gap-3 text-xs text-[#0F766E] dark:text-[#2DD4BF] animate-pulse">
              <Loader2 className="size-4 animate-spin" />
              <span>Contacting rescue dispatch servers and allocating response squad...</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-600 dark:text-rose-400">
              <ShieldAlert className="size-5 shrink-0 text-rose-500" />
              <div className="space-y-0.5">
                <p className="font-bold">Dispatch Failure</p>
                <p className="opacity-90">{error}</p>
              </div>
            </div>
          )}

          {successData && (
            <div className="space-y-3">
              <div className="p-4.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3.5 text-xs text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="size-6 shrink-0 text-emerald-500 mt-0.5" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <p className="font-black text-sm">Priority Dispatch Initiated!</p>
                  <div className="space-y-1 font-mono text-[11px] leading-relaxed">
                    <div>
                      <span className="opacity-70">Request ID:</span>{' '}
                      <span className="font-bold text-foreground bg-white/20 dark:bg-white/5 px-1.5 py-0.5 rounded border border-white/10">{successData.id}</span>
                    </div>
                    <div>
                      <span className="opacity-70">Initial Status:</span>{' '}
                      <WarmBadge variant="emerald" className="py-0.5">{successData.status}</WarmBadge>
                    </div>
                  </div>
                </div>
              </div>

              <WarmButton
                type="button"
                variant="secondary"
                size="md"
                className="w-full flex items-center gap-2"
                onClick={() => {
                  window.location.href = `/request-status?requestId=${successData.id}`;
                }}
              >
                Track Request Status <ChevronRight className="size-4" />
              </WarmButton>
            </div>
          )}

          {/* Submit Button */}
          <WarmButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full shadow-lg"
            disabled={loading}
          >
            {loading ? 'Initiating Dispatch...' : 'Request Mechanic'}
          </WarmButton>
        </form>
      </div>
    </div>
  )
}
