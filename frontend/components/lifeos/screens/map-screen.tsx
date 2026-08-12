'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapCanvas } from '@/components/lifeos/map-canvas'
import { mechanic, vehicles, type Vehicle } from '@/lib/lifeos'
import { CategoryIconBox, HealthRadialGauge, WarmBadge, WarmButton, WarmCard, WarmTabGroup } from '@/components/ui/warm-components'
import {
  Navigation,
  ShieldCheck,
  Phone,
  Filter,
  Car,
  Shield,
  FileText,
  Wrench,
  BatteryCharging,
  Gauge,
  CheckCircle2,
  MapPin,
  Loader2,
  RefreshCw,
  AlertCircle,
  Fuel,
  Hospital,
  Pill,
  Utensils,
  ShieldAlert,
  Truck,
} from 'lucide-react'
import { CallModal } from '@/components/lifeos/call-modal'
import { FadeIn, SlideUp } from '@/components/ui/framer-wrapper'
import { useLocation } from '@/lib/use-location'
import { fetchNearbyPlaces, type NearbyPlace, type NearbyCategory } from '@/lib/places-api'

const CATEGORY_OPTIONS: { id: NearbyCategory; label: string; icon: any }[] = [
  { id: 'mechanic', label: 'Mechanics', icon: Wrench },
  { id: 'petrol_station', label: 'Fuel / Gas', icon: Fuel },
  { id: 'hospital', label: 'Hospitals', icon: Hospital },
  { id: 'pharmacy', label: 'Pharmacies', icon: Pill },
  { id: 'restaurant', label: 'Restaurants', icon: Utensils },
  { id: 'police', label: 'Police', icon: ShieldAlert },
  { id: 'towing', label: 'Towing', icon: Truck },
  { id: 'car_service', label: 'Car Service', icon: Car },
]

export function MapScreen({
  vehicles: userVehicles,
  onEmergency,
}: {
  vehicles?: Vehicle[]
  onEmergency: () => void
}) {
  const vehicleList = userVehicles && userVehicles.length > 0 ? userVehicles : vehicles

  // Real-world Device Geolocation
  const { location, loading: locationLoading, error: locationError, requestLocation } = useLocation()

  // Calling modal state
  const [calling, setCalling] = useState(false)
  const [selectedMechanic, setSelectedMechanic] = useState(mechanic.name)
  const [selectedPhone, setSelectedPhone] = useState(mechanic.phone)

  // Radar & Search filters
  const [filterRadius, setFilterRadius] = useState<'2km' | '5km' | '10km'>('5km')
  const [selectedCategory, setSelectedCategory] = useState<NearbyCategory>('mechanic')
  const [activeTab, setActiveTab] = useState<'telemetry' | 'documents' | 'radar'>('telemetry')
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicleList[0]?.id || 'v1')

  // Places API State
  const [places, setPlaces] = useState<NearbyPlace[]>([])
  const [placesLoading, setPlacesLoading] = useState<boolean>(false)
  const [placesError, setPlacesError] = useState<string | null>(null)

  const activeVehicle = vehicleList.find((v) => v.id === selectedVehicleId) || vehicleList[0] || vehicles[0]

  // Radius map to meters
  const radiusInMeters = filterRadius === '2km' ? 2000 : filterRadius === '10km' ? 10000 : 5000

  // Fetch real-world nearby places from backend
  const loadNearbyPlaces = useCallback(async () => {
    if (!location) return

    setPlacesLoading(true)
    setPlacesError(null)

    const res = await fetchNearbyPlaces({
      latitude: location.latitude,
      longitude: location.longitude,
      category: selectedCategory,
      radius: radiusInMeters,
    })

    if (res.success) {
      setPlaces(res.places)
    } else {
      setPlacesError(res.error || 'Unable to retrieve nearby services.')
    }
    setPlacesLoading(false)
  }, [location, selectedCategory, radiusInMeters])

  // Trigger search on location available or category/radius change
  useEffect(() => {
    if (location) {
      loadNearbyPlaces()
    }
  }, [location, selectedCategory, radiusInMeters, loadNearbyPlaces])

  const handleCall = (name: string, phone: string | null) => {
    setSelectedMechanic(name)
    setSelectedPhone(phone || '+91 98400 32145')
    setCalling(true)
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'hospital': return Hospital
      case 'pharmacy': return Pill
      case 'petrol_station': return Fuel
      case 'restaurant': return Utensils
      case 'police': return ShieldAlert
      case 'towing': return Truck
      case 'car_service': return Car
      default: return Wrench
    }
  }

  return (
    <div className="relative h-full overflow-y-auto no-scrollbar pb-32 font-sans text-[#0F172A] dark:text-[#F8FAFC]">
      
      <div className="relative z-10 px-4 sm:px-6 pt-3 space-y-6 max-w-4xl mx-auto">
        
        {/* Header Vehicle Command Bar */}
        <FadeIn delay={0.05} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] font-mono">
              Vehicle Command Hub
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              {activeVehicle.name} <span className="text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8]">({activeVehicle.plate})</span>
            </h1>
          </div>

          {/* Vehicle Switcher / Single Vehicle Status Badge */}
          {vehicleList.length > 1 ? (
            <div className="flex items-center gap-1.5 bg-[#F1F5F9] dark:bg-[#1E293B] p-1 rounded-2xl border border-[#E2E8F0]">
              {vehicleList.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedVehicleId === v.id
                      ? 'bg-[#2563EB] text-white shadow-sm font-black'
                      : 'text-[#475569] dark:text-[#94A3B8] hover:text-foreground'
                  }`}
                >
                  {v.name.split(' ')[0]}
                </button>
              ))}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-black bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">
              <Car className="size-3.5" />
              <span>Primary Registered Vehicle</span>
            </div>
          )}
        </FadeIn>

        {/* Real GPS Location Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 shadow-sm text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shrink-0">
              <MapPin className="size-4 animate-bounce" />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                {locationLoading ? (
                  <span className="flex items-center gap-1.5 text-amber-500">
                    <Loader2 className="size-3.5 animate-spin" /> Acquiring device GPS location...
                  </span>
                ) : location ? (
                  <span className="text-[#0F766E] font-mono font-bold">
                    GPS Active · {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold">{locationError || 'Location permissions denied'}</span>
                )}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">
                {location ? 'Real-world GPS coordinates linked' : 'Enable device location to discover real nearby services'}
              </p>
            </div>
          </div>

          <button
            onClick={requestLocation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-bold text-foreground transition-all cursor-pointer shrink-0 border border-border"
          >
            <RefreshCw className={`size-3.5 ${locationLoading ? 'animate-spin' : ''}`} />
            <span>Refresh GPS</span>
          </button>
        </div>

        {/* VEHICLE SECTION HERO - Pure White Cards with Royal Blue Highlights */}
        <SlideUp delay={0.12}>
          <WarmCard variant="blue" className="p-5 sm:p-6 relative overflow-hidden border border-[#2563EB]/20 shadow-md min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center min-w-0">
              
              {/* Left Column: Visual Details */}
              <div className="md:col-span-7 space-y-4 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <WarmBadge variant="blue" className="shrink-0">
                    <span className="size-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                    Royal Blue Telemetry
                  </WarmBadge>
                  <WarmBadge variant="emerald" className="shrink-0">Cashless Policy Active</WarmBadge>
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">{activeVehicle.name}</h2>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-mono mt-0.5 truncate">
                    Color: {activeVehicle.color} · VIN: TN07-2024-EV-94028
                  </p>
                </div>

                {/* Quick Diagnostics Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-2">
                  <div className="bg-white dark:bg-[#151C2C] rounded-2xl p-2.5 sm:p-3 border border-[#E2E8F0] dark:border-white/10 text-center min-w-0">
                    <BatteryCharging className="size-4 text-[#F59E0B] mx-auto mb-1 shrink-0" />
                    <p className="text-xs font-black text-foreground truncate">84%</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold truncate">EV Charge</p>
                  </div>
                  <div className="bg-white dark:bg-[#151C2C] rounded-2xl p-2.5 sm:p-3 border border-[#E2E8F0] dark:border-white/10 text-center min-w-0">
                    <Gauge className="size-4 text-[#2563EB] mx-auto mb-1 shrink-0" />
                    <p className="text-xs font-black text-foreground truncate">36 PSI</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold truncate">Tyre Pressure</p>
                  </div>
                  <div className="bg-white dark:bg-[#151C2C] rounded-2xl p-2.5 sm:p-3 border border-[#E2E8F0] dark:border-white/10 text-center min-w-0">
                    <Wrench className="size-4 text-[#0F766E] mx-auto mb-1 shrink-0" />
                    <p className="text-xs font-black text-foreground truncate">420 km</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold truncate">Max Range</p>
                  </div>
                </div>
              </div>

              {/* Right Radial Gauge */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white dark:bg-[#151C2C] rounded-3xl border border-[#E2E8F0] dark:border-white/10">
                <HealthRadialGauge score={98} size={135} strokeWidth={11} label="Vehicle Health Score" />
              </div>
            </div>
          </WarmCard>
        </SlideUp>

        {/* Tab Selection */}
        <WarmTabGroup
          tabs={[
            { id: 'telemetry', label: 'Telemetry & Maintenance', icon: Gauge },
            { id: 'documents', label: 'Insurance & Documents', icon: FileText },
            { id: 'radar', label: 'Live Rescue Radar', icon: Navigation },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* TAB 1: Maintenance Section - Amber Theme */}
        {activeTab === 'telemetry' && (
          <div className="space-y-4">
            <WarmCard variant="amber" className="space-y-4 border border-[#F59E0B]/30">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#D97706]">Upcoming Maintenance Schedule</h3>
                <WarmBadge variant="amber">Next: 15,000 km Service</WarmBadge>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'Tire Pressure & Tread Rotation', date: 'Due in 1,200 km', status: 'Optimal', icon: Gauge, color: 'blue' as const },
                  { title: 'Brake Pad & Rotor Diagnostic', date: 'Due in 4,500 km', status: '94% Health', icon: Wrench, color: 'amber' as const },
                  { title: 'Coolant & Thermal Check', date: 'Completed Last Month', status: 'Passed', icon: CheckCircle2, color: 'emerald' as const },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E2E8F0] text-xs">
                    <div className="flex items-center gap-3">
                      <CategoryIconBox icon={item.icon} color={item.color} />
                      <div>
                        <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{item.title}</p>
                        <p className="text-[10px] text-[#475569] dark:text-[#94A3B8]">{item.date}</p>
                      </div>
                    </div>
                    <WarmBadge variant={item.color === 'blue' ? 'blue' : item.color === 'amber' ? 'amber' : 'emerald'}>
                      {item.status}
                    </WarmBadge>
                  </div>
                ))}
              </div>
            </WarmCard>
          </div>
        )}

        {/* TAB 2: Documents Section */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <WarmCard variant="white" className="space-y-3 border border-[#0F766E]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryIconBox icon={Shield} color="emerald" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#0F766E]">Insurance Policy</h4>
                  </div>
                  <WarmBadge variant="emerald">Active</WarmBadge>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">State Farm Comprehensive VIP Policy</p>
                  <p className="text-[#475569] dark:text-[#94A3B8] font-mono">Policy No: SF-94028-2026</p>
                  <p className="text-[#475569] dark:text-[#94A3B8]">Cashless Limit: ₹10,00,000</p>
                  <p className="text-[10px] text-[#0F766E] font-bold mt-2">Expires: Dec 31, 2026</p>
                </div>
              </WarmCard>

              <WarmCard variant="white" className="space-y-3 border border-[#F59E0B]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryIconBox icon={FileText} color="amber" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#D97706]">Registration & PUC</h4>
                  </div>
                  <WarmBadge variant="amber">Verified</WarmBadge>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">RC & Emission Certificate</p>
                  <p className="text-[#475569] dark:text-[#94A3B8] font-mono">Reg No: {activeVehicle.plate}</p>
                  <p className="text-[#475569] dark:text-[#94A3B8]">RTO: Verified Vehicle</p>
                  <p className="text-[10px] text-[#D97706] font-bold mt-2">PUC Valid Till: Oct 2027</p>
                </div>
              </WarmCard>
            </div>
          </div>
        )}

        {/* TAB 3: Live Radar Section - Real-World Location Services */}
        {activeTab === 'radar' && (
          <div className="space-y-4">
            {/* Interactive Vector Map */}
            <div className="relative h-64 w-full rounded-3xl overflow-hidden border border-[#2563EB]/30 shadow-md">
              <MapCanvas className="h-full w-full" />
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#151C2C]/90 rounded-full px-3.5 py-1.5 text-[11px] font-bold flex items-center gap-2 shadow-lg border border-[#2563EB]/20 backdrop-blur-xl">
                <span className="size-2 rounded-full bg-[#2563EB] animate-ping" />
                <span className="text-[#2563EB]">
                  {placesLoading ? 'Scanning nearby places...' : `${places.length} Real-World Services Found`}
                </span>
              </div>
            </div>

            {/* Real-World Category Selector Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-wider text-[#2563EB]">
                  Service Category:
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  Showing real-world locations
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {CATEGORY_OPTIONS.map((cat) => {
                  const Icon = cat.icon
                  const isSelected = selectedCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-extrabold transition-all cursor-pointer shrink-0 border select-none ${
                        isSelected
                          ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                          : 'bg-white dark:bg-[#151C2C] text-[#475569] dark:text-[#94A3B8] hover:text-foreground border-[#E2E8F0] dark:border-white/10'
                      }`}
                    >
                      <Icon className="size-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Distance Filter Bar */}
            <div className="flex items-center justify-between bg-white dark:bg-[#151C2C] p-3 rounded-2xl border border-[#E2E8F0] dark:border-white/10">
              <span className="text-xs font-bold text-[#475569] dark:text-[#94A3B8] flex items-center gap-1.5">
                <Filter className="size-3.5 text-[#2563EB]" /> Search Radius:
              </span>
              <div className="flex gap-1">
                {(['2km', '5km', '10km'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilterRadius(r)}
                    className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      filterRadius === r ? 'bg-[#2563EB] text-white shadow-sm' : 'text-[#475569] dark:text-[#94A3B8] hover:text-foreground'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Places Results List / Loading / Errors */}
            <div className="space-y-2.5">
              {placesLoading ? (
                <div className="p-8 bg-white dark:bg-[#151C2C] rounded-2xl border border-[#E2E8F0] text-center space-y-3 shadow-sm">
                  <Loader2 className="size-6 text-[#2563EB] animate-spin mx-auto" />
                  <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Discovering real-world {selectedCategory.replace('_', ' ')}s near your location...
                  </p>
                  <p className="text-[10px] text-muted-foreground">Connecting to LifeOS Location Engine</p>
                </div>
              ) : placesError ? (
                <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-center space-y-2">
                  <AlertCircle className="size-6 mx-auto" />
                  <p className="text-xs font-bold">{placesError}</p>
                  <WarmButton size="sm" variant="ghost" onClick={loadNearbyPlaces} className="mx-auto mt-2">
                    <RefreshCw className="size-3.5 mr-1" /> Retry Search
                  </WarmButton>
                </div>
              ) : places.length === 0 ? (
                <div className="p-8 bg-white dark:bg-[#151C2C] rounded-2xl border border-[#E2E8F0] text-center space-y-2 shadow-sm">
                  <MapPin className="size-6 text-muted-foreground mx-auto" />
                  <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    No real-world {selectedCategory.replace('_', ' ')}s found within {filterRadius}.
                  </p>
                  <p className="text-[10px] text-muted-foreground">Try expanding your search radius to 10km.</p>
                  <WarmButton size="sm" variant="ghost" onClick={() => setFilterRadius('10km')} className="mx-auto mt-2">
                    Expand Search Radius
                  </WarmButton>
                </div>
              ) : (
                places.map((place) => {
                  const CatIcon = getCategoryIcon(place.category)
                  return (
                    <WarmCard key={place.id} variant="white" className="flex items-center justify-between p-3.5 border border-[#E2E8F0]">
                      <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                        <CategoryIconBox icon={CatIcon} color="blue" className="shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                            {place.name}
                          </h4>
                          <p className="text-[10px] text-[#475569] dark:text-[#94A3B8] truncate mt-0.5">
                            {place.address || 'Local Verified Service'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right font-mono">
                          <span className="text-xs font-bold text-[#2563EB]">
                            {place.distance} km
                          </span>
                          <p className="text-[9px] text-[#475569] dark:text-[#94A3B8]">away</p>
                        </div>

                        <WarmButton size="sm" variant="ghost" onClick={() => handleCall(place.name, place.phone)}>
                          <Phone className="size-3.5 text-[#2563EB]" />
                        </WarmButton>
                      </div>
                    </WarmCard>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Bottom Dispatch Trigger */}
        <WarmButton variant="secondary" size="lg" className="w-full shadow-lg" onClick={onEmergency}>
          <ShieldCheck className="size-5" /> Dispatch Immediate Rescue for {activeVehicle.name}
        </WarmButton>

      </div>

      {/* Live Calling Modal */}
      <CallModal
        isOpen={calling}
        onClose={() => setCalling(false)}
        mechanicName={selectedMechanic}
        mechanicPhone={selectedPhone}
      />
    </div>
  )
}
