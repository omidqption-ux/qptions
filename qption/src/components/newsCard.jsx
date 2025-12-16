import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import { timeAgo } from '@/utils/timeAgo'
import { getDomain } from '@/utils/getBaseUrl'
import Link from 'next/link'
import { ShareButton } from '@/components/ShareButton/ShareButton'
import { Tooltip } from '@mui/material'

export default function NewsCard({ newsItem }) {
     return (
          <div
               sx={{ maxWidth: 445 }}
               className='max-w-2xl mx-auto bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 lg:p-5 border border-green-500/20'
          >
               <div className='flex flex-col items-start p-4 '>
                    <div className='flex w-full justify-between'>
                         <Avatar
                              src={newsItem?.image_url}
                              aria-label={newsItem?.tickers[0]}
                         >
                              {newsItem?.tickers.join(', ')}
                         </Avatar>
                         <Tooltip title={newsItem?.title} arrow placement='top' >
                              <span className='mx-2 h-[125px] text-lg font-semibold text-green-100'>
                                   {newsItem?.title.length > 138 ? newsItem?.title.slice(0, 138) + " ..." : newsItem?.title}
                              </span>
                         </Tooltip>
                    </div>
                    <span className='my-2 flex justify-end font-normal text-green-400'>
                         {timeAgo(newsItem?.published_utc)}
                    </span>
               </div>
               <CardContent className='flex flex-col'>
                    <span className=" text-md /* Firefox */ /* WebKit */ [&::-webkit-scrollbar-track]:bg-transparent h-[95px] overflow-y-scroll leading-6 font-normal text-green-100 [scrollbar-color:theme('colors.OffWhite')_transparent] [scrollbar-width:3px] [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-OffWhite [&::-webkit-scrollbar]:w-[3px]">
                         {newsItem?.description}
                    </span>
                    <div className='mt-3 flex items-center justify-between'>
                         <div className='text-green-400'>
                              Read more
                              <Tooltip title={newsItem?.author}>
                                   <Link
                                        target='_blank'
                                        className='mx-2 text-Orange text-orange-300'
                                        href={newsItem?.article_url}
                                   >
                                        {getDomain(newsItem?.article_url)}
                                   </Link>
                              </Tooltip>
                         </div>
                         <ShareButton
                              url={newsItem?.article_url}
                              title={newsItem?.title}
                              text={newsItem?.insights[0]?.sentiment_reasoning}
                         />
                    </div>
               </CardContent>
          </div>
     )
}
