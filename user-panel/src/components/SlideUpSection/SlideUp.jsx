import React, { useRef, useEffect, useState } from 'react'
import './styles.css'

const SlideUpSection = ({ children, onClick, className }) => {
     const ref = useRef(null)
     const [isVisible, setIsVisible] = useState(false)

     useEffect(() => {
          const observer = new IntersectionObserver(
               ([entry]) => {
                    if (entry.isIntersecting) {
                         setIsVisible(true)
                         observer.unobserve(ref.current)
                    }
               },
               { threshold: 0.1 }
          )

          if (ref.current) {
               observer.observe(ref.current)
          }

          return () => {
               if (ref.current) {
                    observer.unobserve(ref.current)
               }
          }
     }, [])

     return (
          <div
               onClick={onClick}
               ref={ref}
               className={`w-full h-full slide-up ${className}  ${
                    isVisible ? 'visible' : ''
               } transition-all`}
          >
               {children}
          </div>
     )
}

export default SlideUpSection
