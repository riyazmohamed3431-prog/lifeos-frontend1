'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCurrentLocation, type UserCoordinates } from '@/lib/location'

export function useLocation() {
  const [location, setLocation] = useState<UserCoordinates | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const coords = await getCurrentLocation()
      setLocation(coords)
    } catch (err: any) {
      setError(err?.message || 'Failed to acquire device location.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  return {
    location,
    loading,
    error,
    requestLocation,
  }
}
