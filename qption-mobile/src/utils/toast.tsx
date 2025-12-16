import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type ToastConfig = {
     hideAfterMs?: number;
};

export function useToast(config: ToastConfig = {}) {
     const { hideAfterMs = 1400 } = config;

     const [toastMsg, setToastMsg] = useState<string | null>(null);
     const toastY = useRef(new Animated.Value(-80)).current;
     const toastTimer = useRef<NodeJS.Timeout | null>(null);

     const showToast = useCallback(
          (msg: string) => {
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
                    }, hideAfterMs);
               });
          },
          [hideAfterMs, toastY]
     );

     useEffect(() => {
          return () => {
               if (toastTimer.current) clearTimeout(toastTimer.current);
          };
     }, []);

     const toastNode = toastMsg ? (
          <Animated.View style={[styles.toast, { transform: [{ translateY: toastY }] }]}>
               <View style={styles.toastRow}>
                    <MaterialIcons
                         name="warning-amber"
                         size={18}
                         color="#FCD34D"
                         style={styles.toastIcon}
                    />
                    <Text style={styles.toastText}>{toastMsg}</Text>
               </View>
          </Animated.View>
     ) : null;

     return { showToast, toastNode };
}

const styles = StyleSheet.create({
     toast: {
          position: 'absolute',
          top: 10,
          alignSelf: 'center',
          minWidth: 380,
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 12,
          backgroundColor: 'rgba(251,191,36,0.85)',
          zIndex: 99999,
          alignItems: 'flex-start',
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
          flexShrink: 1,
          flexWrap: 'wrap',
     },
     toastRow: {
          flexDirection: 'row',
          alignItems: 'center',
          flexShrink: 1,
     },
     toastIcon: {
          marginRight: 8,
     },
});
