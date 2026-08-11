'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, LogOut } from 'lucide-react'
import type { Emergency, ScreenId } from '@/lib/lifeos'
import { vehicles, mechanic, history, type Vehicle, type HistoryItem } from '@/lib/lifeos'
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
import { WelcomeScreen } from '@/components/lifeos/screens/welcome-screen'
import { getSavedSession, logoutUser, type AuthUser } from '@/lib/firebase'

const TAB_SCREENS: ScreenId[] = ['home', 'map', 'history', 'profile']

export function LifeOSApp() {
  const [viewMode, setViewMode] = useState<'website' | 'mobile'>('website')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [screen, setScreen] = useState<ScreenId>('landing')
  const [mounted, setMounted] = useState(false)

  const [selectedEmergencies, setSelectedEmergencies] = useState<Emergency[]>([])
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0].id)
  const [bookingNotes, setBookingNotes] = useState<string>('')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>(vehicles)
  const [userHistory, setUserHistory] = useState<HistoryItem[]>(history)

  const userEmail = user?.email || 'guest'
  const vehiclesKey = `lifeos_garage_${userEmail}`
  const primaryVehicleKey = `lifeos_primary_vehicle_${userEmail}`
  const historyKey = `lifeos_history_${userEmail}`

  // Sync state on user load/change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedVehicles = localStorage.getItem(vehiclesKey)
      if (storedVehicles) {
        try {
          setUserVehicles(JSON.parse(storedVehicles))
        } catch (e) {
          setUserVehicles(vehicles)
        }
      } else {
        setUserVehicles(vehicles)
      }

      const storedPrimary = localStorage.getItem(primaryVehicleKey)
      if (storedPrimary) {
        setSelectedVehicleId(storedPrimary)
      } else {
        setSelectedVehicleId(vehicles[0].id)
      }

      const storedHistory = localStorage.getItem(historyKey)
      if (storedHistory) {
        try {
          setUserHistory(JSON.parse(storedHistory))
        } catch (e) {
          setUserHistory(history)
        }
      } else {
        setUserHistory(history)
      }
    }
  }, [userEmail, vehiclesKey, primaryVehicleKey, historyKey])

  const handleVehiclesChange = (newVehicles: Vehicle[], newPrimaryId: string) => {
    setUserVehicles(newVehicles)
    setSelectedVehicleId(newPrimaryId)
    if (typeof window !== 'undefined') {
      localStorage.setItem(vehiclesKey, JSON.stringify(newVehicles))
      localStorage.setItem(primaryVehicleKey, newPrimaryId)
    }
  }

  const handleAddHistoryLog = (newItem: HistoryItem) => {
    const updated = [newItem, ...userHistory]
    setUserHistory(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(historyKey, JSON.stringify(updated))
    }
  }

  useEffect(() => {
    setMounted(true)
    // Check URL query parameters for mobile integration auto-login
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const autoEmail = urlParams.get('email')
      const autoLogin = urlParams.get('login')

      if (autoEmail && autoLogin === 'true') {
        const autoUser = {
          uid: 'mobile-' + Date.now(),
          email: autoEmail,
          displayName: autoEmail.split('@')[0],
        }
        localStorage.setItem('lifeos_demo_user', JSON.stringify(autoUser))
        setUser(autoUser)
        setScreen('home')
        return
      }
    }

    // Check saved session on mount and store user, but start at landing page
    const saved = getSavedSession()
    if (saved) {
      setUser(saved)
    }
    setScreen('landing')
  }, [])

  const go = (s: ScreenId) => setScreen(s)

  const handleLoginSuccess = (authUser: AuthUser) => {
    setUser(authUser)
    go('welcome')
  }

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = async () => {
    setShowLogoutConfirm(false)
    await logoutUser()
    setUser(null)
    go('landing')
  }

  const startEmergency = (initial?: Emergency | Emergency[] | null) => {
    if (Array.isArray(initial) && initial.length > 0) {
      setSelectedEmergencies(initial)
    } else if (initial && !Array.isArray(initial)) {
      setSelectedEmergencies([initial])
    } else {
      setSelectedEmergencies([])
    }
    go('booking')
  }

  const selectedVehicle = userVehicles.find((v) => v.id === selectedVehicleId) || userVehicles[0] || vehicles[0]
  const showNav = TAB_SCREENS.includes(screen)

  // Fullscreen Entry Views: Landing, Splash, & Welcome Screens
  if (screen === 'landing') {
    return (
      <LandingScreen
        onGetStarted={() => go('login')}
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
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onBack={() => go('landing')}
      />
    )
  }

  // Dedicated Fullscreen Cyber Welcome Screen
  if (screen === 'welcome') {
    return (
      <WelcomeScreen
        user={user}
        onContinue={() => go('home')}
      />
    )
  }

  // Active App Screens (Logged In Dashboard)
  const renderActiveScreen = () => (
    <div key={screen} className="h-full w-full">
      {screen === 'home' && (
        <HomeScreen
          vehicles={userVehicles}
          onEmergency={() => startEmergency(null)}
          onSelect={(e) => startEmergency(e)}
          onNavigateProfile={() => go('profile')}
        />
      )}
      {screen === 'map' && <MapScreen onEmergency={() => startEmergency(null)} />}
      {screen === 'booking' && (
        <BookingScreen
          vehicles={userVehicles}
          initial={selectedEmergencies}
          onBack={() => go('home')}
          onConfirm={(issues, vehicleId, notes) => {
            setSelectedEmergencies(issues)
            setSelectedVehicleId(vehicleId)
            setBookingNotes(notes)
            go('waiting')
          }}
        />
      )}
      {screen === 'waiting' && (
        <WaitingScreen
          emergencies={selectedEmergencies}
          vehicleName={selectedVehicle.name}
          onFound={() => go('found')}
        />
      )}
      {screen === 'found' && <FoundScreen onTrack={() => go('tracking')} />}
      {screen === 'tracking' && <TrackingScreen onArrived={() => go('payment')} />}
      {screen === 'payment' && (
        <PaymentScreen
          emergencies={selectedEmergencies}
          vehicleName={selectedVehicle.name}
          onDone={() => {
            if (selectedEmergencies.length > 0) {
              const combinedTitle = selectedEmergencies.map((e) => e.label).join(' + ')
              const combinedFee = selectedEmergencies.reduce((acc, e) => acc + e.fee, 0)
              handleAddHistoryLog({
                id: 'h-' + Date.now(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                title: combinedTitle,
                vehicle: `${selectedVehicle.name} (${selectedVehicle.plate})`,
                mechanic: mechanic.name,
                amount: combinedFee,
                status: 'Completed',
              })
              setSelectedEmergencies([])
            }
            go('home')
          }}
        />
      )}
      {screen === 'history' && <HistoryScreen userHistory={userHistory} />}
      {screen === 'profile' && (
        <ProfileScreen
          user={user}
          onLogout={handleLogout}
          onLoginRedirect={() => go('login')}
          vehicles={userVehicles}
          primaryVehicleId={selectedVehicleId}
          onVehiclesChange={handleVehiclesChange}
        />
      )}
    </div>
  )

  const layoutContent = viewMode === 'website' ? (
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
  ) : (
    <PhoneFrame viewMode={viewMode} onToggleViewMode={setViewMode}>
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
    </PhoneFrame>
  )

  return (
    <>
      {layoutContent}

      {/* Custom Premium Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#131316] border border-white/10 rounded-[28px] p-6 max-w-sm w-full shadow-2xl text-center space-y-4 animate-scale-in">
            <div className="mx-auto size-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <LogOut className="size-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-white">Confirm Logout</h3>
              <p className="text-xs text-neutral-400">
                Are you sure you want to end your LifeOS session and sign out?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl bg-neutral-900 border border-white/5 py-2.5 text-xs font-bold text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-red-950/20 transition-all cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
