export type UserCoordinates = {
  latitude: number
  longitude: number
}

export type PermissionState = 'granted' | 'prompt' | 'denied' | 'unknown'

/**
 * Check browser geolocation support safely for SSR and client runtime.
 */
export function isGeolocationSupported(): boolean {
  return typeof window !== 'undefined' && 'navigator' in window && 'geolocation' in navigator
}

/**
 * Query current browser geolocation permission state.
 */
export async function getPermissionState(): Promise<PermissionState> {
  if (!isGeolocationSupported()) return 'unknown'

  try {
    if ('permissions' in navigator && typeof navigator.permissions.query === 'function') {
      const status = await navigator.permissions.query({ name: 'geolocation' })
      console.log('[LifeOS Location] Permission state:', status.state)
      return status.state as PermissionState
    }
  } catch (err) {
    console.log('[LifeOS Location] Permission query API not supported by browser')
  }

  return 'unknown'
}

/**
 * Request user position with explicit parameters.
 */
export function requestPosition(highAccuracy = true, timeoutMs = 8000): Promise<UserCoordinates> {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      return reject({
        code: 0,
        message: 'Geolocation is not supported by your browser or device.',
      })
    }

    console.log(`[LifeOS Location] Geolocation request started (highAccuracy: ${highAccuracy}, timeout: ${timeoutMs}ms)...`)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }
        console.log('[LifeOS Location] Geolocation success:', coords.latitude, coords.longitude)
        resolve(coords)
      },
      (err) => {
        console.log(`[LifeOS Location] Geolocation error (code ${err.code}): ${err.message}`)
        reject(err)
      },
      {
        enableHighAccuracy: highAccuracy,
        timeout: timeoutMs,
        maximumAge: highAccuracy ? 0 : 30000,
      }
    )
  })
}

/**
 * Main function to retrieve device location with automatic standard accuracy fallback.
 */
export async function getCurrentLocation(): Promise<UserCoordinates> {
  const supported = isGeolocationSupported()
  console.log('[LifeOS Location] Geolocation support:', supported)

  if (!supported) {
    throw new Error('Geolocation is not supported by your browser or device.')
  }

  // Verify secure context for browser geolocation
  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'http:' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    throw new Error('Browser geolocation requires a secure HTTPS connection or localhost.')
  }

  const permState = await getPermissionState()
  if (permState === 'denied') {
    throw new Error('Location permission is blocked by your browser settings. Click the site settings icon in your URL bar to allow location access.')
  }

  // Attempt 1: High accuracy GPS
  try {
    return await requestPosition(true, 7000)
  } catch (err1: any) {
    if (err1.code === 1) { // PERMISSION_DENIED
      throw new Error('Location permission was denied. Please allow location access when prompted by your browser.')
    }

    console.log('[LifeOS Location] High accuracy request failed/timed out. Attempting standard accuracy fallback...')

    // Attempt 2: Standard accuracy fallback with longer timeout
    try {
      return await requestPosition(false, 10000)
    } catch (err2: any) {
      if (err2.code === 1) {
        throw new Error('Location permission was denied. Please allow location access when prompted by your browser.')
      } else if (err2.code === 3) {
        throw new Error('Location request timed out. Please click "Refresh GPS" to try again.')
      } else if (err2.code === 2) {
        throw new Error('Location information is currently unavailable from your device.')
      } else {
        throw new Error(err2.message || 'Unable to determine your device location.')
      }
    }
  }
}

/**
 * Perform reverse geocoding for latitude and longitude coordinates.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3500)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: { 'User-Agent': 'LifeOS-Roadside-App' },
        signal: controller.signal,
      }
    )
    clearTimeout(timer)
    if (res.ok) {
      const data = await res.json()
      if (data && data.display_name) {
        const parts = data.display_name.split(',')
        if (parts.length >= 3) {
          return parts.slice(0, 4).join(',').trim()
        }
        return data.display_name
      }
    }
  } catch (err) {
    console.log('[LifeOS Location] Reverse geocoding fallback triggered:', err)
  }
  return `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E · GPS Locked`
}

