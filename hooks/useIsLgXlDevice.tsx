"use client"

import { useState, useEffect } from 'react'

export function useIsLgXlDevice() {
  const [isLgXlDevice, setIsLgXlDevice] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px) and (max-width: 1280px)")
    
    setIsLgXlDevice(mediaQuery.matches)
    
    const updateTarget = (e: MediaQueryListEvent) => {
      setIsLgXlDevice(e.matches)
    }
    
    mediaQuery.addEventListener('change', updateTarget)
    
    return () => {
      mediaQuery.removeEventListener('change', updateTarget)
    }
  }, [])
  
  return isLgXlDevice
}