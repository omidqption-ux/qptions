import React, { useMemo, useRef, useState } from 'react';
import {
     View,
     Text,
     TouchableOpacity,
     StyleSheet,
     Modal,
     Pressable,
     useWindowDimensions,
     Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import TimeSmall from './TimeSmall';
import { playClick } from '../../utils/sounds';
import { RootState } from '../../store'
import { setTimer } from '../../store/slices/tradingRoomSlices/tradeSlice';
import { getModeAccent, hexToRgba } from '../../theme/modeAccent';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface TimeBoxProps { }

const TimeBox: React.FC<TimeBoxProps> = () => {
     const dispatch = useDispatch();
     const { timer } = useSelector((store: RootState) => store.trade);
     const { userSettings } = useSelector((store: RootState) => store.user);
     const mode = useSelector((store: RootState) => store.tradingRoom.mode);
     const accent = useMemo(() => getModeAccent(mode), [mode]);
     const [open, setOpen] = useState(false);
     const buttonScales = useRef<Record<string, Animated.Value>>({});
     const [anchor, setAnchor] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
     const [cardSize, setCardSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
     const timeRef = useRef<View | null>(null);
     const { width: screenWidth, height: screenHeight } = useWindowDimensions();
     const holdIntervals = useRef<Record<string, NodeJS.Timeout | null>>({}).current;
     const holdTimeouts = useRef<Record<string, NodeJS.Timeout | null>>({}).current;
     const timerRef = useRef(timer);

     React.useEffect(() => {
          timerRef.current = timer;
     }, [timer]);

     React.useEffect(() => {
          // reset timer to default when switching trading mode
          dispatch(setTimer({ timer: 5 }));
          setOpen(false);
          setAnchor(null);
     }, [dispatch, mode]);

     React.useEffect(() => {
          return () => {
               Object.values(holdIntervals).forEach((i) => i && clearInterval(i));
               Object.values(holdTimeouts).forEach((t) => t && clearTimeout(t));
          };
     }, []);

     const adjustTimer = (delta: number) => {
          const base = timerRef.current ?? timer;
          if (delta === -3600 && base < 3600) return;
          if (delta === -60 && base < 60) return;
          const next = Math.max(5, Math.min(14400, base + delta)); // clamp between 5s and 4h
          dispatch(setTimer({ timer: next }));
          userSettings?.soundControl?.notification && playClick();
     };

     const startHold = (key: string, delta: number) => {
          // immediate adjustment for taps
          adjustTimer(delta);
          // kick off rapid repeat after a short delay
          holdTimeouts[key] = setTimeout(() => {
               holdIntervals[key] = setInterval(() => adjustTimer(delta), 50);
          }, 150);
     };
     const stopHold = (key: string) => {
          const i = holdIntervals[key];
          if (i) clearInterval(i);
          holdIntervals[key] = null;
          const t = holdTimeouts[key];
          if (t) clearTimeout(t);
          holdTimeouts[key] = null;
     };

     const getScale = (key: string) => {
          if (!buttonScales.current[key]) {
               buttonScales.current[key] = new Animated.Value(1);
          }
          return buttonScales.current[key];
     };

     const animatePress = (key: string, toValue: number) => {
          Animated.spring(getScale(key), {
               toValue,
               useNativeDriver: true,
               speed: 18,
               bounciness: 6,
          }).start();
     };

     const handlePressIn = (key: string, delta: number) => {
          animatePress(key, 0.9);
          startHold(key, delta);
     };

     const handlePressOut = (key: string) => {
          animatePress(key, 1);
          stopHold(key);
     };

     const handleOpen = () => {
          timeRef.current?.measureInWindow?.((x, y, width, height) => {
               setAnchor({ x, y, width, height });
               setOpen(true);
          }) || setOpen(true);
     };

     const handleClose = () => {
          setOpen(false);
          setAnchor(null);
     };

     const cardLeft = (() => {
          if (!anchor) return 8;
          const maxWidth = cardSize.width || 360;
          const desiredLeft = anchor.x - maxWidth - 12; // place to the left of the timer
          if (desiredLeft >= 8) return desiredLeft;
          // fallback: align to left gutter if not enough space left
          return 8;
     })();
     const cardTop = (() => {
          const gutter = 8;
          if (!anchor) return gutter;
          const estimatedHeight = cardSize.height || 160;
          const centerY = anchor.y + anchor.height / 2;
          const desiredTop = centerY - estimatedHeight / 2;
          return Math.max(gutter, Math.min(screenHeight - estimatedHeight - gutter, desiredTop));
     })();

     const onLayoutCard = (e: any) => {
          const { width, height } = e.nativeEvent.layout;
          if (width !== cardSize.width || height !== cardSize.height) {
               setCardSize({ width, height });
          }
     };

     const hours = Math.floor(timer / 3600);
     const minutes = Math.floor((timer % 3600) / 60);
     const seconds = timer % 60;
     const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

     return (
          <View style={styles.container}>
               {/* Label (desktop-only in web; here always visible) */}
               <View style={styles.labelRow}>
                    <Text style={[styles.labelText, { color: accent.primary }]}>Time</Text>

               </View>

               <TouchableOpacity
                    ref={timeRef}
                    style={styles.timeBox}
                    activeOpacity={0.8}
                    onPress={handleOpen}
               >
                    <MaterialIcons name="hourglass-empty" size={12} color={accent.strong} />
                    <TimeSmall totalSeconds={timer} color={accent.primary} />
               </TouchableOpacity>

               <Modal
                    transparent
                    visible={open}
                    animationType="fade"
                    onRequestClose={handleClose}
               >
                    <Pressable style={styles.modalOverlay} onPress={handleClose}>
                         <Pressable
                              style={[
                                   styles.modalCard,
                                   anchor ? { position: 'absolute', left: cardLeft, top: cardTop } : styles.modalCardDefault,
                              ]}
                              onLayout={onLayoutCard}
                              onPress={(e) => e.stopPropagation()}
                         >
                              <View style={styles.adjustRow}>
                                   {[
                                        { key: 'plusHour', delta: 3600 },
                                        { key: 'plusMin', delta: 60 },
                                        { key: 'plusSec', delta: 1 },
                                   ].map((btn) => (
                                        <AnimatedTouchable
                                             key={btn.key}
                                             style={[
                                                  styles.adjustBtn,
                                                  {
                                                       transform: [{ scale: getScale(btn.key) }],
                                                       borderColor: hexToRgba(accent.strong, 0.5),
                                                       backgroundColor: hexToRgba(accent.strong, 0.14),
                                                  },
                                             ]}
                                             activeOpacity={0.85}
                                             onPressIn={() => handlePressIn(btn.key, btn.delta)}
                                             onPressOut={() => handlePressOut(btn.key)}
                                        >
                                             <MaterialIcons name="add" size={16} color="#E8F0FF" />
                                        </AnimatedTouchable>
                                   ))}
                              </View>

                              <View style={styles.swipeRow}>
                                   <View style={styles.swipeCell}>
                                        <Text style={[styles.swipeValue, { color: accent.primary }]}>{pad(hours)}</Text>
                                   </View>
                                   <Text style={styles.colon}>:</Text>
                                   <View style={styles.swipeCell}>
                                        <Text style={[styles.swipeValue, { color: accent.primary }]}>{pad(minutes)}</Text>
                                   </View>
                                   <Text style={styles.colon}>:</Text>
                                   <View style={styles.swipeCell}>
                                        <Text style={[styles.swipeValue, { color: accent.primary }]}>{pad(seconds)}</Text>
                                   </View>
                              </View>

                              <View style={styles.adjustRow}>
                                   {[
                                        { key: 'minusHour', delta: -3600 },
                                        { key: 'minusMin', delta: -60 },
                                        { key: 'minusSec', delta: -1 },
                                   ].map((btn) => (
                                        <AnimatedTouchable
                                             key={btn.key}
                                             style={[
                                                  styles.adjustBtn,
                                                  {
                                                       transform: [{ scale: getScale(btn.key) }],
                                                       borderColor: hexToRgba(accent.strong, 0.5),
                                                       backgroundColor: hexToRgba(accent.strong, 0.14),
                                                  },
                                             ]}
                                             activeOpacity={0.85}
                                             onPressIn={() => handlePressIn(btn.key, btn.delta)}
                                             onPressOut={() => handlePressOut(btn.key)}
                                        >
                                             <MaterialIcons name="remove" size={16} color="#E8F0FF" />
                                        </AnimatedTouchable>
                                   ))}
                              </View>
                         </Pressable>
                    </Pressable>
               </Modal>

          </View>
     );
};

export default TimeBox;

const styles = StyleSheet.create({
     container: {
          width: '100%',
          paddingHorizontal: 4, // px-1
     },
     labelRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          marginBottom: 4,
     } as any, // if RN < 0.71, replace gap with marginRight on children
     labelText: {
          fontSize: 12,
          fontWeight: '600',
          color: '#AFBCDE',
     },
     timeBox: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.08)', // glassy tint
          borderRadius: 8,
          height: 36,
          gap: 2,
          position: 'relative',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.18)',
     } as any,
     timeText: {
          fontSize: 12,
          fontWeight: '700',
     },
     modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.045)',
     },
     modalCard: {
          maxWidth: 280,
          width: 260,
          backgroundColor: '#05070d',
          borderRadius: 10,
          padding: 8,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)',
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          elevation: 10,
          gap: 6,
     },
     modalCardDefault: {
          marginTop: 8,
          marginLeft: 8,
          alignSelf: 'flex-start',
     },
     adjustRow: {
          flexDirection: 'row',
          gap: 6,
          justifyContent: 'center',
          width: '100%',
          marginVertical: 4,
     },
     adjustBtn: {
          flex: 1,
          minWidth: 0,
          height: 32,
          paddingVertical: 0,
          paddingHorizontal: 0,
          borderRadius: 10,
          backgroundColor: 'rgba(255,255,255,0.15)',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
     },
     adjustLabel: {
          color: '#E8F0FF',
          fontSize: 10,
          fontWeight: '600',
     },
     swipeRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',

     },
     swipeCell: {
          flex: 1,
          minWidth: 0,
          height: 16,
          paddingVertical: 0,
          paddingHorizontal: 0,
          borderRadius: 0,
          borderWidth: 0,
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
     },
     swipeValue: {
          color: '#E8F0FF',
          fontSize: 14,
          fontWeight: '800',
     },
     swipeGhost: {
          color: '#9CA3AF',
          fontSize: 10,
          fontWeight: '600',
     },
     colon: {
          color: '#E8F0FF',
          fontSize: 14,
          fontWeight: '700',
     },
});
