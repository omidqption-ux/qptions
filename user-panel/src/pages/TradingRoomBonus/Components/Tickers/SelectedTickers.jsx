import React from 'react'
import { useSelector } from 'react-redux'
import TickerCard from './TickerCard'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Tickers from '../Tickers/Tickers'
import { playClick } from '../../../../utils/sounds'

const SelectedTickers = () => {
     const { activeTickerBonus: activeTicker } =
          useSelector((store) => store.ticker)
     const { userSettings } = useSelector((store) => store.user)
     const [anchorElTicker, setAnchorElTicker] = React.useState(null)
     const openTicker = Boolean(anchorElTicker)
     const handleClick = (event) => {
          userSettings.soundControl.notification && playClick()
          setAnchorElTicker(event.currentTarget)
     }
     const handleClose = () => {
          userSettings.soundControl.notification && playClick()
          setAnchorElTicker(null)
     }
     return (
          <div className='mx-auto relative'>
               <div className='flex items-center'>
                    {activeTicker.symbol && (
                         <div className='flex' onClick={handleClick}>
                              <TickerCard ticker={activeTicker.symbol}
                              />

                              <div >
                                   {!openTicker ? (
                                        <KeyboardArrowDownIcon className='cursor-pointer text-lightGrey bg-LightNavy lg:h-[32px] h-[28px]' />
                                   ) : (
                                        <KeyboardArrowUpIcon className='cursor-pointer text-lightGrey bg-LightNavy h-[28px] lg:h-[32px]' />
                                   )}
                              </div>
                         </div>
                    )}
               </div>
               <Tickers
                    anchorEl={anchorElTicker}
                    handleClose={handleClose}
                    open={openTicker}
               />
          </div>
     )
}
export default SelectedTickers
