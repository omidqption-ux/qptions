'use client'
import React, { useEffect, useState } from 'react'
import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/Navbar/Navbar'
import { Roboto_Condensed } from 'next/font/google'
import axiosInstance from '@/network/axios'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const robotoCondensed = Roboto_Condensed({
     subsets: ['latin'],
})

export default function RootLayout({ children }) {
     const [isLogin, setIsLogin] = useState(false)
     const chckIsLogin = async () => {
          const res = await axiosInstance.post('/api/auth/isLogin')
          setIsLogin(res.isLogin)
     }

     useEffect(() => {
          chckIsLogin()
          window.__lc = window.__lc || {}
          window.__lc.license = 19355391

          const script = document.createElement('script')
          script.src = 'https://cdn.livechatinc.com/tracking.js'
          script.async = true

          // Add blinking animation to the chat button
          const style = document.createElement('style')
          style.textContent = `
      .lc-chat-button, 
      #livechat-eye-catcher,
      [data-testid="chat-widget-launcher"],
      .lc-chat-button img {
        animation: pulse 1.5s infinite !important;
      }
      @keyframes pulse {
        0% {
          transform: scale(1) !important;
          box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.7) !important;
        }
        50% {
          transform: scale(1.1) !important;
          box-shadow: 0 0 0 15px rgba(255, 165, 0, 0) !important;
        }
        100% {
          transform: scale(1) !important;
          box-shadow: 0 0 0 0 rgba(255, 165, 0, 0) !important;
        }
      }
    `

          // Wait for the widget to load
          const applyAnimation = () => {
               const chatButton = document.querySelector(
                    '.lc-chat-button, #livechat-eye-catcher, [data-testid="chat-widget-launcher"]'
               )
               if (chatButton) {
                    document.head.appendChild(style)
               } else {
                    setTimeout(applyAnimation, 100)
               }
          }

          script.onload = applyAnimation
          document.body.appendChild(script)

          return () => {
               document.body.removeChild(script)
               if (document.head.contains(style)) {
                    document.head.removeChild(style)
               }
          }
     }, [])
     return (
          <div
               className={
                    'flex min-h-screen select-none flex-col justify-start w-full ' +
                    robotoCondensed.className
               }
          >
               <Navbar isLogin={isLogin} />
               <div
                    className={
                         'flex w-full flex-col items-center justify-center text-sm font-semibold text-gray-300'
                    }
               >
                    <div className='w-full'>{children}</div>
               </div>
               <div className='w-full relative'>
                    <div className="absolute top-0 right-1/2 w-34 lg:w-64 h-6 bg-[#3197F0]/50 rounded-full blur-3xl" > </div>
                    <div className="absolute top-0 left-1/2 w-34 lg:w-64 h-6 bg-[#3197F0]/50 rounded-full blur-3xl" > </div>
                    <Footer
                         isLogin={isLogin}
                         toggleMenu={() => { }}
                    />
               </div>
               <ToastContainer
                    position='bottom-right'
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover
                    theme='dark'
               />
          </div>
     )
}
