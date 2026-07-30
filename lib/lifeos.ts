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
  { id: 'tyre', label: 'Flat Tyre', sub: 'Puncture / blowout', icon: Disc3, fee: 24, eta: '9 min' },
  { id: 'battery', label: 'Battery Dead', sub: 'Jump start / replace', icon: BatteryWarning, fee: 29, eta: '11 min' },
  { id: 'engine', label: 'Engine Failure', sub: 'Won\u2019t start / stalling', icon: Cog, fee: 39, eta: '14 min' },
  { id: 'fuel', label: 'Fuel Empty', sub: 'Emergency delivery', icon: Fuel, fee: 19, eta: '12 min' },
  { id: 'accident', label: 'Accident', sub: 'Priority dispatch', icon: AlertTriangle, fee: 0, eta: '6 min' },
  { id: 'lockout', label: 'Locked Out', sub: 'Key retrieval', icon: KeyRound, fee: 22, eta: '10 min' },
  { id: 'overheat', label: 'Overheating', sub: 'Coolant / radiator', icon: Thermometer, fee: 27, eta: '13 min' },
  { id: 'other', label: 'Something Else', sub: 'General assist', icon: Wrench, fee: 25, eta: '15 min' },
]

export type Vehicle = {
  id: string
  name: string
  plate: string
  color: string
}

export const vehicles: Vehicle[] = [
  { id: 'v1', name: 'Tesla Model 3', plate: 'LIFE-2032', color: 'Midnight Silver' },
  { id: 'v2', name: 'BMW iX', plate: 'OS-0007', color: 'Storm Bay' },
  { id: 'v3', name: 'Rivian R1T', plate: 'RVN-118', color: 'Glacier White' },
]

export type Mechanic = {
  name: string
  years: number
  rating: number
  jobs: number
  distanceKm: number
  etaMin: number
  specialty: string
}

export const mechanic: Mechanic = {
  name: 'Marcus Vale',
  years: 12,
  rating: 4.97,
  jobs: 2841,
  distanceKm: 2.3,
  etaMin: 9,
  specialty: 'Certified EV & Drivetrain',
}

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
  { id: 'h1', date: 'Mar 14, 2032', title: 'Flat Tyre Replacement', vehicle: 'Tesla Model 3', mechanic: 'Marcus Vale', amount: 1250, status: 'Completed' },
  { id: 'h2', date: 'Jan 02, 2032', title: 'Battery Jump Start', vehicle: 'BMW iX', mechanic: 'Priya Anand', amount: 650, status: 'Completed' },
  { id: 'h3', date: 'Nov 21, 2031', title: 'Emergency Fuel Delivery', vehicle: 'Rivian R1T', mechanic: 'Diego Ruiz', amount: 550, status: 'Completed' },
  { id: 'h4', date: 'Sep 09, 2031', title: 'Lockout Assist', vehicle: 'Tesla Model 3', mechanic: 'Marcus Vale', amount: 750, status: 'Completed' },
]
