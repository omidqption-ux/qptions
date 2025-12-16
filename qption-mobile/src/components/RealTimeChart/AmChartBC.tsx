import React, {
     FC,
     useCallback,
     useEffect,
     useMemo,
     useRef,
     useState,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';

import AnimatedLogoLoader from '../AnimatedLogoLoader';
import {
     setExpirationTime,
     setFetchLoading,
} from '../../store/slices/tradingRoomSlices/tradeSlice';
import {
     addLiveData,
     setChartData,
     type ChartPoint,
} from '../../store/slices/tradingRoomSlices/chartSlice';
import { resolveTimeZone } from './timeZoneHelper';
import { getSocketByMode } from '../../config/env';

type RootState = any;

const HTML_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    html, body, #chartdiv {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      background: #0b1424;
      color: #e5e7eb;
      overflow: hidden;
    }
  </style>
  <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/stock.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
</head>
<body>
  <div id="chartdiv"></div>
  <script>
    let root;
    let xAxis;
    let yAxis;
    let series;
    let panel;
    let expireRange;
    const RIGHT_PADDING_PX = 100;
    const VIEW_WINDOW_MS = 260000;

    const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

    function disposeChart() {
      if (root) {
        root.dispose();
        root = null;
        xAxis = null;
        yAxis = null;
        series = null;
        panel = null;
        expireRange = null;
      }
    }

    function applyTimezone(tz) {
      if (!root) return;
      if (!tz || tz === 'UTC') {
        root.utc = true;
        root.timezone = undefined;
      } else {
        root.utc = false;
        try {
          root.timezone = am5.Timezone.new(tz);
        } catch (_) {}
      }
    }

    function initChart(tz) {
      disposeChart();
      root = am5.Root.new('chartdiv');
      root.setThemes([am5themes_Animated.new(root)]);
      applyTimezone(tz);

      const stockChart = root.container.children.push(
        am5stock.StockChart.new(root, { paddingRight: 0 })
      );
      panel = stockChart.panels.push(
        am5stock.StockPanel.new(root, {
          panX: true,
          panY: false,
          wheelX: 'none',
          wheelY: 'none',
        })
      );
      panel.plotContainer.setAll({ paddingRight: RIGHT_PADDING_PX });

      const axisLabelColor = am5.color('#e0e0e0');
      const axisLabelSize = 10;
      xAxis = panel.xAxes.push(
        am5xy.DateAxis.new(root, {
          baseInterval: { timeUnit: 'second', count: 1 },
          renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
        })
      );
      xAxis.get('renderer').labels.template.setAll({ fill: axisLabelColor, fontSize: axisLabelSize });
      yAxis = panel.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, { opposite: true }),
        })
      );
      yAxis.get('renderer').labels.template.setAll({ fill: axisLabelColor, fontSize: axisLabelSize });
      series = panel.series.push(
        am5xy.SmoothedXLineSeries.new(root, {
          xAxis,
          yAxis,
          valueYField: 'value',
          valueXField: 'time',
          maskBullets: false,
        })
      );
      series.strokes.template.setAll({
        stroke: am5.color('#305E91'),
        strokeWidth: 2,
      });
      series.fills?.template.setAll({
        visible: true,
        fillOpacity: 0.05,
        strokeWidth: 1,
        stroke: am5.color('#305E91'),
        fill: am5.color('#305E91'),
      });
    }


    function zoomWithHeadroom(start, end) {
      if (!xAxis || start == null || end == null) return;
      let targetEnd = end;
      const plotWidth = panel?.plotContainer?.getPrivate('width');
      if (plotWidth && plotWidth > 0 && end > start) {
        const span = end - start;
        const offset = (span * RIGHT_PADDING_PX) / plotWidth;
        targetEnd = end + offset;
      }
      xAxis.zoomToValues(start, targetEnd);
    }

    function focusLatest(data) {
      if (!xAxis || !data || !data.length) return;
      const last = data[data.length - 1].time;
      if (last == null) return;
      const start = last - VIEW_WINDOW_MS;
      zoomWithHeadroom(start, last);
    }

    function setExpire(timer, data, anchorTime) {
      if (!xAxis) return;
      const last = data && data.length ? data[data.length - 1].time : null;
      const baseTime = anchorTime != null ? anchorTime : last;
      if (baseTime == null || !timer) {
        if (expireRange) {
          expireRange.dispose();
          expireRange = null;
        }
        return;
      }
      if (!expireRange) {
        const di = xAxis.makeDataItem({ value: last + timer * 1000 });
        expireRange = xAxis.createAxisRange(di);
        expireRange.get('grid')?.setAll({
          stroke: am5.color('#364E6E'),
          strokeWidth: 1,
          strokeOpacity: 1,
        });
        const bulletContainer = am5.Container.new(root, { width: 120, height: 20 });
        const label = am5.Label.new(root, {
          text: timer.toString() + 's',
          fontSize: 11,
          fontWeight: 'bold',
          fill: am5.color('#0EA5E9'),
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          background: am5.RoundedRectangle.new(root, {
            fill: am5.color('#1f2937'),
            fillOpacity: 0.8,
            cornerRadiusTL: 6,
            cornerRadiusTR: 6,
            cornerRadiusBL: 6,
            cornerRadiusBR: 6,
          }),
          paddingLeft: 6,
          paddingRight: 6,
          paddingTop: 2,
          paddingBottom: 2,
        });
        bulletContainer.children.push(label);
        expireRange.set('bullet', am5xy.AxisBullet.new(root, { sprite: bulletContainer }));
      }
      const di = expireRange.get('dataItem');
      di?.set('value', baseTime + timer * 1000);
      const lbl = expireRange.get('label');
      if (lbl) {
        lbl.set('text', timer.toString() + 's');
      }
    }

    function setData(payload) {
      const { data, timer, timezone, anchorTime } = payload;
      if (!root) initChart(timezone);
      if (!series) return;
      applyTimezone(timezone);
      series.data.setAll(data || []);
      setExpire(timer, data, anchorTime);
      // focus latest window
      focusLatest(series.data.values);
    }

    function appendPoint(point, timer, timezone, anchorTime) {
      if (!series) return;
      series.data.push(point);
      applyTimezone(timezone);
      setExpire(timer, series.data.values, anchorTime != null ? anchorTime : point?.time);
      focusLatest(series.data.values);
    }

    function handleMessage(raw) {
      try {
        const msg = JSON.parse(raw);
        if (msg.type === 'setData') {
          setData(msg.payload);
        } else if (msg.type === 'append') {
          appendPoint(msg.payload.point, msg.payload.timer, msg.payload.timezone, msg.payload.anchorTime);
        } else if (msg.type === 'reset') {
          initChart(msg.payload?.timezone);
        }
      } catch (e) {
        console.warn('chart message error', e);
      }
    }

    window.addEventListener('message', (e) => handleMessage(e.data));
    document.addEventListener('message', (e) => handleMessage(e.data));
    initChart();
  </script>
</body>
</html>
`;

const AmChart: FC = () => {
     const dispatch = useDispatch();
     const { timer } = useSelector((s: RootState) => s.trade);
     const { chartData } = useSelector(
          (s: RootState) => s.chart,
     );
     const { activeTicker, activeTickerDemo, activeTickerBonus } = useSelector(
          (s: RootState) => s.ticker,
     );
     const { userSettings } = useSelector((s: RootState) => s.user);
     const mode = useSelector((s: RootState) => s.tradingRoom.mode);
     const socket = getSocketByMode(mode);
     const selectedTicker =
          mode === 'demo'
               ? activeTickerDemo
               : mode === 'bonus'
                    ? activeTickerBonus
                    : activeTicker;

     const [showInitialLoader, setShowInitialLoader] = useState(true);
     const [wsLoading, setWsLoading] = useState(true);
     const [historyLoader, setHistoryLoader] = useState(false);
     const [snapshotReady, setSnapshotReady] = useState(false);
     const [firstLiveReady, setFirstLiveReady] = useState(false);
     const [initialFocusDone, setInitialFocusDone] = useState(false);
     const webRef = useRef<WebView>(null);
     const webReadyRef = useRef(false);
     const chartDataRef = useRef<ChartPoint[]>(chartData);
     const activeTickerRef = useRef(selectedTicker);
     const lastSentTimeRef = useRef<number | null>(null);
     const lastSentValueRef = useRef<number | null>(null);
     const lastSyncedLengthRef = useRef(0);
     const lastSyncedSymbolRef = useRef<string | undefined>(selectedTicker?.symbol);
     const tzSettings = userSettings?.timeZone;
     const resolvedTimeZone = useMemo(() => {
          const label = tzSettings?.timeZone?.split(' ')[0];
          return resolveTimeZone(tzSettings?.automaticDetection ?? true, label);
     }, [tzSettings?.automaticDetection, tzSettings?.timeZone]);
     const lastSyncedTzRef = useRef(resolvedTimeZone);
     const expectedInitialLengthRef = useRef(0);

     useEffect(() => {
          chartDataRef.current = chartData;
     }, [chartData]);

     useEffect(() => {
          activeTickerRef.current = selectedTicker;
     }, [selectedTicker]);

     const preparedData = useMemo(() => {
          return chartData.map((p: any) => ({
               time: p.time,
               value: p.value ?? p.close ?? p.open ?? 0,
          }));
     }, [chartData]);

     const latestTickerTime = useMemo(
          () => (chartData.length ? chartData[chartData.length - 1].time : null),
          [chartData],
     );

     const postToWebView = useCallback((message: unknown) => {
          if (!webReadyRef.current) return;
          try {
               webRef.current?.postMessage(JSON.stringify(message));
          } catch (e) {
               // no-op
          }
     }, []);

     useEffect(() => {
          if (!webReadyRef.current) return;

          const symbolChanged = lastSyncedSymbolRef.current !== selectedTicker?.symbol;
          const tzChanged = lastSyncedTzRef.current !== resolvedTimeZone;
          const lengthChanged = preparedData.length !== lastSyncedLengthRef.current;
          const needFullSync =
               !preparedData.length ||
               symbolChanged ||
               tzChanged ||
               lastSyncedLengthRef.current === 0 ||
               preparedData.length - lastSyncedLengthRef.current > 5;

          if (!needFullSync) return;

          postToWebView({
               type: 'setData',
               payload: {
                    data: preparedData,
                    timer,
                    timezone: resolvedTimeZone,
                    anchorTime: latestTickerTime,
               },
          });

          lastSyncedLengthRef.current = preparedData.length;
          lastSyncedSymbolRef.current = selectedTicker?.symbol;
          lastSyncedTzRef.current = resolvedTimeZone;

          if (preparedData.length) {
               const last = preparedData[preparedData.length - 1] as any;
               lastSentTimeRef.current = typeof last.time === 'number' ? last.time : Number(last.time) || null;
               const lastVal = last.value ?? last.close ?? last.open;
               lastSentValueRef.current = Number.isFinite(lastVal) ? Number(lastVal) : null;
          } else {
               lastSentTimeRef.current = null;
               lastSentValueRef.current = null;
          }
     }, [preparedData, timer, resolvedTimeZone, postToWebView, latestTickerTime, selectedTicker?.symbol]);

     useEffect(() => {
          if (!webReadyRef.current) return;
          if (!chartData.length) return;
          const raw = chartData[chartData.length - 1];
          const pointTime = typeof raw.time === 'number' ? raw.time : Number(raw.time);
          if (!Number.isFinite(pointTime)) return;
          if (lastSentTimeRef.current != null && pointTime <= lastSentTimeRef.current) return;

          const mapToSeriesPoint = (p: ChartPoint, timeOverride?: number) => {
               const t = timeOverride ?? (typeof p.time === 'number' ? p.time : Number(p.time));
               return {
                    time: t,
                    value: p.value ?? p.close ?? p.open ?? 0,
               };
          };

          const pointsToSend: any[] = [];
          const lastSentTime = lastSentTimeRef.current;
          const lastSentValue = lastSentValueRef.current;
          if (lastSentTime != null && lastSentValue != null) {
               for (let t = lastSentTime + 1000; t < pointTime; t += 1000) {
                    pointsToSend.push(
                         mapToSeriesPoint(
                              { ...raw, time: t, value: lastSentValue, open: lastSentValue, close: lastSentValue, high: lastSentValue, low: lastSentValue },
                              t,
                         ),
                    );
               }
          }
          pointsToSend.push(mapToSeriesPoint(raw));

          pointsToSend.forEach((pt) =>
               postToWebView({
                    type: 'append',
                    payload: {
                         point: pt,
                         timer,
                         timezone: resolvedTimeZone,
                         anchorTime: pt.time,
                    },
               }),
          );

          lastSentTimeRef.current = pointTime;
          const lastValue = raw.value ?? raw.close ?? raw.open ?? null;
          lastSentValueRef.current = Number.isFinite(lastValue as number) ? Number(lastValue) : lastSentValueRef.current;
     }, [chartData, resolvedTimeZone, timer, postToWebView]);

     useEffect(() => {
          if (!socket.connected) {
               socket.connect();
          }
          const handleDisconnect = () => setWsLoading(true);
          socket.on('disconnect', handleDisconnect);
          return () => {
               socket.off('disconnect', handleDisconnect);
          };
     }, [socket]);

     useEffect(() => {
          if (!selectedTicker) return;
          setWsLoading(true);
          setHistoryLoader(false);
          setSnapshotReady(false);
          setFirstLiveReady(false);
          setInitialFocusDone(false);
          expectedInitialLengthRef.current = 0;
          lastSentTimeRef.current = null;
          lastSentValueRef.current = null;
          lastSyncedLengthRef.current = 0;
          lastSyncedSymbolRef.current = selectedTicker?.symbol;
          lastSyncedTzRef.current = resolvedTimeZone;
          dispatch(setFetchLoading({ loading: true }));
          dispatch(setChartData([]));

          const payload = {
               pair: selectedTicker.symbol,
               currency_symbol: selectedTicker.currency_symbol,
               base_currency_symbol: selectedTicker.base_currency_symbol,
          };

          socket.emit(
               'startLive',
               payload,
               (err: any, liveStarted: boolean) => {
                    if (err) {
                         return;
                    }
                    if (liveStarted) {
                         setWsLoading(false);
                    }
               },
          );

          const onLiveData = (message: ChartPoint) => {

               dispatch(addLiveData(message));
               setFirstLiveReady((prev) => prev || true);
          };

          socket.on('liveData', onLiveData);

          return () => {
               socket.emit('unsubscribe', { pair: activeTickerRef.current?.symbol });
               socket.off('liveData', onLiveData);
               setWsLoading(true);
               dispatch(setFetchLoading({ loading: true }));
               setSnapshotReady(false);
               setFirstLiveReady(false);
               setInitialFocusDone(false);
               expectedInitialLengthRef.current = 0;
               lastSentTimeRef.current = null;
               lastSentValueRef.current = null;
               lastSyncedLengthRef.current = 0;
               lastSyncedSymbolRef.current = selectedTicker?.symbol;
               lastSyncedTzRef.current = resolvedTimeZone;
          };
     }, [
          socket,
          dispatch,
          selectedTicker,
          timer,
          resolvedTimeZone,
          postToWebView,
          mode
     ]);

     useEffect(() => {
          if (!selectedTicker || wsLoading) return;

          socket.emit(
               'subscribe',
               { pair: selectedTicker.symbol },
               (err: any, snapshot: ChartPoint[]) => {
                    if (err) {
                         console.error(err);
                         return;
                    }
                    if (!snapshot?.length) {
                         dispatch(setFetchLoading({ loading: false }));
                         setSnapshotReady(true);
                         expectedInitialLengthRef.current = 0;
                         return;
                    }
                    const sorted = [...snapshot].sort((a, b) => a.time - b.time);
                    dispatch(setChartData(sorted));
                    dispatch(setFetchLoading({ loading: false }));
                    expectedInitialLengthRef.current = sorted.length;
                    setSnapshotReady(true);
                    dispatch(setExpirationTime({ timer }));
               },
          );

          const onMoreKlines = (older: ChartPoint[]) => {
               if (!older?.length) {
                    setHistoryLoader(false);
                    return;
               }
               const existing = chartDataRef.current;
               const merged = [...older, ...existing]
                    .sort((a, b) => a.time - b.time);
               dispatch(setChartData(merged));
               setHistoryLoader(false);
          };

          socket.on('moreKlines', onMoreKlines);

          return () => {
               socket.off('moreKlines', onMoreKlines);
          };
     }, [socket, wsLoading, dispatch, selectedTicker?.symbol, timer]);


     useEffect(() => {
          if (initialFocusDone || wsLoading) return
          console.log("here")
          setTimeout(() => {
               setShowInitialLoader(false)
          }, 1500)
     }, [wsLoading, initialFocusDone])
     useEffect(() => {
          if (!webReadyRef.current) return;
          if (!snapshotReady || !firstLiveReady) return;
          if (!preparedData.length) return;
          setInitialFocusDone(true);
     }, [snapshotReady, firstLiveReady, preparedData.length]);

     useEffect(() => {
          if (!wsLoading) return;
          if (snapshotReady && firstLiveReady && preparedData.length) {
               setWsLoading(false);
          }
     }, [wsLoading, snapshotReady, firstLiveReady, preparedData.length]);

     return (
          <View style={styles.root}>
               {showInitialLoader && (
                    <View style={styles.blockingOverlay}>
                         <View style={styles.blockingCard}>
                              <AnimatedLogoLoader size={78} />
                         </View>
                    </View>
               )}

               <View style={styles.loaderOverlay} pointerEvents="box-none">
                    {historyLoader && (
                         <View style={styles.loaderPill} pointerEvents="auto">
                              <AnimatedLogoLoader size={64} />
                         </View>
                    )}
               </View>

               <View style={styles.chartWrapper}>
                    <WebView
                         ref={webRef}
                         originWhitelist={['*']}
                         source={{ html: HTML_TEMPLATE }}
                         style={[
                              styles.chartArea,
                              !initialFocusDone && styles.chartHidden,
                         ]}
                         onLoadEnd={() => {
                              webReadyRef.current = true;
                              postToWebView({
                                   type: 'setData',
                                   payload: {
                                        data: preparedData,
                                        timer,
                                        timezone: resolvedTimeZone,
                                        anchorTime: latestTickerTime,
                                   },
                              });
                         }}
                         onMessage={() => { }}
                         allowFileAccess
                         scalesPageToFit
                    />
               </View>
          </View>
     );
};

export default AmChart;

const styles = StyleSheet.create({
     root: {
          position: 'relative',
          width: '100%',
          height: '100%',
     },
     blockingOverlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: '#0B1422',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
     },
     loaderOverlay: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingLeft: 8,
          zIndex: 5,
     },
     loaderPill: {
          width: 110,
          height: '100%',
          paddingVertical: 8,
          paddingHorizontal: 10,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 12,
          backgroundColor: 'rgba(31,76,143,0.12)',
          borderWidth: 1,
          borderColor: 'rgba(31,76,143,0.25)',
     },
     blockingCard: {
          padding: 16,
          borderRadius: 14,
          backgroundColor: 'rgba(5,7,13,0.9)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)',
          alignItems: 'center',
     },
     chartWrapper: {
          flex: 1,
          position: 'relative',
     },
     chartArea: {
          position: 'absolute',
          bottom: 0,
          top: 0,
          left: 0,
          right: 0,
     },
     chartHidden: {
          opacity: 0,
          pointerEvents: 'none',
     },
})
