"use client"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  animate?: boolean
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!animate || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setPosition({ x, y })
  }

  useEffect(() => {
    setOpacity(1)
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn("relative bg-zinc-900 rounded-[inherit] z-0 overflow-hidden", containerClassName)}
    >
      <div className={cn("absolute inset-0 z-[-1] transition-opacity duration-500", className)} style={{ opacity }}>
        <div
          className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
          style={{
            opacity: animate ? 0.8 : 0,
            transform: `translate(${position.x}px, ${position.y}px)`,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,0,0,.15), transparent 40%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-transparent to-transparent opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/10 to-red-900/10" />
      </div>
      {children}
    </div>
  )
}
