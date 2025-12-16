'use client'
import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import CardActionArea from '@mui/material/CardActionArea'
import Percentage from '@/components/Percentage/Percentage'
export default function ActionAreaCard({ image, alt, title, price, percent }) {
     return (
          <Card className='bg-linear-to-b from-[#142B47]  to-[#142B47]/90 '>
               <CardActionArea>
                    <CardMedia
                         className='h-[90px] w-56'
                         component='img'
                         height='60'
                         image={image}
                         alt={alt}
                    />
                    <CardContent className='flex flex-col items-center '>
                         <span className='text-bgWhite font-semibold'>
                              {title}
                         </span>
                         <span className='text-bgWhite font-semibold text-sm'>
                              ${price}
                         </span>
                         <div className='relative w-full flex justify-between items-center'>
                              <Percentage
                                   percent={percent}
                                   isPositive={percent > 0}
                              />
                         </div>
                    </CardContent>
               </CardActionArea>
          </Card>
     )
}
