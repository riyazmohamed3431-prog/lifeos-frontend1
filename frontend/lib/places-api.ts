import type { UserCoordinates } from '@/lib/location'

export type NearbyCategory =
  | 'hospital'
  | 'pharmacy'
  | 'petrol_station'
  | 'mechanic'
  | 'restaurant'
  | 'police'
  | 'towing'
  | 'car_service'

export type NearbyPlace = {
  id: string
  name: string
  category: NearbyCategory | string
  latitude: number
  longitude: number
  address: string | null
  distance: number
  rating: number | null
  phone: string | null
}

export type NearbyPlacesResponse = {
  success: boolean
  category: string
  radius: number
  count: number
  places: NearbyPlace[]
  error?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

/**
 * Frontend API client to query real-world nearby places from the LifeOS backend.
 */
export async function fetchNearbyPlaces(params: {
  latitude: number
  longitude: number
  category: NearbyCategory | string
  radius?: number
}): Promise<NearbyPlacesResponse> {
  const { latitude, longitude, category, radius = 5000 } = params

  try {
    const res = await fetch(`${API_URL}/api/location/nearby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude,
        longitude,
        category,
        radius,
      }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.error || `Server error (${res.status})`)
    }

    const data: NearbyPlacesResponse = await res.json()
    return data
  } catch (error: any) {
    return {
      success: false,
      category,
      radius,
      count: 0,
      places: [],
      error: error?.message || 'Failed to connect to LifeOS location services.',
    }
  }
}
