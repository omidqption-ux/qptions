import React, { memo, useCallback } from 'react'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart'
import { Zoom, MenuItem, Menu, Divider, Button } from "@mui/material"
import { changeSeriesType, changeCandleTime } from '../../../../redux/slices/tradingRoomSlices/chartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { playClick } from '../../../../utils/sounds'

const SERIES_OPTIONS = [
    { value: "LineSeries", label: "Line", icon: <ShowChartIcon fontSize="small" /> },
    { value: "CandlestickSeries", label: "Candle", icon: <CandlestickChartIcon fontSize="small" /> },
]
const CANDLE_SECONDS = [5, 10, 15, 30, 60];

const SeriesTypeSelect = memo(function SeriesTypeSelect({
    value,
    candleTime
}) {
    const dispatch = useDispatch()
    const { userSettings } = useSelector((store) => store.user)

    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        userSettings.soundControl.notification && playClick()
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const setCandleTime = (bucket) => {
        setSeriesType('CandlestickSeries')
        dispatch(changeCandleTime(bucket))
        handleClose()
    }
    const setSeriesType = (type) => {
        dispatch(changeSeriesType(type))
    }
    return (
        <div>
            <div
                onClick={handleClick}
                className='cursor-pointer flex items-center justify-center bg-[#20293E] 
                         rounded-xs gap-1  h-[30px]  text-xs rounded-lg px-1'
            >

                {SERIES_OPTIONS.find(sO => sO.value === value).icon}
            </div>
            <Menu
                keepMounted
                TransitionComponent={Zoom}
                TransitionProps={{
                    timeout: { enter: 440, exit: 320 },
                    onExit: () => {
                        const el = document.activeElement
                        if (el && el instanceof HTMLElement) el.blur()
                    },
                    onExited: () => anchorEl?.focus?.(),
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 0.5,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                className='[&>.MuiPaper-root>ul.css-1toxriw-MuiList-root-MuiMenu-list]:pt-0 
                    [&>.MuiPaper-root]:rounded-md [&>.MuiPaper-root]:bg-Navy  [&>.MuiPaper-root]:text-lightGrey'
            >
                <MenuItem onClick={() => setSeriesType('LineSeries')} ><ShowChartIcon /></MenuItem>
                <MenuItem onClick={() => setSeriesType('CandlestickSeries')} >
                    <CandlestickChartIcon />
                </MenuItem>

                {value === 'CandlestickSeries' && (
                    <div className='flex text-xs flex-col' >
                        <Divider className='bg-lightGrey mx-2' />
                        {CANDLE_SECONDS.map((candleSec) => (
                            <Button key={candleSec} className={`  text-xs mx-1 !px-3 !min-w-0 ${candleSec === candleTime ? 'bg-LightNavy text-lightGrey' : 'text-LightBlue'}`} onClick={() => setCandleTime(candleSec)} >{candleSec}S</Button>
                        ))}
                    </div>
                )}
            </Menu>
        </div>
    )
})

export default SeriesTypeSelect