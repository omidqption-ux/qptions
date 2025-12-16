import React from 'react';
import {
     View,
     Text,
     TouchableOpacity,
     StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setAmount } from '../../store/slices/tradingRoomSlices/tradeSlice';
import { setAmountIsMoreThanBalance } from '../../store/slices/tradingRoomSlices/tradingRoomSlice';
import { playClick, playBeep } from '../../utils/sounds';
import { RootState } from '../../store'; // ⬅️ adjust path to your store
import { getModeAccent } from '../../theme/modeAccent';

interface CalculatorProps {
     closeCalc: () => void;
}

const quickAmounts = [
     10, 50, 100,
     200, 500, 1000,
     2000, 4000, 6000,
     8000, 10000, 12000,
];

const Calculator: React.FC<CalculatorProps> = ({ closeCalc }) => {
     const dispatch = useDispatch();

     const { balance, userSettings } = useSelector(
          (state: RootState) => state.user,
     );
     const { mode } = useSelector(
          (state: RootState) => state.tradingRoom,
     );
     const accent = getModeAccent(mode);

     const chooseAmount = (x: number) => {
          userSettings?.soundControl?.notification && playClick();

          if (mode === 'real' && x > balance) {
               dispatch(setAmountIsMoreThanBalance());
               closeCalc();
               userSettings?.soundControl?.notification && playBeep();
               return;
          }

          dispatch(setAmount({ amount: x }));
          closeCalc();
     };

     const formatCurrency = (value: number) =>
          new Intl.NumberFormat('en-US', {
               style: 'currency',
               currency: 'USD',
               maximumFractionDigits: 2,
          }).format(value);

     return (
          <View style={styles.container}>
               <View style={styles.grid}>
                    {quickAmounts.map((value) => (
                         <TouchableOpacity
                              key={value}
                         style={styles.cell}
                         activeOpacity={0.8}
                         onPress={() => chooseAmount(value)}
                     >
                         <Text style={[styles.cellText, { color: accent.primary }]}>
                              {value.toLocaleString('en-US')}$
                         </Text>
                     </TouchableOpacity>
                ))}

                    <TouchableOpacity
                         style={[styles.cell, styles.balanceCell]}
                         activeOpacity={0.8}
                         onPress={() => chooseAmount(balance)}
                     >
                         <Text style={styles.balanceLabel}>Available Balance</Text>
                         <Text style={[styles.balanceValue, { color: accent.primary }]}>
                              {formatCurrency(balance)}
                         </Text>
                     </TouchableOpacity>
                </View>
          </View>
     );
};

export default Calculator;

const styles = StyleSheet.create({
     container: {
          width: 184,
          alignSelf: 'center',
     },
     grid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: 4,
          justifyContent: 'space-between',
     },
     cell: {
          width: '32%',
          backgroundColor: 'rgba(31,76,143,0.12)', // dark-blue tint
          paddingVertical: 8,
          marginBottom: 4,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: 'rgba(31,76,143,0.35)',
     },
     cellText: {
          fontSize: 12,
          color: '#E8F0FF',
     },
     balanceCell: {
          width: '100%',
          marginTop: 4,
          borderRadius: 8,
     },
     balanceLabel: {
          fontSize: 11,
          color: '#A7BFCF',
          marginBottom: 2,
     },
     balanceValue: {
          fontSize: 13,
          color: '#E8F0FF',
          fontWeight: '600',
     },
});
