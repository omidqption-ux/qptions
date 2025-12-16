import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Amount from './Amount';
import TimeBox from './TimeBox';
import OptionPanel from './OptionPanel';
import Payout from './Payout';
import AiPanel from './AiPanel';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleAiMode } from '../../store/slices/tradingRoomSlices/tradeSlice';
import { useToast } from '../../utils/toast';

interface RightDrawerProps {
}

const RightDrawer: React.FC<RightDrawerProps> = () => {
     const dispatch = useDispatch();
     const { aiMode, aiActive, amount, timer } = useSelector((s: RootState) => s.trade);
     const { toastNode, showToast } = useToast();

     const handleAiToggle = () => {
          if (!Number.isFinite(timer) || timer > 30) {
               showToast('Set timer less than 30 seconds');
               return;
          }
          if (!Number.isFinite(amount) || amount < 50) {
               showToast('Min amount to use AI is 50$');
               return;
          }
          dispatch(toggleAiMode());
     };

     return (
          <LinearGradient
               colors={['#020304', '#0A0F19']}
               style={[styles.container, (aiActive || aiMode) && styles.containerAi]}
          >
               {toastNode}
               <View style={styles.content}>
                    {aiActive || aiMode ? (
                         <View style={styles.optionPanelWrapper}>
                              <AiPanel />
                         </View>
                    ) : (
                         <>
                              <Amount />
                              <>
                                   <TimeBox />
                                   <Payout />
                              </>
                              <View style={styles.optionPanelWrapper}>
                                   <OptionPanel />
                              </View>
                              <Pressable style={styles.aiToggle} onPress={handleAiToggle}>
                                   <Text style={styles.aiToggleText}>AI Mode</Text>
                              </Pressable>
                         </>
                    )}
               </View>
          </LinearGradient>
     )
}

export default RightDrawer;

const styles = StyleSheet.create({
     container: {
          width: 120,              // w-[90px]
          height: '100%',
          paddingVertical: 8,    // py-4
          paddingHorizontal: 4,    // px-1
          borderLeftWidth: 1,
          borderLeftColor: 'rgba(255,255,255,0.08)',
     },
     containerAi: {
          width: 240,
     },
     content: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 10,
     } as any,
     optionPanelWrapper: {
          width: '100%',
          marginTop: 8,
          paddingHorizontal: 4,
     },
     aiToggle: {
          marginTop: 6,
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
     aiToggleText: {
          color: '#FACC15',
          fontWeight: '600',
          fontSize: 11,
     },
});
