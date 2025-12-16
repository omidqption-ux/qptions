import { List, ListItem, Box, Typography, Badge } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import Countdown from './CountDown'
export default function LiveTradesList({ trades }) {
     return (
          <List
               disablePadding
               className='p-2'
          >
               {trades &&
                    trades.length > 0 &&
                    trades.map((t) => {
                         const openDate = new Date(
                              t.openTime * 1000
                         ).toLocaleString()
                         return (
                              <ListItem
                                   key={t.tradeIndex}
                                   className='mb-2 rounded-lg bg-darkGrey/10 hover:bg-darkGrey/20 transition-all duration-300'
                              >
                                   <Box className='flex flex-col w-full'>
                                        <Box className='flex items-center justify-between mb-1'>
                                             <Box className='flex items-center gap-2'>
                                                  {t.buyOrSell === 'buy' ? (
                                                       <ArrowUpwardIcon
                                                            className='text-Green'
                                                            fontSize='small'
                                                       />
                                                  ) : (
                                                       <ArrowDownwardIcon
                                                            className='text-googleRed'
                                                            fontSize='small'
                                                       />
                                                  )}
                                                  <Typography
                                                       variant='body2'
                                                       className='font-medium'
                                                  >
                                                       {t.buyOrSell.toUpperCase()}
                                                  </Typography>
                                                  <Typography
                                                       variant='caption'
                                                       className='text-lightGrey/70'
                                                  >
                                                       {t.amount} @ {t.pair}
                                                  </Typography>
                                             </Box>
                                        </Box>
                                        <Typography
                                             variant='caption'
                                             className='text-lightGrey/50'
                                        >
                                             {openDate} - {<Countdown
                                                  targetEpoch={t.closeTime}
                                                  render={({ days, hours, minutes, seconds }) => (
                                                       <div className="inline-flex items-center gap-2">
                                                            {days > 0 && <Badge label={`${days}d`} />}
                                                            <span className="font-mono tabular-nums">
                                                                 {String(hours).padStart(2, "0")}:
                                                                 {String(minutes).padStart(2, "0")}:
                                                                 {String(seconds).padStart(2, "0")}
                                                            </span>
                                                       </div>
                                                  )}
                                             />}
                                        </Typography>
                                   </Box>
                              </ListItem>
                         )
                    })}
               {(!trades || trades.length === 0) && (
                    <Box className='w-full flex items-center justify-center py-4'>
                         <Typography
                              variant='body2'
                              className='text-lightGrey/50'
                         >
                              No live trades.
                         </Typography>
                    </Box>
               )}
          </List>
     )
}
