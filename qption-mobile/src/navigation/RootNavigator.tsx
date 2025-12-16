import { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import LoginScreen from '../screens/auth/LoginScreen'
import SignUpScreen from '../screens/auth/SignUpScreens'
import { clearAuth, setAuth } from '../store/slices/authSlice'
import api from '../services/api'
import LoadingOverlay from '../components/LoadingOverlay'
import TradingRoomScreen from '../screens/trading/TradingRoomScreen'
import TradingRoomLayout from '../components/TradingRoomLayout'

const Stack = createNativeStackNavigator()
export default function RootNavigator() {
    const dispatch = useDispatch()
    const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated)
    const [bootstrapping, setBootstrapping] = useState(true)

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await api.post('/api/auth/isLogin')
                if (res.data?.isLogin) {
                    dispatch(setAuth({ userId: res.data.userId }))
                } else {
                    dispatch(clearAuth())
                }
            } catch {
                dispatch(clearAuth())
            } finally {
                setBootstrapping(false)
            }
        }
        checkSession()
    }, [dispatch])

    if (bootstrapping) return <LoadingOverlay />

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#0C1A2C' },
                statusBarHidden: true,
                statusBarStyle: 'light',
                animation: 'fade_from_bottom',
            }}
        >
            {isAuthenticated ? (
                <Stack.Screen
                    name="TradingRoom"
                    children={() => (
                        <TradingRoomLayout>
                            <TradingRoomScreen />
                        </TradingRoomLayout>
                    )}
                />
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                </>
            )}
        </Stack.Navigator>
    )
}
