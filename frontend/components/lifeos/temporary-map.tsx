'use client'

import { useState } from 'react'
import { MapPin, Navigation, Compass, Plus, Minus, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TemporaryMapProps {
  className?: string
  userLocation?: { latitude: number; longitude: number }
  mechanicLocation?: { latitude: number; longitude: number }
  progress: number
  mechanicName?: string
}

export function TemporaryMap({
  className,
  userLocation,
  mechanicLocation,
  progress = 0,
  mechanicName = 'Rescue Technician',
}: TemporaryMapProps) {
  // Zoom levels: 12 (city scale) to 17 (street scale)
  const [zoom, setZoom] = useState(14)

  const hasUserLocation = 
    userLocation && 
    typeof userLocation.latitude === 'number' && 
    typeof userLocation.longitude === 'number' && 
    userLocation.latitude !== 0

  if (!hasUserLocation) {
    return (
      <div className={cn('relative flex flex-col items-center justify-center bg-slate-900 text-white min-h-[300px]', className)}>
        <div className="flex flex-col items-center space-y-2 text-center p-6">
          <AlertCircle className="size-8 text-red-500 animate-pulse" />
          <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground">Location Unavailable</h3>
          <p className="text-[11px] text-muted-foreground max-w-xs leading-normal">
            No coordinates found for this request. Please verify GPS settings.
          </p>
        </div>
      </div>
    )
  }

  const custLat = userLocation!.latitude
  const custLng = userLocation!.longitude

  // Determine mechanic start location if not available
  let startLat = custLat + 0.008
  let startLng = custLng - 0.009

  if (
    mechanicLocation && 
    typeof mechanicLocation.latitude === 'number' && 
    typeof mechanicLocation.longitude === 'number' &&
    mechanicLocation.latitude !== 0
  ) {
    startLat = mechanicLocation.latitude
    startLng = mechanicLocation.longitude
  }

  // Calculate current mechanic position
  const currentLat = startLat + (custLat - startLat) * progress
  const currentLng = startLng + (custLng - startLng) * progress

  // Slippy Map Tile Calculations
  // Converts Lat/Lng to pixel space at zoom level `z`
  const getPixels = (lat: number, lng: number, z: number) => {
    const n = Math.pow(2, z)
    const x = ((lng + 180) / 360) * n * 256
    const latRad = (lat * Math.PI) / 180
    const y = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n * 256
    return { x, y }
  }

  const centerPx = getPixels(custLat, custLng, zoom)
  const mechPx = getPixels(currentLat, currentLng, zoom)
  const startPx = getPixels(startLat, startLng, zoom)

  // Calculate center tile coordinates
  const tileX = Math.floor(centerPx.x / 256)
  const tileY = Math.floor(centerPx.y / 256)

  // Grid start tile coordinate (top-left of 3x3 grid)
  const startTileX = tileX - 1
  const startTileY = tileY - 1

  // Top-left of the 3x3 tile grid in pixel space
  const gridLeftPx = startTileX * 256
  const gridTopPx = startTileY * 256

  // Viewport offsets to center the grid
  // We want centerPx to align with container center (which we set as 200x200 relative to viewport)
  // Inside the 3x3 grid container:
  const offsetFromGridLeft = centerPx.x - gridLeftPx
  const offsetFromGridTop = centerPx.y - gridTopPx

  // Map Tile grid elements array (3x3 grid of OpenStreetMap tiles)
  const tiles = []
  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 3; dx++) {
      const tx = startTileX + dx
      const ty = startTileY + dy
      // OpenStreetMap standard public tile server URL
      const url = `https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`
      tiles.push({ key: `${tx}-${ty}-${zoom}`, url, left: dx * 256, top: dy * 256 })
    }
  }

  // Calculate coordinates for markers relative to the center of the viewport
  // Container size is assumed to be centered. Using CSS translate offsets:
  const centerTranslateX = `calc(50% - ${offsetFromGridLeft}px)`
  const centerTranslateY = `calc(50% - ${offsetFromGridTop}px)`

  // Marker offsets relative to the grid top-left
  const userMarkerLeft = centerPx.x - gridLeftPx
  const userMarkerTop = centerPx.y - gridTopPx

  const mechMarkerLeft = mechPx.x - gridLeftPx
  const mechMarkerTop = mechPx.y - gridTopPx

  const startMarkerLeft = startPx.x - gridLeftPx
  const startMarkerTop = startPx.y - gridTopPx

  return (
    <div className={cn('relative overflow-hidden bg-[#151C2C] select-none h-full w-full', className)}>
      
      {/* Slippy Tile Container */}
      <div 
        className="absolute w-[768px] h-[768px] transition-transform duration-300 ease-out origin-center pointer-events-none"
        style={{
          transform: `translate(${centerTranslateX}, ${centerTranslateY})`,
        }}
      >
        {/* Render OSM Tile Images */}
        {tiles.map((t) => (
          <img
            key={t.key}
            src={t.url}
            alt=""
            loading="lazy"
            className="absolute w-[256px] h-[256px] border-[0.5px] border-white/5 opacity-80"
            style={{
              left: `${t.left}px`,
              top: `${t.top}px`,
            }}
          />
        ))}

        {/* Route Line Connecting Start to Customer */}
        <svg className="absolute w-full h-full inset-0 pointer-events-none">
          {/* Main blue glow road pathway */}
          <line
            x1={startMarkerLeft}
            y1={startMarkerTop}
            x2={userMarkerLeft}
            y2={userMarkerTop}
            stroke="#2563EB"
            strokeWidth="5"
            strokeLinecap="round"
            className="opacity-40"
          />
          <line
            x1={startMarkerLeft}
            y1={startMarkerTop}
            x2={userMarkerLeft}
            y2={userMarkerTop}
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Animated path representing mechanic's progress */}
          <line
            x1={startMarkerLeft}
            y1={startMarkerTop}
            x2={mechMarkerLeft}
            y2={mechMarkerTop}
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
        </svg>

        {/* CUSTOMER DESTINATION MARKER */}
        <div 
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ left: `${userMarkerLeft}px`, top: `${userMarkerTop}px` }}
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute size-9 rounded-full bg-primary/20 animate-ping" />
            <div className="grid size-8 place-items-center rounded-full bg-primary text-white border-2 border-white shadow-2xl">
              <MapPin className="size-4.5 fill-current" />
            </div>
          </div>
        </div>

        {/* MECHANIC TRAVEL MARKER */}
        <div 
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-200"
          style={{ left: `${mechMarkerLeft}px`, top: `${mechMarkerTop}px` }}
        >
          <div className="grid size-9 place-items-center rounded-full bg-emerald-500 text-white border-2 border-white shadow-2xl">
            <Navigation className="size-4 fill-current rotate-45" />
          </div>
        </div>
      </div>

      {/* Map Control Widget Overlays */}
      
      {/* Zoom Widget */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-1 rounded-xl bg-slate-900/90 p-1 border border-white/10 shadow-lg backdrop-blur-md">
        <button 
          onClick={() => setZoom(z => Math.min(z + 1, 17))}
          className="grid size-8 place-items-center rounded-lg text-white hover:bg-white/10 transition-colors"
          title="Zoom In"
        >
          <Plus className="size-4" />
        </button>
        <div className="h-px bg-white/10 mx-1" />
        <button 
          onClick={() => setZoom(z => Math.max(z - 1, 12))}
          className="grid size-8 place-items-center rounded-lg text-white hover:bg-white/10 transition-colors"
          title="Zoom Out"
        >
          <Minus className="size-4" />
        </button>
      </div>

      {/* Compass Widget */}
      <div className="absolute right-4 top-28 z-10 grid size-10 place-items-center rounded-xl bg-slate-900/90 border border-white/10 shadow-lg backdrop-blur-md text-white">
        <Compass className="size-5 text-emerald-400" />
      </div>

      {/* Map Status labels */}
      <div className="absolute top-4 left-4 z-10 space-y-1">
        <div className="flex items-center gap-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 px-3 py-1 shadow-lg backdrop-blur-md text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
          Live Tracking Map
        </div>
        <div className="text-[9px] text-muted-foreground bg-slate-950/80 px-2 py-0.5 rounded-lg border border-white/5 inline-block">
          Zoom level: {zoom}x
        </div>
      </div>

      {/* Footnote Warning */}
      <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-slate-900/90 border border-white/10 px-2.5 py-1 text-[9px] font-bold text-muted-foreground tracking-wide backdrop-blur-sm">
        ℹ️ Live Map — rendering OpenStreetMap tiles (Chennai, Tamil Nadu)
      </div>

      {/* Ambient Vignette Shadow Ring */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_40%,oklch(0.10_0.012_260)_100%)]" />
    </div>
  )
}
