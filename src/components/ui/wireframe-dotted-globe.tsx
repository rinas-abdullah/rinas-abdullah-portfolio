"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { useLang } from "../../App" // Import language hook to translate labels dynamically

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
}

export default function RotatingEarth({ width = 800, height = 600, className = "" }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { lang } = useLang()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [targetLocked, setTargetLocked] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    // Set up responsive dimensions
    const containerWidth = Math.min(width, window.innerWidth - 40)
    const containerHeight = Math.min(height, window.innerHeight - 100)
    const radius = Math.min(containerWidth, containerHeight) / 2.6

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    // Create projection and path generator for Canvas
    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point
      let inside = false

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]

        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside
        }
      }

      return inside
    }

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates
        if (!pointInPolygon(point, coordinates[0])) {
          return false
        }
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) {
            return false
          }
        }
        return true
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true
                break
              }
            }
            if (!inHole) {
              return true
            }
          }
        }
        return false
      }
      return false
    }

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = []
      const bounds = d3.geoBounds(feature)
      const [[minLng, minLat], [maxLng, maxLat]] = bounds

      const stepSize = dotSpacing * 0.08
      let pointsGenerated = 0

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat]
          if (pointInFeature(point, feature)) {
            dots.push(point)
            pointsGenerated++
          }
        }
      }
      return dots
    }

    interface DotData {
      lng: number
      lat: number
      visible: boolean
    }

    const allDots: DotData[] = []
    let landFeatures: any

    // Jeddah Coordinates
    const jeddahCoords: [number, number] = [39.19797, 21.54333]
    const targetRotation = [-39.19797, -21.54333, 0] // Centering on Jeddah requires inverse coordinates

    // Render loop
    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight)

      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius

      // Draw globe sphere background
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      context.fillStyle = "#010309"
      context.fill()
      context.strokeStyle = "rgba(14, 165, 233, 0.25)"
      context.lineWidth = 1.5 * scaleFactor
      context.stroke()

      if (landFeatures) {
        // Draw graticule
        const graticule = d3.geoGraticule()
        context.beginPath()
        path(graticule())
        context.strokeStyle = "rgba(14, 165, 233, 0.15)"
        context.lineWidth = 1 * scaleFactor
        context.stroke()

        // Draw land outlines
        context.beginPath()
        landFeatures.features.forEach((feature: any) => {
          path(feature)
        })
        context.strokeStyle = "rgba(14, 165, 233, 0.3)"
        context.lineWidth = 1 * scaleFactor
        context.stroke()

        // Draw land dots
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat])
          // Check if the dot is on the visible front hemisphere
          const r = d3.geoDistance(projection.rotate(), [-dot.lng, -dot.lat]) < Math.PI / 2
          if (projected && r) {
            context.beginPath()
            context.arc(projected[0], projected[1], 1.2 * scaleFactor, 0, 2 * Math.PI)
            context.fillStyle = "rgba(14, 165, 233, 0.65)"
            context.fill()
          }
        })

        // Draw pulsing target on Jeddah
        const projectedJeddah = projection(jeddahCoords)
        const jeddahVisible = d3.geoDistance(projection.rotate(), [-jeddahCoords[0], -jeddahCoords[1]]) < Math.PI / 2
        
        if (projectedJeddah && jeddahVisible) {
          const time = Date.now() / 200
          const pulseRadius = 6 + Math.sin(time) * 3
          const pulseOpacity = 0.5 + Math.sin(time) * 0.4

          // Outer pulsing ring
          context.beginPath()
          context.arc(projectedJeddah[0], projectedJeddah[1], pulseRadius * scaleFactor, 0, 2 * Math.PI)
          context.strokeStyle = `rgba(16, 185, 129, ${pulseOpacity})`
          context.lineWidth = 1.5 * scaleFactor
          context.stroke()

          // Inner solid dot
          context.beginPath()
          context.arc(projectedJeddah[0], projectedJeddah[1], 3.5 * scaleFactor, 0, 2 * Math.PI)
          context.fillStyle = "#10b981"
          context.fill()
          context.strokeStyle = "#ffffff"
          context.lineWidth = 1 * scaleFactor
          context.stroke()

          // Jeddah node label card
          context.fillStyle = "rgba(3, 7, 18, 0.85)"
          context.strokeStyle = "rgba(16, 185, 129, 0.4)"
          context.lineWidth = 1

          const labelText = lang === 'en' ? "JEDDAH NODE ACTIVE" : "عقدة جدة نشطة"
          const textWidth = context.measureText(labelText).width
          const rectX = projectedJeddah[0] + 10 * scaleFactor
          const rectY = projectedJeddah[1] - 12 * scaleFactor
          const rectWidth = textWidth + 12
          const rectHeight = 16

          // Draw label background card
          context.beginPath()
          context.roundRect(rectX, rectY, rectWidth, rectHeight, 4)
          context.fill()
          context.stroke()

          // Draw label text
          context.fillStyle = "#10b981"
          context.font = "bold 8px monospace"
          context.fillText(labelText, rectX + 6, rectY + 11)
        }
      }
    }

    const loadWorldData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json",
        )
        if (!response.ok) throw new Error("Failed to load land data")

        landFeatures = await response.json()

        // Generate dots for all land features
        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 14)
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat, visible: true })
          })
        })

        render()
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load land map data")
        setIsLoading(false)
      }
    }

    // Set up rotation and interaction
    let rotation = [0, -10, 0]
    let autoRotate = true
    const rotationSpeed = 0.42
    let snapToJeddah = false
    const startTime = Date.now()

    const rotate = () => {
      const elapsed = Date.now() - startTime

      // Step 1: Initial auto rotation
      if (autoRotate && !snapToJeddah) {
        rotation[0] += rotationSpeed
        projection.rotate(rotation as [number, number, number])
        render()
      }

      // Step 2: Trigger centering lock on Jeddah after 2.8 seconds
      if (elapsed > 2800 && autoRotate && !snapToJeddah) {
        snapToJeddah = true
      }

      // Step 3: Perform smooth interpolation to land on Jeddah
      if (snapToJeddah) {
        const lerpSpeed = 0.052
        
        // Find shortest path for angle wrapping (d3 rotation goes from -180 to 180)
        let diff = (targetRotation[0] - rotation[0]) % 360
        if (diff < -180) diff += 360
        if (diff > 180) diff -= 360

        rotation[0] = rotation[0] + diff * lerpSpeed
        rotation[1] = rotation[1] + (targetRotation[1] - rotation[1]) * lerpSpeed
        rotation[2] = rotation[2] + (targetRotation[2] - rotation[2]) * lerpSpeed

        projection.rotate(rotation as [number, number, number])
        render()

        // Check closeness threshold to lock snap
        const dist = Math.abs(diff) + Math.abs(targetRotation[1] - rotation[1])
        if (dist < 0.08) {
          rotation = [...targetRotation]
          projection.rotate(rotation as [number, number, number])
          snapToJeddah = false
          autoRotate = false
          setTargetLocked(true)
          render()
        }
      }
    }

    // Timer loop using d3
    const rotationTimer = d3.timer(rotate)

    // Manual Drag-to-Rotate interaction
    const handleMouseDown = (event: MouseEvent) => {
      autoRotate = false
      snapToJeddah = false
      setTargetLocked(false)
      const startX = event.clientX
      const startY = event.clientY
      const startRotation = [...projection.rotate()]

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const sensitivity = 0.4
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY

        // Update rotation values
        const nextRotation = [
          startRotation[0] + dx * sensitivity,
          startRotation[1] - dy * sensitivity,
          startRotation[2] || 0
        ]
        // Constrain latitude boundary
        nextRotation[1] = Math.max(-85, Math.min(85, nextRotation[1]))

        rotation = [...nextRotation]
        projection.rotate(rotation as [number, number, number])
        render()
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const zoomFactor = event.deltaY > 0 ? 0.92 : 1.08
      const newRadius = Math.max(radius * 0.4, Math.min(radius * 3.5, projection.scale() * zoomFactor))
      projection.scale(newRadius)
      render()
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("wheel", handleWheel)

    loadWorldData()

    return () => {
      rotationTimer.stop()
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("wheel", handleWheel)
    }
  }, [width, height, lang])

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-cyan-950/20 border border-cyan-500/10 rounded-2xl p-8 ${className}`}>
        <div className="text-center font-mono">
          <p className="text-rose-500 font-bold mb-2">Error loading telemetry scan</p>
          <p className="text-slate-500 text-[10px]">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#02040a]/40 backdrop-blur-sm z-20 rounded-2xl">
          <div className="w-10 h-10 border-t-2 border-r-2 border-cyan-400 rounded-full animate-spin mb-4" />
          <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
            {lang === 'en' ? "BOOTING GLOBAL SCANS..." : "جاري تحميل المسح الجغرافي..."}
          </span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-2xl bg-transparent select-none cursor-grab active:cursor-grabbing"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <div className="absolute bottom-4 left-4 text-[8px] font-mono text-cyan-500/60 px-2 py-1 rounded bg-[#02050c]/80 border border-cyan-500/10 shadow-lg select-none">
        {targetLocked ? (
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
            {lang === 'en' ? "TARGET LOCKED ON JEDDAH NODE" : "تم القفل على إحداثيات جدة"}
          </span>
        ) : (
          <span>{lang === 'en' ? "DRAG TO ROTATE • SCROLL TO ZOOM" : "اسحب للتدوير • العجلة للتكبير"}</span>
        )}
      </div>
    </div>
  )
}
