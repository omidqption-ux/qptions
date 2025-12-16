import { useCallback } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import RightDrawer from '../../components/OptionPanel/RightDrawer'
import Chart from "../../components/RealTimeChart/AmChart"
import * as ScreenOrientation from 'expo-screen-orientation'
import { useFocusEffect } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
export default function TradingRoomScreen() {

    useFocusEffect(
        useCallback(() => {
            const lock = async () => {
                if (Platform.OS === 'web') return
                try {
                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
                    await NavigationBar.setVisibilityAsync('hidden')
                } catch (e) {
                    // ignore orientation errors
                }
            }
            lock()
            return () => {
                if (Platform.OS === 'web') return
                ScreenOrientation.unlockAsync().catch(() => { })
                NavigationBar.setVisibilityAsync('hidden').catch(() => { })
            }
        }, []),
    )

    return (
        <LinearGradient
            colors={['#060b15', '#090f1d']}
            style={styles.container}
        >
            <View style={styles.mainArea}>
                <View style={styles.chartWrap}>
                    <Chart />
                </View>
                <View>
                    <RightDrawer />
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 0,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    topBarText: {
        color: '#E8F0FF',
        fontSize: 18,
        fontWeight: '700',
    },
    historyToggle: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: '#2563EB',
        borderWidth: 1,
        borderColor: '#1D4ED8',
    },
    historyToggleText: {
        color: '#EAF2FF',
        fontWeight: '600',
        fontSize: 12,
    },
    mainArea: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },
    chartWrap: {
        flex: 1,
        marginRight: 8,
    },
    sectionTitle: {
        color: '#E8F0FF',
        fontWeight: '700',
    },
    placeholderBox: {
        flex: 1,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderBoxSmall: {
        flex: 1,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: 'rgba(232,240,255,0.7)',
        textAlign: 'center',
    },
})
