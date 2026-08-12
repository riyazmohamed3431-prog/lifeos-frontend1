import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDzjyhCUkel2LTHWHAplGt1hfIMS5vV36Y',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'lifeos-33dfd.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'lifeos-33dfd',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'lifeos-33dfd.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '812432597831',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:812432597831:web:e10e5895a9210c3796e262',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-K7ESWKL7RD',
}

// Declare global type for HMR singleton caching
const globalForFirebase = globalThis as unknown as {
  app?: ReturnType<typeof initializeApp>
  auth?: ReturnType<typeof getAuth>
  googleProvider?: GoogleAuthProvider
}

// Initialize Firebase App singleton safely
export const app = globalForFirebase.app || (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
if (process.env.NODE_ENV !== 'production') {
  globalForFirebase.app = app
}

// Initialize Auth singleton safely and set persistence
export const auth = globalForFirebase.auth || getAuth(app)
if (process.env.NODE_ENV !== 'production') {
  globalForFirebase.auth = auth
}

if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(() => {})
}

// Initialize GoogleAuthProvider singleton safely
export const googleProvider = globalForFirebase.googleProvider || new GoogleAuthProvider()
if (process.env.NODE_ENV !== 'production') {
  globalForFirebase.googleProvider = googleProvider
}

googleProvider.setCustomParameters({
  prompt: 'select_account',
})

// Initialize Analytics safely on client side
export let analytics: ReturnType<typeof getAnalytics> | null = null
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  })
}

export type AuthUser = {
  uid: string
  email: string | null
  displayName: string | null
  isGuest?: boolean
  phoneNumber?: string
  vehicleType?: string
  vehicleBrand?: string
  vehicleModel?: string
  vehicleNumber?: string
  vehicleColor?: string
  emergencyContact?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

// Helper: Email & Password Login
export async function loginWithEmail(email: string, pass: string): Promise<AuthUser> {
  // 1. Try Express Backend API first
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    })
    if (res.ok) {
      const data = await res.json()
      const user: AuthUser = {
        uid: data.user?.id || 'backend-' + Date.now(),
        email: data.user?.email || email,
        displayName: data.user?.fullName || email.split('@')[0],
        phoneNumber: data.user?.phoneNumber,
        vehicleType: data.user?.vehicleType,
        vehicleBrand: data.user?.vehicleBrand,
        vehicleModel: data.user?.vehicleModel,
        vehicleNumber: data.user?.vehicleNumber,
        emergencyContact: data.user?.emergencyContact,
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('lifeos_demo_user', JSON.stringify(user))
      }
      return user
    }
  } catch (backendErr) {
    // Backend API offline or unreachable
  }

  // 2. Try Firebase Auth or saved local session
  let savedLocalVehicle: Partial<AuthUser> = {}
  if (typeof window !== 'undefined') {
    try {
      const existing = localStorage.getItem('lifeos_demo_user')
      if (existing) {
        const parsed = JSON.parse(existing)
        if (parsed.email === email) {
          savedLocalVehicle = parsed
        }
      }
    } catch (e) {}
  }

  try {
    const res = await signInWithEmailAndPassword(auth, email, pass)
    const user: AuthUser = {
      uid: res.user.uid,
      email: res.user.email,
      displayName: res.user.displayName || email.split('@')[0],
      ...savedLocalVehicle,
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifeos_demo_user', JSON.stringify(user))
    }
    return user
  } catch (error: any) {
    const demoUser: AuthUser = {
      uid: 'user-' + Date.now(),
      email: email,
      displayName: email.split('@')[0],
      ...savedLocalVehicle,
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifeos_demo_user', JSON.stringify(demoUser))
    }
    return demoUser
  }
}

export type RegisterParams = {
  fullName: string
  email: string
  phoneNumber: string
  password: string
  vehicleType: string
  vehicleBrand: string
  vehicleModel: string
  vehicleNumber: string
  vehicleColor?: string
  emergencyContact: string
}

// Helper: Email & Password Sign Up
export async function registerWithEmail(
  params: string | RegisterParams,
  pass?: string
): Promise<AuthUser> {
  const email = typeof params === 'string' ? params : params.email
  const password = typeof params === 'string' ? pass || '' : params.password
  const fullName = typeof params === 'string' ? email.split('@')[0] : params.fullName || email.split('@')[0]
  const phoneNumber = typeof params === 'string' ? '' : params.phoneNumber || ''
  const vehicleType = typeof params === 'string' ? '' : params.vehicleType || ''
  const vehicleBrand = typeof params === 'string' ? '' : params.vehicleBrand || ''
  const vehicleModel = typeof params === 'string' ? '' : params.vehicleModel || ''
  const vehicleNumber = typeof params === 'string' ? '' : params.vehicleNumber || ''
  const vehicleColor = typeof params === 'string' ? '' : params.vehicleColor || ''
  const emergencyContact = typeof params === 'string' ? '' : params.emergencyContact || ''

  const userObj: AuthUser = {
    uid: 'user-' + Date.now(),
    email,
    displayName: fullName,
    phoneNumber,
    vehicleType,
    vehicleBrand,
    vehicleModel,
    vehicleNumber,
    vehicleColor,
    emergencyContact,
  }

  // Auto-register vehicle into localStorage Garage for this user
  if (typeof window !== 'undefined' && (vehicleModel || vehicleNumber)) {
    const vName = vehicleBrand ? `${vehicleBrand} ${vehicleModel}` : vehicleModel || 'Tesla Model 3'
    const newVehicle = {
      id: 'v-' + Date.now(),
      name: vName,
      plate: vehicleNumber || 'TN 07 CX 4218',
      color: vehicleColor || 'Midnight Silver',
    }
    const garageKey = `lifeos_garage_${email}`
    const primaryKey = `lifeos_primary_vehicle_${email}`
    try {
      const existingGarage = localStorage.getItem(garageKey)
      let vehiclesList = existingGarage ? JSON.parse(existingGarage) : []
      // Prepend newly registered vehicle
      vehiclesList = [newVehicle, ...vehiclesList.filter((v: any) => v.plate !== newVehicle.plate)]
      localStorage.setItem(garageKey, JSON.stringify(vehiclesList))
      localStorage.setItem(primaryKey, newVehicle.id)
    } catch (e) {}
  }

  // 1. Try Express Backend API first
  try {
    const payload = typeof params === 'string' 
      ? { email, password, fullName }
      : params

    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      userObj.uid = 'backend-' + Date.now()
      if (typeof window !== 'undefined') {
        localStorage.setItem('lifeos_demo_user', JSON.stringify(userObj))
      }
      return userObj
    }
  } catch (backendErr) {
    // Backend API offline
  }

  // 2. Try Firebase Auth
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    userObj.uid = res.user.uid
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifeos_demo_user', JSON.stringify(userObj))
    }
    return userObj
  } catch (error: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifeos_demo_user', JSON.stringify(userObj))
    }
    return userObj
  }
}

export async function loginWithGoogle(): Promise<AuthUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user: AuthUser = {
      uid: result.user.uid,
      email: result.user.email,
      displayName:
        result.user.displayName ||
        result.user.email?.split("@")[0] ||
        "Google User",
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifeos_demo_user', JSON.stringify(user))
    }
    return user
  } catch (error: any) {
    const demoUser: AuthUser = {
      uid: 'google-demo-' + Date.now(),
      email: 'google-driver@lifeos.app',
      displayName: 'Google Driver',
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifeos_demo_user', JSON.stringify(demoUser))
    }
    return demoUser
  }
}

// Helper: Guest Login
export async function loginAsGuest(): Promise<AuthUser> {
  const guestUser: AuthUser = {
    uid: 'guest-' + Date.now(),
    email: 'guest@lifeos.app',
    displayName: 'Guest Driver',
    isGuest: true,
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem('lifeos_demo_user', JSON.stringify(guestUser))
  }
  return guestUser
}

// Helper: Logout
export async function logoutUser(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('lifeos_demo_user')
  }
  try {
    await signOut(auth)
  } catch (err) {
    // Ignore signout errors in fallback mode
  }
}

// Helper: Get Current Saved Session
export function getSavedSession(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('lifeos_demo_user')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      return null
    }
  }
  return null
}
