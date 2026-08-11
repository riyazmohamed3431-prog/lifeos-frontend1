'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { RequestStatusScreen } from '@/components/lifeos/screens/request-status-screen'
import { Loader2 } from 'lucide-react'

function RequestStatusPageContent() {
  const searchParams = useSearchParams()
  const requestId = searchParams.get('requestId') || ''

  return <RequestStatusScreen initialRequestId={requestId} />
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[oklch(0.13_0.005_260)] text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-7 text-[#0F766E] animate-spin" />
          <span className="text-xs text-muted-foreground font-semibold">Initializing Command Telemetry...</span>
        </div>
      </div>
    }>
      <RequestStatusPageContent />
    </Suspense>
  )
}
