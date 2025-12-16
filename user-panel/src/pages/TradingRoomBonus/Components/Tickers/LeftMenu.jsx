import PaidRoundedIcon from '@mui/icons-material/PaidRounded'
import TroubleshootRoundedIcon from '@mui/icons-material/TroubleshootRounded'
import { useDispatch, useSelector } from 'react-redux'
import CurrencyBitcoinRoundedIcon from '@mui/icons-material/CurrencyBitcoinRounded'
import { Button } from '@mui/material'
import { playClick } from '../../../../utils/sounds'
import { selectTickerType, setSymbols } from '../../../../redux/slices/tradingRoomSlices/tickerSlice'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../../network/axios'

const LeftMenu = ({ setLoading, setValue }) => {
     const dispatch = useDispatch()
     const [isFxActive, setIsFxActive] = useState(true)
     const { tickerType } = useSelector(
          (store) => store.ticker
     )
     const { userSettings } = useSelector((store) => store.user)

     const setTickerType = (tickerType) => {
          if (!isFxActive && tickerType === 'fx') return
          dispatch(selectTickerType({ tickerType }))
          setValue("")
     }
     const setAvailableTickerType = async () => {
          try {
               setLoading(true)
               const res = await axiosInstance.get('/tickers/checkMarketStatus', { params: { market: 'fx' } })
               if (res.isOpen) {
                    setIsFxActive(true)
                    setTickerType(tickerType)
               }
               else {
                    setIsFxActive(false)
                    setTickerType('crypto')
               }
          } catch (e) { }
          finally {
               setLoading(false)
          }
     }
     useEffect(() => {
          setAvailableTickerType()
          dispatch(selectTickerType({ tickerType }))
          setValue("")
     }, [])

     return (
          <div className='flex text-sm justify-between my-0'>
               <Button
                    variant={tickerType === 'fx' ? 'contained' : 'text'}
                    className={` flex cursor-pointer items-center gap-1 px-2 ${tickerType === 'fx'
                         ? 'text-LightBlue bg-LightNavy'
                         : 'text-lightGrey'
                         } `}
                    onClick={() => {
                         setTickerType('fx')
                         userSettings.soundControl.notification && playClick()
                    }}
               >
                    <PaidRoundedIcon className='text-xs lg:text-sm' />
                    <span className='text-xs lg:text-sm' >Forex</span>
                    {!isFxActive && <span className='bg-buttonRed absolute  px-1 text-Navy skew-y-12 text-xs lg:text-sm' >Holiday</span>}
               </Button>
               <Button
                    variant={tickerType === 'crypto' ? 'contained' : 'text'}
                    onClick={() => {
                         setTickerType('crypto')
                         userSettings.soundControl.notification && playClick()
                    }}
                    className={`flex cursor-pointer items-center gap-1 p-2 text-xs lg:text-sm ${tickerType === 'crypto'
                         ? 'text-LightBlue bg-LightNavy'
                         : 'text-lightGrey '
                         } `}
               >
                    <CurrencyBitcoinRoundedIcon className='text-xs lg:text-sm' />
                    <span className='text-xs lg:text-sm' >
                         Crypto
                    </span>
               </Button>
               <Button
                    variant={
                         tickerType === 'WATCHLIST' ? 'contained' : 'text'
                    }
                    onClick={() => {
                         setTickerType('WATCHLIST')
                         userSettings.soundControl.notification && playClick()
                    }}
                    className={`flex cursor-pointer items-center gap-1 p-2 ${tickerType === 'WATCHLIST'
                         ? 'text-LightBlue bg-LightNavy'
                         : 'text-lightGrey'
                         } `}
               >
                    <TroubleshootRoundedIcon className='text-xs lg:text-sm' />
                    <span className='text-xs lg:text-sm' >
                         Watchlist
                    </span>
               </Button>
          </div>
     )
}
export default LeftMenu
