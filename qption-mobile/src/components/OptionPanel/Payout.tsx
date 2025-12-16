import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setPayoutPercentage } from '../../store/slices/tradingRoomSlices/tradeSlice';
import { RootState } from '../../store'; // ⬅️ adjust path
import { getModeAccent } from '../../theme/modeAccent';

const Payout: React.FC = () => {
     const dispatch = useDispatch();

     const { amount, payOutPercentage, timer } = useSelector(
          (store: RootState) => store.trade,
     );
     const { activeTicker, activeTickerDemo, activeTickerBonus } = useSelector(
          (store: RootState) => store.ticker,
     );
     const mode = useSelector((store: RootState) => store.tradingRoom.mode);
     const accent = useMemo(() => getModeAccent(mode), [mode]);
     const selectedTicker =
          mode === 'demo' ? activeTickerDemo : mode === 'bonus' ? activeTickerBonus : activeTicker;

     useEffect(() => {
          const basePayout = Number(selectedTicker?.payoutPercentage ?? 0);

          // Apply timer rule: after 10 minutes, -6; each additional 30 minutes, -6 again
          let deduction = 0;
          if (timer > 600) {
               deduction = 6;
               const extraBlocks = Math.floor((timer - 600) / 1800);
               deduction += extraBlocks * 6;
          }

          const next = Math.max(0, basePayout - deduction);

          if (next !== payOutPercentage) {
               dispatch(setPayoutPercentage({ payOutPercentage: next }));
          }
     }, [selectedTicker?.payoutPercentage, timer, payOutPercentage, dispatch]);

     const formatCurrency = (value: number) =>
          new Intl.NumberFormat('en-US', {
               style: 'currency',
               currency: 'USD',
               maximumFractionDigits: 2,
          }).format(value);

     const formatPayoutTotal = (value: number) => {
          if (!Number.isFinite(value)) return '$0';
          if (Math.abs(value) >= 1_000_000) {
               return `$${(value / 1_000_000).toFixed(2)}M`;
          }
          return formatCurrency(value);
     };

     const numericAmount = Number(amount) || 0;
     const profit = Number(((numericAmount * payOutPercentage) / 100).toFixed(2));
     const totalPayout = numericAmount + profit;

     return (
          <View style={styles.container}>
               {/* Label row (desktop-only in web, but here always visible) */}
               <View style={styles.labelRow}>
                    <Text style={[styles.labelText, { color: accent.primary }]}>Payout</Text>
                    <Text style={[styles.valueText, { color: accent.strong }]}>
                         {formatPayoutTotal(totalPayout)} {/* e.g. $110.00 or $1.23M */}
                    </Text>
               </View>
          </View>
     );
};

export default Payout;

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
     } as any, // gap requires RN 0.71+, otherwise use marginRight
     labelText: {
          fontSize: 12,
          fontWeight: '600',
          color: '#AFBCDE',
     },
     contentWrapper: {
          width: '100%',
     },
     valueRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 4, // mx-1
     },
     valueText: {
          fontSize: 12,
          fontWeight: '600',
          color: '#93C5FD', // text-blue-300
     },
});
