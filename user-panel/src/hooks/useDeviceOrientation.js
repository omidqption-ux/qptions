import { useState, useEffect } from 'react'

const useDeviceOrientation = () => {
     const [isLandscape, setIsLandscape] = useState(false)
     const [isMobile, setIsMobile] = useState(false)
     const [isPortrait, setIsPortrait] = useState(false)

     useEffect(() => {
          const checkOrientation = () => {
               const width = window.innerWidth
               const height = window.innerHeight
               const isMobileDevice = width < 900
               
               // Check if device is in landscape mode
               const isLandscapeMode = width > height
               
               setIsMobile(isMobileDevice)
               setIsLandscape(isLandscapeMode)
               setIsPortrait(!isLandscapeMode)
          }

          // Initial check
          checkOrientation()

          // Add event listeners
          window.addEventListener('resize', checkOrientation)
          window.addEventListener('orientationchange', checkOrientation)

          // Cleanup
          return () => {
               window.removeEventListener('resize', checkOrientation)
               window.removeEventListener('orientationchange', checkOrientation)
          }
     }, [])

     return { isLandscape, isMobile, isPortrait }
}

export default useDeviceOrientation 