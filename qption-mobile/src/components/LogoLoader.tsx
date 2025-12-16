import React, { useEffect } from 'react'
import { View, StyleProp, ViewStyle, Animated, Easing } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg'

type LogoLoaderProps = {
  /** Size in px (width = height = size) */
  size?: number
  /** Optional wrapper style for outer View */
  style?: StyleProp<ViewStyle>
}

const AnimatedPath = Animated.createAnimatedComponent(Path)

export const LogoLoader: React.FC<LogoLoaderProps> = ({ size = 21.5, style }) => {
  // One animated value per tile (0 → 1)
  const a1 = React.useRef(new Animated.Value(0)).current
  const a2 = React.useRef(new Animated.Value(0)).current
  const a3 = React.useRef(new Animated.Value(0)).current
  const a4 = React.useRef(new Animated.Value(0)).current

  const makeLoop = (anim: Animated.Value, delay: number) => {
    const duration = 3000 // full cycle, like your CSS 3s

    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        // grow in
        Animated.timing(anim, {
          toValue: 1,
          duration: duration * 0.18,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        // hold visible
        Animated.timing(anim, {
          toValue: 1,
          duration: duration * 0.20,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // fade out
        Animated.timing(anim, {
          toValue: 0,
          duration: duration * 0.27,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        // rest invisible
        Animated.timing(anim, {
          toValue: 0,
          duration: duration * 0.35,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }

  useEffect(() => {
    makeLoop(a1, 0)
    makeLoop(a2, 450)
    makeLoop(a3, 900)
    makeLoop(a4, 1350)
  }, [a1, a2, a3, a4])

  // map 0..1 -> scaleY + opacity, but return as separate props, not `style`
  const makeAnimProps = (anim: Animated.Value) => {
    const scaleY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    })

    return {
      opacity: anim as any,
      // `transform` type for SVG is not super friendly to Animated,
      // so we just cast to `any` to keep TS quiet.
      transform: [{ scaleY }] as any,
    }
  }

  const p1 = makeAnimProps(a1)
  const p2 = makeAnimProps(a2)
  const p3 = makeAnimProps(a3)
  const p4 = makeAnimProps(a4)

  return (
    <View style={style}>
      <Svg
        viewBox="100 110 240 140"
        width={size}
        height={size}
      >
        <Defs>
          <LinearGradient
            id="linear-gradient"
            x1="105.31"
            y1="173.84"
            x2="159.78"
            y2="173.84"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0.24" stopColor="#2F6BB5" />
            <Stop offset="1" stopColor="#1F4C8F" />
          </LinearGradient>

          <LinearGradient
            id="linear-gradient-2"
            x1="165.73"
            y1="161.15"
            x2="220.2"
            y2="161.15"
          />
          <LinearGradient
            id="linear-gradient-3"
            x1="229.84"
            y1="162.01"
            x2="284.41"
            y2="162.01"
          />
          <LinearGradient
            id="linear-gradient-4"
            x1="290.37"
            y1="162.08"
            x2="342.41"
            y2="162.08"
          />
        </Defs>

        {/* Tile 1 */}
        <AnimatedPath
          d="M159.78,135.57H128a22.69,22.69,0,0,0-22.69,22.69v49.67a22.11,22.11,0,0,0,.4,4.18l54.07-22.85Z"
          fill="url(#linear-gradient)"
          opacity={p1.opacity}
          transform={p1.transform}
        />

        {/* Tile 2 */}
        <AnimatedPath
          d="M197.51,135.57H165.73v51.17l54.47-23v-5.45A22.69,22.69,0,0,0,197.51,135.57Z"
          fill="url(#linear-gradient-2)"
          opacity={p2.opacity}
          transform={p2.transform}
        />

        {/* Tile 3 */}
        <AnimatedPath
          d="M284.41,135.57H252.53a22.69,22.69,0,0,0-22.69,22.69V165l54.57,23.48Z"
          fill="url(#linear-gradient-3)"
          opacity={p3.opacity}
          transform={p3.transform}
        />

        {/* Tile 4 */}
        <AnimatedPath
          d="M290.37,188.59l52-40.31A22.68,22.68,0,0,0,322,135.57H290.37Z"
          fill="url(#linear-gradient-4)"
          opacity={p4.opacity}
          transform={p4.transform}
        />
      </Svg>
    </View>
  )
}

export default LogoLoader
