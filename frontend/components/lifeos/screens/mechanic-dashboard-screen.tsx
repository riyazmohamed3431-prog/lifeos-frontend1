'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, RefreshCw, Wrench, ShieldAlert, CheckCircle2, Loader2, AlertCircle, Phone, Clock, MapPin, DollarSign, Star } from 'lucide-react'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { CategoryIconBox, WarmBadge, WarmButton, WarmCard } from '@/components/ui/warm-components'
import { FadeIn } from '@/components/ui/framer-wrapper'
import { cn } from '@/lib/utils'
import { API_BASE_URL, authFetch } from '@/lib/lifeos'

const DB_MECHANICS = [
  { id: '6a74bc4a2e4003101b330f78', name: 'Arun Kumar (Active)', specialty: 'EV & Drivetrain Specialist' },
  { id: '6a74b8be74c4e9e3507b1985', name: 'John Doe (Secondary)', specialty: 'Heavy Rig & Engine Recovery' },
  { id: 'custom', name: 'Custom Mechanic ID', specialty: 'Enter custom ID manually' },
]

type RequestItem = {
  _id: string
  serviceType: string
  issueDescription: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
  location: {
    latitude: number
    longitude: number
  }
  estimate?: {
    labourCharge: number
    partsCharge: number
    travelCharge: number
    totalAmount: number
    approved: boolean
  }
  payment?: {
    status: 'pending' | 'paid' | 'failed'
    amount: number
  }
  createdAt: string
}

export function MechanicDashboardScreen({
  onBack,
}: {
  onBack: () => void
}) {
  const [selectedMechanic, setSelectedMechanic] = useState('6a74bc4a2e4003101b330f78')
  const [customMechanicId, setCustomMechanicId] = useState('')

  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Complete & Estimate Form state
  const [estimatingId, setEstimatingId] = useState<string | null>(null)
  const [labourCharge, setLabourCharge] = useState('200')
  const [partsCharge, setPartsCharge] = useState('100')
  const [travelCharge, setTravelCharge] = useState('50')
  const [submittingEstimate, setSubmittingEstimate] = useState(false)

  const activeMechanicId = selectedMechanic === 'custom' ? customMechanicId.trim() : selectedMechanic

  const fetchMechanicRequests = useCallback(async (mechId: string) => {
    if (!mechId) {
      setRequests([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await authFetch(`${API_BASE_URL}/api/requests/mechanic/${mechId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch mechanic assignments.')
      }

      setRequests(data.requests || [])
    } catch (err: any) {
      setError(err?.message || 'Failed to load requests from server.')
      setRequests([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const syncMechanicToken = async () => {
      if (!activeMechanicId || activeMechanicId === '') return
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/mechanic-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mechanicId: activeMechanicId }),
        })
        if (res.ok) {
          const data = await res.json()
          localStorage.setItem('lifeos_jwt_token', data.token)
          // Fetch requests using the token
          fetchMechanicRequests(activeMechanicId)
        }
      } catch (err) {
        console.error('Error logging in mechanic:', err)
      }
    }
    syncMechanicToken()
  }, [activeMechanicId, fetchMechanicRequests])

  const handleAccept = async (requestId: string) => {
    setError(null)
    try {
      const response = await authFetch(`${API_BASE_URL}/api/requests/${requestId}/accept`, {
        method: 'PATCH',
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to accept request.')
      }
      // Refresh list
      fetchMechanicRequests(activeMechanicId)
    } catch (err: any) {
      setError(err?.message || 'Error occurred while accepting request.')
    }
  }

  const handleReject = async (requestId: string) => {
    setError(null)
    try {
      const response = await authFetch(`${API_BASE_URL}/api/requests/${requestId}/reject`, {
        method: 'PATCH',
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to reject request.')
      }
      // Refresh list
      fetchMechanicRequests(activeMechanicId)
    } catch (err: any) {
      setError(err?.message || 'Error occurred while rejecting request.')
    }
  }

  const handleCompleteAndEstimate = async (e: React.FormEvent, requestId: string) => {
    e.preventDefault()
    if (!estimatingId) return

    setSubmittingEstimate(true)
    setError(null)

    try {
      // 1. Complete Request
      const completeResponse = await authFetch(`${API_BASE_URL}/api/requests/${requestId}/complete`, {
        method: 'PATCH',
      })
      if (!completeResponse.ok) {
        const data = await completeResponse.json()
        throw new Error(data.message || 'Failed to mark request as completed.')
      }

      // 2. Add Estimate
      const estimateResponse = await authFetch(`${API_BASE_URL}/api/requests/${requestId}/estimate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          labourCharge: parseFloat(labourCharge) || 0,
          partsCharge: parseFloat(partsCharge) || 0,
          travelCharge: parseFloat(travelCharge) || 0,
        }),
      })

      if (!estimateResponse.ok) {
        const data = await estimateResponse.json()
        throw new Error(data.message || 'Failed to upload service estimate.')
      }

      setEstimatingId(null)
      fetchMechanicRequests(activeMechanicId)
    } catch (err: any) {
      setError(err?.message || 'Error occurred during service completion.')
    } finally {
      setSubmittingEstimate(false)
    }
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending')
  const acceptedRequests = requests.filter((r) => r.status === 'accepted')
  const completedRequests = requests.filter((r) => r.status === 'completed' || r.status === 'rejected' || r.status === 'cancelled')

  return (
    <div className="relative flex h-full min-h-screen flex-col overflow-y-auto no-scrollbar pb-36 font-sans text-[#0F172A] dark:text-[#F8FAFC]">
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
            Mechanic Portal
          </span>
          <span className="text-[10px] text-[#475569] dark:text-[#94A3B8] font-semibold">
            Squad Dispatch Console
          </span>
        </div>
        <button
          onClick={() => fetchMechanicRequests(activeMechanicId)}
          disabled={loading || !activeMechanicId}
          className="bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 grid size-10 place-items-center rounded-full text-foreground hover:bg-muted transition-all cursor-pointer shadow-sm disabled:opacity-40"
          aria-label="Refresh"
        >
          <RefreshCw className={cn('size-4.5', loading && 'animate-spin')} />
        </button>
      </div>

      <div className="relative z-10 px-4 sm:px-6 pt-2 space-y-6 max-w-2xl mx-auto flex-1 w-full">
        {/* Mechanic ID Selector */}
        {process.env.NODE_ENV !== 'production' ? (
          <div className="space-y-2">
            <label className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider block">
              Select Active Mechanic Identity
            </label>
            <div className="grid grid-cols-1 gap-2">
              {DB_MECHANICS.map((m) => {
                const isSelected = selectedMechanic === m.id
                return (
                  <WarmCard
                    key={m.id}
                    onClick={() => setSelectedMechanic(m.id)}
                    className={cn(
                      'flex items-center gap-3.5 p-3 cursor-pointer border select-none',
                      isSelected ? 'border-[#0F766E] bg-[#0F766E]/10 shadow-sm' : 'border-[#E2E8F0] hover:bg-muted/40'
                    )}
                  >
                    <CategoryIconBox icon={Wrench} color="emerald" className="size-8" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-foreground block truncate">{m.name}</span>
                      <span className="text-[10px] text-muted-foreground block truncate">{m.specialty}</span>
                    </div>
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
                    placeholder="Enter 24-character Mechanic ID..."
                    required
                    className="w-full rounded-2xl px-3.5 py-3 text-xs text-[#0F172A] dark:text-[#F8FAFC] bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 font-mono shadow-sm"
                  />
                </div>
              </FadeIn>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider block">
              Mechanic Command Center
            </label>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#475569] dark:text-[#94A3B8] uppercase block">Assigned Mechanic ObjectId</label>
              <input
                type="text"
                value={customMechanicId}
                onChange={(e) => {
                  setCustomMechanicId(e.target.value)
                  setSelectedMechanic('custom')
                }}
                placeholder="Enter your 24-character Mechanic ID..."
                required
                className="w-full rounded-2xl px-3.5 py-3 text-xs text-[#0F172A] dark:text-[#F8FAFC] bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 font-mono shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Global Loading state */}
        {loading && (
          <div className="p-8 rounded-3xl bg-card border border-border flex flex-col items-center justify-center gap-3 text-center shadow-sm">
            <Loader2 className="size-8 text-[#0F766E] animate-spin" />
            <span className="text-xs text-muted-foreground font-bold">Fetching service request logs...</span>
          </div>
        )}

        {/* Global Error state */}
        {!loading && error && (
          <div className="p-4.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3.5 text-xs text-rose-700 dark:text-rose-400 shadow-sm">
            <ShieldAlert className="size-5 shrink-0 text-rose-500 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">System Warning</p>
              <p className="opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* MAIN REQUESTS DASHBOARD VIEWS */}
        {!loading && activeMechanicId && (
          <div className="space-y-6">
            
            {/* PENDING ASSIGNMENTS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">Pending Requests ({pendingRequests.length})</span>
                <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              
              {pendingRequests.length === 0 ? (
                <p className="text-xs text-muted-foreground italic pl-1">No pending requests at present.</p>
              ) : (
                <div className="space-y-3.5">
                  {pendingRequests.map((req) => (
                    <WarmCard key={req._id} className="p-4 border border-border space-y-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono text-muted-foreground bg-[#F8FAFC] dark:bg-[#151C2C] px-1.5 py-0.5 rounded border border-border">ID: {req._id}</span>
                          <h4 className="text-sm font-black text-foreground mt-2">{req.serviceType}</h4>
                        </div>
                        <WarmBadge variant="amber">Pending</WarmBadge>
                      </div>
                      
                      <div className="text-xs space-y-1.5 text-muted-foreground">
                        <p className="text-foreground font-semibold line-clamp-2">{req.issueDescription}</p>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-blue-500 shrink-0" />
                          <span className="font-mono text-[11px]">Lat: {req.location.latitude} · Lng: {req.location.longitude}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-[#0F766E] shrink-0" />
                          <span>Reported: {new Date(req.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2.5 pt-1.5">
                        <WarmButton
                          onClick={() => handleReject(req._id)}
                          variant="danger"
                          size="sm"
                          className="flex-1"
                        >
                          Reject
                        </WarmButton>
                        <WarmButton
                          onClick={() => handleAccept(req._id)}
                          variant="primary"
                          size="sm"
                          className="flex-1"
                        >
                          Accept
                        </WarmButton>
                      </div>
                    </WarmCard>
                  ))}
                </div>
              )}
            </div>

            {/* ACTIVE/ACCEPTED ASSIGNMENTS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">Active Tasks ({acceptedRequests.length})</span>
                <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
              </div>

              {acceptedRequests.length === 0 ? (
                <p className="text-xs text-muted-foreground italic pl-1">No active requests en route.</p>
              ) : (
                <div className="space-y-3.5">
                  {acceptedRequests.map((req) => {
                    const isEstimating = estimatingId === req._id
                    return (
                      <WarmCard key={req._id} className="p-4 border border-border space-y-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono text-muted-foreground bg-[#F8FAFC] dark:bg-[#151C2C] px-1.5 py-0.5 rounded border border-border">ID: {req._id}</span>
                            <h4 className="text-sm font-black text-foreground mt-2">{req.serviceType}</h4>
                          </div>
                          <WarmBadge variant="blue">En Route</WarmBadge>
                        </div>
                        
                        <div className="text-xs space-y-1.5 text-muted-foreground">
                          <p className="text-foreground font-semibold">{req.issueDescription}</p>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-blue-500 shrink-0" />
                            <span className="font-mono text-[11px]">Lat: {req.location.latitude} · Lng: {req.location.longitude}</span>
                          </div>
                        </div>

                        {!isEstimating ? (
                          <WarmButton
                            onClick={() => setEstimatingId(req._id)}
                            variant="indigo"
                            size="sm"
                            className="w-full"
                          >
                            Mark Completed & Add Estimate
                          </WarmButton>
                        ) : (
                          <FadeIn>
                            <form onSubmit={(e) => handleCompleteAndEstimate(e, req._id)} className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-3 mt-2.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 block">Complete Service Invoice</span>
                              
                              <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Labour (₹)</label>
                                  <input
                                    type="number"
                                    value={labourCharge}
                                    onChange={(e) => setLabourCharge(e.target.value)}
                                    required
                                    className="w-full rounded-xl px-2 py-1.5 text-xs text-foreground bg-white dark:bg-[#151C2C] border border-border focus:outline-none focus:ring-1 focus:ring-[#0F766E]/40"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Parts (₹)</label>
                                  <input
                                    type="number"
                                    value={partsCharge}
                                    onChange={(e) => setPartsCharge(e.target.value)}
                                    required
                                    className="w-full rounded-xl px-2 py-1.5 text-xs text-foreground bg-white dark:bg-[#151C2C] border border-border focus:outline-none focus:ring-1 focus:ring-[#0F766E]/40"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Travel (₹)</label>
                                  <input
                                    type="number"
                                    value={travelCharge}
                                    onChange={(e) => setTravelCharge(e.target.value)}
                                    required
                                    className="w-full rounded-xl px-2 py-1.5 text-xs text-foreground bg-white dark:bg-[#151C2C] border border-border focus:outline-none focus:ring-1 focus:ring-[#0F766E]/40"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-between items-center text-xs font-black border-t border-border pt-2.5 mt-2 text-foreground">
                                <span>Calculated Total Amount:</span>
                                <span className="text-[#0F766E] font-mono text-sm">₹{(parseFloat(labourCharge) || 0) + (parseFloat(partsCharge) || 0) + (parseFloat(travelCharge) || 0)}</span>
                              </div>

                              <div className="flex gap-2 mt-2">
                                <WarmButton
                                  type="button"
                                  onClick={() => setEstimatingId(null)}
                                  variant="ghost"
                                  size="sm"
                                  className="flex-1"
                                >
                                  Cancel
                                </WarmButton>
                                <WarmButton
                                  type="submit"
                                  variant="indigo"
                                  size="sm"
                                  className="flex-2"
                                  disabled={submittingEstimate}
                                >
                                  {submittingEstimate ? 'Submitting...' : 'Submit & Close Request'}
                                </WarmButton>
                              </div>
                            </form>
                          </FadeIn>
                        )}
                      </WarmCard>
                    )
                  })}
                </div>
              )}
            </div>

            {/* CLOSED/COMPLETED HISTORY */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Closed / Completed Logs ({completedRequests.length})</span>
                <span className="size-2 rounded-full bg-slate-400" />
              </div>

              {completedRequests.length === 0 ? (
                <p className="text-xs text-muted-foreground italic pl-1">No closed requests recorded.</p>
              ) : (
                <div className="space-y-3.5">
                  {completedRequests.map((req) => {
                    const isClosedSuccess = req.status === 'completed'
                    const isClosedFail = req.status === 'rejected' || req.status === 'cancelled'
                    return (
                      <WarmCard key={req._id} className="p-4 border border-border space-y-2.5 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono text-muted-foreground">ID: {req._id}</span>
                            <h4 className="text-xs font-black text-foreground truncate mt-1">{req.serviceType}</h4>
                          </div>
                          <WarmBadge variant={isClosedSuccess ? 'green' : 'rose'}>
                            {req.status}
                          </WarmBadge>
                        </div>

                        {req.estimate && req.estimate.totalAmount > 0 && (
                          <div className="text-xs font-bold font-mono text-[#0F766E] border-t border-border/50 pt-2 flex justify-between">
                            <span>Estimate Invoiced:</span>
                            <span>₹{req.estimate.totalAmount} ({req.payment && req.payment.status === 'paid' ? 'PAID' : 'UNPAID'})</span>
                          </div>
                        )}
                      </WarmCard>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
