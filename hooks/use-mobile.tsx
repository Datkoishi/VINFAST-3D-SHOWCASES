"use client"

import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }

      // Initial check
      checkIfMobile()

      // Add event listener
      window.addEventListener("resize", checkIfMobile)

      // Clean up
      return () => {
        window.removeEventListener("resize", checkIfMobile)
      }
    }
  }, [])

  return isMobile
}
