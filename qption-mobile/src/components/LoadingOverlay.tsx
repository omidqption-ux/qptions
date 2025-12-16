import React from 'react'
import { View, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AnimatedLogoLoader from './AnimatedLogoLoader'

const LoadingOverlay = () => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.backdrop} />
            <LinearGradient
                colors={['rgba(20,43,71,0.95)', 'rgba(12,26,44,0.92)']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.gradient}
            >
                <AnimatedLogoLoader size={680} />
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default LoadingOverlay
