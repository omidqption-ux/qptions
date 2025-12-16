import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform, Pressable, Modal, Animated, Easing, ActivityIndicator, Linking, DeviceEventEmitter } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuth } from '../store/slices/authSlice'
import api from '../services/api'
import LoadingOverlay from './LoadingOverlay'
import { setUserSettings, setUserProfile, setUserBalances } from '../store/slices/userSlice'
import { setMode, setTradingRoom } from '../store/slices/tradingRoomSlices/tradingRoomSlice'
import { RootState } from '../store'
import SelectedTickers from './TickersList/SelectedTickers'
import { defaultAvatar } from '../constants/images'
import StepOne from './Deposites/stepOne'
import StepTwo from './Deposites/stepTwo'
import StepThree from './Deposites/stepThree'
import { getModeAccent, hexToRgba } from '../theme/modeAccent'
import { getSocketByMode } from '../config/env'

type CurrencyTextProps = {
    value: number
    style?: any
}

const CurrencyText = ({ value, style }: CurrencyTextProps) => (
    <Text style={style}>
        {Number.isFinite(value) ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}
    </Text>
)
type Props = { children: ReactNode }

export default function TradingRoomLayout({ children }: Props) {
    const dispatch = useDispatch()
    const [menuOpen, setMenuOpen] = useState(false)
    const [userBalance, setUserBalance] = useState(0)
    const [modeMenuOpen, setModeMenuOpen] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)
    const [balanceLoading, setBalanceLoading] = useState(false)
    const [depositOpen, setDepositOpen] = useState(false)
    const [depositStep, setDepositStep] = useState(0)
    const {
        balance,
        bonusBalance,
        demoBalance,
        profile,
    } = useSelector((store: RootState) => store.user)
    const { aiActive } = useSelector((store: RootState) => store.trade)
    const tradingMode = useSelector((store: RootState) => store.tradingRoom.mode)
    const amountIsMoreThanBalance = useSelector((store: RootState) => store.tradingRoom.amountIsMoreThanBalance)

    const modeLabel = tradingMode === 'demo' ? 'Demo' : tradingMode === 'bonus' ? 'Bonus' : 'Real'

    const balanceShake = useRef(new Animated.Value(0)).current
    const [balanceWarn, setBalanceWarn] = useState(false)
    const contactLabel = useMemo(
        () => (profile?.email || profile?.phone || "--"),
        [profile?.email, profile?.phone]
    )
    const logOut = async () => {
        try {
            setLoggingOut(true)
            await api.post('/api/auth/logout')
            dispatch(clearAuth())
        } catch (e: any) {
            Alert.alert('Logout failed', e?.response?.data?.message || 'Please try again.')
        } finally {
            setMenuOpen(false)
            setLoggingOut(false)
        }
    }
    const handleWithdraw = async () => {
        try {
            setMenuOpen(false)
            await Linking.openURL('https://panel.qption.com/Withdrawal')
        } catch {
            Alert.alert('Unable to open link', 'Please try again.')
        }
    }

    const showContactTooltip = () => {
        if (!contactLabel || contactLabel === '--') return;
        DeviceEventEmitter.emit('option-panel-toast', contactLabel);
    }

    const getUserTradingRoomInfo = async () => {
        try {
            const tradingRoomRes = await api.post('/api/tradingRoom/setTradingRoom')
            const responseSettings = await api.get('/api/users/settings')
            dispatch(setUserSettings(responseSettings.data))
            dispatch(setTradingRoom({ tradingRoomId: tradingRoomRes.data._id }))
            dispatch(setMode('real'))
            try {
                const profileRes = await api.get('/api/users/getUserBalanceAndUsername')
                if (profileRes.data) {
                    if (typeof profileRes.data.balance === 'number') {
                        dispatch(setUserBalances(profileRes.data))
                        setUserBalance(profileRes.data.balance)  /// initial load set real balance to show
                    }
                    dispatch(
                        setUserProfile({
                            ...profile,
                            username: profileRes.data.username || '',
                            profileImage: profileRes.data.avatar || '',
                            email: profileRes.data.email || '',
                            phone: profileRes.data.phone || ''
                        })
                    )
                }
            } catch { }
        } catch (e) {
        } finally {
            setBalanceLoading(false)
        }
    }

    useEffect(() => {
        getUserTradingRoomInfo()
        return () => setBalanceLoading(true)
    }, [])

    const handleModeSelect = (mode: 'real' | 'demo' | 'bonus') => {
        if (aiActive) return;
        dispatch(setMode(mode))
        switch (mode) {
            case 'real':
                setUserBalance(balance)
                break;
            case 'demo':
                setUserBalance(demoBalance)
                break;
            case 'bonus':
                setUserBalance(bonusBalance)
                break;
        }

        setModeMenuOpen(false)
    }

    const accent = useMemo(() => getModeAccent(tradingMode), [tradingMode])

    useEffect(() => {
        if (amountIsMoreThanBalance) {
            setBalanceWarn(true)
            balanceShake.setValue(0)
            Animated.sequence([
                Animated.timing(balanceShake, { toValue: 1, duration: 70, easing: Easing.linear, useNativeDriver: true }),
                Animated.timing(balanceShake, { toValue: -1, duration: 70, easing: Easing.linear, useNativeDriver: true }),
                Animated.timing(balanceShake, { toValue: 1, duration: 70, easing: Easing.linear, useNativeDriver: true }),
                Animated.timing(balanceShake, { toValue: 0, duration: 70, easing: Easing.linear, useNativeDriver: true }),
            ]).start(() => setBalanceWarn(false))
        }
    }, [amountIsMoreThanBalance, balanceShake])

    // Join balance room per mode and listen for live updates
    useEffect(() => {
        const socket = getSocketByMode(tradingMode)
        if (!socket) return undefined;
        const handler = (payload: any) => {
            setBalanceLoading(true)
            const bal = payload?.balance || {}
            const nextReal = typeof bal.amount === 'number' ? bal.amount : balance
            const nextDemo = typeof bal.demo === 'number' ? bal.demo : demoBalance
            const nextBonus = typeof bal.bonus === 'number' ? bal.bonus : bonusBalance

            dispatch(setUserBalances({ balance: nextReal, demoBalance: nextDemo, bonusBalance: nextBonus }))

            const current =
                tradingMode === 'demo'
                    ? nextDemo
                    : tradingMode === 'bonus'
                        ? nextBonus
                        : nextReal
            setUserBalance(current)
            setBalanceLoading(false)
        }
        if (!socket.connected) socket.connect()
        socket.emit('joinBalanceCheckRoom')
        socket.on('balanceUpdate', handler)
        return () => {
            socket.off('balanceUpdate', handler)
            socket.emit('leaveBalanceCheckRoom')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tradingMode, dispatch, balance, demoBalance, bonusBalance])

    // Keep the displayed balance in sync when mode or stored balances change
    useEffect(() => {
        const next =
            tradingMode === 'demo'
                ? demoBalance
                : tradingMode === 'bonus'
                    ? bonusBalance
                    : balance;
        setUserBalance(Number.isFinite(next as number) ? Number(next) : 0);
    }, [tradingMode, balance, demoBalance, bonusBalance])

    const refreshBalance = async () => {
        if (aiActive) return;
        try {
            setBalanceLoading(true)
            let res
            if (tradingMode !== 'demo') {
                res = await api.get('/api/users/getUserBalanceAndUsername')
            }
            else {
                res = await api.put('/api/users/refreshDemoBalance')
            }
            if (res.data) {
                const real = typeof res.data.balance === 'number' ? res.data.balance : balance
                const demo = typeof res.data.demoBalance === 'number' ? res.data.demoBalance : demoBalance
                const bonus = typeof res.data.bonusBalance === 'number' ? res.data.bonusBalance : bonusBalance
                dispatch(setUserBalances({ balance: real, demoBalance: demo, bonusBalance: bonus }))
                // refresh the local pill in case mode matches
                const next =
                    tradingMode === 'demo' ? demo : tradingMode === 'bonus' ? bonus : real
                setUserBalance(next)
            }
        } catch (e: any) {
        } finally {
            setBalanceLoading(false)
        }
    }
    const navigateToDeposit = () => {
        setMenuOpen(false)
        setDepositStep(0)
        setDepositOpen(true)
    }
    useEffect(() => {
        if (aiActive) {
            setMenuOpen(false);
            setModeMenuOpen(false);
        }
    }, [aiActive]);

    return (
        <View style={styles.safe}>
            {(menuOpen || modeMenuOpen) && (
                <Pressable style={styles.globalBackdrop} onPress={() => { setMenuOpen(false); setModeMenuOpen(false) }} />
            )}
            <LinearGradient
                colors={['#020304', '#0A0F19']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 5 }}
                style={styles.header}
            >
                <View style={styles.headerPart}>
                    <TouchableOpacity style={styles.modePill} onPress={() => {
                        if (aiActive) return;
                        setModeMenuOpen((p) => !p);
                    }}>
                        <MaterialIcons
                            name={
                                tradingMode === 'demo'
                                    ? 'school'
                                    : tradingMode === 'bonus'
                                        ? 'card-giftcard'
                                        : 'payments'
                            }
                            size={14}
                            color={accent.strong}
                        />
                        <View style={styles.modeLabelWrap}>
                            <Text style={[styles.modeText, { color: accent.primary }]}>
                                {modeLabel}
                            </Text>

                        </View>
                        <View style={[styles.modeArrowWrap, modeMenuOpen && styles.modeArrowPressed]}>
                            <MaterialIcons
                                name="expand-more"
                                size={16}
                                color={accent.primary}
                                style={styles.modeArrowIcon}
                            />
                        </View>
                    </TouchableOpacity>
                    <SelectedTickers />
                </View>
                <View style={styles.headerPart}>

                    <Animated.View
                        style={{
                            transform: [
                                {
                                    translateX: balanceShake.interpolate({
                                        inputRange: [-1, 0, 1],
                                        outputRange: [-4, 0, 4],
                                    }),
                                },
                            ],
                        }}
                    >
                        <TouchableOpacity style={[styles.balancePill, styles.balancePillRow]} onPress={refreshBalance} activeOpacity={aiActive ? 1 : 0.8}>
                            {tradingMode === 'demo' && (
                                <MaterialIcons
                                    name="refresh"
                                    size={16}
                                    color={balanceLoading ? '#7EA7FF66' : accent.primary}
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            {balanceLoading ? (
                                <ActivityIndicator color="#E8F0FF" />
                            ) : (
                                <CurrencyText
                                    value={userBalance}
                                    style={[styles.pillValue, { color: accent.strong }, balanceWarn && styles.pillValueWarn]}
                                />
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                    <TouchableOpacity onPress={() => { if (aiActive) return; setMenuOpen((p) => !p) }} style={styles.avatarButton}>
                        <View style={styles.avatarImageWrapper}>
                            <Image
                                source={
                                    profile?.profileImage
                                        ? profile.profileImage.startsWith('http') || profile.profileImage.startsWith('data:')
                                            ? { uri: profile.profileImage }
                                            : { uri: `data:image/jpeg;base64,${profile.profileImage}` }
                                        : defaultAvatar
                                }
                                style={[
                                    styles.avatar,
                                    { borderColor: hexToRgba(accent.primary, 0.45) },
                                ]}
                                resizeMode="cover"
                            />
                        </View>
                        <View style={styles.avatarChevron}>
                            <MaterialIcons
                                name="expand-more"
                                size={14}
                                color={accent.primary}
                                style={[
                                    styles.avatarChevronIcon,
                                    menuOpen && styles.avatarChevronIconPressed,
                                ]}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <View style={styles.content}>{children}</View>

            {modeMenuOpen && !aiActive && (
                <View style={styles.modeMenu}>
                    {(['real', 'demo', 'bonus'] as const).map((m) => {
                        const itemAccent = getModeAccent(m);
                        const isActive = m === tradingMode;
                        const iconName = m === 'demo'
                            ? 'school'
                            : m === 'bonus'
                                ? 'card-giftcard'
                                : 'payments';

                        return (
                            <TouchableOpacity
                                key={m}
                                style={[
                                    styles.modeMenuItem,
                                    isActive && styles.modeMenuItemActive,
                                    isActive && {
                                        backgroundColor: hexToRgba(itemAccent.strong, 0.14),
                                        borderColor: hexToRgba(itemAccent.strong, 0.35),
                                    },
                                ]}
                                onPress={() => handleModeSelect(m)}
                                activeOpacity={0.85}
                            >
                                <View style={styles.modeMenuItemRow}>
                                    <MaterialIcons
                                        name={iconName as any}
                                        size={16}
                                        color={isActive ? itemAccent.strong : itemAccent.primary}
                                    />
                                    <Text style={[
                                        styles.modeMenuText,
                                        { color: isActive ? itemAccent.strong : itemAccent.primary },
                                        isActive && styles.modeMenuTextActive,
                                    ]}>
                                        {m === 'demo' ? 'Demo' : m === 'bonus' ? 'Bonus' : 'Real'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}

            {menuOpen && !aiActive && (
                <View style={styles.menuDropdown}>
                    <Pressable style={[styles.menuItem, styles.menuItemInfo]} onPress={showContactTooltip}>
                        <View style={styles.menuItemRow}>
                            <MaterialIcons
                                name={(profile?.email ? 'alternate-email' : 'phone') as any}
                                size={12}
                                style={[styles.menuItemIcon, { color: accent.strong }]}
                            />
                            <Text style={[styles.menuItemText, { color: accent.primary }]} numberOfLines={1}>
                                {contactLabel}
                            </Text>
                        </View>
                    </Pressable>
                    <TouchableOpacity style={styles.menuItem} onPress={navigateToDeposit}>
                        <View style={styles.menuItemRow}>
                            <MaterialIcons
                                name="credit-score"
                                size={12}
                                style={[styles.menuItemIcon, { color: accent.strong }]}
                            />
                            <Text style={[styles.menuItemText, { color: accent.primary }]}>Deposit</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={handleWithdraw}>
                        <View style={styles.menuItemRow}>
                            <MaterialIcons
                                name="account-balance-wallet"
                                size={12}
                                style={[styles.menuItemIcon, { color: accent.strong }]}
                            />
                            <Text style={[styles.menuItemText, { color: accent.primary }]}>Withdraw</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={logOut}>
                        <View style={styles.menuItemRow}>
                            <MaterialIcons
                                name="logout"
                                size={12}
                                style={[styles.menuItemIcon, { color: accent.strong }]}
                            />
                            <Text style={[styles.menuItemText, { color: accent.primary }]}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            {loggingOut && (
                <View style={styles.overlayWrapper}>
                    <LoadingOverlay />
                </View>
            )}

            <View style={styles.cornerLogo} pointerEvents="none">
                <Image
                    source={require('../../assets/bottomLogo.png')}
                    style={styles.cornerLogoImage}
                    resizeMode="none"
                />
            </View>
            <Modal
                transparent
                visible={depositOpen}
                animationType="slide"
                onRequestClose={() => setDepositOpen(false)}
                presentationStyle="overFullScreen"
            >
                <View style={styles.depositRoot}>

                    {/* Centered card */}
                    <View style={styles.depositContainer}>
                        <Pressable
                            style={styles.depositCard}
                            onPress={(e) => e.stopPropagation()}
                        >
                            <View style={styles.depositBody}>
                                {depositStep === 0 && <StepOne closeDepModal={() => setDepositOpen(false)} setDepositStep={setDepositStep} />}
                                {depositStep === 1 && <StepTwo closeDepModal={() => setDepositOpen(false)} setDepositStep={setDepositStep} />}
                                {depositStep === 2 && <StepThree closeDepModal={() => setDepositOpen(false)} setDepositStep={setDepositStep} />}
                            </View>
                        </Pressable>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#0B1422',
    },
    globalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2200,
        backgroundColor: 'rgba(0,0,0,0.06)',
    },
    header: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        zIndex: 300,
        overflow: 'visible',

    },
    headerPart: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        color: '#E8F0FF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.4,
    },
    modePill: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
        width: 80,
        alignItems: 'center',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 4,
        backgroundColor: 'rgba(31, 76, 143, 0.15)',
    },
    modeText: {
        fontWeight: '600',
        fontSize: 12,
        textAlign: 'center',
    },
    modeLabelWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
    },
    modeSubText: {
        fontSize: 8,
        fontWeight: '600',
        letterSpacing: 0.2,
        marginTop: 6,
        marginLeft: 2,
        textAlign: 'left',
    },
    modeArrow: {
        fontWeight: '600',
        fontSize: 10,
        transform: [{ rotate: '0deg' }],
    },
    modeArrowOpen: {
        transform: [{ rotate: '180deg' }],
    },
    modeArrowWrap: {
        marginLeft: 2,
        transform: [{ translateY: 0 }],
    },
    modeArrowPressed: {
        transform: [{ translateY: 2 }],
    },
    modeArrowIcon: {
        textShadowColor: 'rgba(0,0,0,0.35)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    modeMenu: {
        position: 'absolute',
        top: 54,
        left: 16,
        backgroundColor: '#05070d',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        minWidth: 110,
        zIndex: 2301,
        ...Platform.select({
            web: {
                boxShadow: '0 10px 22px rgba(0,0,0,0.35)',
            },
            default: {
                shadowColor: '#000',
                shadowOpacity: 0.35,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 14,
            },
        }),
        gap: 6,
    },
    modeMenuSide: {
        top: 16,
        left: 12,
    },
    modeMenuItem: {
        paddingVertical: 6,
        paddingHorizontal: 0,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    modeMenuItemRow: {
        gap: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modeMenuItemActive: {
        backgroundColor: 'rgba(79,134,216,0.14)',
        borderColor: 'rgba(79,134,216,0.35)',
    },
    modeMenuText: {
        fontWeight: '600',
    },
    modeMenuTextActive: {
        fontWeight: '700',
    },
    avatarButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        overflow: 'visible',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        position: 'relative',
    },
    avatarImageWrapper: {
        width: '100%',
        height: '100%',
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderWidth: 1,
    },
    avatarChevron: {
        position: 'absolute',
        right: -6,
        bottom: -6,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: 'rgba(12,26,44,0.85)',
        borderColor: 'rgba(255,255,255,0.15)',
        overflow: 'visible',
    },
    avatarChevronIcon: {
        textShadowColor: 'rgba(0,0,0,0.35)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        transform: [{ translateY: 0 }],
    },
    avatarChevronIconPressed: {
        transform: [{ translateY: 2 }],
    },
    depositOverlay: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    depositContainer: {
        maxWidth: 700,
        width: '98%',
        height: '90%',
        maxHeight: '90%',
        padding: 12,
        backgroundColor: '#05070d',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 16,
    },
    depositCard: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        paddingHorizontal: 0,
        paddingVertical: 0,
        minHeight: '80%',
        maxHeight: '100%',
    },
    depositHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    depositTitle: {
        color: '#E8F0FF',
        fontWeight: '700',
        fontSize: 16,
    },
    depositClose: {
        padding: 6,
        margin: -6,
    },
    depositBody: {
        minHeight: 180,
        flex: 1,
        marginBottom: 14,
    },
    depositActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    depositButton: {
        flex: 1,
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    depositButtonText: {
        color: '#E5EDFF',
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    depositButtonGhost: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.04)',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    depositButtonGhostText: {
        color: '#E5EDFF',
        fontWeight: '600',
    },
    balancePill: {
        backgroundColor: 'rgba(31, 76, 143, 0.15)',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    balancePillRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    refreshIconWrap: {
        marginRight: 6,
    },
    demoButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: '#2563EB',
        borderWidth: 1,
        borderColor: '#1D4ED8',
    },
    demoText: {
        color: '#EAF2FF',
        fontWeight: '700',
        fontSize: 12,
    },
    content: {
        flex: 1,
        backgroundColor: '#0B1422',
    },
    menuDropdown: {
        position: 'absolute',
        top: 54,
        right: 16,
        borderRadius: 12,
        padding: 12,
        gap: 10,
        zIndex: 2300,
        backgroundColor: '#05070d',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        ...Platform.select({
            web: {
                boxShadow: '0 10px 22px rgba(0,0,0,0.35)',
            },
            default: {
                shadowColor: '#000',
                shadowOpacity: 0.35,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 14,
            },
        }),
    },
    dropdownHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownLogo: {
        width: 100,
        height: 30,
    },
    dropdownBalance: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
        width: '100%'
    },
    pillLabel: {
        color: 'rgba(232,240,255,0.8)',
        fontSize: 12,
        marginBottom: 2,
    },
    pillValue: {
        fontSize: 13,
        fontWeight: '700',
    },
    pillValueWarn: {
        color: '#ff6b6b',
    },
    menuItem: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.04)',
        alignContent: 'space-between',
        display: 'flex',
        width: 90
    },
    menuItemInfo: {
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    menuItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%'
    },
    menuItemIcon: {
        color: '#E8F0FF',
        marginRight: 2,
    },
    menuItemText: {
        color: '#E8F0FF',
        fontWeight: '600',
        textAlign: 'left',
    },
    overlayWrapper: {
        ...StyleSheet.absoluteFillObject,
    },
    cornerLogo: {
        position: 'absolute',
        bottom: -8,
        left: 12,
        width: 88,
        height: 44,
        zIndex: 99999,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        ...Platform.select({
            web: {
                boxShadow: '0 6px 14px rgba(0,0,0,0.35)',
            },
            default: {
                shadowColor: '#000',
                shadowOpacity: 0.35,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 4 },
                elevation: 12,
            },
        }),
    },
    cornerLogoImage: {
        width: '100%',
        height: '100%',
    },
    depositRoot: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.045)',
    },

    // Backdrop that actually covers everything
    depositBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
})
