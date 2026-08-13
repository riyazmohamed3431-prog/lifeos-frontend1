'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getCurrentLocation,
  getPermissionState,
  type UserCoordinates,
  type PermissionState,
} from '@/lib/location'

export function useLocation() {
  const [location, setLocation] = useState<UserCoordinates | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [permissionState, setPermissionState] = useState<PermissionState>('unknown')

  const requestLocation = useCallback(async () => {
    setLoading(true)
    setError(null)

    const currentPerm = await getPermissionState()
    setPermissionState(currentPerm)

    try {
      const coords = await getCurrentLocation()
      setLocation(coords)
      setError(null)
      setPermissionState('granted')
    } catch (err: any) {
      setError(err?.message || 'Failed to acquire device location.')
      const updatedPerm = await getPermissionState()
      setPermissionState(updatedPerm)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    requestLocation()

    if (
      typeof window !== 'undefined' &&
      'permissions' in navigator &&
      typeof navigator.permissions.query === 'function'
    ) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((status) => {
          setPermissionState(status.state as PermissionState)

          const handlePermissionChange = () => {
            console.log('[LifeOS Location] Permission status changed to:', status.state)
            setPermissionState(status.state as PermissionState)
            if (status.state === 'granted') {
              requestLocation()
            }
          }

          status.addEventListener('change', handlePermissionChange)
        })
        .catch(() => {})
    }
  }, [requestLocation])

  return {
    location,
    loading,
    error,
    permissionState,
    requestLocation,
  }
}
