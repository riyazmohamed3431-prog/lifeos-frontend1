'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { Emergency, ScreenId } from '@/lib/lifeos'
import { vehicles, mechanic, addHistoryLog } from '@/lib/lifeos'
import { PhoneFrame } from '@/components/lifeos/phone-frame'
import { WebsiteLayout } from '@/components/lifeos/website-layout'
import { StatusBar } from '@/components/lifeos/status-bar'
import { BottomNav } from '@/components/lifeos/bottom-nav'
import { LandingScreen } from '@/components/lifeos/screens/landing-screen'
import { SplashScreen } from '@/components/lifeos/screens/splash-screen'
import { LoginScreen } from '@/components/lifeos/screens/login-screen'
import { HomeScreen } from '@/components/lifeos/screens/home-screen'
import { MapScreen } from '@/components/lifeos/screens/map-screen'
import { BookingScreen } from '@/components/lifeos/screens/booking-screen'
import { WaitingScreen } from '@/components/lifeos/screens/waiting-screen'
import { FoundScreen } from '@/components/lifeos/screens/found-screen'
import { TrackingScreen } from '@/components/lifeos/screens/tracking-screen'
import { PaymentScreen } from '@/components/lifeos/screens/payment-screen'
import { HistoryScreen } from '@/components/lifeos/screens/history-screen'
import { ProfileScreen } from '@/components/lifeos/screens/profile-screen'
import { getSavedSession, logoutUser, type AuthUser } from '@/lib/firebase'

const TAB_SCREENS: ScreenId[] = ['home', 'map', 'history', 'profile']

export function LifeOSApp() {
  const [viewMode, setViewMode] = useState<'website' | 'mobile'>('website')
  const [screen, setScreen] = useState<ScreenId>('landing')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [emergency, setEmergency] = useState<Emergency | null>(null)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0].id)
  const [bookingNotes, setBookingNotes] = useState<string>('')

  useEffect(() => {
    // Check saved session on mount
    const saved = getSavedSession()
    if (saved) {
      setUser(saved)
      setScreen('home')
    }
  }, [])

  const go = (s: ScreenId) => setScreen(s)

  const handleLoginSuccess = (authUser: AuthUser) => {
    setUser(authUser)
    go('home')
  }

  const handleLogout = async () => {
    await logoutUser()
    setUser(null)
    go('landing')
  }

  const startEmergency = (e: Emergency | null = null) => {
    setEmergency(e)
    go('booking')
  }

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0]
  const showNav = TAB_SCREENS.includes(screen)

  // Fullscreen Entry Views: Landing & Splash Screen
  if (screen === 'landing') {
    return (
      <LandingScreen
        onGetStarted={() => go('splash')}
        onLoginClick={() => go('login')}
      />
    )
  }

  if (screen === 'splash') {
    return <SplashScreen onFinish={() => go('login')} />
  }

  // Dedicated Fullscreen Login View (without website dashboard header)
  if (screen === 'login') {
    return (
      <div className="relative min-h-screen w-full bg-[oklch(0.13_0.005_260)] text-foreground flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Ambient Depth Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

        {/* Back Button to Landing Page */}
        <button
          onClick={() => go('landing')}
          className="absolute top-6 left-6 z-50 flex items-center gap-2 rounded-full surface-glass px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-white/10 transition-all cursor-pointer shadow-md"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Home</span>
        </button>

        {/* Centered Login Card Container */}
        <div className="surface-card relative w-full max-w-md min-h-[580px] rounded-3xl border border-white/12 p-3 sm:p-5 shadow-2xl overflow-hidden backdrop-blur-2xl">
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    )
  }

  // Active App Screens (Logged In Dashboard)
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
          onConfirm={(e, vehicleId, notes) => {
            setEmergency(e)
            setSelectedVehicleId(vehicleId)
            setBookingNotes(notes)
            go('waiting')
          }}
        />
      )}
      {screen === 'waiting' && (
        <WaitingScreen
          emergency={emergency}
          vehicleName={selectedVehicle.name}
          onFound={() => go('found')}
        />
      )}
      {screen === 'found' && <FoundScreen onTrack={() => go('tracking')} />}
      {screen === 'tracking' && <TrackingScreen onArrived={() => go('payment')} />}
      {screen === 'payment' && (
        <PaymentScreen
          emergency={emergency}
          vehicleName={selectedVehicle.name}
          onDone={() => {
            if (emergency) {
              addHistoryLog({
                id: 'h-' + Date.now(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                title: emergency.label,
                vehicle: `${selectedVehicle.name} (${selectedVehicle.plate})`,
                mechanic: mechanic.name,
                amount: emergency.fee,
                status: 'Completed',
              })
              setEmergency(null)
            }
            go('home')
          }}
        />
      )}
      {screen === 'history' && <HistoryScreen />}
      {screen === 'profile' && <ProfileScreen user={user} onLogout={handleLogout} onLoginRedirect={() => go('login')} />}
    </div>
  )

  if (viewMode === 'website') {
    return (
      <WebsiteLayout
        activeScreen={screen}
        user={user}
        onNavigate={go}
        onEmergency={() => startEmergency(null)}
        onSelectEmergency={(e) => startEmergency(e)}
        onLogout={handleLogout}
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
