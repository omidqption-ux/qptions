import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import { agoYMDHMS } from '../../utils/timeAgo'
import { ShareButton } from '../../components/ShareButton/ShareButton'
import { Tooltip } from '@mui/material'

export default function NewsCard({ newsItem }) {
     return (
          <Card
               sx={{ width: 405 }}
               className='bg-DarkGreen text-lightGrey text-xs'
          >
               <div className='flex flex-col p-4 '>
                    <div className='flex justify-start w-full '>
                         <Avatar
                              src={newsItem.image_url}
                              aria-label={newsItem.keywords.join(', ')}
                              className='p-2 border border-greentxt mx-1'
                         >
                              {newsItem.author}
                         </Avatar>
                         <span className='text-menuTxt mx-2 text-sm font-semibold h-[54px]'>
                              {newsItem.title.slice(0, 85)}
                              {newsItem.title.length > 84 ? '...' : ''}
                         </span>
                    </div>
                    <span className='flex justify-end font-normal my-2 '>
                         {agoYMDHMS(newsItem.published_utc)}
                    </span>
               </div>
               <CardContent className='flex flex-col'>
                    <span className='text-lightGrey font-normal text-md truncate'>
                         <Tooltip
                              title={newsItem.description.slice(0, 405)}
                              placement='bottom'
                         >
                              {newsItem.description.slice(0, 45)}...
                         </Tooltip>
                    </span>
                    <div className='mt-3 flex  justify-between items-center'>
                         <div>
                              Read more
                              <Tooltip title={newsItem.publisher.name}>
                                   <a
                                        target='_blank'
                                        rel='noreferrer'
                                        className='text-Orange mx-2'
                                        href={newsItem.article_url}
                                   >
                                        {newsItem.article_url
                                             ? new URL(
                                                    newsItem.article_url.toString()
                                               ).host
                                             : ''}
                                   </a>
                              </Tooltip>
                         </div>
                         <ShareButton
                              url={newsItem.article_url}
                              title={newsItem.title}
                              text={newsItem.description}
                         />
                    </div>
               </CardContent>
          </Card>
     )
}
