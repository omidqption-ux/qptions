import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const LiveChatControl = () => {
     const location = useLocation()
     const [isChatVisible, setIsChatVisible] = useState(true)

     useEffect(() => {
          if (location.pathname !== '/TradingRoom') {
               const script = document.createElement('script')
               script.src = 'https://cdn.livechatinc.com/tracking.js'
               script.async = true
               script.onload = () => {
                    window.__lc = window.__lc || {}
                    window.__lc.license = '19355391' // شناسه لایسنس شما
               }
               document.body.appendChild(script)
               return () => {
                    document.body.removeChild(script)
               }
          }
     }, [location])

     const toggleLiveChat = () => {
          if (window.LiveChatWidget) {
               if (isChatVisible) {
                    window.LiveChatWidget.hide()
               } else {
                    window.LiveChatWidget.show()
               }
               setIsChatVisible(!isChatVisible)
          }
     }
     return (
          <div>
               <button onClick={toggleLiveChat}>
                    {isChatVisible ? 'بستن چت' : 'باز کردن چت'}
               </button>
          </div>
     )
}

export default LiveChatControl
