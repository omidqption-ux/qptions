import { useEffect, useRef, useState, useCallback } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import * as am5stock from '@amcharts/amcharts5/stock'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import { useDispatch, useSelector } from 'react-redux'
import { ButtonGroup, Tooltip } from '@mui/material'
import ZoomIcon from '@mui/icons-material/Add'
import ZoomOutIcon from '@mui/icons-material/Remove'
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong'
import './styles.css'
import {
     setExpirationTime,
     setFetchLoading,
     terminateTrade,
} from '../../../../redux/slices/tradingRoomSlices/tradeSlice'
import { formatSeconds } from '../../../../utils/timeAgo'
import FocusCircle from '@mui/icons-material/CenterFocusWeak'
import OldTvLoader from './oldTvLoader'
import { prevClockSvgUri, clockNoTimeSvgUriBuy, clockNoTimeSvgUriSell } from "./svgs"
import { applyAm5TimeZone, resolveTimeZone } from "./timeZoneHelper"
import SeriesTypeSelect from "./ChartType"
import { setChartData, addLiveData } from '../../../../redux/slices/tradingRoomSlices/chartSlice'
import { aggregateToOHLC } from './aggregateToOHLC'
import { toast } from 'react-toastify'

function formatCurrency(
     value,
     currency = 'USD',
     locale = 'en-US',
     minFraction = 0,
     maxFraction = 2
) {
     return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
          minimumFractionDigits: minFraction,
          maximumFractionDigits: maxFraction,
     }).format(value);
}

const RealTimeChart = ({ socket }) => {
     const dispatch = useDispatch()
     const [chartIsReady, setChartIsReady] = useState(false)
     const [historyLoader, setHistoryLoader] = useState(false)
     const [wsLoading, setWsLoading] = useState(true)
     const [zoomInterval, setZoomInterval] = useState(5) /// 5|| 15 || 30 || 60   
     const [activeCounters, setActiveCounters] = useState([])
     const {
          hover,
          openTrades,
          fetchLoading,
          timer,
          openedTradeIndex,
          closedTradeIndex,
          termminatedTradeIndex
     } = useSelector((store) => store.trade)
     const { seriesType, chartData, candleTime } = useSelector(store => store.chart)
     const { activeTickerBonus: activeTicker } = useSelector(store => store.ticker)
     const { userSettings } = useSelector(store => store.user)
     const { automaticDetection, timeZone } = userSettings.timeZone
     const storedRangesRef = useRef([])
     const storedRangeOpenRef = useRef([])
     const storedRangeBuyOrSellRef = useRef([])
     const storedBulletBuyOrSellRef = useRef([])
     const storedResultBulletRef = useRef([])
     const chartRef = useRef(null)
     const seriesRef = useRef(null)
     const candleSeriesRef = useRef(null)
     const xAxisRef = useRef(null)
     const yAxisRef = useRef(null)
     const rootRef = useRef(null)
     const counterLabelRef = useRef(null)
     const counterLabelTradeRef = useRef([])
     const rangeExpireDataItemRef = useRef(null)
     const mainPanelRef = useRef(null)
     const backgroundRef = useRef(null)
     const redBackgroundRef = useRef(null)
     const labelRef = useRef()
     const bulletRef = useRef(null)
     const currentPriceRangeRef = useRef(null)
     const arrowRef = useRef(null)
     const rangeExpireRef = useRef(null)
     const redArrowRef = useRef(null)
     const clockRef = useRef(null)
     const lastTradeRef = useRef(null)
     const lastCloseTradeRef = useRef([])
     const rangeBuyOrSellRef = useRef([])
     const prevTickerRef = useRef(null)
     const earliestTsRef = useRef(Infinity)
     const latestTsRef = useRef(Infinity)
     const expireBulletContainerRef = useRef(null)
     const seriesTypeRef = useRef(seriesType)
     const candleTimeRef = useRef(candleTime)
     const candleStepRef = useRef(0)
     const activeTickerRef = useRef(activeTicker)
     const hasInitialZoomRef = useRef(false)


     //// handle font sizes 
     const LG_PX = 1024;
     const isBelowLg =
          typeof window !== 'undefined' &&
          window.matchMedia(`(max-width: ${LG_PX}px)`).matches;

     const FONT_SMALL = 9; // ~text-xs
     const FONT_LARGE = 12; // desktop
     const fontSizeAxis = isBelowLg ? FONT_SMALL : FONT_LARGE;

     // tighten spacing a bit on small screens
     const xMinGrid = isBelowLg ? 50 : 80;
     const yAxisWidth = isBelowLg ? 60 : 75;
     const yMinGrid = isBelowLg ? 40 : 50;
     //////
     useEffect(() => {
          hasInitialZoomRef.current = false
          const root = am5.Root.new("ChartDivBonus")
          root.dom.addEventListener('contextmenu', (ev) => ev.preventDefault())
          const preventMultiTouch = (ev) => {
               if (ev.touches && ev.touches.length > 1) {
                    ev.preventDefault()
                    ev.stopImmediatePropagation()
               }
          }
          root.dom.addEventListener('touchstart', preventMultiTouch, {
               passive: false,
               capture: true,
          })
          root.dom.addEventListener('touchmove', preventMultiTouch, {
               passive: false,
               capture: true,
          })
          root.dom.addEventListener('touchend', preventMultiTouch, {
               passive: false,
               capture: true,
          })
          const preventMultiPointer = (ev) => {
               // primary touch is fine; block secondary fingers
               if (ev.pointerType === 'touch' && ev.isPrimary === false) {
                    ev.preventDefault()
                    ev.stopImmediatePropagation()
               }
          }

          root.dom.addEventListener('pointerdown', preventMultiPointer, { capture: true })
          root.dom.addEventListener('pointermove', preventMultiPointer, { capture: true })

          const blockRightClick = (ev) => {
               if (ev.button === 2) {
                    ev.preventDefault()
                    ev.stopPropagation()
               }
          }

          // Use capture so we stop it BEFORE amCharts handlers
          root.dom.addEventListener('pointerdown', blockRightClick, { capture: true })
          root.dom.addEventListener('mousedown', blockRightClick, { capture: true })

          // Block two-finger pinch-zoom on mobile
          root.dom.addEventListener(
               'touchmove',
               (ev) => {
                    if (ev.touches.length > 1) ev.preventDefault()
               },
               { passive: false }
          )
          // 1) resolve tz from browser or prop
          const tz = resolveTimeZone(automaticDetection, timeZone.split(" ")[0]);
          // 2) apply BEFORE building axes/series
          applyAm5TimeZone(root, tz);
          const myTheme = am5.Theme.new(root)
          myTheme.rule('Graphics', ['series', 'fill', 'drawing']).setAll({
               forceInactive: true,
          })
          root.setThemes([am5themes_Animated.new(root), myTheme])
          rootRef.current = root
          const stockChart = root.container.children.push(
               am5stock.StockChart.new(root, {
                    paddingRight: 0,
               })
          )
          const mainPanel = stockChart.panels.push(
               am5stock.StockPanel.new(root, {
                    groupData: true,
                    focusable: true,
                    panX: true,
                    panY: false,
                    wheelX: 'none',
                    wheelY: 'none',
                    pinchZoomX: false,  // ❌ no pinch zoom X
                    pinchZoomY: false,  // ❌ no pinch zoom Y (extra safety)
               })
          )
          mainPanel.rightAxesContainer.setAll({
               width: yAxisWidth,          // pick your fixed width
               paddingLeft: 0,
               paddingRight: 0,
               marginLeft: 0,
               marginRight: 0,
          })
          mainPanelRef.current = mainPanel
          chartRef.current = stockChart
          /// xAxis
          const xAxis = mainPanel.xAxes.push(
               am5xy.DateAxis.new(root, {
                    baseInterval: { timeUnit: 'second', count: 1 },
                    gridIntervals: [
                         { timeUnit: 'second', count: 10 },
                         { timeUnit: 'second', count: 15 },
                         { timeUnit: 'second', count: 30 },
                         { timeUnit: 'second', count: 60 },
                         { timeUnit: 'second', count: 120 },
                         { timeUnit: 'second', count: 5 * 60 },
                         { timeUnit: 'minute', count: 15 },
                         { timeUnit: 'minute', count: 30 },
                         { timeUnit: 'hour', count: 1 },
                         { timeUnit: 'hour', count: 2 },
                         { timeUnit: 'hour', count: 5 },
                         { timeUnit: 'hour', count: 12 },
                    ],
                    extraMin: -0.1,
                    extraMax: 0.41,
                    groupData: false,
                    groupIntervals: [
                         { timeUnit: 'second', count: 1 },
                         { timeUnit: 'second', count: 5 },
                         { timeUnit: 'second', count: 10 },
                         { timeUnit: 'second', count: 30 },
                         { timeUnit: 'minute', count: 1 },
                         { timeUnit: 'minute', count: 5 },
                         // no hours/days here → it won't jump that far
                    ],
                    renderer: am5xy.AxisRendererX.new(root, {
                         minGridDistance: xMinGrid,
                    }),
               })
          )
          xAxisRef.current = xAxis
          /// xAxis labels
          xAxis.get('renderer').labels.template.setAll({
               fill: am5.color('#426591'),
               fontSize: fontSizeAxis, // Font size in pixels
               fontFamily: 'Arial', // Font family
               fontWeight: 'bold', // Optional: Make labels bold
          })
          const yAxis = mainPanel.yAxes.push(
               am5xy.ValueAxis.new(root, {
                    strictMinMax: true,
                    treatZeroAs: 0.001,
                    logarithmic: true,
                    renderer: am5xy.AxisRendererY.new(root, {
                         opposite: true, // This places the axis on the right side
                         minGridDistance: yMinGrid,
                    }),
                    extraMin: 0.02,
                    extraMax: 0.02,
               })
          )
          yAxis.setAll({
               animationDuration: 300,
               interpolationDuration: 300,
               easing: am5.ease.out(am5.ease.cubic),
          })
          yAxisRef.current = yAxis
          const yRenderer = yAxis.get('renderer')
          yRenderer.labels.template.setAll({
               fill: am5.color('#426591'),
               fontSize: fontSizeAxis,
               fontFamily: 'Arial',
               fontWeight: 'bold',
               centerY: am5.p50,
               centerX: am5.p100,     // anchor at right
               textAlign: 'right',    // text right-aligned
               dx: 0,                 // no extra horizontal offset
          })
          /// end of yAxis
          const candleSeries = mainPanel.series.push(
               am5xy.CandlestickSeries.new(root, {
                    name: activeTickerRef.current.symbol,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    openValueYField: "open",
                    highValueYField: "high",
                    lowValueYField: "low",
                    valueYField: "close",
                    valueXField: "time",
                    lowValueYGrouped: "low",
                    highValueYGrouped: "high",
                    openValueYGrouped: "open",
                    valueYGrouped: "close",
                    legendValueText:
                         "open: {openValueY} low: {lowValueY} high: {highValueY} close: {valueY}",
                    legendRangeValueText: "{valueYClose}",
                    tooltip: am5.Tooltip.new(root, {
                         pointerOrientation: "horizontal",
                         labelText: "open: {openValueY}\nlow: {lowValueY}\nhigh: {highValueY}\nclose: {valueY}"
                    })
               })
          )
          const series = mainPanel.series.push(
               am5xy.SmoothedXLineSeries.new(root, {
                    name: activeTickerRef.current.symbol,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: 'value',
                    valueXField: 'time',
                    maskBullets: false,
               })
          )
          series.fills?.template.setAll({
               visible: true,
               fillOpacity: 0.05,
               strokeWidth: 1,
               stroke: am5.color('#305E91'),
               fill: am5.color('#305E91'),

          })
          candleSeries.columns?.template.setAll({
               width: am5.percent(900),
               strokeWidth: 2
          })

          stockChart.set('stockSeries', series)

          candleSeriesRef.current = candleSeries
          seriesRef.current = series

          //// ybullet
          const rangePriceTag = yAxis.createAxisRange(
               yAxis.makeDataItem({ value: 0 })
          )
          currentPriceRangeRef.current = rangePriceTag
          rangePriceTag.get('grid')?.set('stroke', am5.color('#426591'))
          const label = rangePriceTag.get('label')
          labelRef.current = label
          label?.setAll({
               fontSize: fontSizeAxis,
               fill: am5.color('#cecece'),
               centerY: am5.p50,
               centerX: am5.p100,
               background: am5.Rectangle.new(root, {
                    fill: am5.color('#426591'),
                    fillOpacity: 0.8,
               }),
               paddingBottom: 2,
               paddingTop: 2,
               paddingLeft: 6,
               paddingRight: 6,
               maxWidth: yAxisWidth - 2,
               oversizedBehavior: "truncate", // or "wrap" if you prefer multiline
               textAlign: "right",
          })
          ///// x range expire
          const rangeExpireDataItem = xAxis.makeDataItem({ value: 0 })
          const rangeExpire = xAxis.createAxisRange(rangeExpireDataItem)
          rangeExpire.get('grid')?.setAll({
               stroke: am5.color('#364E6E'),
               strokeWidth: 1,
               strokeOpacity: 1,
               zIndex: 10,
               location: 0.5,
          })
          const bulletContainer = am5.Container.new(root, {
               width: 150,
               height: 25,
          })
          const counterLabelBG = am5.Picture.new(root, {
               src: prevClockSvgUri,
               width: 16,
               height: 16,
               centerX: am5.percent(50),
               centerY: am5.percent(75),
          })
          const counterLabelBgDeactive = am5.Picture.new(root, {
               src: prevClockSvgUri,
               width: 16,
               height: 16,
               centerX: am5.percent(50),
               centerY: am5.percent(80),
               opacity: 0,
          })
          const counterLabel = am5.Label.new(root, {
               fontSize: fontSizeAxis,
               fontWeight: 'bold',
               fill: am5.color('#1565C0'),
               centerX: am5.percent(50),
               centerY: am5.percent(142),
               fontFamily: 'Arial',
          })
          bulletContainer.children.push(counterLabelBG)
          bulletContainer.children.push(counterLabelBgDeactive)
          bulletContainer.children.push(counterLabel)
          rangeExpire.set(
               'bullet',
               am5xy.AxisBullet.new(root, {
                    sprite: bulletContainer,
               })
          )
          counterLabelRef.current = counterLabel
          rangeExpireDataItemRef.current = rangeExpireDataItem
          rangeExpireRef.current = rangeExpire

          series.bullets?.push(function (root, series, dataItem) {
               const arrow = am5.Graphics.new(root, {
                    svgPath: 'M12 2 L19 9 L5 9 Z M12 9 V22', // Hollow upward arrow
                    fill: am5.color('#00743F'), // Green color
                    stroke: am5.color('#00743F'),
                    strokeWidth: 2,
                    width: 48,
                    height: 48,
                    centerX: am5.percent(40),
                    centerY: am5.percent(140),
                    rotation: 45, // Rotate to point up-right
                    opacity: 0,
               })
               arrowRef.current = arrow
               const redArrow = am5.Graphics.new(root, {
                    svgPath: 'M12 2 L19 9 L5 9 Z M12 9 V22', // Hollow upward arrow
                    fill: am5.color('#C4352F'), // Red color
                    stroke: am5.color('#C4352F'),
                    strokeWidth: 2,
                    width: 48,
                    height: 48,
                    centerX: am5.percent(40),
                    centerY: am5.percent(150),
                    rotation: 135, // Rotate to point up-right
                    opacity: 0,
               })
               redArrowRef.current = redArrow
               if (
                    dataItem.dataContext.bullet &&
                    dataItem === series.dataItems[series.dataItems.length - 1]
               ) {
                    const container = am5.Container.new(root, {})
                    container.children.push(
                         am5.Circle.new(root, {
                              radius: 3,
                              fill: am5.color('#00B6F9'),
                         })
                    )
                    const circle1 = container.children.push(
                         am5.Circle.new(root, {
                              radius: 5,
                              fill: am5.color('#00B6F9'),
                         })
                    )
                    circle1.animate({
                         key: 'radius',
                         to: 20,
                         duration: 1000,
                         easing: am5.ease.out(am5.ease.cubic),
                         loops: Infinity,
                    })
                    circle1.animate({
                         key: 'opacity',
                         to: 0,
                         from: 0.8,
                         duration: 1000,
                         easing: am5.ease.out(am5.ease.cubic),
                         loops: Infinity,
                    })

                    container.children.push(arrow)
                    container.children.push(redArrow)
                    bulletRef.current = container
                    return am5.Bullet.new(root, {
                         locationX: undefined,
                         sprite: container,
                    })
               }
          })
          mainPanel.events.on('panended', () => {
               const startFrac = xAxis.get('start')
               if (startFrac <= 0.001) {
                    setHistoryLoader(true)
                    socket.emit('loadMore', {
                         pair: activeTickerRef.current.symbol,
                         interval: 10,
                         rows: 600,
                         endTime: earliestTsRef.current,
                    })
               }
          })
          mainPanel.events.on('wheel', () => {
               const startFrac = xAxis.get('start')
               if (startFrac <= 0.001) {
                    setHistoryLoader(true)
                    socket.emit('loadMore', {
                         pair: activeTickerRef.current.symbol,
                         interval: 10,
                         rows: 600,
                         endTime: earliestTsRef.current - 1,
                    })
               }
          })
          series.events.on('datavalidated', () => {
               if (!hasInitialZoomRef.current) {
                    handleInitialFocus()
                    hasInitialZoomRef.current = true
               }
          })
          candleSeries.events.on('datavalidated', () => {
               if (!hasInitialZoomRef.current) {
                    handleInitialFocus()
                    hasInitialZoomRef.current = true
               }
          })
          am5stock.StockToolbar.new(root, {
               container: document.getElementById('chartcontrols'),
               stockChart: stockChart,
               controls: [
                    // Indicators dropdown (RSI, MACD, etc.)
                    am5stock.IndicatorControl.new(root, {
                         stockChart,
                         // optional: limit the list
                         // indicators: ['RSI', 'MACD', 'SMA', 'EMA', 'BollingerBands']
                    }),
                    // Drawing tools (trendline, fibs, etc.)
                    am5stock.DrawingControl.new(root, {
                         stockChart,
                    }),
                    // Reset viewport / studies to initial
                    am5stock.ResetControl.new(root, {
                         stockChart,
                    }),
               ],
          })
          yAxis.set(
               'tooltip',
               am5.Tooltip.new(root, {
                    tooltipText: `{valueY}`,
               })
          )
          const yTooltip = yAxis.get('tooltip')
          yTooltip?.get('background')?.setAll({
               fill: am5.color('#303F5D'), // Transparent black (adjust if needed)
               strokeOpacity: 0, // No border
          })
          yTooltip?.label.setAll({
               fontSize: fontSizeAxis, // Optional: Adjust text size
          })
          xAxis.set(
               'tooltip',
               am5.Tooltip.new(root, {
                    tooltipText: `{valueX}`,
               })
          )
          const xTooltip = xAxis.get('tooltip')
          xTooltip?.get('background')?.setAll({
               fill: am5.color('#303F5D'),
               strokeOpacity: 0,
          })
          xTooltip?.label.setAll({
               fontSize: fontSizeAxis,
          })
          const cursor = mainPanel.set(
               'cursor',
               am5xy.XYCursor.new(root, {
                    xAxis: xAxis,
                    yAxis: yAxis,
                    zIndex: 0,
               })
          )
          cursor.lineX.setAll({
               stroke: am5.color('#303F5D'),
               strokeWidth: 2,
               strokeDasharray: [4, 4],
               zIndex: 0,
          })
          cursor.lineY.setAll({
               stroke: am5.color('#426591'),
               strokeWidth: 1,
               zIndex: 0,
          })
          setTimeout(() => setChartIsReady(true), 100)

          return () => {
               setChartIsReady(false)
               root.dispose()
               mainPanel.series.each((series) => {
                    series.dispose()
               })
               if (storedRangesRef.current.length) {
                    storedRangesRef.current.forEach((range) => {
                         if (range && !range.isDisposed()) {
                              range.dispose()
                         }
                    })
               }
               storedRangesRef.current = []
               if (storedRangeOpenRef.current.length) {
                    storedRangeOpenRef.current.forEach((range) => {
                         if (range && !range.isDisposed()) {
                              range.dispose()
                         }
                    })
               }
               storedRangeOpenRef.current = []
               Object.keys(storedRangeBuyOrSellRef.current).forEach((key) => {
                    const series = storedRangeBuyOrSellRef.current[key]
                    if (series && !series.isDisposed()) {
                         series.dispose()
                    }
                    delete storedRangeBuyOrSellRef.current[key]
               })
               if (
                    rangeExpireRef.current &&
                    !rangeExpireRef.current.isDisposed()
               ) {
                    rangeExpireRef.current.dispose()
               }
               if (rootRef.current && !rootRef.current.isDisposed()) {
                    rootRef.current.dispose()
               }

               chartRef.current = null
               yAxisRef.current = null
               xAxisRef.current = null
               mainPanelRef.current = null
               rootRef.current = null
               backgroundRef.current = null
               storedBulletBuyOrSellRef.current = []
               storedResultBulletRef.current = []
               currentPriceRangeRef.current = null
               counterLabelRef.current = null
               counterLabelTradeRef.current = []
               rangeExpireDataItemRef.current = null
               labelRef.current = undefined
               bulletRef.current = null
               arrowRef.current = null
               redArrowRef.current = null
               rangeExpireRef.current = null
               clockRef.current = null
               lastTradeRef.current = null
               lastCloseTradeRef.current = []
               rangeBuyOrSellRef.current = []
               seriesRef.current = null
               earliestTsRef.current = Infinity
               latestTsRef.current = 0
               seriesRef.current?.data.setAll([])
          }
     }, [activeTicker.symbol])

     useEffect(() => {
          if (!seriesRef.current || !candleSeriesRef.current || !chartIsReady) return
          activeTickerRef.current = activeTicker
          socket.emit(
               'startLive',
               {
                    pair: activeTickerRef.current.symbol,
                    currency_symbol: activeTickerRef.current.currency_symbol,
                    base_currency_symbol: activeTickerRef.current.base_currency_symbol,
               },
               (err, liveStarted) => {
                    if (err) {
                         toast.error(err.message)
                         return
                    }
                    if (liveStarted) {
                         setWsLoading(false)
                    }
               }
          )
          let open = 0
          let close = 0
          let high = 0
          let low = Infinity


          const newData = {
               time: 0,
               value: 0,
               high: 0,
               low: 0,
               close: 0,
               open: 0
          }
          const firstData = {
               time: 0,
               value: 0,
               high: 0,
               low: Infinity,
               close: 0,
               open: 0
          }
          socket.on('liveData', (message) => {
               dispatch(addLiveData(message))
               if (seriesTypeRef.current === 'LineSeries') {
                    if (!seriesRef.current || !seriesRef.current.dataItems.length) return
               }
               else if (seriesTypeRef.current === 'CandlestickSeries') {
                    if (!candleSeriesRef.current || !candleSeriesRef.current.dataItems.length) return
               }
               let lastDataItem = seriesTypeRef.current === 'LineSeries' ?
                    seriesRef.current.dataItems[
                    seriesRef.current.dataItems.length - 1
                    ] : candleSeriesRef.current.dataItems[
                    candleSeriesRef.current.dataItems.length - 1
                    ]
               let newDataItem = {}
               let lastValue = 0
               let newValue = 0


               lastValue = lastDataItem?.get('valueY')
               newData.time = message.time
               newData.value = message.value
               if (seriesTypeRef.current === 'LineSeries') {
                    seriesRef.current.data.push({ ...newData, bullet: true })
               } else {
                    if (candleStepRef.current === 0 && message.time - latestTsRef.current < candleTimeRef.current * 1000 && message.time - latestTsRef.current > 1000) {
                         if (!latestTsRef.current) return
                         firstData.open = message.value
                         firstData.close = message.value
                         firstData.high = message.value > firstData.high ? message.value : firstData.high
                         firstData.low = message.value < firstData.low ? message.value : firstData.low
                         lastDataItem.set("openValueY", firstData.open)
                         lastDataItem.set("closeValueY", firstData.value)
                         lastDataItem.set("lowValueY", firstData.low)
                         lastDataItem.set("highValueY", firstData.high)
                         lastDataItem.set("valueY", firstData.close)
                    } else {
                         if (candleStepRef.current % candleTimeRef.current === 0) {
                              high = newData.value
                              low = newData.value
                              close = newData.value
                              open = lastValue
                              newData.high = high
                              newData.low = low
                              newData.close = close
                              newData.open = open
                              candleSeriesRef.current.data.push(newData)
                         } else {
                              newData.close = newData.value
                              high = Math.max(high, newData.value)
                              low = Math.min(low, newData.value)
                              lastDataItem.set("openValueY", open)
                              lastDataItem.set("closeValueY", newData.value)
                              lastDataItem.set("lowValueY", low)
                              lastDataItem.set("highValueY", high)
                              lastDataItem.set("valueY", newData.value)
                         }
                         candleStepRef.current = candleStepRef.current + 1
                    }
               }
               //// data was pushed                
               if (lastDataItem) {
                    const lastValue = lastDataItem.get('valueY')
                    labelRef.current?.set('text', `${lastValue}`)
                    newDataItem = seriesTypeRef.current === 'LineSeries' ?
                         seriesRef.current.dataItems[
                         seriesRef.current.dataItems.length - 1
                         ] : candleSeriesRef.current.dataItems[
                         candleSeriesRef.current.dataItems.length - 1
                         ]

                    newValue = newDataItem.get('valueY')

                    if (
                         seriesTypeRef.current === 'LineSeries' &&
                         lastDataItem.bullets &&
                         lastDataItem.dataContext &&
                         lastDataItem.bullets[0]
                    ) {

                         newDataItem.bullets = []
                         newDataItem.bullets[0] = lastDataItem.bullets[0]
                         newDataItem.bullets[0].get('sprite').dataItem =
                              newDataItem
                         // reset bullets
                         lastDataItem.bullets.splice(0, 1) /// remove only ticking bullet 
                    }
                    newDataItem.animate({
                         key: 'valueYWorking',
                         to: newValue,
                         from: lastValue,
                         duration: 300,
                         easing: am5.ease.linear,
                    })
                    currentPriceRangeRef.current?.animate({
                         key: 'value',
                         to: newValue,
                         from: lastValue,
                         duration: 300,
                         easing: am5.ease.linear,
                    })
               }

          })
          socket.onerror = () => {
               socket.off('liveData')
          }
          prevTickerRef.current = activeTicker.symbol
          return () => {
               dispatch(setFetchLoading({ loading: true }))
               setWsLoading(true)
               if (prevTickerRef.current) {
                    socket.emit('unsubscribe', { pair: prevTickerRef.current })
               }
               socket.off('liveData')
          }
     }, [chartIsReady])

     useEffect(() => {
          if (!activeTickerRef.current || !socket || wsLoading || !chartIsReady) return
          socket.emit(
               'subscribe',
               { pair: activeTickerRef.current.symbol },
               (err, snapshot) => {
                    if (err) {
                         console.error(err)
                    }
                    if (!snapshot || !snapshot.length || !seriesRef.current)
                         return
                    earliestTsRef.current = snapshot[0].time
                    latestTsRef.current = snapshot[snapshot.length - 1].time
                    candleStepRef.current = 0
                    dispatch(setFetchLoading({ loading: false }))
                    dispatch(setChartData(snapshot))
                    dispatch(setExpirationTime({ timer }))
               }
          )
          socket.on('moreKlines', (older) => {
               if (
                    !earliestTsRef.current ||
                    !older?.length ||
                    !seriesRef.current
               ) {
                    return
               }
               const prevEarliest = earliestTsRef.current

               // take only those bars strictly older than what you've already got
               const uniqueOlder = older.filter((o) => o.time < prevEarliest)

               const existingHistory = seriesRef.current?.data

               seriesRef.current.data.setAll([
                    ...uniqueOlder,
                    ...existingHistory,
               ])
               earliestTsRef.current = older[0].time
               setTimeout(() => {
                    setHistoryLoader(false)
               }, 0)
          })
          socket.onerror = () => {
               socket.off('moreKlines')
          }
          return () => {
               socket.off('moreKlines')
               dispatch(setChartData([]))
               latestTsRef.current = 0
          }
     }, [wsLoading])
     useEffect(() => {
          if (!chartData.length || wsLoading || fetchLoading) return
          candleTimeRef.current = candleTime
          candleStepRef.current = 0
          seriesTypeRef.current = seriesType
          if (seriesTypeRef.current === 'CandlestickSeries') {
               const candles = aggregateToOHLC(chartData, candleTime)
               candleSeriesRef.current.data.setAll(candles)
               seriesRef.current.hide(300)
               candleSeriesRef.current.show(300)
               latestTsRef.current = candles[candles.length - 1].time
          } else if (seriesTypeRef.current === 'LineSeries') {
               seriesRef.current.data.setAll(chartData)
               candleSeriesRef.current.hide(300)
               seriesRef.current.show(300)
          }

          setZoomInterval(candleTime)
          /// ommit open trades lines and bullets when series type chnages 
          if (storedBulletBuyOrSellRef.current[openedTradeIndex]) {
               storedBulletBuyOrSellRef.current[
                    openedTradeIndex
               ].dispose()
               delete storedBulletBuyOrSellRef.current[
                    openedTradeIndex
               ]
          }
          if (storedResultBulletRef.current[openedTradeIndex]) {
               storedResultBulletRef.current[
                    openedTradeIndex
               ].dispose()
               delete storedResultBulletRef.current[openedTradeIndex]
          }
          if (storedRangeBuyOrSellRef.current[openedTradeIndex]) {
               storedRangeBuyOrSellRef.current[openedTradeIndex].dispose()
               delete storedRangeBuyOrSellRef.current[openedTradeIndex]
          }
          if (storedRangesRef.current[openedTradeIndex]) {
               storedRangesRef.current[openedTradeIndex].dispose()
               delete storedRangesRef.current[openedTradeIndex]
          }
          if (storedRangeOpenRef.current[openedTradeIndex]) {
               storedRangeOpenRef.current[openedTradeIndex].dispose()
               delete storedRangeOpenRef.current[openedTradeIndex]
          }

     }, [seriesType, candleTime, fetchLoading])


     useEffect(() => {
          activeCounters.forEach((ac) => {
               counterLabelTradeRef.current[ac.tradeIndex]?.set(
                    "text",
                    formatSeconds(ac.counter)
               )
          })
     }, [activeCounters])
     useEffect(() => {
          const id = setInterval(() => {
               setActiveCounters((prev) =>
                    prev.flatMap((ac) => {
                         const nextVal = ac.counter - 1;
                         return nextVal < 0 ? [] : [{ ...ac, counter: nextVal }];
                    })
               );
          }, 1000);
          return () => clearInterval(id);
     }, [])
     useEffect(() => {
          if (fetchLoading) return
          if (
               seriesType !== 'LineSeries' ||
               !currentPriceRangeRef.current ||
               !seriesRef.current ||
               !rootRef.current ||
               !bulletRef.current ||
               !mainPanelRef.current
          )
               return
          if (!hover) {
               redArrowRef.current?.set('opacity', 0)
               arrowRef.current?.set('opacity', 0)
               currentPriceRangeRef.current
                    ?.get('grid')
                    ?.set('stroke', am5.color('#426591'))
               labelRef.current?.set('fill', am5.color(0xb0b2b5))
          } else {
               if (!arrowRef.current || !redArrowRef.current) return
               if (bulletRef.current?.y() !== 0) {
                    if (hover === 'BUY') {
                         arrowRef.current?.set('opacity', 1)
                         redArrowRef.current?.set('opacity', 0)
                    } else {
                         redArrowRef.current?.set('opacity', 1)
                         arrowRef.current?.set('opacity', 0)
                    }
                    currentPriceRangeRef.current
                         ?.get('grid')
                         ?.set(
                              'stroke',
                              hover === 'BUY'
                                   ? am5.color('#076F3C')
                                   : am5.color(0xccff0000)
                         )
                    labelRef.current?.set(
                         'fill',
                         hover === 'BUY'
                              ? am5.color(0x22a06c)
                              : am5.color(0x990000)
                    )
               }
          }
     }, [hover, bulletRef.current?.y()])
     useEffect(() => {
          if (!xAxisRef.current || !timer || !rootRef.current || fetchLoading || !chartData.length) return
          rangeExpireDataItemRef.current.set('value', chartData[chartData.length - 1].time + timer * 1000)
          counterLabelRef.current?.set('text', `${formatSeconds(timer)}`)
     }, [timer, chartData.length])
     useEffect(() => {
          if (
               fetchLoading ||
               !openedTradeIndex ||
               !seriesRef.current ||
               !rootRef.current ||
               !yAxisRef.current
          )
               return
          const openTrade = openTrades.find(
               (oTrade) => oTrade.tradeIndex === openedTradeIndex
          )
          lastTradeRef.current = openTrade
          const registerCounter = (tradeIndex, initialCounter) => {
               setActiveCounters(prev => ([...prev, { tradeIndex, counter: initialCounter }]))
          }
          if (lastTradeRef.current) {
               const rangeTradeDataItem = yAxisRef.current?.makeDataItem({
                    value: lastTradeRef.current.price,
               })
               const rangeTrade =
                    yAxisRef.current?.createAxisRange(rangeTradeDataItem)

               storedRangeOpenRef.current[
                    lastTradeRef.current.tradeIndex
               ] = rangeTrade
               rangeTrade.get('grid')?.setAll({
                    stroke:
                         lastTradeRef.current.BuyOrSell === 'BUY'
                              ? am5.color(0x22a06c)
                              : am5.color(0xff6666),
                    strokeWidth: 1,
                    strokeOpacity: 0.5,
                    zIndex: 10,
                    location: 0.5,
                    strokeDasharray: [2, 2],
               })
               const containerBuyOrSell = am5.Container.new(
                    rootRef.current,
                    {
                         locationX: 0.5,
                         locationY: 0.5,
                         position: 'relative',
                    }
               )
               const buyOrSellBullet = am5.Circle.new(rootRef.current, {
                    radius: 3,
                    fill: am5.color(0xffffff),
                    strokeWidth: 1,
                    stroke:
                         lastTradeRef.current.BuyOrSell === 'BUY'
                              ? am5.color(0x22a06c)
                              : am5.color(0xff6666),
                    shadowBlur: 15,
               })
               const labelBuyOrSell = am5.RadialLabel.new(rootRef.current, {
                    text: formatCurrency(lastTradeRef.current.amount),
                    fill: am5.color(0x000),
                    focusable: true,
                    populateText: true,
                    fontSize: fontSizeAxis, // twice the original font size (was 10px)
                    shadowColor: am5.color(0x22a06c),
                    fontWeight: '600',
                    centerX: seriesTypeRef.current === 'LineSeries' ? am5.percent(70) : am5.percent(65),
                    centerY: seriesTypeRef.current === 'LineSeries' ? am5.percent(160) : am5.percent(260),
                    paddingBottom: 8, // doubled padding
                    paddingTop: 8,
                    paddingRight: 8,
                    paddingLeft: 8,
                    opacity: 1,
                    textAlign: 'center',
                    stacked: 'up',
                    width: 48,
                    interactive: true,
                    background: am5.Graphics.new(rootRef.current, {
                         svgPath: 'M40 2 c0 -1.1 -0.9 -2 -2 -2 h-36 c-1.1 0 -2 .9 -2 2 v14 c0 1.1 0.9 2 2 2 H14 l6 6 v-6 H38 c1.1 0 2 -0.9 2 -2 V2 z M2 14 H16 l4 4 v-4 H38 V2 h-36 v12 z',
                         fill:
                              lastTradeRef.current.BuyOrSell === 'BUY'
                                   ? am5.color(0x22a06c)
                                   : am5.color(0xff6666),
                         strokeWidth: 1,
                         scale: 1.5,
                         interactive: false,
                    }),
               })
               labelBuyOrSell.animate({
                    key: 'scale',
                    to: 1,
                    from: 0,
                    duration: 300,
                    easing: am5.ease.out(am5.ease.cubic),
               })

               containerBuyOrSell.children.push(buyOrSellBullet)
               containerBuyOrSell.children.push(labelBuyOrSell)
               if (seriesTypeRef.current === 'LineSeries') {
                    const targetDataItem =
                         seriesRef.current.dataItems.find(di => di.get('valueX') === lastTradeRef.current.openTime * 1000) ??
                         seriesRef.current.dataItems[seriesRef.current.dataItems.length - 1]
                    seriesRef.current?.addBullet(
                         targetDataItem,
                         am5.Bullet.new(rootRef.current, {
                              locationX: 0.5,
                              locationY: 0.5,
                              sprite: containerBuyOrSell,
                              stacked: 'up',
                         })
                    )
               }
               storedBulletBuyOrSellRef.current[
                    lastTradeRef.current.tradeIndex
               ] = containerBuyOrSell
               const rangeExpireDataItem =
                    xAxisRef.current?.makeDataItem({
                         value:
                              lastTradeRef.current.closeTime * 1000 + 500,
                    })
               const rangeExpire =
                    xAxisRef.current?.createAxisRange(rangeExpireDataItem)
               storedRangesRef.current[lastTradeRef.current.tradeIndex] =
                    rangeExpire
               rangeExpire.get('grid')?.setAll({
                    stroke:
                         lastTradeRef.current.BuyOrSell === 'BUY'
                              ? am5.color(0x4ccb90)
                              : am5.color(0xff6666),
                    strokeWidth: 1,
                    zIndex: 100,
                    strokeOpacity: seriesTypeRef.current === 'LineSeries' ? 0.8 : 0,
               })
               const expireBulletContainer = am5.Container.new(
                    rootRef.current,
                    {}
               )
               expireBulletContainerRef.current = expireBulletContainer
               const counterLabelTrade = am5.Label.new(rootRef.current, {
                    text: `${formatSeconds(
                         lastTradeRef.current.counter - 1
                    )}`,
                    fontSize: fontSizeAxis,
                    fontWeight: 'bold',
                    fill:
                         lastTradeRef.current.BuyOrSell === 'BUY'
                              ? am5.color(0x4ccb90)
                              : am5.color(0xff6666),
                    centerX: am5.percent(seriesTypeRef.current === 'LineSeries' ? 180 : 48),
                    centerY: am5.percent(seriesTypeRef.current === 'LineSeries' ? 10 : 136),
                    fontFamily: 'Arial',
                    rotation: seriesTypeRef.current === 'LineSeries' ? 90 : 0,
               })
               counterLabelTradeRef.current[
                    lastTradeRef.current.tradeIndex
               ] = counterLabelTrade
               const expierCounterLabelBG = am5.Picture.new(
                    rootRef.current,
                    {
                         src:
                              lastTradeRef.current.BuyOrSell === 'BUY'
                                   ? clockNoTimeSvgUriBuy
                                   : clockNoTimeSvgUriSell,
                         width: 16,
                         height: 16,
                         centerX: am5.percent(50),
                         centerY: am5.percent(75),
                         opacity: 1,
                         dx: 0,
                    }
               )
               expireBulletContainer.children.push(
                    expierCounterLabelBG
               )
               expireBulletContainer.children.push(
                    counterLabelTrade
               )
               if (seriesTypeRef.current !== 'LineSeries') {
                    expireBulletContainer.children.push(
                         containerBuyOrSell
                    )
               }
               rangeExpire.set(
                    'bullet',
                    am5xy.AxisBullet.new(rootRef.current, {
                         locationX: 0.5,
                         locationY: 0.5,
                         sprite: expireBulletContainer,
                    })
               )
               registerCounter(
                    lastTradeRef.current.tradeIndex,
                    Number(lastTradeRef.current.counter)
               )

               lastTradeRef.current = null
          }


          return () => lastTradeRef.current = null
     }, [openedTradeIndex])
     useEffect(() => {
          if (!yAxisRef.current || !closedTradeIndex || fetchLoading) return
          const closeTrade = openTrades.find(
               (oTrade) => oTrade.tradeIndex === closedTradeIndex
          )
          lastCloseTradeRef.current = [...lastCloseTradeRef.current, closeTrade]
          dispatch(terminateTrade({ tradeIndex: closedTradeIndex }))
          if (lastCloseTradeRef.current) {
               for (const lastCloseTrade of lastCloseTradeRef.current) {
                    const containerResult = am5.Container.new(rootRef.current, {
                         locationX: 0.5,
                         locationY: 0.5,
                    })
                    storedResultBulletRef.current[
                         lastCloseTrade.tradeIndex
                    ] = containerResult
                    const circle = am5.Circle.new(rootRef.current, {
                         radius: 3,
                         fill: am5.color(0x000000),
                         strokeWidth: 1,
                         stroke: lastCloseTrade.isWin
                              ? am5.color(0x22a06c)
                              : am5.color(0xff6666),
                         shadowBlur: 15,
                    })
                    const labelRes = am5.RadialLabel.new(rootRef.current, {
                         text: `${lastCloseTrade.isWin
                              ? '+' +
                              formatCurrency(
                                   lastCloseTrade.winAmount
                              )
                              : '-' +
                              formatCurrency(
                                   lastCloseTrade.winAmount
                              )
                              }`,
                         fill: lastCloseTrade.isWin
                              ? am5.color(0x22a06c)
                              : am5.color(0xff6666),
                         focusable: true,
                         populateText: true,
                         fontSize: fontSizeAxis, // twice the original font size (was 10px)
                         shadowColor: am5.color(0x22a06c),
                         fontWeight: '600',
                         centerX: seriesTypeRef.current === 'LineSeries' ? am5.percent(70) : am5.percent(85),
                         centerY: seriesTypeRef.current === 'LineSeries' ? am5.percent(160) : am5.percent(270),
                         paddingBottom: 8, // doubled padding
                         paddingTop: 8,
                         paddingRight: 8,
                         paddingLeft: 8,
                         opacity: 1,
                         width: 48,
                         textAlign: 'center',
                         background: am5.Graphics.new(rootRef.current, {
                              svgPath: 'M2 2c0-1.1.9-2 2-2h36c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H28l-6 6v-6H4c-1.1 0-2-.9-2-2V2zM40 14H26l-4 4v-4H4V2h36v12z',
                              fill: am5.color(0x000000),
                              strokeWidth: 1,
                              scale: 1.8,
                         }),
                    })

                    labelRes.animate({
                         key: 'scale',
                         to: 1,
                         from: 0,
                         duration: 500,
                         easing: am5.ease.out(am5.ease.cubic),
                    })
                    circle.animate({
                         key: 'scale',
                         to: 1,
                         from: 0,
                         duration: 500,
                         easing: am5.ease.out(am5.ease.cubic),
                    })
                    containerResult.children.push(circle)
                    containerResult.children.push(labelRes)
                    if (seriesTypeRef.current === 'LineSeries') {
                         const targetDataItem =
                              seriesRef.current.dataItems.find(di => di.get('valueX') === lastCloseTrade.closeTime * 1000) ??
                              seriesRef.current.dataItems[seriesRef.current.dataItems.length - 1]
                         seriesRef.current?.addBullet(
                              targetDataItem,
                              am5.Bullet.new(rootRef.current, {
                                   locationX: 0.5,
                                   locationY: 0.5,
                                   sprite: containerResult,
                                   stacked: 'up',
                              })
                         )
                    } else {
                         expireBulletContainerRef.current.children.push(
                              containerResult
                         )

                    }
                    const index = lastCloseTradeRef.current.findIndex(lastCloseTradeRef => lastCloseTradeRef.tradeIndex === lastCloseTrade.tradeIndex)
                    lastCloseTradeRef.current.splice(index, 1)
               }
          }
          return () => lastCloseTradeRef.current = []
     }, [closedTradeIndex])
     useEffect(() => {
          if (fetchLoading) return
          setTimeout(() => {
               if (storedBulletBuyOrSellRef.current[termminatedTradeIndex]) {
                    storedBulletBuyOrSellRef.current[
                         termminatedTradeIndex
                    ].dispose()
                    delete storedBulletBuyOrSellRef.current[
                         termminatedTradeIndex
                    ]
               }
               if (storedResultBulletRef.current[termminatedTradeIndex]) {
                    storedResultBulletRef.current[
                         termminatedTradeIndex
                    ].dispose()
                    delete storedResultBulletRef.current[termminatedTradeIndex]
               }
               if (storedRangeBuyOrSellRef.current[closedTradeIndex]) {
                    storedRangeBuyOrSellRef.current[closedTradeIndex].dispose()
                    delete storedRangeBuyOrSellRef.current[closedTradeIndex]
               }
               if (storedRangesRef.current[closedTradeIndex]) {
                    storedRangesRef.current[closedTradeIndex].dispose()
                    delete storedRangesRef.current[closedTradeIndex]
               }
               if (storedRangeOpenRef.current[closedTradeIndex]) {
                    storedRangeOpenRef.current[closedTradeIndex].dispose()
                    delete storedRangeOpenRef.current[closedTradeIndex]
               }
          }, 10000)
     }, [termminatedTradeIndex])
     useEffect(() => {
          if (fetchLoading) return
          if (seriesType !== 'LineSeries') {
               candleSeriesRef.current?.columns?.template.setAll({
                    width: am5.percent(zoomInterval * 30),
                    strokeWidth: 2
               })
          }
     }, [zoomInterval])
     const MIN_WINDOW = 0.022 // never zoom closer than 2 % of dataset
     const MAX_WINDOW = seriesType === 'LineSeries' ? 0.2 : 0.1 // 40% of the data range
     const ZOOM_STEP = 0.2 // zoom‑in by 20 % each click (was 5 %)

     const handleZoomIn = () => {
          const xAxis = xAxisRef.current
          if (!xAxis) return

          let start = xAxis.get('start') ?? 0
          let end = xAxis.get('end') ?? 1

          const span = end - start
          if (span <= MIN_WINDOW) return // already max‑zoomed

          const shrink = (span * ZOOM_STEP) / 2 // shrink both sides equally
          let newStart = start + shrink
          let newEnd = end - shrink

          // clamp so we keep at least MIN_WINDOW visible
          if (zoomInterval < candleTimeRef.current * 5)
               setZoomInterval(prev => prev + Math.floor(candleTimeRef.current / 2))
          if (newEnd - newStart < MIN_WINDOW) {

               const mid = (start + end) / 2
               newStart = mid - MIN_WINDOW / 2
               newEnd = mid + MIN_WINDOW / 2
          }

          xAxis.zoom(newStart, newEnd)
     }

     const handleZoomOut = () => {
          const xAxis = xAxisRef.current
          if (!xAxis) return

          let start = xAxis.get('start') ?? 0
          let end = xAxis.get('end') ?? 1

          const span = end - start
          if (span > MAX_WINDOW) return // already fully zoomed‑out

          const expand = (span * ZOOM_STEP) / 2 // grow both sides equally
          let newStart = Math.max(start - expand, 0)
          let newEnd = Math.min(end + expand, 1)

          // clamp so we never overshoot the full range
          if (zoomInterval > candleTime * 5)
               setZoomInterval(prev => prev - candleTime)


          xAxis.zoom(newStart, newEnd)
     }

     const handleFocus = useCallback(() => {
          setZoomInterval(candleTimeRef.current * 2)
          const xAxis = xAxisRef.current
          if (!xAxis) return
          const now = Date.now()
          const from = new Date(now - 1200_000)
          const to = new Date(now + 160_000)
          xAxis.zoomToDates(from, to, 300)
     }, [])
     const handleInitialFocus = useCallback(() => {
          setZoomInterval(candleTimeRef.current * 2)
          const xAxis = xAxisRef.current
          if (!xAxis) return
          const now = Date.now()
          const from = new Date(now - 1200_000)
          const to = new Date(now + 160_000)
          xAxis.zoomToDates(from, to, 300)
     }, [])

     return (
          <div className='relative h-full w-full'>
               <div
                    className={`absolute w-full h-full flex justify-center items-center `}
               >
                    {historyLoader && (
                         <OldTvLoader />
                    )}
               </div>
               <div
                    className={`flex ${(wsLoading || fetchLoading) && 'hidden'}`}
               >
                    <div className='absolute bottom-12 left-1/2 z-10'>
                         <ButtonGroup
                              variant='text'
                              aria-label='zoom controls'
                              className='space-x-2'
                         >
                              <Tooltip title='ZomOut'  >
                                   <ZoomOutIcon
                                        onClick={handleZoomOut}
                                        className='cursor-pointer shadow-black shadow-sm rounded-full p-0.5'
                                   />
                              </Tooltip>
                              <Tooltip
                                   title='Focus'
                                   className='group  flex justify-center items-center'
                              >
                                   <div className='cursor-pointer shadow-black shadow-sm rounded-none p-0.5' >
                                        <FocusCircle
                                             onClick={handleFocus}
                                             className='cursor-pointer block group-hover:hidden transition-all w-[20px]'
                                        />
                                        <CenterFocusStrongIcon
                                             onClick={handleFocus}
                                             className='cursor-pointer hidden group-hover:block transition-all w-[20px]'
                                        />
                                   </div>
                              </Tooltip>
                              <Tooltip title='zoomIn'>
                                   <ZoomIcon
                                        onClick={handleZoomIn}
                                        className='cursor-pointer shadow-black shadow-sm rounded-full p-0.5'
                                   />
                              </Tooltip>
                         </ButtonGroup>
                    </div>
                    <div
                         id={"ChartDivBonus"}
                         className='absolute bottom-0 left-0 right-0 top-0'
                         key={activeTicker.symbol}
                    />
                    <div className='flex items-center justify-between m-1' >
                         <div className='rounded-sm  flex flex-col text-xs z-10 items-center justify-start'>
                              <SeriesTypeSelect
                                   value={seriesType}
                                   candleTime={candleTime}
                              />
                         </div>
                         <div
                              className="flex flex-wrap gap-0 items-center text-xs  p-1 rounded-sm shadow 
                               [&>div.am5stock-control-button]:flex 
                               [&>div.am5stock-control-button]:items-center 
                               [&>div.am5stock-control-button]:border-none 
                               [&>div.am5stock-control-button]:bg-[#20293E] 
                               [&>div.am5stock-control-button]:p-2 
                               [&>div>div.am5stock-control-label]:hidden
                               [&_.am5stock-control-button]:!text-lightGrey
                              [&_.am5stock-control-button:hover]:!text-white
                              [&_.am5stock-control-button_svg]:[fill:currentColor]
                              [&_.am5stock-control-button_svg]:[stroke:currentColor]
                              [&_.am5stock-control-button_path]:[fill:currentColor]
                              [&_.am5stock-control-button_path]:[stroke:currentColor]
                              [&_.am5stock-control-button[aria-pressed='true']]:bg-[#24304A]
                              [&_.am5stock-control-button[aria-pressed='true']]:!text-white
                              [&_.am5stock-control-label]:hidden
                              [&>.am5stock>div.am5stock-control-list-container]:bg-[#1A2236]
                              [&>.am5stock>div.am5stock-control-list-container]:border-none
                              [&>.am5stock>div.am5stock-control-list-container]:rounded-xs
                              [&>.am5stock>div.am5stock-control-list-container]:shadow-lg
                              [&>title]:hidden
                              [&>.am5stock>div.am5stock-control-list-container>.am5stock-control-list-arrow]:hidden
                              [&>.am5stock>div.am5stock-control-list-container>.am5stock-list-search>input]:bg-darkEnd
                              [&>.am5stock>div.am5stock-control-list-container>.am5stock-list-search>input]:border-none
                             
                               "
                              id={'chartcontrols'}
                         ></div>
                    </div>
               </div>
          </div>
     )
}
export default RealTimeChart
