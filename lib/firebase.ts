import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
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

// Initialize Firebase App singleton safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Use localStorage persistence to prevent IndexedDB "Database is closing/hidden" errors on tab hide/HMR
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(() => {})
}

export const googleProvider = new GoogleAuthProvider()
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

// Helper: Email & Password Sign Up
export async function registerWithEmail(email: string, pass: string): Promise<AuthUser> {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass)
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

// Helper: Google Sign In
export async function loginWithGoogle(): Promise<AuthUser> {
  try {
    const res = await signInWithPopup(auth, googleProvider)
    return {
      uid: res.user.uid,
      email: res.user.email,
      displayName: res.user.displayName || res.user.email?.split('@')[0] || 'Google User',
    }
  } catch (error: any) {
    console.error('Google Sign-In Error:', error)
    if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
      throw new Error('Google Sign-In popup was closed before completing login.')
    }
    if (error?.code === 'auth/invalid-api-key' || error?.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
      const demoUser: AuthUser = {
        uid: 'google-demo-' + Date.now(),
        email: 'driver@lifeos.app',
        displayName: 'LifeOS Driver',
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('lifeos_demo_user', JSON.stringify(demoUser))
      }
      return demoUser
    }
    throw new Error(error?.message || 'Google Sign-In failed. Please try again.')
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
