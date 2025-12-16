import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import Svg, {
    Defs,
    LinearGradient,
    Stop,
    Mask,
    Rect,
    G,
    Polygon,
    Path,
} from "react-native-svg";

interface LogoLoaderProps {
    size?: number;
}

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const LogoLoader: React.FC<LogoLoaderProps> = ({ size = 160 }) => {
    // BLUE REVEAL
    const blueReveal = useRef(new Animated.Value(0)).current;

    // GREEN SEGMENTS
    const green1 = useRef(new Animated.Value(0)).current;
    const green2 = useRef(new Animated.Value(0)).current;
    const green3 = useRef(new Animated.Value(0)).current;
    const green4 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // blue reveal once
        Animated.timing(blueReveal, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false, // animating width
        }).start();

        const animateGreen = (anim: Animated.Value, delay: number) => {
            Animated.loop(
                Animated.sequence([
                    // grow in (0% → 18%)
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 540, // ~18% of 3000ms
                        delay,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: false,
                    }),
                    // hold visible (18% → 38%)
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 600, // ~20% of 3000ms
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: false,
                    }),
                    // shrink out (38% → 65% and rest)
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 810, // rest of the cycle
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        };

        animateGreen(green1, 0);
        animateGreen(green2, 450);
        animateGreen(green3, 900);
        animateGreen(green4, 1350);
    }, [blueReveal, green1, green2, green3, green4]);

    // BLUE mask width
    const blueMaskWidth = blueReveal.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 450.15],
    });

    // GREEN helpers
    const makeOpacity = (anim: Animated.Value) =>
        anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });

    const green1Opacity = makeOpacity(green1);
    const green2Opacity = makeOpacity(green2);
    const green3Opacity = makeOpacity(green3);
    const green4Opacity = makeOpacity(green4);

    return (
        <Svg width={size} height={size} viewBox="0 0 450.15 450.15">
            <Defs>
                {/* gradients – duplicated instead of href/xlinkHref */}
                <LinearGradient
                    id="linear-gradient-1"
                    x1="105.31"
                    y1="173.84"
                    x2="159.78"
                    y2="173.84"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0.24" stopColor="#23b375" />
                    <Stop offset="1" stopColor="#21b474" />
                </LinearGradient>

                <LinearGradient
                    id="linear-gradient-2"
                    x1="165.73"
                    y1="161.15"
                    x2="220.2"
                    y2="161.15"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0.24" stopColor="#23b375" />
                    <Stop offset="1" stopColor="#21b474" />
                </LinearGradient>

                <LinearGradient
                    id="linear-gradient-3"
                    x1="229.84"
                    y1="162.01"
                    x2="284.41"
                    y2="162.01"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0.24" stopColor="#23b375" />
                    <Stop offset="1" stopColor="#21b474" />
                </LinearGradient>

                <LinearGradient
                    id="linear-gradient-4"
                    x1="290.37"
                    y1="162.08"
                    x2="342.41"
                    y2="162.08"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0.24" stopColor="#23b375" />
                    <Stop offset="1" stopColor="#21b474" />
                </LinearGradient>

                {/* BLUE REVEAL MASK */}
                <Mask id="blue-mask">
                    <AnimatedRect
                        x={0}
                        y={0}
                        height={450.15}
                        width={blueMaskWidth as any}
                        fill="#ffffff"
                    />
                </Mask>
            </Defs>

            {/* 🔵 BLUE PART (revealed once) */}
            <G mask="url(#blue-mask)">
                <Polygon
                    fill="#132a46"
                    points="165.74 194.54 165.74 230.62 196.27 230.62 196.27 314.57 220.2 314.57 220.2 207.93 220.2 183.95 220.2 171.51 165.74 194.54"
                />
                <Path
                    fill="#132a46"
                    d="M159.78,197.06l-51.64,21.83A22.67,22.67,0,0,0,128,230.62h31.78Z"
                />
                <Path
                    fill="#132a46"
                    d="M344.68,155.69l-54.31,42.08v32.85h31.78a22.68,22.68,0,0,0,22.68-22.69V158.26A21.77,21.77,0,0,0,344.68,155.69Z"
                />
                <Polygon
                    fill="#132a46"
                    points="284.41 196.22 229.95 172.8 229.95 185.3 229.95 207.93 229.95 314.57 253.88 314.57 253.88 230.62 284.41 230.62 284.41 196.22"
                />
            </G>

            {/* 🟢 GREEN SEGMENTS */}
            {/* 1 */}
            <AnimatedPath
                fill="url(#linear-gradient-1)"
                d="M159.78,135.57H128a22.69,22.69,0,0,0-22.69,22.69v49.67a22.11,22.11,0,0,0,.4,4.18l54.07-22.85Z"
                opacity={green1Opacity}
            />

            {/* 2 */}
            <AnimatedPath
                fill="url(#linear-gradient-2)"
                d="M197.51,135.57H165.73v51.17l54.47-23v-5.45A22.69,22.69,0,0,0,197.51,135.57Z"
                opacity={green2Opacity}
            />

            {/* 3 */}
            <AnimatedPath
                fill="url(#linear-gradient-3)"
                d="M284.41,135.57H252.53a22.69,22.69,0,0,0-22.69,22.69V165l54.57,23.48Z"
                opacity={green3Opacity}
            />

            {/* 4 */}
            <AnimatedPath
                fill="url(#linear-gradient-4)"
                d="M290.37,188.59l52-40.31A22.68,22.68,0,0,0,322,135.57H290.37Z"
                opacity={green4Opacity}
            />
        </Svg>
    );
};

export default LogoLoader;
