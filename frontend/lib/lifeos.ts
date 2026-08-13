import type { LucideIcon } from 'lucide-react'
import {
  Disc3,
  BatteryWarning,
  Cog,
  Fuel,
  AlertTriangle,
  KeyRound,
  Wrench,
  Thermometer,
} from 'lucide-react'

export type ScreenId =
  | 'landing'
  | 'splash'
  | 'login'
  | 'welcome'
  | 'home'
  | 'map'
  | 'booking'
  | 'waiting'
  | 'found'
  | 'tracking'
  | 'payment'
  | 'history'
  | 'profile'

export type Emergency = {
  id: string
  label: string
  sub: string
  icon: LucideIcon
  fee: number
  eta: string
  category: 'Tyres' | 'Battery' | 'Engine' | 'Fuel' | 'Lockout' | 'Cooling' | 'Towing' | 'Service'
  image: string
  description: string
  about: string
  causes: string[]
  symptoms: string[]
  included: string[]
}

export const emergencies: Emergency[] = [
  {
    id: 'tyre',
    label: 'Flat Tyre',
    sub: 'Puncture / Blowout',
    icon: Disc3,
    fee: 750,
    eta: '8 min',
    category: 'Tyres',
    image: '/images/issues/flat-tyre.png',
    description: 'A flat tyre can leave you stranded anytime. Our expert will check the tyre and repair it on the spot.',
    about: 'A flat tyre can happen due to a puncture, road debris, valve leak, or worn-out tyre.',
    causes: ['Puncture', 'Sharp road objects', 'Valve leak', 'Low tyre pressure', 'Worn tyre'],
    symptoms: ['Tyre looks deflated', 'Vehicle pulls to one side', 'Steering feels unusual', 'Warning indicator may appear'],
    included: ['Puncture repair or stepney replacement', 'Tyre pressure check', 'Wheel nut tightening', 'Safety recheck before you go'],
  },
  {
    id: 'battery',
    label: 'Battery Dead',
    sub: 'Jump start / Replace',
    icon: BatteryWarning,
    fee: 950,
    eta: '10 min',
    category: 'Battery',
    image: '/images/issues/battery-dead.png',
    description: "Battery drained or not starting? We'll jump start your vehicle or replace the battery.",
    about: 'Vehicle batteries drain over time, due to headlights left on, alternator fault, or aging cells.',
    causes: ['Left headlights on', 'Aging battery (>3 years)', 'Faulty alternator', 'Cold temperature', 'Parasitic drain'],
    symptoms: ['Clicking sound on start', 'Dim headlights', 'Slow engine crank', 'Dashboard battery warning light'],
    included: ['High-amp battery jump start', 'Voltage & alternator diagnostic', 'Terminal cleaning & tightening', 'New battery replacement option'],
  },
  {
    id: 'engine',
    label: 'Engine Failure',
    sub: "Won't start / Stalling",
    icon: Cog,
    fee: 1450,
    eta: '12 min',
    category: 'Engine',
    image: '/images/issues/engine-failure.png',
    description: 'Engine not starting or keeps stalling? Our expert will diagnose and fix the issue.',
    about: 'Engine stalling or non-start can stem from ignition coil defects, sensor failure, or fuel delivery issues.',
    causes: ['Ignition coil failure', 'Faulty spark plugs', 'Sensor malfunction (OBD-II)', 'Fuel pump issue', 'Timing belt problem'],
    symptoms: ["Engine cranks but won't start", 'Sudden stalling at idle', 'Check engine light illuminated', 'Rough idling or misfire'],
    included: ['On-site OBD-II diagnostic scan', 'Ignition & sensor inspection', 'Emergency electrical bypass', 'Roadside clearance verification'],
  },
  {
    id: 'fuel',
    label: 'Out of Fuel',
    sub: 'Fuel delivery',
    icon: Fuel,
    fee: 650,
    eta: '15 min',
    category: 'Fuel',
    image: '/images/issues/fuel-empty.png',
    description: "Ran out of fuel? We'll deliver fuel to get you back on the road.",
    about: 'Running out of fuel on highways or isolated roads happens unexpectedly. We bring fuel straight to your vehicle.',
    causes: ['Inaccurate fuel gauge', 'Unexpected traffic delay', 'Long distance between fuel stations'],
    symptoms: ['Engine sputtering', 'Fuel indicator on empty', 'Vehicle stopped on shoulder'],
    included: ['5 Liters premium fuel delivery', 'Safe funnel fueling', 'Fuel system priming', 'Engine start verification'],
  },
  {
    id: 'lockout',
    label: 'Key Locked Inside',
    sub: 'Unlock vehicle',
    icon: KeyRound,
    fee: 550,
    eta: '10 min',
    category: 'Lockout',
    image: '/images/issues/key-locked.png',
    description: "Locked your keys inside? We'll safely unlock your vehicle without damage.",
    about: 'Accidentally locking keys inside happens in a flash. Our specialists unlock doors using zero-damage tools.',
    causes: ['Automatic door lock triggered', 'Key fob battery dead inside', 'Key left in ignition or trunk'],
    symptoms: ['Keys visible inside vehicle', 'Doors locked from outside', 'Key fob unresponsive'],
    included: ['Damage-free air wedge unlocking', 'Special lock-pick tool entry', 'Trunk key retrieval', 'Key fob signal re-sync test'],
  },
  {
    id: 'overheat',
    label: 'Overheating',
    sub: 'Engine too hot',
    icon: Thermometer,
    fee: 950,
    eta: '15 min',
    category: 'Cooling',
    image: '/images/issues/overheating.svg',
    description: "Engine temperature high? We'll cool it down and prevent further damage.",
    about: 'Engine overheating can severely damage internal heads. We diagnose radiator leaks and top up coolant.',
    causes: ['Coolant leak', 'Broken radiator fan', 'Thermostat stuck closed', 'Low engine oil'],
    symptoms: ['Steam from under hood', 'Temp gauge in red zone', 'Coolant smell in cabin', 'Engine knocking sound'],
    included: ['Safe engine cooling procedure', 'Radiator & hose pressure test', 'Coolant refill (up to 2L)', 'Fan & thermostat diagnostic'],
  },
  {
    id: 'towing',
    label: 'Towing / Recovery',
    sub: 'Vehicle towing',
    icon: AlertTriangle,
    fee: 1200,
    eta: '20 min',
    category: 'Towing',
    image: '/images/issues/towing-recovery.png',
    description: "Can't move your vehicle? We'll tow it safely to your desired location.",
    about: 'When on-site repair is not possible, flatbed towing ensures damage-free transport to your garage.',
    causes: ['Major mechanical breakdown', 'Transmission failure', 'Axle or brake lock', 'Collision impact'],
    symptoms: ['Vehicle unsafe to drive', 'Wheels locked', 'Engine completely inoperable'],
    included: ['Hydraulic flatbed truck dispatch', 'Soft-strap wheel winching', 'Transport to designated workshop', 'On-truck insurance coverage'],
  },
  {
    id: 'other',
    label: 'General Service',
    sub: 'Minor repair / Inspection',
    icon: Wrench,
    fee: 850,
    eta: '20 min',
    category: 'Service',
    image: '/images/issues/general-service.png',
    description: 'Need a quick check or minor repair? Our expert will help you on the spot.',
    about: 'Unsure about an unusual noise, fluid drop, or warning sign? Our technician performs a 20-point roadside check.',
    causes: ['Loose belts', 'Minor oil leak', 'Brake squeal', 'Electrical glitch', 'Fuse blown'],
    symptoms: ['Strange noise while driving', 'Warning light on dash', 'Minor fluid leak under car'],
    included: ['20-Point diagnostic inspection', 'Fuse & relay replacement', 'Fluid top-up check', 'Roadside fix or recommendation'],
  },
]

export type Vehicle = {
  id: string
  name: string
  plate: string
  color: string
}

export const vehicles: Vehicle[] = [
  { id: 'v1', name: 'Tesla Model 3', plate: 'TN 07 CX 4218', color: 'Midnight Silver' },
  { id: 'v2', name: 'BMW iX', plate: 'TN 38 B 9007', color: 'Storm Bay' },
  { id: 'v3', name: 'Tata Nexon EV', plate: 'TN 01 AK 1118', color: 'Glacier White' },
]

export type Mechanic = {
  name: string
  phone: string
  years: number
  rating: number
  jobs: number
  distanceKm: number
  etaMin: number
  specialty: string
  location: string
  vehicleRig: string
}

export const mechanic: Mechanic = {
  name: 'Karthik Subramanian',
  phone: '+91 98400 32145',
  years: 14,
  rating: 4.98,
  jobs: 3120,
  distanceKm: 2.1,
  etaMin: 8,
  specialty: 'Master EV & Drivetrain Specialist · Tamil Nadu Rescue Squad',
  location: 'NH-45 GST Road · Chengalpattu, Tamil Nadu',
  vehicleRig: 'TN 07 SOS Heavy Rescue Rig',
}

export const nearbyMechanics = [
  { tag: 'A', name: 'Karthik Subramanian', phone: '+91 98400 32145', rating: 4.98, eta: '8 min', km: '2.1 km', spec: 'EV & Heavy Recovery · GST Road Hub' },
  { tag: 'B', name: 'Mugan Rajan', phone: '+91 94440 88210', rating: 4.94, eta: '12 min', km: '3.6 km', spec: 'Towing & Engine Specialist · Tambaram' },
  { tag: 'C', name: 'Priya Selvam', phone: '+91 98841 55320', rating: 4.91, eta: '15 min', km: '4.8 km', spec: 'Electrical & Battery Assist · ECR Squad' },
  { tag: 'D', name: 'Anand Kabilan', phone: '+91 97909 12344', rating: 4.89, eta: '18 min', km: '6.2 km', spec: 'Highway Quick Response · Sriperumbudur' },
]

export type HistoryItem = {
  id: string
  date: string
  title: string
  vehicle: string
  mechanic: string
  amount: number
  status: 'Completed' | 'Cancelled'
}

export const history: HistoryItem[] = [
  { id: 'h1', date: 'Mar 14, 2026', title: 'Flat Tyre Replacement', vehicle: 'Tesla Model 3 (TN 07 CX 4218)', mechanic: 'Karthik Subramanian', amount: 750, status: 'Completed' },
  { id: 'h2', date: 'Jan 02, 2026', title: 'Battery Jump Start', vehicle: 'BMW iX (TN 38 B 9007)', mechanic: 'Priya Selvam', amount: 950, status: 'Completed' },
  { id: 'h3', date: 'Nov 21, 2025', title: 'Emergency Fuel Delivery', vehicle: 'Tata Nexon EV (TN 01 AK 1118)', mechanic: 'Mugan Rajan', amount: 650, status: 'Completed' },
  { id: 'h4', date: 'Sep 09, 2025', title: 'Lockout Assist', vehicle: 'Tesla Model 3 (TN 07 CX 4218)', mechanic: 'Karthik Subramanian', amount: 800, status: 'Completed' },
]

export function addHistoryLog(newItem: HistoryItem) {
  history.unshift(newItem)
}

const getApiBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL
  if (!url) {
    if (process.env.NODE_ENV === 'production') {
      return ''
    }
    return 'http://localhost:5001'
  }
  return url
}

export const API_BASE_URL = getApiBaseUrl()

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('lifeos_jwt_token') : null
  const headers = new Headers(options.headers || {})
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const res = await fetch(url, { ...options, headers })
  if (res.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('lifeos_jwt_token')
    localStorage.removeItem('lifeos_current_request_id')
    window.location.href = '/'
  }
  return res
}

