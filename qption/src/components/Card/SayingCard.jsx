'use client'
import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Image from 'next/image'
import qoute from '@/assets/icon_quote.svg'
export default function SayingCard({ saying, fullName, country }) {
     return (
          <Card className='w-56 bg-green-500/10 text-gray-300 '>
               <CardActionArea>
                    <CardContent className='flex flex-col items-center justify-between h-[260px]'>
                         <div className='flex flex-col items-start leading-snug'>
                              <Image
                                   src={qoute}
                                   alt='fxoption'
                              />
                              <span className='text-txt font-light text-lg text-left mt-2 text-green-100'>
                                   {saying}
                              </span>
                         </div>
                         <div className='w-full flex justify-between items-center'>
                              <span className='text-blue-100'>{fullName}</span>
                              <span className='text-blue-100'>{country}</span>
                         </div>
                    </CardContent>
               </CardActionArea>
          </Card>
     )
}
