import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, DeviceEventEmitter, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RootState } from '../../store';
import {
     openTrade as openTradeAction,
     setAiActive as setAiActiveAction,
     toggleAiMode,
} from '../../store/slices/tradingRoomSlices/tradeSlice';
import { useToast } from '../../utils/toast';
import { getSocketByMode } from '../../config/env';
import { normalizeEpochMs } from '../../utils/time';

type AIOptions = 'Cautious' | 'Moderate' | 'Aggressive';
type BuyOrSell = 'BUY' | 'SELL';

const AI_MESSAGE = 'AI manages strategies to reach desired profit levels.';
const SESSION_MAX_TRADES = 10;

type AISession = {
     running: boolean;
     choice: AIOptions | null;
     initialAmount: number;
     pool: number;
     totalWon: number;
     totalLost: number;
     gain: number; // totalWon - totalLost
     targetPct: number;
     targetGain: number;
     maxTrades: number;
     tradesOpened: number;
     nextOpenAfterMs: number;
};

type CurrentTrade = {
     side: BuyOrSell;
     stake: number;
     openTimeMs: number;
     tradeIndex?: number;
     confirmed: boolean;
};

const AiPanel: React.FC = () => {
     const dispatch = useDispatch();
     const { amount, timer, aiActive, aiMode, payOutPercentage } = useSelector((s: RootState) => s.trade);
     const { activeTicker, activeTickerBonus, activeTickerDemo } = useSelector((s: RootState) => s.ticker);
     const { mode } = useSelector((s: RootState) => s.tradingRoom);
     const { lastchartData } = useSelector((s: RootState) => s.chart);
     const { balance, demoBalance, bonusBalance } = useSelector((s: RootState) => s.user);
     const selectedTicker =
          mode === 'demo' ? activeTickerDemo : mode === 'bonus' ? activeTickerBonus : activeTicker;
     const effectiveBalance =
          mode === 'demo' ? demoBalance : mode === 'bonus' ? bonusBalance : balance;
     const payout =
          selectedTicker?.payoutPercentage != null ? selectedTicker.payoutPercentage : payOutPercentage;
     const socket = getSocketByMode(mode);

     const [aiChoice, setAiChoice] = useState<AIOptions | null>(null);
     const [showAiOptions, setShowAiOptions] = useState(true);
     const [isWaiting, setIsWaiting] = useState(false);
     const [aiTypingText, setAiTypingText] = useState(AI_MESSAGE);
     const aiTypingTextRef = useRef(AI_MESSAGE);
     const aiTypingTimerRef = useRef<NodeJS.Timeout | null>(null);
     const aiLogRef = useRef(AI_MESSAGE);
     const aiSessionRef = useRef<AISession>({
          running: false,
          choice: null,
          initialAmount: 0,
          pool: 0,
          totalWon: 0,
          totalLost: 0,
          gain: 0,
          targetPct: 0,
          targetGain: 0,
          maxTrades: Infinity,
          tradesOpened: 0,
          nextOpenAfterMs: 0,
     });
     const currentTradeRef = useRef<CurrentTrade | null>(null);

     const selectedSymbolRef = useRef<string | undefined>(selectedTicker?.symbol);
     const lastChartRef = useRef(lastchartData);
     const effectiveBalanceRef = useRef(effectiveBalance);
     const payoutRef = useRef(payout);
     const timerRef = useRef(timer);
     const modeRef = useRef(mode);
     const socketRef = useRef(socket);
     const logScrollRef = useRef<any>(null);

     const { toastNode, showToast } = useToast();

     useEffect(() => {
          aiTypingTextRef.current = aiTypingText;
          logScrollRef.current?.scrollToEnd?.({ animated: false });
     }, [aiTypingText]);

     useEffect(() => {
          selectedSymbolRef.current = selectedTicker?.symbol;
     }, [selectedTicker?.symbol]);

     useEffect(() => {
          lastChartRef.current = lastchartData;
     }, [lastchartData]);

     useEffect(() => {
          effectiveBalanceRef.current = effectiveBalance;
     }, [effectiveBalance]);

     useEffect(() => {
          payoutRef.current = payout;
     }, [payout]);

     useEffect(() => {
          timerRef.current = timer;
     }, [timer]);

     useEffect(() => {
          modeRef.current = mode;
     }, [mode]);

     useEffect(() => {
          socketRef.current = socket;
     }, [socket]);

     const startTypingTo = (text: string) => {
          if (aiTypingTimerRef.current) clearInterval(aiTypingTimerRef.current);
          let idx = Math.min(aiTypingTextRef.current.length, text.length);
          if (idx >= text.length) {
               setAiTypingText(text);
               return;
          }
          aiTypingTimerRef.current = setInterval(() => {
               idx += 1;
               setAiTypingText(text.slice(0, idx));
               if (idx >= text.length && aiTypingTimerRef.current) {
                    clearInterval(aiTypingTimerRef.current);
                    aiTypingTimerRef.current = null;
               }
          }, 14);
     };

     const setAiLogBase = (text: string) => {
          aiLogRef.current = text;
          if (aiTypingTimerRef.current) clearInterval(aiTypingTimerRef.current);
          aiTypingTimerRef.current = null;
          setAiTypingText(text);
     };

     const appendAiLog = (line: string) => {
          const next = aiLogRef.current ? `${aiLogRef.current}\n${line}` : line;
          aiLogRef.current = next;
          startTypingTo(next);
     };

     const formatSigned = (value: number) => {
          const rounded = Math.round(value);
          const sign = rounded >= 0 ? '+' : '-';
          return `${sign}$${Math.abs(rounded)}`;
     };

     const formatBestEffort = (totalGain: number) => {
          const rounded = Math.round(totalGain);
          if (rounded >= 0) return `Win amount is $${rounded} during AI trading`;
          return `Lose amount is -$${Math.abs(rounded)} during AI trading`;
     };

     const stopSession = (finalLine: string) => {
          aiSessionRef.current.running = false;
          currentTradeRef.current = null;
          dispatch(setAiActiveAction(false));
          setShowAiOptions(false);
          setIsWaiting(false);
          appendAiLog(finalLine);
     };

     const pickRandomInt = (min: number, max: number) => {
          const lo = Math.min(min, max);
          const hi = Math.max(min, max);
          return Math.floor(Math.random() * (hi - lo + 1)) + lo;
     };

     const openNextTrade = () => {
          const session = aiSessionRef.current;
          if (!session.running) return;

          const nowMs = Date.now();
          if (session.nextOpenAfterMs && nowMs < session.nextOpenAfterMs) {
               setIsWaiting(true);
               setTimeout(openNextTrade, Math.max(150, session.nextOpenAfterMs - nowMs));
               return;
          }

          setIsWaiting(false);

          if (session.gain >= session.targetGain && session.targetGain > 0) {
               stopSession(
                    `${session.targetPct}% profit goal reached. ${formatBestEffort(session.gain)}`
               );
               return;
          }

          if (session.pool <= 0) {
               stopSession(formatBestEffort(session.gain));
               return;
          }

          if (session.tradesOpened >= session.maxTrades) {
               stopSession(`Max trade numbers reached (${session.maxTrades}). ${formatBestEffort(session.gain)}`);
               return;
          }

          const symbol = selectedSymbolRef.current;
          const sock = socketRef.current;
          const last = lastChartRef.current;
          if (!symbol || !sock || !last) {
               stopSession(formatBestEffort(session.gain));
               return;
          }

          if (currentTradeRef.current) return; // wait for current trade to settle

          const poolInt = Math.max(0, Math.floor(session.pool));
          const maxStakeByPool = Math.max(1, Math.floor(poolInt / 2));
          const minStakeByPool = Math.max(1, Math.floor(poolInt / 10));
          let stake = pickRandomInt(minStakeByPool, maxStakeByPool);
          stake = Math.min(stake, poolInt);

          const balanceInt = Math.max(0, Math.floor(effectiveBalanceRef.current));
          stake = Math.min(stake, balanceInt);
          if (stake <= 0) {
               stopSession(formatBestEffort(session.gain));
               return;
          }

          const side: BuyOrSell = Math.random() < 0.5 ? 'BUY' : 'SELL';
          const openTimeSec = Math.floor(last.time / 1000);
          const closeTimeSec = openTimeSec + timerRef.current;
          const initialPrice = last.value;

          currentTradeRef.current = {
               side,
               stake,
               openTimeMs: openTimeSec * 1000,
               confirmed: false,
          };
          session.tradesOpened += 1;
          session.pool = Math.max(0, Math.round(session.pool - stake));

          sock.emit(
               'openTrade',
               {
                    buyOrSell: side,
                    closeTime: closeTimeSec,
                    openTime: openTimeSec,
                    amount: stake,
                    mode: modeRef.current,
                    pair: symbol,
                    initialPrice,
                    percentage: payoutRef.current,
               },
               (err: any) => {
                    if (err) {
                         session.pool = Math.round(session.pool + stake);
                         session.tradesOpened = Math.max(0, session.tradesOpened - 1);
                         showToast('Trade failed, please retry');
                         stopSession(formatBestEffort(aiSessionRef.current.gain));
                         return;
                    }
                    DeviceEventEmitter.emit('chart-trade', {
                         side,
                         amount: stake,
                         time: openTimeSec * 1000,
                         openTime: openTimeSec * 1000,
                         closeTime: closeTimeSec * 1000,
                         price: initialPrice,
                    });
               }
          );
     };

     useEffect(() => {
          return () => {
               if (aiTypingTimerRef.current) clearInterval(aiTypingTimerRef.current);
          };
     }, []);

     useEffect(() => {
          setAiLogBase(AI_MESSAGE);
     }, []);

     React.useEffect(() => {
          if (!socket) return;
          const onTradeOpened = (data: any) => {
               if (!data || data.pair !== selectedSymbolRef.current) return;
               const side = String(data.buyOrSell || '').toUpperCase() as BuyOrSell;
               const openMs = normalizeEpochMs(data.openTime);
               const closeMs = normalizeEpochMs(data.closeTime);

               const session = aiSessionRef.current;
               const current = currentTradeRef.current;
               if (session.running && current && !current.confirmed) {
                    const openedMs = normalizeEpochMs(data.openTime);
                    const openedAmount = Math.round(Number(data.amount));
                    const matchesTime =
                         openedMs != null && Math.abs(openedMs - current.openTimeMs) <= 5000;
                    const matchesSide = side === current.side;
                    const matchesAmount = Number.isFinite(openedAmount) && openedAmount === current.stake;
                    if (matchesTime && matchesSide && matchesAmount) {
                         current.confirmed = true;
                         current.tradeIndex = data.tradeIndex;
                         appendAiLog(`${side.toLowerCase()} trade amount $${current.stake}`);
                    }
               }

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
          const onTradeResult = (result: any) => {
               if (!result || result.pair !== selectedSymbolRef.current) return;

               const session = aiSessionRef.current;
               const current = currentTradeRef.current;
               if (session.running && current) {
                    const resultOpenMs = normalizeEpochMs(result.openTime);
                    const matchesIndex =
                         current.tradeIndex != null &&
                         result.tradeIndex != null &&
                         Number(result.tradeIndex) === Number(current.tradeIndex);
                    const matchesTime =
                         resultOpenMs != null && Math.abs(resultOpenMs - current.openTimeMs) <= 5000;
                    if (matchesIndex || matchesTime) {
                         const isWin = !!result.isWin;
                         const payoutPct = Number(payoutRef.current);
                         const winAmountAbs = Math.abs(Math.round(Number(result.winAmount ?? 0)));
                         const stake = Math.round(current.stake);

                         const expectedProfit = Number.isFinite(payoutPct) && payoutPct > 0
                              ? Math.round((stake * payoutPct) / 100)
                              : null;
                         const expectedPayout =
                              expectedProfit != null ? stake + expectedProfit : null;

                         let profitAmount = winAmountAbs;
                         if (expectedProfit != null && expectedPayout != null) {
                              const diffProfit = Math.abs(winAmountAbs - expectedProfit);
                              const diffPayout = Math.abs(winAmountAbs - expectedPayout);
                              if (diffPayout < diffProfit) profitAmount = Math.max(0, winAmountAbs - stake);
                         } else if (winAmountAbs > stake) {
                              profitAmount = Math.max(0, winAmountAbs - stake);
                         }

                         const lossAmount = stake;
                         const delta = isWin ? profitAmount : -lossAmount;

                         if (isWin) {
                              session.totalWon = Math.round(session.totalWon + profitAmount);
                              session.pool = Math.round(session.pool + stake + profitAmount);
                         } else {
                              session.totalLost = Math.round(session.totalLost + lossAmount);
                         }
                         session.gain = Math.round(session.totalWon - session.totalLost);
                         appendAiLog(` ${isWin ? 'win' : 'lose'}  amount ${formatSigned(delta)}`);
                         currentTradeRef.current = null;

                         const waitSeconds = pickRandomInt(3, 10);
                         session.nextOpenAfterMs = Date.now() + waitSeconds * 1000;
                         setIsWaiting(true);
                         openNextTrade();
                    }
               }

               DeviceEventEmitter.emit('chart-trade-result', {
                    closeTime: normalizeEpochMs(result.closeTime),
                    openTime: normalizeEpochMs(result.openTime),
                    finalPrice: Number(result.finalPrice),
                    isWin: !!result.isWin,
                    winAmount: Number(result.winAmount),
                    tradeIndex: result.tradeIndex,
               });
          };
          socket.on('tradeOpened', onTradeOpened);
          socket.on('tradeResult', onTradeResult);
          return () => {
               socket.off('tradeOpened', onTradeOpened);
               socket.off('tradeResult', onTradeResult);
          };
     }, [socket, dispatch]);

     const handleChoice = (choice: AIOptions) => {
          const amt = Number(amount);
          if (choice === 'Cautious' && (!Number.isFinite(amt) || amt < 50)) {
               showToast('Min amount for Conservative is 50');
               return;
          }
          if (choice === 'Moderate' && (!Number.isFinite(amt) || amt < 100)) {
               showToast('Min amount for Moderate is 100');
               return;
          }
          if (choice === 'Aggressive' && (!Number.isFinite(amt) || amt < 500)) {
               showToast('Min amount for Aggressive is 500');
               return;
          }
          setAiChoice(choice);
     };

     const startAiTrading = async () => {
          if (!aiChoice) {
               showToast('Choose an AI preset first');
               return;
          }
          const rawAmount = Number(amount);
          const amt = Math.floor(rawAmount);
          if (Number.isFinite(rawAmount) && rawAmount !== amt) {
               showToast('No decimal amounts are acceptable');
               return;
          }
          if (aiChoice === 'Cautious' && (!Number.isFinite(rawAmount) || rawAmount < 50)) {
               showToast('Min amount for Conservative is 50');
               return;
          }
          if (aiChoice === 'Moderate' && (!Number.isFinite(rawAmount) || rawAmount < 100)) {
               showToast('Min amount for Moderate is 100');
               return;
          }
          if (aiChoice === 'Aggressive' && (!Number.isFinite(rawAmount) || rawAmount < 500)) {
               showToast('Min amount for Aggressive is 500');
               return;
          }

          if (!selectedTicker?.symbol || !socket || !lastchartData) {
               showToast('Select a ticker first');
               return;
          }
          if (effectiveBalance === 0) {
               showToast('Balance is zero');
               return;
          }
          if (!Number.isFinite(rawAmount) || rawAmount <= 0 || amt <= 0) {
               showToast('Set amount please');
               return;
          }
          if (amt > effectiveBalance) {
               showToast('Amount exceeds your balance');
               return;
          }

          const targets: Record<AIOptions, { pct: number; maxTrades: number }> = {
               Cautious: { pct: 25, maxTrades: SESSION_MAX_TRADES },
               Moderate: { pct: 40, maxTrades: SESSION_MAX_TRADES },
               Aggressive: { pct: 55, maxTrades: SESSION_MAX_TRADES },
          };

          const { pct, maxTrades: choiceMaxTrades } = targets[aiChoice];
          const maxTrades = Math.min(choiceMaxTrades, SESSION_MAX_TRADES);
          const targetGain = Math.round((amt * pct) / 100);

          aiSessionRef.current = {
               running: true,
               choice: aiChoice,
               initialAmount: amt,
               pool: amt,
               totalWon: 0,
               totalLost: 0,
               gain: 0,
               targetPct: pct,
               targetGain,
               maxTrades,
               tradesOpened: 0,
               nextOpenAfterMs: 0,
          };
          currentTradeRef.current = null;

          dispatch(setAiActiveAction(true));
          setShowAiOptions(false);
          setIsWaiting(false);
          setAiLogBase(AI_MESSAGE);
          appendAiLog('AI started…');
          openNextTrade();
     };

     const stopAiTrading = async () => {
          if (aiSessionRef.current.running) {
               stopSession(formatBestEffort(aiSessionRef.current.gain));
               return;
          }
          dispatch(setAiActiveAction(false));
          currentTradeRef.current = null;
          setShowAiOptions(false);
          setIsWaiting(false);
          appendAiLog('AI stopped.');
     };

     const handleBackToManual = () => {
          aiSessionRef.current.running = false;
          currentTradeRef.current = null;
          dispatch(setAiActiveAction(false));
          if (aiMode) dispatch(toggleAiMode());
          setAiChoice(null);
          setShowAiOptions(true);
          setIsWaiting(false);
     };

     return (
          <View style={styles.container}>
               {toastNode}
               <View style={styles.aiPanel}>
                    <View style={styles.aiWriterHeader}>
                         <MaterialIcons name="smart-toy" size={18} color="#FACC15" />
                         <Text style={styles.aiWriterTitle}>AI Assistant</Text>
                         <View style={{ flex: 1 }} />
                         {aiActive ? (
                              <TouchableOpacity style={styles.stopButton} onPress={stopAiTrading}>
                                   <MaterialIcons name="stop-circle" size={18} color="#FCD34D" />
                                   <Text style={styles.stopButtonText}>Stop</Text>
                              </TouchableOpacity>
                         ) : (
                              <TouchableOpacity style={styles.backButton} onPress={handleBackToManual}>
                                   <MaterialIcons name="arrow-back" size={18} color="#FCD34D" />
                                   <Text style={styles.stopButtonText}>Manual</Text>
                              </TouchableOpacity>
                         )}
                    </View>

                    <ScrollView
                         ref={logScrollRef}
                         style={styles.aiLogScroll}
                         contentContainerStyle={styles.aiLogContent}
                         onContentSizeChange={() => logScrollRef.current?.scrollToEnd?.({ animated: false })}
                    >
                         <Text style={styles.aiWriterText}>
                              {aiTypingText.split('\n').map((line, idx, arr) => {
                                   const isGoalLine = line.toLowerCase().includes('goal reached');
                                   const suffix = idx < arr.length - 1 ? '\n' : '';
                                   return (
                                        <Text key={`${idx}-${line}`} style={isGoalLine ? styles.aiGoalText : undefined}>
                                             {line + suffix}
                                        </Text>
                                   );
                              })}
                         </Text>
                         {aiActive && isWaiting ? (
                              <View style={styles.waitingRow}>
                                   <ActivityIndicator size="small" color="#FACC15" />
                                   <Text style={styles.waitingText}>Waiting…</Text>
                              </View>
                         ) : null}
                    </ScrollView>
                    {!aiActive && showAiOptions ? (
                         <View style={styles.aiOptions}>
                              <Text style={styles.aiIntro}>Choose an AI trading mode.</Text>
                              {(['Cautious', 'Moderate', 'Aggressive'] as const).map((opt) => {
                                   const isSelected = aiChoice === opt;
                                   return (
                                        <TouchableOpacity key={opt} style={[styles.aiButton, isSelected && styles.aiButtonSelected]} onPress={() => handleChoice(opt)}>
                                             <LinearGradient
                                                  colors={['#0f172a', '#111827']}
                                                  start={{ x: 0, y: 0 }}
                                                  end={{ x: 1, y: 1 }}
                                                  style={styles.aiButtonGradient}
                                             >
                                                  <View style={styles.aiButtonContent}>
                                                       <View style={styles.aiButtonTextWrap}>
                                                            <Text style={styles.aiButtonText}>{opt}</Text>
                                                       </View>
                                                       {isSelected && <MaterialIcons name="check-circle" size={16} color="#FACC15" style={{ marginLeft: 6 }} />}
                                                  </View>
                                             </LinearGradient>
                                        </TouchableOpacity>
                                   );
                              })}
                              <TouchableOpacity style={[styles.startButton, !aiChoice && styles.startButtonDisabled]} disabled={!aiChoice} onPress={startAiTrading}>
                                   <LinearGradient
                                        colors={['#0f172a', '#1955d6ff']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.startButtonGradient}
                                   >
                                        <View style={styles.aiButtonContent}>
                                             <MaterialIcons name="insights" size={20} color="#1955d6ff" />
                                             <View style={styles.aiButtonTextWrap}>
                                                  <Text style={styles.aiButtonText}>Start</Text>
                                             </View>
                                        </View>
                                   </LinearGradient>
                              </TouchableOpacity>
                         </View>
                    ) : null}
               </View>
          </View>
     );
};

export default AiPanel;

const styles = StyleSheet.create({
     container: {
          width: '100%',
          paddingHorizontal: 4,
          paddingTop: 8,
     },
     aiPanel: {
          width: '100%',
          padding: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: 'rgba(250,204,21,0.35)',
          backgroundColor: 'rgba(15,23,42,0.8)',
          gap: 12,
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
     aiGoalText: {
          color: '#FACC15',
          fontSize: 15,
          fontWeight: '800',
     },
     aiLogScroll: {
          maxHeight: 150,
     },
     aiLogContent: {
          paddingBottom: 2,
     },
     aiIntro: {
          color: '#E5E7EB',
          fontSize: 12,
          marginBottom: 4,
     },
     aiOptions: {
          width: '100%',
          gap: 8,
     },
     aiButton: {
          borderRadius: 10,
     },
     aiButtonSelected: {
          borderWidth: 1,
          borderColor: 'rgba(250,204,21,0.4)',
     },
     aiButtonGradient: {
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 10,
          width: '100%',
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
     startButton: {
          borderRadius: 10,
          overflow: 'hidden',
     },
     startButtonDisabled: {
          opacity: 0.6,
     },
     startButtonGradient: {
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 10,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
     },
     stopButton: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 8,
          backgroundColor: 'rgba(250,204,21,0.12)',
     },
     backButton: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 8,
          backgroundColor: 'rgba(250,204,21,0.1)',
     },
     stopButtonText: {
          color: '#FCD34D',
          fontWeight: '700',
          fontSize: 11,
     },
     waitingRow: {
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
     },
     waitingText: {
          color: '#FCD34D',
          fontWeight: '600',
          fontSize: 11,
     },
});
