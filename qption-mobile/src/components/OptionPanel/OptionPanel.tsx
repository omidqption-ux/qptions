import React, { useEffect, useRef, useState } from 'react';
import {
     View,
     Text,
     TouchableOpacity,
     StyleSheet,
     Platform,
     Animated,
     Easing,
     DeviceEventEmitter,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
     openTrade as openTradeAction,
} from '../../store/slices/tradingRoomSlices/tradeSlice';
import { getSocketByMode } from '../../config/env';
import { RootState } from '../../store';
import { normalizeEpochMs } from '../../utils/time';


type BuyOrSell = 'BUY' | 'SELL';
type AIPending = {
     id: string;
     openTimeMs: number;
     stake: number;
     side: BuyOrSell;
     tradeIndex?: number;
     timeout?: NodeJS.Timeout;
     resolve: (res: { settled: boolean; isWin?: boolean; winAmount?: number }) => void;
};


const OptionPanel: React.FC = () => {
     const dispatch = useDispatch();
     const { amount, payOutPercentage, timer, aiMode, aiActive } = useSelector((s: RootState) => s.trade);
     const { activeTicker, activeTickerBonus, activeTickerDemo } = useSelector((s: RootState) => s.ticker);
     const { lastchartData } = useSelector((s: RootState) => s.chart);
     const { balance, demoBalance, bonusBalance } = useSelector((s: RootState) => s.user);
     const { mode } = useSelector((s: RootState) => s.tradingRoom);
     const selectedTicker =
          mode === 'demo' ? activeTickerDemo : mode === 'bonus' ? activeTickerBonus : activeTicker;
     const effectiveBalance =
          mode === 'demo' ? demoBalance : mode === 'bonus' ? bonusBalance : balance;
     const payout =
          selectedTicker?.payoutPercentage != null ? selectedTicker.payoutPercentage : payOutPercentage;
     const socket = getSocketByMode(mode);

     const buyScale = useRef(new Animated.Value(1)).current;
     const sellScale = useRef(new Animated.Value(1)).current;
     const [buttonsLocked, setButtonsLocked] = useState(false);
     const unlockTimerRef = useRef<NodeJS.Timeout | null>(null);
     const [toastMsg, setToastMsg] = useState<string | null>(null);
     const toastY = useRef(new Animated.Value(-80)).current;
     const toastTimer = useRef<NodeJS.Timeout | null>(null);
     const aiTypingTimerRef = useRef<NodeJS.Timeout | null>(null);
     const aiSessionRef = useRef<{ running: boolean; initial: number; pool: number; trades: number }>({
          running: false,
          initial: 0,
          pool: 0,
          trades: 0,
     });
     const aiPendingRef = useRef<AIPending[]>([]);
     const lastChartRef = useRef(lastchartData);
     const balanceRef = useRef(effectiveBalance);



     React.useEffect(() => {
          if (!socket) return;
          const handler = (data: any) => {
               if (!data || data.pair !== selectedTicker?.symbol) return;
               const side = String(data.buyOrSell || '').toUpperCase() as BuyOrSell;
               const openMs = normalizeEpochMs(data.openTime);
               const closeMs = normalizeEpochMs(data.closeTime);
               dispatch(
                    openTradeAction({
                         amount: data.amount,
                         BuyOrSell: side,
                         isWin: false,
                         status: 'open',
                         openTime: data.openTime,
                         closeTime: data.closeTime,
                         counter: data.closeTime - data.openTime,
                         price: Number(data.price),
                         tradeIndex: data.tradeIndex,
                    })
               );
               DeviceEventEmitter.emit('chart-trade', {
                    side,
                    amount: data.amount,
                    time: openMs ?? data.openTime,
                    openTime: openMs ?? data.openTime,
                    closeTime: closeMs ?? data.closeTime,
                    price: Number(data.price),
                    tradeIndex: data.tradeIndex,
               });
          };
          socket.on('tradeOpened', handler);
          const onTradeResult = (result: any) => {
               if (!result || result.pair !== selectedTicker?.symbol) return;
               DeviceEventEmitter.emit('chart-trade-result', {
                    closeTime: normalizeEpochMs(result.closeTime),
                    openTime: normalizeEpochMs(result.openTime),
                    finalPrice: Number(result.finalPrice),
                    isWin: !!result.isWin,
                    winAmount: Number(result.winAmount),
                    tradeIndex: result.tradeIndex,
               });
          };
          socket.on('tradeResult', onTradeResult);
          return () => {
               socket.off('tradeOpened', handler);
               socket.off('tradeResult', onTradeResult);
               if (toastTimer.current) clearTimeout(toastTimer.current);
          };
     }, [socket, selectedTicker?.symbol, dispatch]);



     const runPressAnimation = (target: Animated.Value) => {
          target.stopAnimation();
          target.setValue(1);
          Animated.sequence([
               Animated.timing(target, {
                    toValue: 1.12,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
               }),
               Animated.timing(target, {
                    toValue: 0.9,
                    duration: 250,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
               }),
               Animated.timing(target, {
                    toValue: 1,
                    duration: 450,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
               }),
          ]).start();
     };

     const showToast = (msg: string) => {
          setToastMsg(msg);
          toastY.stopAnimation();
          toastY.setValue(-80);
          Animated.timing(toastY, {
               toValue: 0,
               duration: 220,
               easing: Easing.out(Easing.cubic),
               useNativeDriver: true,
          }).start(() => {
               if (toastTimer.current) clearTimeout(toastTimer.current);
               toastTimer.current = setTimeout(() => {
                    Animated.timing(toastY, {
                         toValue: -80,
                         duration: 200,
                         easing: Easing.in(Easing.cubic),
                         useNativeDriver: true,
                    }).start(() => setToastMsg(null));
               }, 1400);
          });
     };

     React.useEffect(() => {
          const sub = DeviceEventEmitter.addListener('option-panel-toast', (payload) => {
               const msg = typeof payload === 'string' ? payload : payload?.message;
               if (!msg) return;
               showToast(String(msg));
          });
          return () => {
               // @ts-ignore
               sub?.remove?.();
          };
     }, []);

     const releaseButtons = () => {
          if (unlockTimerRef.current) {
               clearTimeout(unlockTimerRef.current);
               unlockTimerRef.current = null;
          }
          setButtonsLocked(false);
     };

     const lockButtons = (duration = 1500) => {
          if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
          setButtonsLocked(true);
          unlockTimerRef.current = setTimeout(() => {
               unlockTimerRef.current = null;
               setButtonsLocked(false);
          }, duration);
     };

     const handlePress = (side: BuyOrSell) => {
          if (buttonsLocked) return;
          lockButtons();
          const isBuy = side === 'BUY';
          runPressAnimation(isBuy ? buyScale : sellScale);

          if (!selectedTicker?.symbol || !socket || !lastchartData) {
               releaseButtons();
               return;
          }
          if (effectiveBalance === 0) {
               showToast('Balance is zero');
               releaseButtons();
               return;
          }
          if (amount === 0) {
               showToast('Set amount please');
               releaseButtons();
               return;
          }
          if (amount > effectiveBalance) {
               showToast('Amount exceeds your balance');
               releaseButtons();
               return;
          }
          const last = lastchartData;
          const openTime = Math.floor(last.time / 1000);
          const closeTime = openTime + timer;
          const initialPrice = last.value;
          socket.emit(
               'openTrade',
               {
                    buyOrSell: side,
                    closeTime,
                    openTime,
                    amount,
                    mode,
                    pair: selectedTicker.symbol,
                    initialPrice,
                    percentage: payout,
               },
               (err: any, res: any) => {
                    releaseButtons();
                    if (err) {
                         showToast('Trade failed, please retry');
                         return;
                    }
                    // optimistically show marker on chart
                    DeviceEventEmitter.emit('chart-trade', {
                         side,
                         amount,
                         time: openTime * 1000,
                         openTime: openTime * 1000,
                         closeTime: closeTime * 1000,
                         price: initialPrice,
                    });
               }
          );
     };

     React.useEffect(() => {
          return () => {
               if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
               if (aiTypingTimerRef.current) clearInterval(aiTypingTimerRef.current);
          };
     }, []);



     React.useEffect(() => {
          lastChartRef.current = lastchartData;
     }, [lastchartData]);


     React.useEffect(() => {
          balanceRef.current = effectiveBalance;
     }, [effectiveBalance]);

     const matchPendingOpen = (tradeIndex: number, openTimeValue: any, amountValue: any) => {
          const openMs = normalizeEpochMs(openTimeValue) ?? Number(openTimeValue);
          const pending = aiPendingRef.current.find(
               (p) =>
                    !p.tradeIndex &&
                    ((Number.isFinite(openMs) && Math.abs(openMs - p.openTimeMs) <= 5000) ||
                         (amountValue != null && Math.abs(Number(amountValue) - p.stake) < 1e-3))
          );
          if (pending) pending.tradeIndex = tradeIndex;
     };

     const settlePendingResult = (payload: { tradeIndex: number; openTime: any; isWin: boolean; winAmount: number }) => {
          const openMs = normalizeEpochMs(payload.openTime) ?? Number(payload.openTime);
          let pending =
               aiPendingRef.current.find(
                    (p) =>
                         (p.tradeIndex && p.tradeIndex === payload.tradeIndex) ||
                         (Number.isFinite(openMs) && Math.abs(openMs - p.openTimeMs) <= 5000)
               ) || aiPendingRef.current[0];
          if (!pending) return;
          if (pending.timeout) clearTimeout(pending.timeout);
          pending.resolve({ settled: true, isWin: payload.isWin, winAmount: payload.winAmount });
          aiPendingRef.current = aiPendingRef.current.filter((p) => p.id !== pending.id);
     };

     React.useEffect(() => {
          if (!socket) return undefined;
          const onOpened = (data: any) => {
               if (!data) return;
               matchPendingOpen(data.tradeIndex, data.openTime, data.amount);
          };
          const onResult = (result: any) => {
               if (!result) return;
               settlePendingResult({
                    tradeIndex: result.tradeIndex,
                    openTime: result.openTime,
                    isWin: !!result.isWin,
                    winAmount: Number(result.winAmount || 0),
               });
          };
          socket.on('tradeOpened', onOpened);
          socket.on('tradeResult', onResult);
          return () => {
               socket.off('tradeOpened', onOpened);
               socket.off('tradeResult', onResult);
          };
     }, [socket]);

     useEffect(() => {
          return () => {
               aiPendingRef.current.forEach((p) => {
                    if (p.timeout) clearTimeout(p.timeout);
               });
               aiPendingRef.current = [];
               aiSessionRef.current.running = false;
          };
     }, []);

     return (
          <View style={styles.container}>
               {toastMsg && (
                    <Animated.View
                         style={[
                              styles.toast,
                              {
                                   transform: [{ translateY: toastY }],
                              },
                         ]}
                    >
                         <View style={styles.toastRow}>
                              <MaterialIcons name="warning-amber" size={18} color="#FCD34D" style={styles.toastIcon} />
                              <Text style={styles.toastText}>{toastMsg}</Text>
                         </View>
                    </Animated.View>
               )}
               <View style={styles.innerContainer}>

                    {/* BUY button */}
                    <Animated.View
                         style={{
                              transform: [{ scale: buyScale }],
                         }}
                    >
                         <TouchableOpacity
                              activeOpacity={0.8}
                              disabled={buttonsLocked}
                              onPress={() => handlePress('BUY')}
                              style={[
                                   styles.actionButton,
                                   styles.buyButton,
                              ]}
                         >
                              <LinearGradient
                                   colors={['#0b1f13', '#0f3d27', '#165835']}
                                   start={{ x: 0, y: 0 }}
                                   end={{ x: 1, y: 1 }}
                                   style={styles.buyGradient}
                              >
                                   <View style={styles.buyContent}>
                                        <MaterialIcons name="trending-up" size={18} style={styles.sideIcon} color="#34D399" />
                                        <Text style={[styles.actionLabel, { color: '#34D399' }]}>Buy</Text>
                                   </View>
                              </LinearGradient>
                         </TouchableOpacity>
                    </Animated.View>
                    {/* SELL button */}
                    <Animated.View
                         style={{
                              transform: [{ scale: sellScale }],
                         }}
                    >
                         <TouchableOpacity
                              activeOpacity={0.8}
                              disabled={buttonsLocked}
                              onPress={() => handlePress('SELL')}
                              style={[
                                   styles.actionButton,
                                   styles.sellButton,
                              ]}
                         >
                              <LinearGradient
                                   colors={['#260909', '#4a0f0f', '#751616']}
                                   start={{ x: 0, y: 0 }}
                                   end={{ x: 1, y: 1 }}
                                   style={styles.sellGradient}
                              >
                                   <View style={styles.sellContent}>
                                        <MaterialIcons name="trending-down" size={18} style={styles.sideIcon} color="#F87171" />
                                        <Text style={[styles.actionLabel, { color: '#F87171' }]}>Sell</Text>
                                   </View>
                              </LinearGradient>
                         </TouchableOpacity>
                    </Animated.View>
               </View>
          </View>
     );
};

export default OptionPanel;

const styles = StyleSheet.create({
     container: {
          width: '100%',
          paddingHorizontal: 4,
     },
     innerContainer: {
          position: 'relative',
          width: '100%',
          innerHeight: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
     } as any, // "gap" requires RN 0.71+, otherwise use margin
     toast: {
          position: 'absolute',
          top: 10,
          alignSelf: 'center',
          minWidth: 390,
          maxWidth: 480,
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 12,
          backgroundColor: 'rgba(251,191,36,0.85)',
          zIndex: 99999,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
     },
     toastText: {
          color: '#0a0600ff',
          fontSize: 13,
          fontWeight: '600',
          textAlign: 'left',
     },
     toastRow: {
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
     },
     toastIcon: {
          marginRight: 8,
     },
     actionButton: {
          height: 40,
          width: 92,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 2,
          ...Platform.select({
               web: {
                    boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
               },
               default: {
                    shadowColor: '#000',
                    shadowOpacity: 0.18,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 3 },
                    elevation: 6,
               },
          }),
          position: 'relative',
          borderWidth: 0,
     },
     buyButton: {
          backgroundColor: 'transparent',
     },
     buyGradient: {
          width: '100%',
          height: '100%',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
     },
     sellButton: {
          backgroundColor: 'transparent',
     },
     sellGradient: {
          width: '100%',
          height: '100%',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
     },
     actionButtonDisabled: {
          transform: [{ scale: 1.05 }],
          opacity: 0.9,
     },
     buyContent: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          paddingLeft: 6,
     },
     sellContent: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          paddingLeft: 6,
     },
     sideIcon: {
          position: 'absolute',
          left: 10,
     },
     actionLabel: {
          fontSize: 13,
          fontWeight: '500',
     },
     mobileToolbar: {
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 8,
          marginBottom: 16,
     },
     aiToggle: {
          position: 'absolute',
          bottom: -40,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: 'rgba(250,204,21,0.4)',
          backgroundColor: 'rgba(250,204,21,0.08)',
     },
     aiToggleActive: {
          backgroundColor: '#FACC15',
          borderColor: '#EAB308',
     },
     aiToggleText: {
          color: '#FACC15',
          fontWeight: '600',
          fontSize: 10,
     },
     aiToggleTextActive: {
          color: '#0B1324',
     },
     aiOptions: {
          width: '100%',
          gap: 6,
     },
     aiButton: {
          borderRadius: 10,
          overflow: 'hidden',
     },
     aiButtonGradient: {
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 10,
          width: 92,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

     },
     aiButtonContent: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
     },
     aiButtonTextWrap: {
          flexDirection: 'column',
          gap: 1,
     },
     aiButtonText: {
          color: '#FACC15',
          fontWeight: '700',
          fontSize: 13,
     },
     aiButtonTextCoice: {
          fontSize: 11,
          color: '#fdea9dff',
          fontWeight: '500',
     },
     aiButtonSub: {
          color: '#E5E7EB',
          fontWeight: '400',
          fontSize: 11,
     },
     aiWriterPanel: {
          width: '100%',
          padding: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: 'rgba(250,204,21,0.35)',
          backgroundColor: 'rgba(15,23,42,0.8)',
          gap: 8,
     },
     aiWriterHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
     },
     aiWriterTitle: {
          color: '#FACC15',
          fontWeight: '700',
          fontSize: 13,
     },
     aiWriterText: {
          color: '#E5E7EB',
          fontSize: 12,
          lineHeight: 18,
     },
     toolbarButton: {
          backgroundColor: '#1F2937',
          padding: 6,
          borderRadius: 4,
     },
     toolbarIcon: {
          color: '#9CA3AF',
     },
});
