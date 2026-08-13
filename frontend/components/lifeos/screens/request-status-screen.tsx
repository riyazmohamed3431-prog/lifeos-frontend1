'use client'

import { useState, useEffect, useCallback } from 'react'
import { Disc3, BatteryCharging, Cog, Fuel, Wrench, ArrowLeft, RefreshCw, MapPin, Calendar, Clock, AlertTriangle, AlertCircle, ShieldAlert, CheckCircle2, Loader2, Star, CreditCard, ChevronRight } from 'lucide-react'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { CategoryIconBox, WarmBadge, WarmButton, WarmCard } from '@/components/ui/warm-components'
import { FadeIn } from '@/components/ui/framer-wrapper'
import { cn } from '@/lib/utils'
import { API_BASE_URL, authFetch } from '@/lib/lifeos'

const SERVICE_ICONS = {
  'Flat Tyre': { icon: Disc3, color: 'blue' as const },
  'Battery Jump Start': { icon: BatteryCharging, color: 'amber' as const },
  'Engine Problem': { icon: Cog, color: 'emerald' as const },
  'Fuel Delivery': { icon: Fuel, color: 'orange' as const },
  'Towing': { icon: Wrench, color: 'rose' as const },
}

type RequestDetails = {
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
    paidAt: string | null
  }
  rating?: {
    score: number | null
    review: string
    ratedAt: string | null
  }
  createdAt: string
  updatedAt: string
}

export function RequestStatusScreen({
  initialRequestId,
}: {
  initialRequestId: string
}) {
  const [requestId, setRequestId] = useState(initialRequestId)
  const [inputRequestId, setInputRequestId] = useState(initialRequestId)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [request, setRequest] = useState<RequestDetails | null>(null)

  // Estimate Approval & Payment simulation state
  const [submittingApproval, setSubmittingApproval] = useState(false)
  const [submittingPayment, setSubmittingPayment] = useState(false)

  // Interactive rating form state
  const [ratingScore, setRatingScore] = useState<number>(5)
  const [ratingReview, setRatingReview] = useState('')
  const [submittingRating, setSubmittingRating] = useState(false)
  const [ratingSuccessMsg, setRatingSuccessMsg] = useState<string | null>(null)
  const [mechanicRating, setMechanicRating] = useState<number | null>(null)

  const fetchRequestDetails = useCallback(async (idToFetch: string) => {
    if (!idToFetch.trim()) {
      setError('Please provide a valid Request ID.')
      setRequest(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await authFetch(`${API_BASE_URL}/api/requests/${idToFetch.trim()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Service request not found.')
      }

      setRequest(data)
    } catch (err: any) {
      setRequest(null)
      setError(err?.message || 'A network error occurred. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch automatically on mount or when requestId query changes
  useEffect(() => {
    if (requestId) {
      fetchRequestDetails(requestId)
    } else {
      setError('No Request ID was provided in the URL. Please configure or input a Request ID below.')
    }
  }, [requestId, fetchRequestDetails])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRequestId(inputRequestId)
  }

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back()
      } else {
        window.location.href = '/'
      }
    }
  }

  const handleApproveEstimate = async () => {
    if (!requestId) return
    setSubmittingApproval(true)
    setError(null)
    try {
      const response = await authFetch(`${API_BASE_URL}/api/requests/${requestId}/estimate/approve`, {
        method: 'PATCH',
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve estimate.')
      }
      fetchRequestDetails(requestId)
    } catch (err: any) {
      setError(err?.message || 'Error approving estimate.')
    } finally {
      setSubmittingApproval(false)
    }
  }

  const handleMakePayment = async () => {
    if (!requestId) return
    setSubmittingPayment(true)
    setError(null)
    try {
      const response = await authFetch(`${API_BASE_URL}/api/requests/${requestId}/payment`, {
        method: 'PATCH',
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process payment.')
      }
      fetchRequestDetails(requestId)
    } catch (err: any) {
      setError(err?.message || 'Error processing payment.')
    } finally {
      setSubmittingPayment(false)
    }
  }

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestId) return
    setSubmittingRating(true)
    setError(null)
    setRatingSuccessMsg(null)
    try {
      const response = await authFetch(`${API_BASE_URL}/api/requests/${requestId}/rating`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: ratingScore,
          review: ratingReview.trim(),
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit rating.')
      }
      setRatingSuccessMsg('Rating submitted successfully!')
      if (data.mechanicRating !== undefined) {
        setMechanicRating(data.mechanicRating)
      }
      fetchRequestDetails(requestId)
    } catch (err: any) {
      setError(err?.message || 'Error submitting rating.')
    } finally {
      setSubmittingRating(false)
    }
  }

  // Get status color tokens
  const getStatusConfig = (status: RequestDetails['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending Approval',
          color: 'amber' as const,
          badgeColor: 'amber' as const,
          bgClass: 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-400',
          indicatorClass: 'bg-amber-500 animate-pulse',
        }
      case 'accepted':
        return {
          label: 'Mechanic En Route',
          color: 'blue' as const,
          badgeColor: 'blue' as const,
          bgClass: 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-400',
          indicatorClass: 'bg-blue-500 animate-pulse',
        }
      case 'rejected':
        return {
          label: 'Dispatch Rejected',
          color: 'rose' as const,
          badgeColor: 'rose' as const,
          bgClass: 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30 text-rose-700 dark:text-rose-400',
          indicatorClass: 'bg-rose-500',
        }
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: 'slate' as const,
          badgeColor: 'slate' as const,
          bgClass: 'bg-slate-500/10 dark:bg-slate-500/20 border-slate-500/30 text-slate-700 dark:text-slate-400',
          indicatorClass: 'bg-slate-500',
        }
      case 'completed':
        return {
          label: 'Service Completed',
          color: 'emerald' as const,
          badgeColor: 'emerald' as const,
          bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
          indicatorClass: 'bg-emerald-500',
        }
      default:
        return {
          label: status,
          color: 'slate' as const,
          badgeColor: 'slate' as const,
          bgClass: 'bg-slate-500/10 border-slate-500/30 text-slate-700',
          indicatorClass: 'bg-slate-500',
        }
    }
  }

  const serviceConfig = request ? (SERVICE_ICONS[request.serviceType as keyof typeof SERVICE_ICONS] || { icon: Wrench, color: 'emerald' as const }) : null
  const statusConfig = request ? getStatusConfig(request.status) : null

  // Helpers to evaluate current workflow status
  const hasEstimate = request?.estimate && request.estimate.totalAmount > 0
  const isEstimateApproved = request?.estimate?.approved
  const isPaymentPaid = request?.payment && request.payment.status === 'paid'
  const isRated = request?.rating && request.rating.score !== null

  return (
    <div className="relative flex h-full min-h-screen flex-col overflow-y-auto no-scrollbar pb-36 font-sans text-[#0F172A] dark:text-[#F8FAFC]">
      <AmbientBg tone="primary" />

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 pt-4 pb-2">
        <button
          onClick={handleBack}
          className="bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 grid size-10 place-items-center rounded-full text-foreground hover:bg-muted transition-all cursor-pointer shadow-sm"
          aria-label="Back"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-wider block text-[#0F766E]">
            Telemetry Hub
          </span>
          <span className="text-[10px] text-[#475569] dark:text-[#94A3B8] font-semibold">
            Live Dispatch Tracking
          </span>
        </div>
        <button
          onClick={() => fetchRequestDetails(requestId)}
          disabled={loading || !requestId}
          className="bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 grid size-10 place-items-center rounded-full text-foreground hover:bg-muted transition-all cursor-pointer shadow-sm disabled:opacity-40"
          aria-label="Refresh"
        >
          <RefreshCw className={cn('size-4.5', loading && 'animate-spin')} />
        </button>
      </div>

      <div className="relative z-10 px-2 sm:px-4 pt-2 space-y-6 flex-1 w-full">
        {/* Dynamic ID Search Selector */}
        <form onSubmit={handleSearchSubmit} className="p-4 rounded-3xl bg-card border border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex items-center gap-2">
          <input
            type="text"
            value={inputRequestId}
            onChange={(e) => setInputRequestId(e.target.value)}
            placeholder="Input dynamic Request ID..."
            className="flex-1 rounded-2xl px-3.5 py-2.5 text-xs text-[#0F172A] dark:text-[#F8FAFC] bg-[#F8FAFC] dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 font-mono shadow-inner"
          />
          <WarmButton type="submit" size="sm" variant="ghost" className="shrink-0 rounded-2xl h-10 border border-border">
            Load
          </WarmButton>
        </form>

        {/* LOADING STATE */}
        {loading && (
          <div className="p-8 rounded-3xl bg-card border border-border flex flex-col items-center justify-center gap-3 text-center shadow-sm">
            <Loader2 className="size-8 text-[#0F766E] animate-spin" />
            <span className="text-xs text-muted-foreground font-bold">Querying satellite telemetry and fetching request details...</span>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3.5 text-xs text-rose-700 dark:text-rose-400 shadow-sm">
            <ShieldAlert className="size-6 shrink-0 text-rose-500 mt-0.5" />
            <div className="space-y-1">
              <p className="font-black text-sm">Telemetry Fault</p>
              <p className="opacity-95 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* REQUEST DETAILS SUCCESS PANEL */}
        {!loading && request && statusConfig && serviceConfig && (
          <FadeIn className="space-y-5">
            {/* Status Hero Badge Card */}
            <div className={cn('p-5 rounded-3xl border flex items-center justify-between gap-4 shadow-md', statusConfig.bgClass)}>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider opacity-85 block">Current Telemetry Status</span>
                <span className="text-lg font-black tracking-tight block mt-0.5">{statusConfig.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('size-2.5 rounded-full', statusConfig.indicatorClass)} />
                <WarmBadge variant={statusConfig.badgeColor} className="uppercase font-black text-[10px] py-1 border-current">
                  {request.status}
                </WarmBadge>
              </div>
            </div>

            {/* Core Details Bento Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Service Type Card */}
              <WarmCard className="p-4 flex items-center gap-3.5 border border-border">
                <CategoryIconBox icon={serviceConfig.icon} color={serviceConfig.color} className="size-10" />
                <div className="min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block">Breakdown Service</span>
                  <span className="text-xs font-black text-foreground truncate block mt-0.5">{request.serviceType}</span>
                </div>
              </WarmCard>

              {/* Request ID Card */}
              <WarmCard className="p-4 flex items-center gap-3.5 border border-border">
                <div className="grid size-10 place-items-center rounded-2xl bg-[#4338CA]/10 text-[#4338CA] border border-[#4338CA]/20">
                  <AlertCircle className="size-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block">Request Reference</span>
                  <span className="text-xs font-mono font-bold text-foreground truncate block mt-0.5 bg-[#F8FAFC] dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 px-1.5 py-0.5 rounded">
                    {request._id}
                  </span>
                </div>
              </WarmCard>
            </div>

            {/* Situation Details */}
            <WarmCard className="p-5 border border-border space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0F766E] block">Issue Report / Situation</span>
              <p className="text-xs text-foreground font-semibold leading-relaxed">
                {request.issueDescription || 'No description provided by user.'}
              </p>
            </WarmCard>

            {/* Location & GPS Telemetry */}
            <WarmCard className="p-5 border border-border flex items-center gap-4">
              <CategoryIconBox icon={MapPin} color="blue" className="size-10" />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider text-blue-500 block">GPS Coordinates</span>
                <span className="text-xs font-mono font-bold text-foreground block mt-0.5">
                  Lat: {request.location.latitude} · Lng: {request.location.longitude}
                </span>
              </div>
            </WarmCard>

            {/* PHASE 6 ESTIMATE BLOCK */}
            {hasEstimate && request.estimate && (
              <FadeIn>
                <WarmCard className="p-5 border border-border space-y-4">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0F766E]">Service Estimate Invoice</span>
                    <WarmBadge variant={isEstimateApproved ? 'emerald' : 'amber'}>
                      {isEstimateApproved ? 'Approved' : 'Awaiting Approval'}
                    </WarmBadge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2.5 text-xs text-muted-foreground font-semibold">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider">Labour Charge</p>
                      <p className="text-foreground font-mono mt-0.5">₹{request.estimate.labourCharge}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider">Parts Charge</p>
                      <p className="text-foreground font-mono mt-0.5">₹{request.estimate.partsCharge}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider">Travel Charge</p>
                      <p className="text-foreground font-mono mt-0.5">₹{request.estimate.travelCharge}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm font-black border-t border-border/50 pt-3 text-foreground">
                    <span>Total Amount:</span>
                    <span className="text-lg font-mono text-[#0F766E]">₹{request.estimate.totalAmount}</span>
                  </div>

                  {!isEstimateApproved && (
                    <WarmButton
                      onClick={handleApproveEstimate}
                      disabled={submittingApproval}
                      variant="primary"
                      className="w-full shadow-md mt-2"
                    >
                      {submittingApproval ? 'Processing Approval...' : 'Approve Estimate Invoice'}
                    </WarmButton>
                  )}
                </WarmCard>
              </FadeIn>
            )}

            {/* PHASE 6 PAYMENT BLOCK */}
            {hasEstimate && isEstimateApproved && (
              <FadeIn>
                <WarmCard className="p-5 border border-border space-y-4">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#4338CA]">Secure Checkout Payment</span>
                    <WarmBadge variant={isPaymentPaid ? 'emerald' : 'rose'}>
                      {isPaymentPaid ? 'Paid' : 'Unpaid'}
                    </WarmBadge>
                  </div>

                  {isPaymentPaid && request.payment ? (
                    <div className="space-y-3.5">
                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-3.5 text-xs text-emerald-800 dark:text-emerald-400">
                        <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                        <div>
                          <p className="font-black">Transaction Verified</p>
                          <p className="opacity-90 leading-relaxed font-mono text-[10px] mt-0.5">
                            Amount: ₹{request.payment.amount} · Timestamp: {request.payment.paidAt ? new Date(request.payment.paidAt).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-2xl bg-slate-500/5 border border-border flex items-center gap-3 text-xs text-muted-foreground font-semibold">
                        <CreditCard className="size-5 text-muted-foreground shrink-0" />
                        <span>Checkout amount pre-calculated based on approved estimate invoice.</span>
                      </div>
                      
                      <WarmButton
                        onClick={handleMakePayment}
                        disabled={submittingPayment}
                        variant="indigo"
                        className="w-full shadow-md flex items-center justify-center gap-2"
                      >
                        {submittingPayment ? 'Securing Transaction...' : `Pay ₹${request.estimate?.totalAmount}`}
                        <ChevronRight className="size-4" />
                      </WarmButton>
                    </div>
                  )}
                </WarmCard>
              </FadeIn>
            )}

            {/* PHASE 6 RATING BLOCK */}
            {isPaymentPaid && (
              <FadeIn>
                <WarmCard className="p-5 border border-border space-y-4">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#F59E0B]">Mechanic Service Rating</span>
                    <WarmBadge variant={isRated ? 'emerald' : 'amber'}>
                      {isRated ? 'Rated' : 'Pending Review'}
                    </WarmBadge>
                  </div>

                  {isRated && request.rating ? (
                    <div className="space-y-3.5">
                      <div className="p-4 rounded-2xl bg-[#F59E0B]/5 border border-[#F59E0B]/20 space-y-2.5">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1 text-[#F59E0B]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'size-4',
                                  i < (request.rating?.score || 0)
                                    ? 'fill-[#F59E0B] stroke-[#F59E0B]'
                                    : 'stroke-[#F59E0B]/30'
                                )}
                              />
                            ))}
                          </div>
                          {request.rating.ratedAt && (
                            <span className="text-[10px] text-muted-foreground font-mono">{new Date(request.rating.ratedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                        <p className="text-xs text-foreground font-semibold leading-relaxed">
                          "{request.rating.review || 'No review comments left.'}"
                        </p>
                      </div>

                      {mechanicRating !== null && (
                        <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-400">
                          <span className="font-bold">Recalculated Mechanic Rating:</span>
                          <div className="flex items-center gap-1 font-mono font-bold text-sm text-[#F59E0B]">
                            <Star className="size-4 fill-[#F59E0B] stroke-[#F59E0B]" />
                            <span>{mechanicRating}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitRating} className="space-y-4">
                      {ratingSuccessMsg && (
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 className="size-4" />
                          <span>{ratingSuccessMsg}</span>
                        </div>
                      )}
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Rate Service Experience</label>
                        <div className="flex gap-2">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const starValue = i + 1
                            const isActive = starValue <= ratingScore
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setRatingScore(starValue)}
                                className="cursor-pointer focus:outline-none"
                              >
                                <Star
                                  className={cn(
                                    'size-7 transition-all hover:scale-110',
                                    isActive
                                      ? 'fill-[#F59E0B] stroke-[#F59E0B]'
                                      : 'stroke-[#F59E0B]/40 hover:stroke-[#F59E0B]'
                                  )}
                                />
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Review Comments</label>
                        <textarea
                          value={ratingReview}
                          onChange={(e) => setRatingReview(e.target.value)}
                          placeholder="Tell us about the mechanic's speed, efficiency, and safety precautions..."
                          rows={3}
                          required
                          className="w-full rounded-2xl p-3.5 text-xs text-foreground bg-white dark:bg-[#151C2C] border border-border focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30 resize-none shadow-sm"
                        />
                      </div>

                      <WarmButton
                        type="submit"
                        disabled={submittingRating}
                        variant="amber"
                        className="w-full shadow-md"
                      >
                        {submittingRating ? 'Uploading Review...' : 'Submit Rating'}
                      </WarmButton>
                    </form>
                  )}
                </WarmCard>
              </FadeIn>
            )}

            {/* Time stamps */}
            <WarmCard className="p-5 border border-border space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block border-b border-border pb-1.5">
                Timestamp Logs
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-muted-foreground font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-[#0F766E] shrink-0" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Reported At</p>
                    <p className="text-[11px] text-foreground mt-0.5">{new Date(request.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-[#4338CA] shrink-0" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Latest Update</p>
                    <p className="text-[11px] text-foreground mt-0.5">{new Date(request.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </WarmCard>

            {/* Footer Refresh trigger */}
            <WarmButton
              onClick={() => fetchRequestDetails(requestId)}
              disabled={loading}
              variant="primary"
              size="lg"
              className="w-full shadow-lg"
            >
              <RefreshCw className={cn('size-4', loading && 'animate-spin')} /> {loading ? 'Refetching Telemetry...' : 'Refresh Status'}
            </WarmButton>
          </FadeIn>
        )}
      </div>
    </div>
  )
}
