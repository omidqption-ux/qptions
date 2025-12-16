// CrossHatchLoader.tsx
import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Easing,
    ViewStyle,
} from 'react-native';

export interface CrossHatchLoaderProps {
    line?: number;          // hatch line thickness (px)
    gap?: number;           // distance between lines (px)
    tilt?: number;          // hatch angle (deg)
    speed?: number;         // animation loop duration (s)
    fg?: string;            // hatch color
    bg?: string;            // background color
    shimmer?: boolean;      // sweeping highlight
    style?: ViewStyle;      // extra layout styles
}

const CrossHatchLoader: React.FC<CrossHatchLoaderProps> = ({
    line = 2,
    gap = 10,
    tilt = 45,
    speed = 2.4,
    fg = 'rgba(255,255,255,0.08)',
    bg = '#0b0f14',
    shimmer = true,
    style,
}) => {
    const anim = useRef(new Animated.Value(0)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(anim, {
                toValue: 1,
                duration: speed * 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ).start();
    }, [anim, speed]);

    useEffect(() => {
        if (!shimmer) return;
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: speed * 1200,
                easing: Easing.inOut(Easing.linear),
                useNativeDriver: true,
            }),
        ).start();
    }, [shimmer, shimmerAnim, speed]);

    const unit = line + gap;
    const translateX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -unit],
    });

    const shimmerTranslateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-150, 150],
    });

    // build a row of stripes
    const stripes = Array.from({ length: 40 }, (_, i) => (
        <View
            key={i}
            style={{
                width: line,
                backgroundColor: fg,
                marginRight: gap,
                height: '200%',
            }}
        />
    ));

    return (
        <View style={[styles.wrap, { backgroundColor: bg }, style]}>
            {/* First diagonal hatch */}
            <Animated.View
                style={[
                    styles.patternLayer,
                    {
                        transform: [
                            { rotate: `${tilt}deg` },
                            { translateX },
                        ],
                    },
                ]}
            >
                <View style={styles.row}>{stripes}</View>
            </Animated.View>

            {/* Second diagonal hatch (cross) */}
            <Animated.View
                style={[
                    styles.patternLayer,
                    {
                        transform: [
                            { rotate: `${-tilt}deg` },
                            { translateX },
                        ],
                    },
                ]}
            >
                <View style={styles.row}>{stripes}</View>
            </Animated.View>

            {/* Shimmer sweep */}
            {shimmer && (
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.shimmer,
                        {
                            transform: [{ translateX: shimmerTranslateX }],
                        },
                    ]}
                />
            )}
        </View>
    );
};

export default CrossHatchLoader;

const styles = StyleSheet.create({
    wrap: {
        overflow: 'hidden',
        borderRadius: 8,
    },
    patternLayer: {
        position: 'absolute',
        top: -40,
        left: -40,
        right: -40,
        bottom: -40,
    },
    row: {
        flexDirection: 'row',
        height: '100%',
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 120,
        backgroundColor: 'rgba(255,255,255,0.09)',
        opacity: 0.9,
    },
});
