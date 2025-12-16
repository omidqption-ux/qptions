import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
     View,
     Text,
     TextInput,
     StyleSheet,
     Keyboard,
     Animated,
     Modal,
     Pressable,
     TouchableOpacity,
     useWindowDimensions,
     LayoutChangeEvent,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { RootState } from '../../store/index';
import {
     setAmount,
} from '../../store/slices/tradingRoomSlices/tradeSlice'
import { setAmountIsMoreThanBalance } from '../../store/slices/tradingRoomSlices/tradingRoomSlice';
import { formatNumber } from '../../utils/numberFormat';
import { getModeAccent, hexToRgba } from '../../theme/modeAccent';

const QUICK_AMOUNTS = [10, 20, 50, 100, 500, 1000, 5000, 10000, 20000];

interface AmountProps { }

const Amount: React.FC<AmountProps> = () => {
     const dispatch = useDispatch()
     const { amount, amountIsZero, aiActive } = useSelector(
          (store: RootState) => store.trade,
     );
     const { balance, demoBalance, bonusBalance } = useSelector(
          (store: RootState) => store.user,
     );
     const { mode } = useSelector((store: RootState) => store.tradingRoom);
     const [keypadOpen, setKeypadOpen] = useState(false);
     const [amountText, setAmountText] = useState('');
     const [anchor, setAnchor] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
     const [cardSize, setCardSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
     const inputRef = useRef<TextInput | null>(null);
     const { width: screenWidth, height: screenHeight } = useWindowDimensions();
     const accent = useMemo(() => getModeAccent(mode), [mode]);

     const isAIDisabled = aiActive;

     const changeAmount = (raw: string) => {
          if (isAIDisabled) return;
          const digitsOnly = String(raw).replace(/\D+/g, '');
          setAmountText(digitsOnly);

          const numeric = digitsOnly === '' ? 0 : Number(digitsOnly);
          if (!Number.isFinite(numeric)) return;

          const maxAllowed = currentBalance ?? 0;
          if (maxAllowed > 0 && numeric > maxAllowed) {
               dispatch(setAmountIsMoreThanBalance());
               setAmountText(String(maxAllowed));
               dispatch(setAmount({ amount: maxAllowed }));
               return;
          }

          dispatch(setAmount({ amount: numeric }));
     };

     useEffect(() => {
          if (amount === null || amount === undefined) {
               setAmountText('');
               return;
          }
          setAmountText(String(amount));
     }, [amount]);

     useEffect(() => {
          dispatch(setAmount({ amount: 0 }));
          setAmountText('');
     }, [mode, dispatch]);

     const formattedAmount = formatNumber(amount, { maximumFractionDigits: 0 });
     const currentBalance =
          mode === 'demo' ? demoBalance :
               mode === 'bonus' ? bonusBalance : balance;
     const availableBalance = currentBalance || 0;
     const handleOpenKeypad = () => {
          if (isAIDisabled) return;
          if (!availableBalance) {
               dispatch(setAmountIsMoreThanBalance());
               return;
          }
          if (inputRef.current?.measureInWindow) {
               inputRef.current.measureInWindow((x, y, width, height) => {
                    setAnchor({ x, y, width, height });
                    setKeypadOpen(true);
               });
               return;
          }
          setAnchor(null);
          setKeypadOpen(true);
     };
     const handleCloseKeypad = () => {
          setKeypadOpen(false);
          setAnchor(null);
     };
     const handleAppend = (ch: string) => changeAmount(`${amountText}${ch}`);
     const handleBackspace = () => changeAmount(amountText.slice(0, -1));
     const handleClear = () => changeAmount('');
     const handleDone = () => setKeypadOpen(false);
     const handleQuickSelect = (val: number) => {
          if (isAIDisabled) return;
          const safeVal = Math.max(0, Math.floor(val));
          changeAmount(String(safeVal));
          setKeypadOpen(false);
          setAnchor(null);
     };
     const keypadLayout = [
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['0', '⌫'],
     ];

     const cardLeft = (() => {
          if (!anchor) return 8;
          const maxWidth = 240;
          const paddedLeft = Math.max(8, anchor.x);
          return Math.min(paddedLeft, Math.max(8, screenWidth - maxWidth - 8));
     })();
     const cardTop = (() => {
          if (!anchor) return 12;
          const gutter = 8;
          const defaultTop = anchor.y + anchor.height + 6;
          if (!cardSize.height) return defaultTop;
          const spaceBelow = screenHeight - (anchor.y + anchor.height) - gutter;
          if (spaceBelow >= cardSize.height) {
               return defaultTop;
          }
          const aboveTop = anchor.y - cardSize.height - 6;
          if (aboveTop >= gutter) return aboveTop;
          return Math.max(gutter, screenHeight - cardSize.height - gutter);
     })();

     const handleCardLayout = (event: LayoutChangeEvent) => {
          const { width, height } = event.nativeEvent.layout;
          if (width !== cardSize.width || height !== cardSize.height) {
               setCardSize({ width, height });
          }
     };

     useEffect(() => {
          if (isAIDisabled) {
               setKeypadOpen(false);
               setAnchor(null);
          }
     }, [isAIDisabled]);

     return (
          <View style={styles.container}>
               <View style={styles.labelRow}>
                    <Text style={[styles.labelText, { color: accent.primary }]}>Amount</Text>
               </View>

               <Animated.View
                    style={[
                         styles.inputWrapper,
                    ]}
               >
                    <Animated.View style={styles.textInputContainer}>
                         <Text style={[styles.prefix, { color: accent.strong }]}>$</Text>
                         <TextInput
                              ref={inputRef}
                         value={formattedAmount || ''}
                         onChangeText={changeAmount}
                         keyboardType="number-pad"
                         showSoftInputOnFocus={false}
                         onFocus={handleOpenKeypad}
                         onTouchStart={handleOpenKeypad}
                         contextMenuHidden
                         caretHidden
                         selectTextOnFocus={false}
                         editable={!isAIDisabled}
                         style={[
                              styles.textInput,
                              { color: accent.primary },
                              amountIsZero && { color: 'red' },
                              ]}
                              placeholder="10"
                              placeholderTextColor="#6B7280"
                              onBlur={Keyboard.dismiss}
                         />
                    </Animated.View>
               </Animated.View>
               <Modal
                    transparent
                    visible={keypadOpen}
                    animationType="fade"
                    onRequestClose={handleCloseKeypad}
               >
                    <Pressable style={styles.modalOverlay} onPress={handleCloseKeypad}>
                         <Pressable
                              style={[
                                   styles.modalCard,
                                   anchor ? { position: 'absolute', left: cardLeft, top: cardTop } : styles.modalCardDefault,
                              ]}
                              onPress={(e) => e.stopPropagation()}
                              onLayout={handleCardLayout}
                         >
                              <View style={styles.keypad}>
                                   {keypadLayout.map((row) => (
                                        <View key={row.join('')} style={styles.keypadRow}>
                                             {row.map((key) => (
                                                  <TouchableOpacity
                                                       key={key}
                                                       style={styles.keypadKey}
                                                       onPress={() => {
                                                            if (key === '⌫') {
                                                                 handleBackspace();
                                                            } else {
                                                                 handleAppend(key);
                                                            }
                                                       }}
                                                       onLongPress={handleClear}
                                                       activeOpacity={0.85}
                                                  >
                                                       <Text style={styles.keypadKeyText}>{key}</Text>
                                                  </TouchableOpacity>
                                             ))}
                                        </View>
                                   ))}
                                   <View style={styles.keypadActions}>
                                        <TouchableOpacity
                                             style={styles.actionButton}
                                             onPress={handleClear}
                                             activeOpacity={0.85}
                                        >
                                             <Text style={styles.actionText}>Clear</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                             style={[styles.actionButton, styles.actionButtonPrimary]}
                                             onPress={handleDone}
                                             activeOpacity={0.85}
                                        >
                                             <Text style={styles.actionTextPrimary}>Done</Text>
                                        </TouchableOpacity>
                                   </View>
                              </View>

                              <View style={styles.quickList}>
                                   {QUICK_AMOUNTS.filter((val) => val <= availableBalance).map((val) => (
                                        <TouchableOpacity
                                             key={val}
                                             style={[
                                                  styles.quickChip,
                                                  amount === val && styles.quickChipActive,
                                             ]}
                                             onPress={() => handleQuickSelect(val)}
                                             activeOpacity={0.85}
                                        >
                                             <Text
                                                  style={[
                                                       styles.quickChipText,
                                                       amount === val && styles.quickChipTextActive,
                                                  ]}
                                             >
                                                  {`$${formatNumber(val, { maximumFractionDigits: 0 })}`}
                                             </Text>
                                        </TouchableOpacity>
                                   ))}
                                   <TouchableOpacity
                                        style={[
                                             styles.balanceChip,
                                             {
                                                  backgroundColor: hexToRgba(accent.strong, 0.12),
                                                  borderColor: hexToRgba(accent.strong, 0.35),
                                             },
                                        ]}
                                        onPress={() => handleQuickSelect(availableBalance)}
                                        activeOpacity={0.85}
                                   >
                                        <Text
                                             style={[
                                                  styles.balanceLabel,
                                                  { color: accent.primary },
                                             ]}
                                        >
                                             Available balance
                                        </Text>
                                        <Text
                                             style={[
                                                  styles.balanceValue,
                                                  { color: accent.strong },
                                             ]}
                                        >
                                             {`$${formatNumber(availableBalance || 0, {
                                                  maximumFractionDigits: 2,
                                                  minimumFractionDigits: 2,
                                             })}`}
                                        </Text>
                                   </TouchableOpacity>
                              </View>
                         </Pressable>
                    </Pressable>
               </Modal>
          </View>
     )
}

export default Amount

const styles = StyleSheet.create({
     container: {
          width: '100%',
          paddingHorizontal: 4,
     },
     labelRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          marginBottom: 4,
     },
     labelText: {
          fontSize: 12,
          fontWeight: '600',
          color: '#AFBCDE',
     },
     inputWrapper: {
          position: 'relative',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          height: 36,
     },

     textInputContainer: {
          backgroundColor: 'rgba(255,255,255,0.08)', // glassy tint
          borderRadius: 8,
          width: '100%',
          height: '100%',
          paddingHorizontal: 8,
          paddingLeft: 18,
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.18)',
     },
     prefix: {
          position: 'absolute',
          left: 8,
          top: 0,
          bottom: 0,
          textAlignVertical: 'center',
          textAlign: 'center',
          color: '#8cc2f8ff',
          fontWeight: '700',
          fontSize: 12,
          includeFontPadding: false,
          paddingTop: 1,
          pointerEvents: 'none',
     },
     textInput: {
          height: '100%',
          padding: 0,
          fontSize: 12,
          color: '#8cc2f8ff',
          fontWeight: 700,
          textAlign: 'right',
          writingDirection: 'rtl',
     },
     modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.045)',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          padding: 4,
     },
     modalCard: {
          width: '100%',
          maxWidth: 220,
          backgroundColor: '#05070d',
          borderRadius: 10,
          padding: 8,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)',
          shadowColor: '#000',
          shadowOpacity: 0.35,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 14,
          gap: 6,
     },
     modalCardDefault: {
          marginTop: 8,
          marginLeft: 8,
     },
     keypad: {
          gap: 6,
     },
     keypadRow: {
          flexDirection: 'row',
          gap: 6,
     },
     keypadKey: {
          flex: 1,
          paddingVertical: 6,
          borderRadius: 7,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.12)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     keypadKeyText: {
          color: '#E8F0FF',
          fontWeight: '700',
          fontSize: 12,
     },
     keypadActions: {
          flexDirection: 'row',
          gap: 8,
          marginTop: 0,
     },
     actionButton: {
          flex: 1,
          paddingVertical: 6,
          borderRadius: 7,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.12)',
          backgroundColor: 'rgba(255,255,255,0.06)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     actionButtonPrimary: {
          backgroundColor: '#2563EB',
          borderColor: '#2563EB',
     },
     actionText: {
          color: '#E8F0FF',
          fontWeight: '700',
     },
     actionTextPrimary: {
          color: '#E8F0FF',
          fontWeight: '700',
     },
     quickList: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
     },
     quickChip: {
          paddingVertical: 5,
          paddingHorizontal: 8,
          borderRadius: 7,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.15)',
          backgroundColor: 'rgba(255,255,255,0.05)',
     },
     quickChipActive: {
          backgroundColor: '#2563EB',
          borderColor: '#2563EB',
     },
     quickChipText: {
          color: '#E8F0FF',
          fontWeight: '700',
          fontSize: 10.5,
     },
     quickChipTextActive: {
          color: '#E8F0FF',
     },
     balanceChip: {
          paddingVertical: 7,
          paddingHorizontal: 8,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.25)',
          backgroundColor: 'rgba(0,123,255,0.12)',
          flexGrow: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
     },
     balanceLabel: {
          color: '#8CD9FF',
          fontSize: 10,
     },
     balanceValue: {
          color: '#E8F0FF',
          fontWeight: '700',
          fontSize: 12,
     },
})
