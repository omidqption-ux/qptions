import { List, ListItem, Chip, Box, Typography } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

export default function TradeHistoryList({ trades }) {
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
                         ).toLocaleString(undefined, {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: false,
                         })
                         const closeDate = new Date(
                              t.closeTime * 1000
                         ).toLocaleString(undefined, {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: false,
                         })
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
                                                       {t.amount}$ @ {t.pair}
                                                  </Typography>
                                             </Box>
                                             <Chip
                                                  label={
                                                       t.netProfit === 0
                                                            ? 'Tie'
                                                            : t.netProfit > 0
                                                                 ? 'Win'
                                                                 : 'Loss'
                                                  }
                                                  color={
                                                       t.netProfit > 0
                                                            ? 'success'
                                                            : 'error'
                                                  }
                                                  size='small'
                                                  className='h-[20px] text-xs font-medium'
                                             />
                                        </Box>
                                        <Box className='flex items-center justify-between'>
                                             <Typography
                                                  variant='caption'
                                                  className='text-lightGrey/50'
                                             >
                                                  {openDate}
                                             </Typography>
                                             <Typography
                                                  variant='caption'
                                                  className='text-lightGrey/50'
                                             >
                                                  {closeDate}
                                             </Typography>
                                        </Box>
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
                              No trade history.
                         </Typography>
                    </Box>
               )}
          </List>
     )
}
