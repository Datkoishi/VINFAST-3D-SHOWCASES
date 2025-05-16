"use client"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export const Spotlight = ({
  className,
  fill = "white",
}: {
  className?: string
  fill?: string
}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const [size, setSize] = useState(0)

  const updatePosition = (x: number, y: number) => {
    setPosition({ x, y })
  }

  const updateSize = () => {
    if (divRef.current) {
      const { width } = divRef.current.getBoundingClientRect()
      setSize(width / 2)
    }
  }

  useEffect(() => {
    updateSize()
    setOpacity(1)

    const handleMouseMove = (e: MouseEvent) => {
      if (divRef.current) {
        const { left, top, width, height } = divRef.current.getBoundingClientRect()
        const x = e.clientX - left
        const y = e.clientY - top
        updatePosition(x, y)
      }
    }

    const handleResize = () => {
      updateSize()
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div ref={divRef} className={cn("absolute inset-0 overflow-hidden pointer-events-none z-0", className)}>
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${fill}, transparent 80%)`,
        }}
      />
    </div>
  )
}
