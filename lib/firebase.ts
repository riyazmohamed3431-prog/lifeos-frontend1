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
}

// Helper: Email & Password Login
export async function loginWithEmail(email: string, pass: string): Promise<AuthUser> {
  try {
    const res = await signInWithEmailAndPassword(auth, email, pass)
    return {
      uid: res.user.uid,
      email: res.user.email,
      displayName: res.user.displayName || email.split('@')[0],
    }
  } catch (error: any) {
    if (error?.code === 'auth/invalid-api-key' || error?.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
      const demoUser: AuthUser = {
        uid: 'demo-' + Date.now(),
        email: email,
        displayName: email.split('@')[0],
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('lifeos_demo_user', JSON.stringify(demoUser))
      }
      return demoUser
    }
    throw error
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
  emergencyContact: string
}

// Helper: Email & Password Sign Up
export async function registerWithEmail(
  params: string | RegisterParams,
  pass?: string
): Promise<AuthUser> {
  const email = typeof params === 'string' ? params : params.email
  const password = typeof params === 'string' ? pass || '' : params.password

  try {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    return {
      uid: res.user.uid,
      email: res.user.email,
      displayName: typeof params === 'string' ? (res.user.displayName || email.split('@')[0]) : params.fullName,
    }
  } catch (error: any) {
    if (error?.code === 'auth/invalid-api-key' || error?.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
      const demoUser: AuthUser = {
        uid: 'demo-' + Date.now(),
        email: email,
        displayName: typeof params === 'string' ? email.split('@')[0] : params.fullName,
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('lifeos_demo_user', JSON.stringify(demoUser))
      }
      return demoUser
    }
    throw error
  }
}

export async function loginWithGoogle(): Promise<AuthUser> {
  console.log("=== GOOGLE SIGN-IN DEBUG ===");
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName:
        result.user.displayName ||
        result.user.email?.split("@")[0] ||
        "Google User",
    }
  } catch (error: any) {
    console.log("Google Sign-In failed, checking fallback:", error?.code, error?.message);
    if (
      error?.code === 'auth/invalid-api-key' ||
      error?.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.' ||
      error?.code === 'auth/operation-not-allowed' ||
      error?.code === 'auth/configuration-not-found' ||
      error?.code === 'auth/network-request-failed' ||
      error?.code === 'auth/internal-error'
    ) {
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
    throw error;
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
