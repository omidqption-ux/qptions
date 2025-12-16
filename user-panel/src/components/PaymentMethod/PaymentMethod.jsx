import { Box } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'

const PaymentMethod = ({ logo, title, onClick, code, isMini, isSelected }) => {
     return (
          <Box
               onClick={onClick}
               className={`${isMini ? 'w-full' : 'w-[220px]'
                    } group relative flex flex-col rounded-xl bg-gradient-to-br from-darkBlue/20 to-darkBlue/5 backdrop-blur-sm transition-all duration-300 cursor-pointer overflow-hidden ${isSelected
                         ? 'border-2 border-primary/50 shadow-[0_0_20px_rgba(59,130,246,0.2)] scale-[1.02]'
                         : 'border border-darkBlue/50 shadow-[0_0_10px_rgba(15,23,42,0.1)] hover:border-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:scale-[1.02]'
                    }`}
          >
               <div
                    className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent transition-opacity duration-300 ${isSelected
                              ? 'opacity-100'
                              : 'opacity-0 group-hover:opacity-100'
                         }`}
               />

               <div className='flex items-center justify-between p-3 relative z-10'>
                    <div className='flex items-center gap-3'>
                         <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-darkBlue/20 backdrop-blur-sm border border-darkBlue/40'>
                              <img
                                   alt={title}
                                   src={
                                        logo.startsWith('/payments')
                                             ? logo
                                             : 'https://nowpayments.io/' + logo
                                   }
                                   className={`${isMini ? 'w-4' : 'w-6'
                                        } transition-transform duration-300 group-hover:scale-110`}
                              />
                         </div>
                         <div className='flex flex-col'>
                              <span
                                   className={`${isMini ? 'text-xs' : 'text-sm'
                                        } font-medium text-offWhite/90 group-hover:text-primary transition-colors duration-300`}
                              >
                                   {isMini ? code : title}
                              </span>
                              {!isMini && (
                                   <span className='text-xs text-offWhite/60'>
                                        {code}
                                   </span>
                              )}
                         </div>
                    </div>

                    {isSelected && (
                         <div className='flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 border border-primary/30'>
                              <CheckCircle
                                   className='text-primary'
                                   fontSize='small'
                              />
                         </div>
                    )}
               </div>

               <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transition-opacity duration-300 ${isSelected
                              ? 'opacity-100'
                              : 'opacity-0 group-hover:opacity-100'
                         }`}
               />
          </Box>
     )
}
export default PaymentMethod
