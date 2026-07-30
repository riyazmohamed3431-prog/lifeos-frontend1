import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'

// Firebase Configuration (supports environment variables or fallback configuration)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoKeyForLifeOSConfigFallback12345',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'lifeos-roadside.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'lifeos-roadside',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'lifeos-roadside.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890',
}

// Initialize Firebase App singleton safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

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
    // If Firebase project API key is demo fallback or invalid, provide seamless demo login
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
      displayName: res.user.displayName,
    }
  } catch (error: any) {
    if (error?.code === 'auth/invalid-api-key' || error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
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
    throw error
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
