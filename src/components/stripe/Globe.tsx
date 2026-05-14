"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"
import styles from "./Globe.module.css"

interface PartnerMarker {
  id: string
  position: [number, number]
  title: string
  flag: string
  abbr: string
}

interface GlobeBarsProps {
  className?: string
  speed?: number
}

const defaultMarkers: PartnerMarker[] = [
  {
    "id": "bar-us",
    "position": [40.71, -74.01],
    "title": "APhA",
    "flag": "🇺🇸",
    "abbr": "USA"
  },
  {
    "id": "bar-jp",
    "position": [35.68, 139.65],
    "title": "Takeda",
    "flag": "🇯🇵",
    "abbr": "JPN"
  },
  {
    "id": "bar-et",
    "position": [9.03, 38.74],
    "title": "MoH",
    "flag": "🇪🇹",
    "abbr": "ETH"
  },
  {
    "id": "bar-ng",
    "position": [9.07, 7.39],
    "title": "ACPN",
    "flag": "🇳🇬",
    "abbr": "NGA"
  },
  {
    "id": "bar-ke",
    "position": [-1.29, 36.82],
    "title": "PSK",
    "flag": "🇰🇪",
    "abbr": "KEN"
  },
  {
    "id": "bar-pharmalink",
    "position": [38.89511, -77.03637],
    "title": "PharmaLink",
    "flag": "🇺🇸",
    "abbr": "USA"
  },
  {
    "id": "bar-epa",
    "position": [9.03, 38.74],
    "title": "EPA",
    "flag": "🇪🇹",
    "abbr": "ETH"
  },
  {
    "id": "bar-nphcda",
    "position": [9.05785, 7.49508],
    "title": "NPHCDA",
    "flag": "🇳🇬",
    "abbr": "NGA"
  },
  {
    "id": "bar-ncc",
    "position": [-1.29207, 36.82195],
    "title": "NCC",
    "flag": "🇰🇪",
    "abbr": "KEN"
  }
]

export function Globe({
  className = "",
  speed = 0.00125,
}: GlobeBarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const markerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 0

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.2,
        dark: 0,
        diffuse: 1.5,
        mapSamples: 12000,
        mapBrightness: 6,
        baseColor: [248 / 255, 243 / 255, 1],
        markerColor: [232 / 255, 72 / 255, 198 / 255],
        glowColor: [1, 1, 1],
        markerElevation: 0,
        opacity: 0.5,
        markers: defaultMarkers.map((m) => ({ location: m.position, size: 0.05 })),
        arcColor: [232 / 255, 72 / 255, 198 / 255],
        arcWidth: 0.4,
        arcHeight: 0.3,
        arcs: []
      })

      function animate() {
        if (!canvasRef.current) return
        phi += speed

        const currentPhi = phi + phiOffsetRef.current + dragOffset.current.phi
        const currentTheta = 0.2 + thetaOffsetRef.current + dragOffset.current.theta
        
        globe!.update({
          phi: currentPhi,
          theta: currentTheta,
          arcs: []
        })

        // Update markers
        const size = canvas.offsetWidth
        const pillWidth = 160 // Approximate width
        const pillHeight = 45 // Approximate height
        
        const activeMarkers = defaultMarkers.map((m) => {
          const lat = (m.position[0] - 4) * Math.PI / 180
          const lon = m.position[1] * Math.PI / 180
          
          const x = Math.cos(lat) * Math.sin(currentPhi + lon + 0.6 * Math.PI)
          const y = Math.cos(lat) * Math.cos(currentPhi + lon + 0.6 * Math.PI) * Math.sin(currentTheta) - Math.sin(lat) * Math.cos(currentTheta)
          const z = Math.cos(lat) * Math.cos(currentPhi + lon + 0.6 * Math.PI) * Math.cos(currentTheta) + Math.sin(lat) * Math.sin(currentTheta)
          
          return {
            ...m,
            x: (x + 1) * size / 2,
            y: (y + 1) * size / 2,
            z
          }
        }).filter(m => m.z > 0).sort((a, b) => a.y - b.y)

        // Reset all first
        defaultMarkers.forEach(m => {
          const el = markerRefs.current[m.id]
          if (el) el.style.opacity = "0"
        })

        const yOffsets = new Map<string, number>()

        activeMarkers.forEach((m, i) => {
          const el = markerRefs.current[m.id]
          if (!el) return

          let extraY = 0
          // Check against already positioned markers for overlap
          for (let j = 0; j < i; j++) {
            const other = activeMarkers[j]
            const dx = Math.abs(m.x - other.x)
            const dy = Math.abs((m.y - extraY) - (other.y - (yOffsets.get(other.id) || 0)))
            
            if (dx < pillWidth && dy < pillHeight) {
              extraY += pillHeight
            }
          }
          yOffsets.set(m.id, extraY)

          el.style.opacity = "1"
          el.style.transform = `translate(-50%, -100%) translate(${ m.x }px, ${ m.y }px) translateY(-${ 12 + extraY }px)`
        })

        animationId = requestAnimationFrame(animate)
      }
      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"), 200)
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [speed])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      
      {/* Dynamic Markers Overlay */}
      <div className={styles.pillContainer}>
        {defaultMarkers.map((m) => (
          <div
            key={m.id}
            ref={(el) => { markerRefs.current[m.id] = el; }}
            className={styles.pill}
            style={{ opacity: 0 }}
          >
            <span className={styles.flag}>{m.flag}</span>
            <span className={styles.name}>{m.title}</span>
            <div className={styles.abbrBox}>{m.abbr}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
