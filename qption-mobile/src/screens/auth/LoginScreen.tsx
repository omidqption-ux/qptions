import { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from 'react-redux'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import PhoneInput, { getCountryByCca2, type ICountry } from "react-native-international-phone-number";
import * as ScreenOrientation from 'expo-screen-orientation'
import { setAuth } from '../../store/slices/authSlice'
import api from '../../services/api'
import LoadingOverlay from '../../components/LoadingOverlay'
import { useGoogleAuth } from '../../hooks/useGoogleAuth'
import { loadCredentials, savePassword, saveUsername } from '../../utils/credentials'

export default function LoginScreen() {
    const [authMode, setAuthMode] = useState<'email' | 'phone'>('email')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const deriveDialCode = (country?: ICountry) => {
        const root = country?.idd?.root ?? ''
        const suffix = country?.idd?.suffixes?.[0] ?? ''
        const numeric = `${root}${suffix}`.replace(/\D/g, '')
        return numeric || '1'
    }
    const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(() => getCountryByCca2('US'))
    const [callingCode, setCallingCode] = useState(deriveDialCode(getCountryByCca2('US')))
    const [password, setPassword] = useState('')
    const [rememberPassword, setRememberPassword] = useState(false)
    const [forgotFlow, setForgotFlow] = useState(false)
    const [awaitingOtp, setAwaitingOtp] = useState(false)
    const [otpValue, setOtpValue] = useState('')
    const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null)
    const [otpCountdownMs, setOtpCountdownMs] = useState(0)
    const [forgotLoading, setForgotLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const passwordRef = useRef<TextInput | null>(null)
    const dispatch = useDispatch()
    const navigation = useNavigation<any>()
    const { startGoogleAuth, googleLoading, googleError } = useGoogleAuth({
        onSuccess: (userId?: string | null) => dispatch(setAuth({ userId })),
    })

    const isValidEmail = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    const isValidPhone = (value: string) => value.replace(/\D/g, '').length >= 7
    const isValidPassword = (value: string) =>
        /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value)

    const toggleAuthMode = () => {
        setAuthMode((prev) => (prev === 'email' ? 'phone' : 'email'))
        setError(null)
    }

    const resetOtpState = () => {
        setAwaitingOtp(false)
        setOtpValue('')
        setOtpExpiresAt(null)
        setOtpCountdownMs(0)
    }

    useEffect(() => {
        if (googleError) setError(googleError)
    }, [googleError])

    useEffect(() => {
        const code = deriveDialCode(selectedCountry)
        if (code) setCallingCode(code)
    }, [selectedCountry])

    useEffect(() => {
        loadCredentials().then(({ username, password }) => {
            if (username) {
                setEmail(username)
                setPhone(username)
            }
            if (password) {
                setPassword(password)
                setRememberPassword(true)
            }
        })
    }, [])

    useFocusEffect(
        useCallback(() => {
            const lock = async () => {
                if (Platform.OS === 'web') {
                    // keep portrait layout even on web by avoiding landscape styling changes
                    return
                }
                try {
                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
                } catch {
                    // ignore
                }
            }
            lock()
            return () => { }
        }, []),
    )

    useEffect(() => {
        if (!awaitingOtp || !otpExpiresAt) {
            setOtpCountdownMs(0)
            return
        }
        const timer = setInterval(() => {
            const remaining = Math.max(0, otpExpiresAt - Date.now())
            setOtpCountdownMs(remaining)
            if (remaining <= 0) {
                resetOtpState()
                setError('OTP expired. Please request a new code.')
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [awaitingOtp, otpExpiresAt])

    const handleGoogleLogin = () => {
        setError(null)
        startGoogleAuth()
    }

    const handleLogin = async () => {
        if (loading) return
        setLoading(true)
        setError(null)
        try {
            if (!password.trim()) {
                throw new Error('Password is required')
            }
            if (!isValidPassword(password)) {
                throw new Error('Password must include upper, lower, and numbers')
            }

            let payload: { email?: string; phone?: string; password: string }
            if (authMode === 'email') {
                if (!isValidEmail(email)) {
                    throw new Error('Enter a valid email')
                }
                payload = { email: email.trim(), password }
            } else {
                const digitsOnly = phone.replace(/\D/g, '')
                if (!isValidPhone(phone)) {
                    throw new Error('Enter a valid phone number')
                }
                const code = deriveDialCode(selectedCountry) || callingCode || '1'
                const normalized = digitsOnly.startsWith(code) ? digitsOnly : `${code}${digitsOnly}`
                payload = { phone: `+${normalized}`, password }
            }

            const res = await api.post('/api/auth/login', payload)
            if (res.data?.ok) {
                dispatch(setAuth({ userId: res.data?.userId }))
                const usernameValue = payload.email ?? payload.phone ?? ''
                if (usernameValue) {
                    saveUsername(usernameValue)
                }
                await savePassword(rememberPassword ? password : null)
                if (!rememberPassword) {
                    setPassword('')
                }
            } else {
                setError(res.data?.message || 'Login failed')
            }
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPress = () => {
        setForgotFlow(true)
        resetOtpState()
        setError(null)
    }

    const handleForgotSubmit = async () => {
        if (forgotLoading) return
        setError(null)

        const digitsOnly = phone.replace(/\D/g, '')

        if (!awaitingOtp) {
            try {
                if (authMode === 'email') {
                    if (!isValidEmail(email)) throw new Error('Enter a valid email')
                } else {
                    if (!isValidPhone(phone)) throw new Error('Enter a valid phone number')
                }
                setForgotLoading(true)
                const endpoint = authMode === 'email' ? '/api/auth/sendOtpEmail' : '/api/auth/sendOtpSMS'
                const code = deriveDialCode(selectedCountry) || callingCode || '1'
                const normalized = digitsOnly.startsWith(code) ? digitsOnly : `${code}${digitsOnly}`
                const payload =
                    authMode === 'email'
                        ? { email: email.trim() }
                        : { phone: `+${normalized}` }

                await api.post(endpoint, payload)
                setAwaitingOtp(true)
                setOtpExpiresAt(Date.now() + 2 * 60 * 1000)
            } catch (e: any) {
                setError(e?.response?.data?.message || e?.message || 'Failed to send OTP')
            } finally {
                setForgotLoading(false)
            }
            return
        }

        // Verify OTP
        if (!otpValue.trim()) {

            setError('Enter the OTP code')
            return
        }

        try {
            setForgotLoading(true)
            if (!/^\d{6}$/.test(otpValue)) {
                setError('Invalid OTP')
                return
            }
            const res = await api.post('/api/auth/otpLogin', {
                otp: otpValue.trim(),
                phone: authMode === 'phone' ? `+${digitsOnly.startsWith(deriveDialCode(selectedCountry) || callingCode || '1') ? digitsOnly : (deriveDialCode(selectedCountry) || callingCode || '1') + digitsOnly}` : undefined,
                email: authMode === 'email' ? email.trim() : undefined,
            })
            dispatch(setAuth({ userId: res.data?.userId }))
            resetOtpState()
            setForgotFlow(false)

        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || 'OTP verification failed')
        } finally {
            setForgotLoading(false)
        }
    }

    const otpCountdownLabel = () => {
        if (!otpCountdownMs) return '02:00'
        const totalSeconds = Math.ceil(otpCountdownMs / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    return (
        <LinearGradient
            colors={['#10253F', 'rgba(16,37,63,0.92)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
            importantForAutofill="noExcludeDescendants"

        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <Image
                            source={require('../../../assets/qption-logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <View style={styles.form}>
                            <Text style={styles.title}>Log in to your account</Text>
                            {!forgotFlow ? (
                                <>
                                    <Text style={styles.label}>{authMode === 'email' ? 'Email' : 'Phone'}</Text>
                                    {authMode === 'email' ? (
                                        <View style={[styles.input, styles.inputFlex, styles.inputRow]}>
                                            <TextInput
                                                value={email}
                                                onChangeText={setEmail}
                                                autoCapitalize="none"
                                                keyboardType="email-address"
                                                autoComplete="off"
                                                textContentType="none"
                                                importantForAutofill="no"
                                                autoCorrect={false}
                                                placeholder="you@example.com"
                                                placeholderTextColor="rgba(255,255,255,0.6)"
                                                style={{
                                                    flex: 1,
                                                    color: '#fff',
                                                    fontSize: 14,
                                                    paddingVertical: 0,
                                                }}
                                                returnKeyType="next"
                                                blurOnSubmit={false}
                                                onSubmitEditing={() => {
                                                    passwordRef.current?.focus?.()
                                                }}
                                            />
                                            <TouchableOpacity onPress={toggleAuthMode} style={styles.iconToggleInside}>
                                                <FontAwesome name="phone" size={16} color="#8CD9FF" />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={[styles.inputRow, styles.inputFlex, styles.phoneRow]}>
                                            <PhoneInput
                                                value={phone}
                                                onChangePhoneNumber={(text) => setPhone(text)}
                                                selectedCountry={selectedCountry}
                                                onChangeSelectedCountry={(country) => {
                                                    setSelectedCountry(country)
                                                    setPhone('')
                                                }}
                                                defaultCountry="US"
                                                placeholder="123 456 7890"
                                                modalType="bottomSheet"
                                                autoCapitalize="none"
                                                autoComplete="off"
                                                textContentType="none"
                                                importantForAutofill="no"
                                                modalSearchInputPlaceholderTextColor="#d1d5db"
                                                phoneInputStyles={{
                                                    container: [styles.input, styles.phoneInputContainer] as any,
                                                    input: styles.phoneText as any,
                                                    callingCode: styles.phoneText as any,
                                                    flag: styles.phoneFlag as any,
                                                    flagContainer: styles.phoneFlagContainer as any,
                                                    divider: { backgroundColor: 'rgba(255,255,255,0.08)' },
                                                    caret: { color: 'silver', width: 10 }
                                                }}
                                                modalStyles={{
                                                    backdrop: { backgroundColor: 'rgba(0,0,0,0.03)' },
                                                    container: { backgroundColor: '#0b1422' },
                                                    content: { backgroundColor: '#0b1422' },
                                                    searchInput: { color: '#d1d5db', borderWidth: 1, borderColor: '#cecece' },
                                                    countryName: { color: '#d1d5db' },
                                                    callingCode: { color: '#d1d5db' },
                                                    countryInfo: { backgroundColor: '#0f2744' },
                                                    countryItem: { backgroundColor: '#0f2744' },
                                                    dragHandleIndicator: { backgroundColor: '#cdd2e0', shadowColor: '#cdd2e0', outlineColor: '#cdd2e0' },
                                                    alphabetLetterText: { color: '#9ca3af' },
                                                    alphabetLetterTextActive: { color: '#e5e7eb' },
                                                    alphabetLetterTextDisabled: { color: '#4b5563' },
                                                }}
                                            />
                                            <TouchableOpacity onPress={toggleAuthMode} style={styles.iconToggleInside}>
                                                <FontAwesome name="envelope" size={16} color="#8CD9FF" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    <Text style={styles.label}>Password</Text>
                                    <View style={styles.passwordWrapper}>
                                        <TextInput
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={!showPassword}
                                            autoComplete="off"
                                            textContentType="none"
                                            importantForAutofill="no"
                                            autoCorrect={false}
                                            placeholder="••••••••"
                                            placeholderTextColor="rgba(255,255,255,0.6)"
                                            style={[styles.input, styles.passwordInput]}
                                            ref={passwordRef}
                                            returnKeyType="go"
                                            onSubmitEditing={handleLogin}
                                        />
                                        <TouchableOpacity
                                            style={styles.passwordToggle}
                                            onPress={() => setShowPassword((p) => !p)}
                                            activeOpacity={0.7}
                                        >
                                            <MaterialIcons
                                                name={showPassword ? 'visibility-off' : 'visibility'}
                                                size={18}
                                                color="#8CD9FF"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.checkboxRow}
                                        activeOpacity={0.8}
                                        onPress={() => setRememberPassword((p) => !p)}
                                    >
                                        <View style={[styles.checkboxBox, rememberPassword && styles.checkboxChecked]}>
                                            {rememberPassword && <MaterialIcons name="check" size={14} color="#0F172A" />}
                                        </View>
                                        <Text style={styles.checkboxLabel}>Save password on this device</Text>
                                    </TouchableOpacity>
                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity
                                            style={[styles.googleButton, (loading || googleLoading) && styles.submitButtonDisabled]}
                                            activeOpacity={0.9}
                                            onPress={handleGoogleLogin}
                                            disabled={loading || googleLoading}
                                        >
                                            <FontAwesome name="google" size={18} color="#FFFFFF" />
                                            <Text style={styles.googleText}>Google Login</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.submitButton, (loading || googleLoading) && styles.submitButtonDisabled]}
                                            activeOpacity={0.85}
                                            onPress={handleLogin}
                                            disabled={loading || googleLoading}
                                        >
                                            <FontAwesome name="sign-in" size={18} color="#FFFFFF" />
                                            <Text style={styles.submitText}>Login</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                                    <View style={styles.helperRow}>
                                        <Text style={styles.helperText}>Don&apos;t have an account?</Text>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('SignUp')}
                                            disabled={loading}
                                        >
                                            <Text style={styles.linkText}>Sign up</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.forgotLink}
                                        onPress={handleForgotPress}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.forgotText}>Forgot password?</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.helperTextCentered}>
                                        We will send a one-time code to your {authMode === 'email' ? 'email' : 'phone'}.
                                    </Text>
                                    {!awaitingOtp ? (
                                        <>
                                            <Text style={styles.label}>{authMode === 'email' ? 'Email' : 'Phone'}</Text>
                                            {authMode === 'email' ? (
                                                <View style={[styles.input, styles.inputFlex]}>
                                                    <TextInput
                                                        value={email}
                                                        onChangeText={setEmail}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            placeholder="you@example.com"
                                            placeholderTextColor="rgba(255,255,255,0.6)"
                                            autoComplete="off"
                                            textContentType="none"
                                            importantForAutofill="no"
                                            style={{
                                                flex: 1,
                                                color: '#fff',
                                                fontSize: 14,
                                                paddingVertical: 0,
                                                        }}
                                                    />
                                                    <TouchableOpacity onPress={toggleAuthMode} style={styles.iconToggle}>
                                                        <FontAwesome name="phone" size={16} color="#8CD9FF" />
                                                    </TouchableOpacity>
                                                </View>
                                            ) : (
                                                <View style={[styles.inputRow, styles.inputFlex, styles.phoneRow]}>
                                                    <PhoneInput
                                                        value={phone}
                                                        onChangePhoneNumber={(text) => setPhone(text)}
                                                        selectedCountry={selectedCountry}
                                                        onChangeSelectedCountry={(country) => {
                                                            setSelectedCountry(country);
                                                            setPhone('');
                                                        }}
                                                        defaultCountry="US"
                                                        placeholder="123 456 7890"
                                                        modalType="bottomSheet"
                                                        modalSearchInputPlaceholderTextColor="#d1d5db"
                                                        phoneInputStyles={{
                                                            container: [styles.input, styles.phoneInputContainer] as any,
                                                            input: styles.phoneText as any,
                                                            callingCode: styles.phoneText as any,
                                                            flag: styles.phoneFlag as any,
                                                            flagContainer: styles.phoneFlagContainer as any,
                                                            divider: { backgroundColor: 'rgba(255,255,255,0.08)' },
                                                        }}
                                                        modalStyles={{
                                                            backdrop: { backgroundColor: 'rgba(0,0,0,0.03)' },
                                                            container: { backgroundColor: '#0b1422' },
                                                            content: { backgroundColor: '#0b1422' },
                                                            searchInput: { color: '#d1d5db' },
                                                            countryName: { color: '#d1d5db' },
                                                            callingCode: { color: '#d1d5db' },
                                                            countryInfo: { backgroundColor: '#0f2744' },
                                                            countryItem: { backgroundColor: '#0f2744' },
                                                            dragHandleIndicator: { backgroundColor: '#cdd2e0', shadowColor: '#cdd2e0', outlineColor: '#cdd2e0' },
                                                            alphabetLetterText: { color: '#9ca3af' },
                                                            alphabetLetterTextActive: { color: '#e5e7eb' },
                                                            alphabetLetterTextDisabled: { color: '#4b5563' },
                                                        }}
                                                    />
                                                    <TouchableOpacity onPress={toggleAuthMode} style={styles.iconToggle}>
                                                        <FontAwesome name="envelope" size={16} color="#8CD9FF" />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <View style={styles.otpHeader}>
                                                <Text style={styles.label}>Enter OTP</Text>
                                                <Text style={styles.otpTimer}>Expires in {otpCountdownLabel()}</Text>
                                            </View>
                                            <TextInput
                                                value={otpValue}
                                                onChangeText={setOtpValue}
                                                keyboardType="number-pad"
                                                placeholder="6-digit code"
                                                placeholderTextColor="rgba(255,255,255,0.6)"
                                                style={styles.input}
                                            />
                                        </>
                                    )}
                                    <TouchableOpacity
                                        style={[styles.submitButton, (forgotLoading) && styles.submitButtonDisabled, { marginTop: 12 }]}
                                        activeOpacity={0.9}
                                        onPress={handleForgotSubmit}
                                        disabled={forgotLoading}
                                    >
                                        <FontAwesome name={awaitingOtp ? 'check-circle' : 'paper-plane'} size={18} color="#FFFFFF" />
                                        <Text style={styles.submitText}>{awaitingOtp ? 'Verify OTP' : 'Send OTP'}</Text>
                                    </TouchableOpacity>
                                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                                    <TouchableOpacity
                                        style={styles.forgotLink}
                                        onPress={() => {
                                            setForgotFlow(false)
                                            resetOtpState()
                                            setError(null)
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.forgotText}>Back to password login</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            {(loading || googleLoading || forgotLoading) && (
                <View style={styles.loadingOverlay}>
                    <LoadingOverlay />
                </View>
            )}

        </LinearGradient>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 24,
        justifyContent: 'center',
    },
    content: {
        width: '100%',
        alignItems: 'center',
        gap: 8,
    },
    logo: {
        width: 120,
        height: 80,
        position: 'absolute',
        top: -10,
        left: -14,
    },
    form: {
        width: '100%',
        maxWidth: 360,
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.04)',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginTop: 10,
    },
    title: {
        color: '#F5F7FA',
        fontWeight: '700',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 8,
    },
    fieldGroup: {
        gap: 6,
    },
    label: {
        color: '#F5F7FA',
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    input: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12,
        borderRadius: 10,
        color: '#FFFFFF',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputFlex: {
        flex: 1,
        height: 48,
    },
    phoneInput: {
        paddingLeft: 4,
    },
    phoneRow: {
        alignItems: 'center',
        gap: 0,
    },
    phoneInputContainer: {
        paddingVertical: 4,
    },
    phoneText: {
        color: '#fff',
        fontSize: 14,
        paddingHorizontal: 1
    },
    phoneCallingCode: {
        color: '#8CD9FF',
        fontWeight: '600',
    },
    phoneFlag: {
        marginRight: 6,
    },
    phoneFlagContainer: {
        paddingHorizontal: 0,
        backgroundColor: 'transparent',
    },
    iconToggleInside: {
        paddingVertical: 4,
        height: '100%',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 999,
        right: 14
    },
    countryPickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0,
        paddingHorizontal: 2,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: 'rgba(255,255,255,0.05)',
        height: 48,
    },
    countryPickerButton: {
        paddingRight: 1,
    },
    callingCode: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    switchButton: {
        paddingHorizontal: 0,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    iconToggle: {
        paddingLeft: 0,
        paddingVertical: 4,
    },
    passwordWrapper: {
        position: 'relative',
        width: '100%',
    },
    passwordInput: {
        paddingRight: 44,
    },
    passwordToggle: {
        position: 'absolute',
        right: 5,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: 32,
    },
    helper: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
    },
    checkboxBox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    checkboxChecked: {
        backgroundColor: '#8CD9FF',
        borderColor: '#8CD9FF',
    },
    checkboxLabel: {
        color: '#E5EDFF',
        fontSize: 12,
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 8,
    },
    submitButton: {
        flex: 1,
        marginTop: 0,
        backgroundColor: '#2563EB',
        paddingVertical: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitText: {
        color: '#E5EDFF',
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    googleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#22C55E',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    googleText: {
        color: '#FFFFFF',
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    helperTextCentered: {
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 10,
    },
    otpHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    otpTimer: {
        color: '#8CD9FF',
        fontWeight: '700',
        fontSize: 12,
    },
    forgotLink: {
        marginTop: 2,
        alignItems: 'flex-start',
    },
    forgotText: {
        color: '#8CD9FF',
        fontWeight: '700',
    },
    helperRow: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 2,
    },
    helperText: {
        color: 'rgba(255,255,255,0.7)',
    },
    linkText: {
        color: '#8CD9FF',
        fontWeight: '700',
    },
    errorText: {
        color: '#ffb3b3',
        marginTop: 8,
        textAlign: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        height: 48,
        // backgroundColor: 'rgba(0,0,0,0.3)', // if you had bg on input
    },
    textInput: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
        paddingVertical: 0,   // so it centers nicely
    },
    endIconButton: {
        paddingLeft: 8,
        paddingVertical: 4,
    },
});
