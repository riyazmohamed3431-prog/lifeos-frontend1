'use client'

import { useState } from 'react'
import { vehicles as initialVehicles, type Vehicle } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { CategoryIconBox, WarmBadge, WarmButton, WarmCard } from '@/components/ui/warm-components'
import type { AuthUser } from '@/lib/firebase'
import {
  Car,
  Crown,
  Phone,
  ShieldCheck,
  ChevronRight,
  Plus,
  LogOut,
  LogIn,
  Bell,
  Lock,
  Sparkles,
  CreditCard,
  Award,
  Shield,
  Wallet,
  User,
  Sliders,
  CheckCircle2,
  PhoneCall,
  Smartphone,
  Check,
  AlertCircle,
  Trash2,
  Star,
  Pencil,
} from 'lucide-react'

type ProfileTab = 'all' | 'personal' | 'garage' | 'billing' | 'emergency' | 'security'

export function ProfileScreen({
  user,
  onLogout,
  onLoginRedirect,
}: {
  user?: AuthUser | null
  onLogout?: () => void
  onLoginRedirect?: () => void
}) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('all')

  // User identity defaults
  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Riyaz Mohamed')
  const email = user?.email || 'riyaz@lifeos.app'
  const phoneNumber = '+91 98400 12345'
  const driverLicense = 'TN-07-2022-89410'

  // Interactive Garage State
  const [garageVehicles, setGarageVehicles] = useState<Vehicle[]>(initialVehicles)
  const [primaryVehicleId, setPrimaryVehicleId] = useState<string>(initialVehicles[0]?.id || 'v1')
  
  // Add Vehicle State
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [newVehicleName, setNewVehicleName] = useState('')
  const [newVehiclePlate, setNewVehiclePlate] = useState('')
  const [newVehicleColor, setNewVehicleColor] = useState('')

  // Edit Vehicle State
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null)
  const [editVehicleName, setEditVehicleName] = useState('')
  const [editVehiclePlate, setEditVehiclePlate] = useState('')
  const [editVehicleColor, setEditVehicleColor] = useState('')

  // Interactive Security & Telemetry State
  const [realtimeAlerts, setRealtimeAlerts] = useState(true)
  const [crashDetection, setCrashDetection] = useState(true)
  const [gpsTelemetry, setGpsTelemetry] = useState(true)

  // Interactive Payment Default State
  const [primaryPayment, setPrimaryPayment] = useState<'card' | 'upi'>('card')

  // Emergency contact test state
  const [testSent, setTestSent] = useState(false)

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVehicleName.trim() || !newVehiclePlate.trim()) return
    const newV: Vehicle = {
      id: 'v-' + Date.now(),
      name: newVehicleName.trim(),
      plate: newVehiclePlate.trim(),
      color: newVehicleColor.trim() || 'Metallic Silver',
    }
    setGarageVehicles([newV, ...garageVehicles])
    setNewVehicleName('')
    setNewVehiclePlate('')
    setNewVehicleColor('')
    setShowAddVehicle(false)
  }

  const startEditVehicle = (v: Vehicle) => {
    setEditingVehicleId(v.id)
    setEditVehicleName(v.name)
    setEditVehiclePlate(v.plate)
    setEditVehicleColor(v.color)
  }

  const handleSaveEditVehicle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVehicleId || !editVehicleName.trim() || !editVehiclePlate.trim()) return
    setGarageVehicles(
      garageVehicles.map((v) =>
        v.id === editingVehicleId
          ? {
              ...v,
              name: editVehicleName.trim(),
              plate: editVehiclePlate.trim(),
              color: editVehicleColor.trim() || v.color,
            }
          : v
      )
    )
    setEditingVehicleId(null)
  }

  const cancelEditVehicle = () => {
    setEditingVehicleId(null)
  }

  const handleRemoveVehicle = (id: string) => {
    if (garageVehicles.length <= 1) {
      alert('At least one vehicle must remain registered in your garage.')
      return
    }
    const updated = garageVehicles.filter((v) => v.id !== id)
    setGarageVehicles(updated)
    if (primaryVehicleId === id) {
      setPrimaryVehicleId(updated[0].id)
    }
  }

  const handleSetPrimary = (id: string) => {
    setPrimaryVehicleId(id)
  }

  const handleTestAlert = () => {
    setTestSent(true)
    setTimeout(() => setTestSent(false), 3000)
  }

  return (
    <div className="relative h-full overflow-y-auto no-scrollbar px-4 sm:px-6 pt-3 pb-32 space-y-6 font-sans text-[#0F172A] dark:text-[#F8FAFC] max-w-4xl mx-auto">
      <AmbientBg tone="calm" />

      <div className="relative z-10 space-y-6">

        {/* User Identity Hero Card */}
        <WarmCard variant="white" className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#E2E8F0] shadow-md min-w-0">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="grid size-14 sm:size-16 place-items-center rounded-3xl bg-[#0F766E]/10 text-[#0F766E] font-black text-xl border border-[#0F766E]/20 shadow-sm shrink-0">
              {displayName.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">{displayName}</h1>
                <ShieldCheck className="size-5 text-[#0F766E] shrink-0" />
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-mono truncate">{email}</p>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5">
                <WarmBadge variant="emerald" className="shrink-0">Verified Driver</WarmBadge>
                <WarmBadge variant="purple" className="shrink-0">Executive VIP Tier</WarmBadge>
              </div>
            </div>
          </div>
          {user ? (
            <WarmButton variant="ghost" size="sm" onClick={onLogout} className="self-start sm:self-center shrink-0">
              <LogOut className="size-4 text-[#EF4444]" /> Sign Out
            </WarmButton>
          ) : (
            <WarmButton variant="primary" size="sm" onClick={onLoginRedirect} className="self-start sm:self-center shrink-0">
              <LogIn className="size-4" /> Sign In
            </WarmButton>
          )}
        </WarmCard>

        {/* PROFILE OPTIONS CATEGORY TABS BAR */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-[#E2E8F0] dark:border-white/10">
          {[
            { id: 'all', label: 'All Options', icon: Sliders },
            { id: 'personal', label: 'Personal Info', icon: User },
            { id: 'garage', label: 'My Garage', icon: Car },
            { id: 'billing', label: 'Payments & Wallet', icon: CreditCard },
            { id: 'emergency', label: 'SOS Contacts', icon: Phone },
            { id: 'security', label: 'Security & Privacy', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ProfileTab)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition-all cursor-pointer shrink-0 border select-none ${
                  isActive
                    ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
                    : 'bg-card text-[#475569] dark:text-[#94A3B8] hover:text-foreground border-[#E2E8F0] dark:border-white/10'
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* OPTION SECTION 1: Personal Driver Info */}
        {(activeTab === 'all' || activeTab === 'personal') && (
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] px-1 flex items-center gap-2">
              <User className="size-3.5 text-[#0F766E]" /> Driver Credentials & Info
            </h2>
            <WarmCard variant="white" className="p-4 sm:p-5 border border-[#E2E8F0] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#475569] dark:text-[#94A3B8]">Full Name</p>
                  <p className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">{displayName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#475569] dark:text-[#94A3B8]">Email Address</p>
                  <p className="text-xs font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC]">{email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#475569] dark:text-[#94A3B8]">Registered Phone</p>
                  <p className="text-xs font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC]">{phoneNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#475569] dark:text-[#94A3B8]">Driver License Number</p>
                  <p className="text-xs font-mono font-bold text-[#0F766E] flex items-center gap-1">
                    <CheckCircle2 className="size-3.5 text-[#0F766E]" /> {driverLicense}
                  </p>
                </div>
              </div>
            </WarmCard>
          </div>
        )}

        {/* OPTION SECTION 2: Membership Tier Banner */}
        {(activeTab === 'all' || activeTab === 'personal') && (
          <WarmCard variant="purple" className="p-5 sm:p-6 border border-[#8B5CF6]/30 space-y-3 min-w-0">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#8B5CF6] truncate">LifeOS VIP Rewards & Protection</p>
                <h2 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">Executive Tier I VIP Protection</h2>
              </div>
              <Crown className="size-7 sm:size-8 text-[#F59E0B] shrink-0" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#475569] dark:text-[#94A3B8] pt-2 border-t border-[#8B5CF6]/20 min-w-0">
              <span className="font-semibold text-[11px] sm:text-xs min-w-0 flex-1">24/7 Unlimited Priority Highway Dispatch & Cashless Coverage</span>
              <WarmBadge variant="purple" className="shrink-0 self-start sm:self-auto">Active Tier</WarmBadge>
            </div>
          </WarmCard>
        )}

        {/* Driver Safety Achievements */}
        {(activeTab === 'all' || activeTab === 'personal') && (
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] px-1">Safety Badges & Achievements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <WarmCard variant="white" className="p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 border border-[#E2E8F0] min-w-0">
                <CategoryIconBox icon={Award} color="amber" className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">5-Yr Safe Driver</p>
                  <p className="text-[10px] text-[#475569] dark:text-[#94A3B8] font-semibold truncate">Zero Highway Incidents</p>
                </div>
              </WarmCard>

              <WarmCard variant="white" className="p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 border border-[#E2E8F0] min-w-0">
                <CategoryIconBox icon={Shield} color="emerald" className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">Fully Insured</p>
                  <p className="text-[10px] text-[#475569] dark:text-[#94A3B8] font-semibold truncate">Cashless Policy Verified</p>
                </div>
              </WarmCard>

              <WarmCard variant="white" className="p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 col-span-2 sm:col-span-1 border border-[#E2E8F0] min-w-0">
                <CategoryIconBox icon={Sparkles} color="purple" className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">Top 1% VIP</p>
                  <p className="text-[10px] text-[#475569] dark:text-[#94A3B8] font-semibold truncate">Priority Dispatch Tier</p>
                </div>
              </WarmCard>
            </div>
          </div>
        )}

        {/* OPTION SECTION 3: Garage & Vehicles (Add, Edit, Remove, Set Primary) */}
        {(activeTab === 'all' || activeTab === 'garage') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
                <Car className="size-3.5 text-[#2563EB]" /> Registered Garage Vehicles ({garageVehicles.length})
              </h2>
              <WarmButton variant="ghost" size="sm" onClick={() => setShowAddVehicle(!showAddVehicle)}>
                <Plus className="size-3.5 text-[#2563EB]" /> {showAddVehicle ? 'Cancel' : 'Add Vehicle'}
              </WarmButton>
            </div>

            {/* Add Vehicle Form Drawer */}
            {showAddVehicle && (
              <form onSubmit={handleAddVehicle} className="p-4 bg-card border border-[#2563EB]/30 rounded-2xl space-y-3 shadow-md animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-[#2563EB] flex items-center gap-1.5">
                    <Plus className="size-4" /> Add New Vehicle to Garage
                  </p>
                  <span className="text-[10px] text-muted-foreground font-semibold">Step 1 of 1</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    placeholder="Vehicle Model (e.g. Tesla Model Y)"
                    value={newVehicleName}
                    onChange={(e) => setNewVehicleName(e.target.value)}
                    className="surface-glass rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-[#2563EB]"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Plate # (e.g. TN 07 CX 9900)"
                    value={newVehiclePlate}
                    onChange={(e) => setNewVehiclePlate(e.target.value)}
                    className="surface-glass rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-[#2563EB]"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Color (e.g. Stealth Grey)"
                    value={newVehicleColor}
                    onChange={(e) => setNewVehicleColor(e.target.value)}
                    className="surface-glass rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <WarmButton type="button" variant="ghost" size="sm" onClick={() => setShowAddVehicle(false)}>
                    Cancel
                  </WarmButton>
                  <WarmButton type="submit" variant="primary" size="sm">
                    Save Vehicle
                  </WarmButton>
                </div>
              </form>
            )}

            {/* Vehicle List Cards with Options: Edit, Set Primary, Delete */}
            <div className="grid grid-cols-1 gap-3">
              {garageVehicles.map((v) => {
                const isPrimary = v.id === primaryVehicleId
                const isEditing = editingVehicleId === v.id

                if (isEditing) {
                  return (
                    <form key={v.id} onSubmit={handleSaveEditVehicle} className="p-4 bg-card border border-[#2563EB]/40 rounded-2xl space-y-3 shadow-md animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black text-[#2563EB] flex items-center gap-1.5">
                          <Pencil className="size-4" /> Edit Vehicle Details
                        </p>
                        <span className="text-[10px] text-muted-foreground font-mono">{v.plate}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Model / Name</label>
                          <input
                            type="text"
                            value={editVehicleName}
                            onChange={(e) => setEditVehicleName(e.target.value)}
                            className="surface-glass w-full rounded-xl px-3.5 py-2 text-xs text-foreground border border-border focus:outline-none focus:border-[#2563EB]"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Plate Number</label>
                          <input
                            type="text"
                            value={editVehiclePlate}
                            onChange={(e) => setEditVehiclePlate(e.target.value)}
                            className="surface-glass w-full rounded-xl px-3.5 py-2 text-xs text-foreground border border-border focus:outline-none focus:border-[#2563EB]"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Color</label>
                          <input
                            type="text"
                            value={editVehicleColor}
                            onChange={(e) => setEditVehicleColor(e.target.value)}
                            className="surface-glass w-full rounded-xl px-3.5 py-2 text-xs text-foreground border border-border focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <WarmButton type="button" variant="ghost" size="sm" onClick={cancelEditVehicle}>
                          Cancel
                        </WarmButton>
                        <WarmButton type="submit" variant="primary" size="sm">
                          Save Changes
                        </WarmButton>
                      </div>
                    </form>
                  )
                }

                return (
                  <WarmCard
                    key={v.id}
                    variant="white"
                    className={`p-4 border transition-all min-w-0 ${
                      isPrimary ? 'border-[#0F766E] ring-1 ring-[#0F766E]/40 shadow-sm' : 'border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <CategoryIconBox icon={Car} color={isPrimary ? 'emerald' : 'blue'} className="shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">{v.name}</h3>
                            {isPrimary ? (
                              <WarmBadge variant="emerald" className="shrink-0 text-[10px] flex items-center gap-1 py-0.5">
                                <CheckCircle2 className="size-3" /> Primary Vehicle
                              </WarmBadge>
                            ) : (
                              <WarmBadge variant="purple" className="shrink-0 text-[10px] py-0.5">
                                Secondary
                              </WarmBadge>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-[#475569] dark:text-[#94A3B8] truncate mt-0.5">
                            {v.color} · {v.plate}
                          </p>
                        </div>
                      </div>

                      {/* Vehicle Action Options */}
                      <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        {!isPrimary && (
                          <button
                            onClick={() => handleSetPrimary(v.id)}
                            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-[#0F766E] bg-[#0F766E]/10 hover:bg-[#0F766E]/20 border border-[#0F766E]/20 transition-all cursor-pointer"
                            title="Set as Primary Vehicle"
                          >
                            <Star className="size-3.5 fill-[#0F766E]" />
                            <span>Set Primary</span>
                          </button>
                        )}

                        <button
                          onClick={() => startEditVehicle(v)}
                          className="p-2 rounded-xl text-[#2563EB] hover:bg-[#2563EB]/10 border border-[#2563EB]/20 transition-all cursor-pointer"
                          title="Edit Vehicle Details"
                        >
                          <Pencil className="size-4" />
                        </button>

                        <button
                          onClick={() => handleRemoveVehicle(v.id)}
                          className="p-2 rounded-xl text-destructive hover:bg-destructive/10 border border-destructive/20 transition-all cursor-pointer"
                          title="Remove Vehicle from Garage"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </WarmCard>
                )
              })}
            </div>
          </div>
        )}

        {/* OPTION SECTION 4: Digital Wallet & Stored Payment Methods */}
        {(activeTab === 'all' || activeTab === 'billing') && (
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] px-1 flex items-center gap-2">
              <CreditCard className="size-3.5 text-[#0F766E]" /> Stored Payment Methods & Wallet
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <WarmCard
                variant="white"
                onClick={() => setPrimaryPayment('card')}
                className={`p-3.5 sm:p-4 flex items-center justify-between border cursor-pointer transition-all ${
                  primaryPayment === 'card' ? 'border-[#0F766E] ring-1 ring-[#0F766E]/40' : 'border-[#E2E8F0]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                  <CategoryIconBox icon={CreditCard} color="emerald" className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">HDFC Visa Signature</p>
                    <p className="text-[10px] font-mono text-[#475569] dark:text-[#94A3B8] truncate">•••• 4218 · Primary Card</p>
                  </div>
                </div>
                {primaryPayment === 'card' ? (
                  <WarmBadge variant="emerald" className="shrink-0">Default</WarmBadge>
                ) : (
                  <span className="text-[10px] font-bold text-muted-foreground">Select</span>
                )}
              </WarmCard>

              <WarmCard
                variant="white"
                onClick={() => setPrimaryPayment('upi')}
                className={`p-3.5 sm:p-4 flex items-center justify-between border cursor-pointer transition-all ${
                  primaryPayment === 'upi' ? 'border-[#0F766E] ring-1 ring-[#0F766E]/40' : 'border-[#E2E8F0]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                  <CategoryIconBox icon={Wallet} color="orange" className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">UPI Autopay</p>
                    <p className="text-[10px] font-mono text-[#475569] dark:text-[#94A3B8] truncate">lifeos@okaxis</p>
                  </div>
                </div>
                {primaryPayment === 'upi' ? (
                  <WarmBadge variant="emerald" className="shrink-0">Default</WarmBadge>
                ) : (
                  <span className="text-[10px] font-bold text-muted-foreground">Select</span>
                )}
              </WarmCard>
            </div>
          </div>
        )}

        {/* OPTION SECTION 5: Emergency SOS Contacts */}
        {(activeTab === 'all' || activeTab === 'emergency') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#EF4444] flex items-center gap-2">
                <Phone className="size-3.5 text-[#EF4444]" /> Trusted Emergency Contacts
              </h2>
              <button
                onClick={handleTestAlert}
                className="text-xs font-bold text-[#0F766E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {testSent ? <Check className="size-3.5 text-emerald-500" /> : <PhoneCall className="size-3.5" />}
                <span>{testSent ? 'Test Alert Broadcast Sent!' : 'Send Test SOS Alert'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {[
                { n: 'Sarah Lin', r: 'Spouse · Primary SOS Alert Recipient', p: '+91 98400 99881' },
                { n: 'State Farm Emergency Desk', r: 'Policy #SF-94028 · Priority Claims Desk', p: '1800-555-CLAIM' },
              ].map((c) => (
                <WarmCard key={c.n} variant="white" className="p-3.5 flex items-center justify-between border border-[#E2E8F0] min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <CategoryIconBox icon={Phone} color="purple" className="shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">{c.n}</p>
                      <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] font-medium truncate">{c.r} · {c.p}</p>
                    </div>
                  </div>
                  <WarmBadge variant="purple" className="shrink-0">Verified</WarmBadge>
                </WarmCard>
              ))}
            </div>
          </div>
        )}

        {/* OPTION SECTION 6: Security & Telemetry Options */}
        {(activeTab === 'all' || activeTab === 'security') && (
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] px-1 flex items-center gap-2">
              <Lock className="size-3.5 text-[#0F766E]" /> Security & Telemetry Options
            </h2>
            <div className="space-y-2">
              <WarmCard variant="white" className="p-3.5 flex items-center justify-between border border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <Bell className="size-4 text-[#0F766E]" />
                  <div>
                    <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">Real-time Highway Emergency Alerts</p>
                    <p className="text-[10px] text-muted-foreground">Receive instant notifications for accidents nearby</p>
                  </div>
                </div>
                <button
                  onClick={() => setRealtimeAlerts(!realtimeAlerts)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    realtimeAlerts ? 'bg-[#0F766E] text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {realtimeAlerts ? 'Enabled' : 'Disabled'}
                </button>
              </WarmCard>

              <WarmCard variant="white" className="p-3.5 flex items-center justify-between border border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <Smartphone className="size-4 text-[#2563EB]" />
                  <div>
                    <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">Automatic Crash Detection</p>
                    <p className="text-[10px] text-muted-foreground">Auto-dispatch SOS if sudden deceleration detected</p>
                  </div>
                </div>
                <button
                  onClick={() => setCrashDetection(!crashDetection)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    crashDetection ? 'bg-[#2563EB] text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {crashDetection ? 'Active' : 'Paused'}
                </button>
              </WarmCard>

              <WarmCard variant="white" className="p-3.5 flex items-center justify-between border border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <Lock className="size-4 text-[#8B5CF6]" />
                  <div>
                    <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">GPS Telemetry Encryption</p>
                    <p className="text-[10px] text-muted-foreground">End-to-end 256-bit SSL encrypted location transmission</p>
                  </div>
                </div>
                <button
                  onClick={() => setGpsTelemetry(!gpsTelemetry)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    gpsTelemetry ? 'bg-[#8B5CF6] text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {gpsTelemetry ? '256-Bit SSL' : 'Standard'}
                </button>
              </WarmCard>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
