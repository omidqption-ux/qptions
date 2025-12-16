'use client'

import React, { useRef, useEffect, useState } from 'react'

const SlideLeftSection = ({ children }) => {
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
               { threshold: 0.3 }
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
               ref={ref}
               className={`w-full slide-left ${isVisible ? 'visible' : ''}  `}
          >
               {children}
          </div>
     )
}

export default SlideLeftSection
