import React, { useEffect, useMemo } from 'react';
import {
     View,
     Text,
     TouchableOpacity,
     StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import {
     setPayoutPercentage,
     setTimer,
} from '../../store/slices/tradingRoomSlices/tradeSlice';
import TimeLarge from './Timeparts';
import { playClick, playBeep } from '../../utils/sounds';
import { RootState } from '../../store'; // ⬅️ adjust path
import { getModeAccent } from '../../theme/modeAccent';

const MIN_SEC = 5;
const MAX_SEC = 4 * 60 * 60; // 4h

const TimeDisplay = ({ handleClose }: { handleClose: () => void }) => {
     const dispatch = useDispatch();
     const { timer } = useSelector((store: RootState) => store.trade);
     const { userSettings } = useSelector((store: RootState) => store.user);
     const { activeTicker } = useSelector((store: RootState) => store.ticker);
     const mode = useSelector((store: RootState) => store.tradingRoom.mode);
     const accent = useMemo(() => getModeAccent(mode), [mode]);

     const adjustSeconds = (step: number) => {
          const allowed = new Set([-3600, -60, -1, 1, 60, 3600]);

          if (!Number.isFinite(timer)) {
               playBeep();
               return;
          }
          if (!allowed.has(step)) {
               playBeep();
               return;
          }

          userSettings?.soundControl?.notification && playClick();

          let next = timer + step;
          if (next < MIN_SEC) {
               next = MIN_SEC;
               playBeep();
          }
          if (next > MAX_SEC) {
               next = MAX_SEC;
               playBeep();
          }

          dispatch(setTimer({ timer: next }));
     };

     useEffect(() => {
          // mirror your payout adjustment logic
          const basePayout = Number(activeTicker?.payoutPercentage ?? 0);
          const payOutPercentage =
               timer > 599 ? basePayout - 6 : basePayout;

          dispatch(
               setPayoutPercentage({
                    payOutPercentage,
               }),
          );
     }, [timer, activeTicker, dispatch]);

     return (
          <View style={styles.container}>
               {/* Header */}
               <View style={styles.header}>
                    <TouchableOpacity
                         onPress={handleClose}
                         style={styles.headerClose}

                    >
                         <MaterialIcons name="close" size={16} color="#D1D5DB" />
                    </TouchableOpacity>
               </View>

               {/* Body */}
               <View style={styles.body}>
                    {/* Plus row */}
                    <View style={styles.buttonRow}>

                         <TouchableOpacity
                         onPress={() => adjustSeconds(3600)}
                         style={styles.plusButton}
                         activeOpacity={0.8}
                     >
                         <MaterialIcons name="add" size={18} style={[styles.plusIcon, { color: accent.primary }]} />
                     </TouchableOpacity>
                     <TouchableOpacity
                         onPress={() => adjustSeconds(60)}
                         style={styles.plusButton}
                         activeOpacity={0.8}
                     >
                         <MaterialIcons name="add" size={18} style={[styles.plusIcon, { color: accent.primary }]} />
                     </TouchableOpacity>
                     <TouchableOpacity
                         onPress={() => adjustSeconds(1)}
                         style={styles.plusButton}
                         activeOpacity={0.8}
                     >
                         <MaterialIcons name="add" size={18} style={[styles.plusIcon, { color: accent.primary }]} />
                     </TouchableOpacity>
                </View>

                {/* Time display */}
                <Text style={[styles.timeText, { color: accent.primary }]}><TimeLarge totalSeconds={timer} /></Text>

                {/* Minus row */}
                <View style={styles.buttonRow}>
                     <TouchableOpacity
                          onPress={() => adjustSeconds(-3600)}
                          style={styles.minusButton}
                          activeOpacity={0.8}
                     >
                         <MaterialIcons name="remove" size={18} style={[styles.minusIcon, { color: accent.primary }]} />
                     </TouchableOpacity>


                     <TouchableOpacity
                          onPress={() => adjustSeconds(-60)}
                          style={styles.minusButton}
                          activeOpacity={0.8}
                     >
                         <MaterialIcons name="remove" size={18} style={[styles.minusIcon, { color: accent.primary }]} />
                     </TouchableOpacity>

                     <TouchableOpacity
                          onPress={() => adjustSeconds(-1)}
                          style={styles.minusButton}
                          activeOpacity={0.8}
                     >
                         <MaterialIcons name="remove" size={18} style={[styles.minusIcon, { color: accent.primary }]} />
                     </TouchableOpacity>
                    </View>
               </View>
          </View>
     );
};

export default TimeDisplay;

const styles = StyleSheet.create({
     container: {
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
     },
     header: {
          paddingTop: 8,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
     },

     headerClose: {
          position: 'absolute',
          right: 0,
          top: 0,
     },
     body: {
          paddingTop: 8,
          paddingBottom: 16,
          alignItems: 'center',
     },
     buttonRow: {
          flexDirection: 'row',
          width: 120,
          justifyContent: 'space-between',
          marginVertical: 6,
     },
     plusButton: {
          backgroundColor: 'rgba(31,76,143,0.08)',
          paddingVertical: 2,
          paddingHorizontal: 2,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: 'rgba(31,76,143,0.25)',
     },
     minusButton: {
          backgroundColor: 'rgba(31,76,143,0.08)',
          paddingVertical: 2,
          paddingHorizontal: 2,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: 'rgba(31,76,143,0.25)',
     },
     plusIcon: {
          color: '#E8F0FF', // fallback; overridden by mode accent
     },
     minusIcon: {
          color: '#E8F0FF',
     },
     timeText: {
          fontSize: 18,
          fontWeight: '600',
          color: '#E8F0FF',
          textAlign: 'center',
     }
});
