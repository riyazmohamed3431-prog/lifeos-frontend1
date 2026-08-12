export type UserCoordinates = {
  latitude: number
  longitude: number
}

export type LocationError = {
  code: number
  message: string
}

/**
 * Obtain the user's real browser/device location using the HTML5 Geolocation API.
 */
export function getCurrentLocation(
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
  }
): Promise<UserCoordinates> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      return reject({
        code: 0,
        message: 'Geolocation is not supported by your browser or device.',
      })
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        let userFriendlyMsg = 'Unable to determine your device location.'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            userFriendlyMsg = 'Location permission was denied. Please allow location access to find nearby services.'
            break
          case error.POSITION_UNAVAILABLE:
            userFriendlyMsg = 'Location information is currently unavailable from your device.'
            break
          case error.TIMEOUT:
            userFriendlyMsg = 'Location request timed out. Please check your signal and try again.'
            break
        }
        reject({
          code: error.code,
          message: userFriendlyMsg,
        })
      },
      options
    )
  })
}
