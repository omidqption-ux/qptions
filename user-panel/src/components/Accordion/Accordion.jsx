import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const Accordion = ({ title, icon, children, defaultExpanded = false }) => {
     const [isExpanded, setIsExpanded] = useState(defaultExpanded)

     return (
          <Box className='w-full group'>
               <Box
                    onClick={(e) => {
                         setIsExpanded(!isExpanded)
                         e.stopPropagation()
                    }}
                    className={`flex items-center justify-between p-4 cursor-pointer rounded-xl transition-all duration-300 ${
                         isExpanded
                              ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                              : 'bg-darkBlue/20 border-darkBlue/40 hover:bg-darkBlue/30'
                    } border backdrop-blur-sm`}
               >
                    <div className='flex items-center gap-3'>
                         <div
                              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-300 ${
                                   isExpanded
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-darkBlue/30 text-offWhite/60 group-hover:text-primary'
                              }`}
                         >
                              {icon}
                         </div>
                         <Typography
                              className={`font-medium transition-colors duration-300 ${
                                   isExpanded
                                        ? 'text-primary'
                                        : 'text-offWhite group-hover:text-primary'
                              }`}
                         >
                              {title}
                         </Typography>
                    </div>
                    <ExpandMoreIcon
                         className={`transition-all duration-300 ${
                              isExpanded
                                   ? 'text-primary rotate-180'
                                   : 'text-offWhite/60 group-hover:text-primary'
                         }`}
                    />
               </Box>
               <Box
                    className={`overflow-hidden transition-all duration-300 ${
                         isExpanded
                              ? 'max-h-[5000px] opacity-100 translate-y-0'
                              : 'max-h-0 opacity-0 -translate-y-2'
                    }`}
               >
                    <Box className='p-4 pt-6'>{children}</Box>
               </Box>
          </Box>
     )
}

export default Accordion
