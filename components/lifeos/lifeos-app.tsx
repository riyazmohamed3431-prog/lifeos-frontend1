'use client'

import { useState } from 'react'
import type { Emergency, ScreenId } from '@/lib/lifeos'
import { PhoneFrame } from '@/components/lifeos/phone-frame'
import { WebsiteLayout } from '@/components/lifeos/website-layout'
import { StatusBar } from '@/components/lifeos/status-bar'
import { BottomNav } from '@/components/lifeos/bottom-nav'
import { HomeScreen } from '@/components/lifeos/screens/home-screen'
import { MapScreen } from '@/components/lifeos/screens/map-screen'
import { BookingScreen } from '@/components/lifeos/screens/booking-screen'
import { WaitingScreen } from '@/components/lifeos/screens/waiting-screen'
import { FoundScreen } from '@/components/lifeos/screens/found-screen'
import { TrackingScreen } from '@/components/lifeos/screens/tracking-screen'
import { PaymentScreen } from '@/components/lifeos/screens/payment-screen'
import { HistoryScreen } from '@/components/lifeos/screens/history-screen'
import { ProfileScreen } from '@/components/lifeos/screens/profile-screen'

const TAB_SCREENS: ScreenId[] = ['home', 'map', 'history', 'profile']

export function LifeOSApp() {
  const [viewMode, setViewMode] = useState<'website' | 'mobile'>('website')
  const [screen, setScreen] = useState<ScreenId>('home')
  const [emergency, setEmergency] = useState<Emergency | null>(null)

  const go = (s: ScreenId) => setScreen(s)

  const startEmergency = (e: Emergency | null = null) => {
    setEmergency(e)
    go('booking')
  }

  const showNav = TAB_SCREENS.includes(screen)

  const renderActiveScreen = () => (
    <div key={screen} className="h-full w-full">
      {screen === 'home' && (
        <HomeScreen onEmergency={() => startEmergency(null)} onSelect={(e) => startEmergency(e)} />
      )}
      {screen === 'map' && <MapScreen onEmergency={() => startEmergency(null)} />}
      {screen === 'booking' && (
        <BookingScreen
          initial={emergency}
          onBack={() => go('home')}
          onConfirm={(e) => {
            setEmergency(e)
            go('waiting')
          }}
        />
      )}
      {screen === 'waiting' && (
        <WaitingScreen emergency={emergency} onFound={() => go('found')} />
      )}
      {screen === 'found' && <FoundScreen onTrack={() => go('tracking')} />}
      {screen === 'tracking' && <TrackingScreen onArrived={() => go('payment')} />}
      {screen === 'payment' && <PaymentScreen onDone={() => go('home')} />}
      {screen === 'history' && <HistoryScreen />}
      {screen === 'profile' && <ProfileScreen />}
    </div>
  )

  if (viewMode === 'website') {
    return (
      <WebsiteLayout
        activeScreen={screen}
        onNavigate={go}
        onEmergency={() => startEmergency(null)}
        onSelectEmergency={(e) => startEmergency(e)}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      >
        {renderActiveScreen()}
      </WebsiteLayout>
    )
  }

  return (
    <PhoneFrame viewMode={viewMode} onToggleViewMode={setViewMode}>
      <StatusBar />

      <div className="absolute inset-0 top-8">
        {renderActiveScreen()}
      </div>

      {showNav && (
        <BottomNav active={screen} onNavigate={go} onEmergency={() => startEmergency(null)} />
      )}
    </PhoneFrame>
  )
}
