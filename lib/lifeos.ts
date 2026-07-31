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
  | 'login'
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
}

export const emergencies: Emergency[] = [
  { id: 'tyre', label: 'Flat Tyre', sub: 'Puncture / blowout', icon: Disc3, fee: 750, eta: '8 min' },
  { id: 'battery', label: 'Battery Dead', sub: 'Jump start / replace', icon: BatteryWarning, fee: 950, eta: '10 min' },
  { id: 'engine', label: 'Engine Failure', sub: 'Won’t start / stalling', icon: Cog, fee: 1450, eta: '12 min' },
  { id: 'fuel', label: 'Fuel Empty', sub: 'Emergency delivery', icon: Fuel, fee: 650, eta: '11 min' },
  { id: 'accident', label: 'Accident Assist', sub: 'Priority dispatch', icon: AlertTriangle, fee: 0, eta: '5 min' },
  { id: 'lockout', label: 'Locked Out', sub: 'Key retrieval', icon: KeyRound, fee: 800, eta: '9 min' },
  { id: 'overheat', label: 'Overheating', sub: 'Coolant / radiator', icon: Thermometer, fee: 900, eta: '13 min' },
  { id: 'other', label: 'General Assist', sub: 'Mechanical support', icon: Wrench, fee: 850, eta: '14 min' },
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

