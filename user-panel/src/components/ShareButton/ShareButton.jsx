import React from 'react'
import IconButton from '@mui/material/IconButton'
import ShareIcon from '@mui/icons-material/Share'

export function ShareButton({ url, title, text }) {
     const handleShare = async () => {
          if (navigator.share) {
               try {
                    await navigator.share({
                         title: title,
                         text: text,
                         url: url,
                    })
               } catch (error) {
                    console.error('Error sharing:', error)
               }
          } else {
               alert('Web Share API is not supported in your browser.')
          }
     }

     return (
          <IconButton onClick={handleShare}>
               <ShareIcon className='text-menuTxt' />
          </IconButton>
     )
}
