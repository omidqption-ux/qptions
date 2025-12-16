import { useEffect, useRef, useState } from 'react'
import { Box, Button, Divider, Tooltip } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import {
     addToWatchList,
     clearWatchList,
     removeFormWatchList,
     setSymbols,
     setActiveTicker
} from '../../../../redux/slices/tradingRoomSlices/tickerSlice'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import axiosInstance from "../../../../network/axios"
import SearchBox from '../SearchBox/SearchBox'
import { playClick } from '../../../../utils/sounds'
import { CircularProgress } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

const TickersList = ({
     handleClose,
     loading,
     setLoading,
     value,
     setValue
}) => {
     const dispatch = useDispatch()
     const {
          tickerType,
          fxSymbols,
          cryptoSymbols,
          WATCHLISTSymbols,
          activeTicker
     } = useSelector((store) => store.ticker)
     const { userSettings } = useSelector((store) => store.user)
     const [sortType, setSortType] = useState("payout")
     const debounceRef = useRef(null);

     const clearWatchlistFunction = () => {
          userSettings.soundControl.notification && playClick()
          dispatch(clearWatchList())
     }
     const removeFromWatchListFunction = (symbol) => {
          userSettings.soundControl.notification && playClick()
          dispatch(removeFormWatchList(symbol))
     }
     const addToWatchListFunction = (symbol) => {
          userSettings.soundControl.notification && playClick()
          dispatch(addToWatchList(symbol))
     }
     const setActiveTickerFunction = (symbol, e) => {
          // 1) Prevent the inner target from keeping focus
          if (e && e.currentTarget instanceof HTMLElement) e.currentTarget.blur()
          const active = document.activeElement
          if (active && active instanceof HTMLElement) active.blur()

          userSettings.soundControl.notification && playClick()
          dispatch(setActiveTicker(symbol))

          handleClose?.(e)
     }

     useEffect(() => {
          getSymbols()
     }, [tickerType])
     const getSymbols = async () => {
          try {
               setLoading(true)
               if (tickerType === 'fx') {
                    const res = await axiosInstance.get("/tickers/forexSymbols")
                    dispatch(setSymbols({
                         tickerType: 'fx',
                         symbols: res.items
                    }))
               } else if (tickerType === 'crypto') {
                    const res = await axiosInstance.get("/tickers/cryptoSymbols")
                    dispatch(setSymbols({
                         tickerType: 'crypto',
                         symbols: res.items
                    }))
               }

          } catch (e) { }
          finally { setLoading(false) }
     }
     const handleOnChnage = (v) => {
          setValue(v)
          clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(async () => {
               try {
                    if (tickerType === 'fx') {
                         const res = await axiosInstance.get(`/tickers/forexSymbols?q=${encodeURIComponent(v.trim())}`)

                         dispatch(setSymbols({
                              tickerType: 'fx',
                              symbols: res.items
                         }))
                    } else if (tickerType === 'crypto') {
                         const res = await axiosInstance.get(`/tickers/cryptoSymbols?q=${encodeURIComponent(v.trim())}`)
                         dispatch(setSymbols({
                              tickerType: 'crypto',
                              symbols: res.items
                         }))
                    }

               } catch (err) {
                    console.error(err);
               }
          }, 300);
     }
     const sortSymbols = async () => {
          try {
               if (tickerType === 'fx') {
                    const res = await axiosInstance.get(`/tickers/forexSymbols?sort=${sortType}`)
                    dispatch(setSymbols({
                         tickerType: 'fx',
                         symbols: res.items
                    }))
               } else if (tickerType === 'crypto') {
                    const res = await axiosInstance.get(`/tickers/cryptoSymbols?sort=${sortType}`)
                    dispatch(setSymbols({
                         tickerType: 'crypto',
                         symbols: res.items
                    }))
               }
               setSortType(sortType === 'payout' ? '-payout' : 'payout')
          } catch (err) {
               console.error(err);
          }
     }
     return (
          <Box className='my-1 w-full bg-slate-800 p-4'>
               {tickerType !== 'WATCHLIST' && (
                    <SearchBox
                         value={value}
                         handleOnChnage={handleOnChnage}
                    />
               )}
               {tickerType === 'WATCHLIST' &&
                    WATCHLISTSymbols &&
                    WATCHLISTSymbols.length > 0 && (
                         <div className='flex justify-start w-full'>
                              <Button
                                   className='bg-red-700 text-red-100 font-semibold text-xs normal-case'
                                   onClick={clearWatchlistFunction}
                              >
                                   Clear watchlist
                              </Button>
                         </div>
                    )}
               {tickerType === 'WATCHLIST' &&
                    WATCHLISTSymbols &&
                    WATCHLISTSymbols.length === 0 && (
                         <div className='text-sm text-lightGrey font-normal grid grid-cols-6 p-2 py-1  w-full gap-2'>
                              <div className='col-span-6 text-center'>
                                   Pick the assets you&apos;d like to showcase
                                   <div className='text-lightBlueBg '>
                                        in your Watch list.
                                   </div>
                              </div>
                         </div>
                    )}

               <div className='text-sm text-lightGrey font-normal grid grid-cols-6 p-2  w-full gap-2'>
                    <div className='col-span-5'>Asset</div>
                    <div onClick={sortSymbols} className='w-[24px] flex items-center justify-center cursor-pointer text-xs lg:text-sm' >
                         {tickerType !== 'WATCHLIST' && (
                              sortType === "payout" ? (
                                   <KeyboardArrowDownIcon className='cursor-pointer  h-[14px] ' />
                              ) : (
                                   <KeyboardArrowUpIcon className='cursor-pointer  h-[14px] ' />
                              )
                         )}
                         Payout
                    </div>
               </div>

               <div className='overflow-y-scroll max-h-[125px] xl:max-h-[200px]'>
                    {
                         loading ? (
                              <div className="flex justify-center items-center p-4">
                                   <CircularProgress size={20} />
                              </div>
                         ) : (
                              tickerType === 'fx' ?
                                   (fxSymbols.length > 0 && (
                                        fxSymbols.map((symbol, index) => (
                                             <div
                                                  className='lg:py-1'
                                                  key={symbol.symbol + index}
                                             >
                                                  <div className='lg:text-sm text-xs font-normal grid grid-cols-6 lg:gap-2'>
                                                       <div className='col-span-5 flex items-center'>
                                                            {WATCHLISTSymbols &&
                                                                 WATCHLISTSymbols.length > 0 &&
                                                                 WATCHLISTSymbols.findIndex(
                                                                      (watchElement) =>
                                                                           watchElement.symbol ===
                                                                           symbol.symbol
                                                                 ) > -1 ? (
                                                                 <Tooltip
                                                                      title='Remove from Watchlist'
                                                                      placement='left-end'
                                                                      arrow
                                                                      className='mx-2'
                                                                 >
                                                                      <StarIcon
                                                                           fontSize='small'
                                                                           className='cursor-pointer text-gold text-xs lg:text-sm'
                                                                           onClick={() =>
                                                                                removeFromWatchListFunction(
                                                                                     symbol.symbol
                                                                                )
                                                                           }
                                                                      />
                                                                 </Tooltip>
                                                            ) : (
                                                                 <Tooltip
                                                                      title='Add Watchlist'
                                                                      placement='left-end'
                                                                      arrow
                                                                      className='mx-2'
                                                                 >
                                                                      <StarBorderIcon
                                                                           fontSize='small'
                                                                           className='cursor-pointer hover:text-gold text-gray-400 text-xs lg:text-sm'
                                                                           onClick={() =>
                                                                                addToWatchListFunction(
                                                                                     symbol
                                                                                )
                                                                           }
                                                                      />
                                                                 </Tooltip>
                                                            )}
                                                            <Tooltip
                                                                 title={symbol.desc}
                                                                 placement='right-start'
                                                                 arrow
                                                                 className={`flex items-center mx-2  ${symbol.symbol ===
                                                                      activeTicker.symbol
                                                                      ? 'text-webMoneyBlue'
                                                                      : 'text-lightGrey'
                                                                      } `}
                                                            >
                                                                 <span
                                                                      className='cursor-pointer hover:underline text-gray-400'
                                                                      onMouseDown={(e) => e.preventDefault()}
                                                                      onClick={(e) => setActiveTickerFunction(symbol, e)
                                                                      }
                                                                 >
                                                                      {symbol.symbol.slice(2, symbol.symbol.length)}
                                                                 </span>
                                                            </Tooltip>
                                                       </div>
                                                       <div
                                                            className={`font-semibold text-lightGrey`}
                                                       >
                                                            {symbol?.payoutPercentage}%
                                                       </div>
                                                  </div>
                                                  {index < fxSymbols.length - 1 && (
                                                       <Divider className='bg-DarkBlue my-1 lg:my-2' />
                                                  )}
                                             </div>
                                        ))
                                   )
                                   ) :
                                   tickerType === 'crypto' &&
                                   (cryptoSymbols.length > 0 && (
                                        cryptoSymbols.map((symbol, index) => (
                                             <div
                                                  className='lg:py-1'
                                                  key={symbol.symbol + index}
                                             >
                                                  <div className='lg:text-sm text-xs font-normal grid grid-cols-6 lg:gap-2'>
                                                       <div className='col-span-5 flex items-center'>
                                                            {WATCHLISTSymbols &&
                                                                 WATCHLISTSymbols.length > 0 &&
                                                                 WATCHLISTSymbols.findIndex(
                                                                      (watchElement) =>
                                                                           watchElement.symbol ===
                                                                           symbol.symbol
                                                                 ) > -1 ? (
                                                                 <Tooltip
                                                                      title='Remove from Watchlist'
                                                                      placement='left-end'
                                                                      arrow
                                                                      className='mx-2'
                                                                 >
                                                                      <StarIcon
                                                                           className='cursor-pointer text-gold text-xs lg:text-sm'
                                                                           onClick={() =>
                                                                                removeFromWatchListFunction(
                                                                                     symbol.symbol
                                                                                )
                                                                           }
                                                                      />
                                                                 </Tooltip>
                                                            ) : (
                                                                 <Tooltip
                                                                      title='Add Watchlist'
                                                                      placement='left-end'
                                                                      arrow
                                                                      className='mx-2'
                                                                 >
                                                                      <StarBorderIcon
                                                                           className='cursor-pointer hover:text-gold text-xs lg:text-sm text-gray-400'
                                                                           onClick={() =>
                                                                                addToWatchListFunction(
                                                                                     symbol
                                                                                )
                                                                           }
                                                                      />
                                                                 </Tooltip>
                                                            )}
                                                            <Tooltip
                                                                 title={symbol.desc}
                                                                 placement='right-end'
                                                                 arrow
                                                                 className={`flex items-center mx-2  ${symbol.symbol ===
                                                                      activeTicker.symbol
                                                                      ? 'text-webMoneyBlue'
                                                                      : 'text-lightGrey'
                                                                      } `}
                                                            >
                                                                 <span
                                                                      className='cursor-pointer hover:underline text-xs lg:text-sm text-gray-400'
                                                                      onMouseDown={(e) => e.preventDefault()}
                                                                      onClick={(e) => setActiveTickerFunction(symbol, e)
                                                                      }
                                                                 >
                                                                      {symbol.symbol.slice(2, symbol.symbol.length)}
                                                                 </span>
                                                            </Tooltip>
                                                       </div>
                                                       <div
                                                            className={`font-semibold text-lightGrey text-xs lg:text-sm`}
                                                       >
                                                            {symbol?.payoutPercentage}%
                                                       </div>
                                                  </div>
                                                  {index < fxSymbols.length - 1 && (
                                                       <Divider className='bg-DarkBlue my-1 lg:my-2' />
                                                  )}
                                             </div>
                                        ))
                                   )
                                   )
                         )
                    }
               </div>
               <div className='overflow-y-scroll max-h-[125px] xl:max-h-[200px]'>
                    {tickerType === 'WATCHLIST' &&
                         WATCHLISTSymbols &&
                         WATCHLISTSymbols.length > 0 &&
                         WATCHLISTSymbols.map((wls, index) => (
                              <div key={index}>
                                   <div
                                        className='text-sm font-normal grid grid-cols-6 gap-2 lg:py-1'
                                   >
                                        <div className='col-span-5'>
                                             <Tooltip
                                                  title='Remove'
                                                  placement='top'
                                                  arrow
                                                  className='mx-2'
                                             >
                                                  <StarIcon
                                                       className='cursor-pointer text-gold text-xs lg:text-sm'
                                                       onClick={() =>
                                                            removeFromWatchListFunction(
                                                                 wls.symbol
                                                            )
                                                       }
                                                  />
                                             </Tooltip>
                                             <Tooltip
                                                  title={wls.desc}
                                                  placement='right'
                                                  arrow
                                                  className='mx-2 '
                                             >
                                                  <span
                                                       className='cursor-pointer hover:underline text-xs lg:text-sm text-gray-400'
                                                       onMouseDown={(e) => e.preventDefault()}
                                                       onClick={(e) =>
                                                            setActiveTickerFunction(
                                                                 wls, e
                                                            )
                                                       }
                                                  >
                                                       {wls.symbol.slice(2, wls.symbol.length)}
                                                  </span>
                                             </Tooltip>
                                        </div>
                                        <div
                                             className={`font-semibold text-lightGrey text-xs lg:text-sm`}
                                        >
                                             {wls.payoutPercentage}%
                                        </div>
                                   </div>
                                   {index < WATCHLISTSymbols.length - 1 && (
                                        <Divider className='bg-DarkBlue my-1 lg:my-2' />
                                   )}
                              </div>
                         ))}
               </div>
          </Box>
     )
}
export default TickersList
