'use client'
import { useEffect } from 'react'
import dynamic from "next/dynamic"
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import SchoolIcon from '@mui/icons-material/School'
const Registeration = dynamic(() => import("@/components/RegisterationModal/Registeration"), { ssr: false })
import React from 'react'
import PersonIcon from '@mui/icons-material/Person'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import axiosInstance from '@/network/axios'
import { useTranslation } from 'next-i18next'

const OpenAccount = () => {
     const { t } = useTranslation('common')

     const [isLogin, setIsLogin] = React.useState(false)
     const chckIsLogin = async () => {
          const res = await axiosInstance.post('/api/auth/isLogin')
          setIsLogin(res.isLogin)
     }
     useEffect(() => {
          chckIsLogin()
     }, [])
     const [openLogin, setOpenLogin] = React.useState(false)
     const [isRegister, setIsRegister] = React.useState(false)
     const searchParams = useSearchParams()
     const router = useRouter()

     React.useEffect(() => {
          const modal = searchParams.get('modal')
          if (modal === 'login' || modal === 'register') {
               setOpenLogin(true)
               setIsRegister(modal === 'register')
          }
     }, [searchParams])

     const handleOpen = () => {
          setOpenLogin(true)
          setIsRegister(true)
     }
     const handleClose = () => {
          setOpenLogin(false)
          router.push('/')
     }

     return (
          <div
               className={` flex flex-col sm:flex-row mt-4 sm:mt-6 items-center justify-center gap-6 md:flex-row`}
          >
               <Registeration
                    handleClose={handleClose}
                    open={openLogin}
                    isRegister={isRegister}
               />
               {isLogin ? (
                    <Link
                         href={
                              process.env.NODE_ENV !== 'development'
                                   ? 'https://panel.qption.com'
                                   : 'http://localhost:3001'
                         }
                    >
                         <Button
                              className='w-48 bg-darkEnd text-xs normal-case lg:text-sm'
                              variant='contained'
                              color='info'
                              size='small'
                         >
                              <PersonIcon className='mx-1' />  {t('clientCabinet')}
                         </Button>
                    </Link>
               ) : (
                    <Button
                         onClick={handleOpen}
                         className='w-48 bg-darkEnd text-xs normal-case lg:text-sm'
                         variant='contained'
                         color='info'
                         size='small'
                    >
                         <HowToRegIcon className='mx-1' />
                         {t('registration')}
                    </Button>
               )}
               <Button
                    onClick={
                         isLogin
                              ? () =>
                                   router.push(
                                        process.env.NODE_ENV === 'development'
                                             ? 'http://localhost:3001/TradingRoomDemo'
                                             : 'https://panel.qption.com/TradingRoomDemo'
                                   )
                              : () => handleOpen()
                    }
                    className='w-48 bg-DarkBlue text-xs normal-case lg:text-sm'
                    variant='contained'
                    color='success'
                    size='small'
               >
                    <SchoolIcon className='mx-1' />
                    {t('tryDemo')}
               </Button>
          </div>
     )
}

export default OpenAccount
