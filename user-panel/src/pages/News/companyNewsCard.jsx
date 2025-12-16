import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import { timeAgo } from '../../utils/timeAgo'

export default function CompanyNewsCard({ newsItem }) {
     return (
          <Card
               sx={{ width: 405 }}
               className='bg-DarkGreen text-lightGrey text-xs'
          >
               <div className='flex flex-col p-4 '>
                    <div className='flex justify-start w-full items-center '>
                         <Avatar
                              src={`data:image/jpeg;base64,${newsItem.SOURCEIMAGE}`}
                              aria-label={newsItem.KEYWORDS}
                              className='p-2 border border-greentxt mx-1'
                         >
                              {newsItem.KEYWORDS}
                         </Avatar>
                         <span className='text-menuTxt mx-2 text-sm font-semibold '>
                              {newsItem.TITLE}
                         </span>
                    </div>
                    <span className='flex justify-end font-normal my-2 '>
                         {timeAgo(newsItem.DATE * 10000)}
                    </span>
               </div>
               <CardContent className='flex flex-col'>
                    <span className='text-lightGrey font-normal text-md truncate'>
                         {newsItem.BODY}
                    </span>
               </CardContent>
          </Card>
     )
}
