"use client"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export const BackgroundBeams = ({
  className,
  fill = "#ff0000",
}: {
  className?: string
  fill?: string
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const beams = Array.from({ length: 8 }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      width: Math.random() * 4 + 2,
      speed: Math.random() * 0.05 + 0.05,
      hue: Math.random() * 30 - 15,
    }))

    let animationFrameId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const delta = time - lastTime
      lastTime = time

      ctx.clearRect(0, 0, rect.width, rect.height)

      beams.forEach((beam) => {
        beam.y -= beam.speed * delta
        if (beam.y < -100) {
          beam.y = rect.height + 100
          beam.x = Math.random() * rect.width
        }

        const gradient = ctx.createLinearGradient(beam.x, beam.y, beam.x, beam.y + rect.height / 2)
        gradient.addColorStop(0, `hsla(0, 100%, 50%, 0)`)
        gradient.addColorStop(0.2, `hsla(0, 100%, 50%, 0.15)`)
        gradient.addColorStop(0.6, `hsla(0, 100%, 50%, 0)`)

        ctx.beginPath()
        ctx.moveTo(beam.x, beam.y)
        ctx.lineTo(beam.x + beam.width, beam.y)
        ctx.lineTo(beam.x + beam.width * 1.5, beam.y + rect.height)
        ctx.lineTo(beam.x - beam.width * 0.5, beam.y + rect.height)
        ctx.closePath()
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    setOpacity(1)

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [fill])

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-1000", className)}
      style={{ opacity }}
    />
  )
}
