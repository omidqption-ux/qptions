import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../services/api'
import { selectTickerType, TickerType } from '../../store/slices/tradingRoomSlices/tickerSlice'
import type { AppDispatch, RootState } from '../../store'
import { getModeAccent, hexToRgba } from '../../theme/modeAccent'

type Props = {
    setLoading: (loading: boolean) => void
    setValue: (value: string) => void
}

const TopMenu: React.FC<Props> = ({ setLoading, setValue }) => {
    const dispatch = useDispatch<AppDispatch>()
    const [isFxActive, setIsFxActive] = useState(true)
    const tickerType = useSelector((store: RootState) => store.ticker.tickerType)
    const mode = useSelector((store: RootState) => store.tradingRoom.mode)
    const accent = useMemo(() => getModeAccent(mode), [mode])

    const setTickerTypeLocal = (type: TickerType) => {
        if (!isFxActive && type === 'fx') return
        dispatch(selectTickerType({ tickerType: type }))
        setValue('')
    }

    const setAvailableTickerType = async () => {
        try {
            setLoading(true)
            const res = await api.get('/api/tickers/checkMarketStatus', { params: { market: 'fx' } })
            if (res.data?.isOpen) {
                setIsFxActive(true)
                setTickerTypeLocal(tickerType)
            } else {
                setIsFxActive(false)
                setTickerTypeLocal('crypto')
            }
        } catch {
            // ignore
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setAvailableTickerType()
        dispatch(selectTickerType({ tickerType }))
        setValue('')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!isFxActive && tickerType === 'fx') {
            setTickerTypeLocal('crypto')
        }
    }, [isFxActive, tickerType])

    const renderButton = (type: TickerType, label: string) => {
        const isActive = tickerType === type
        const isFxClosed = type === 'fx' && !isFxActive
        const showHolidayBadge = type === 'fx' && isFxClosed
        const activeTint = hexToRgba(accent.strong, 0.28)
        return (
            <TouchableOpacity
                style={[
                    styles.tab,
                    isActive && [
                        styles.tabActive,
                        {
                            backgroundColor: hexToRgba(accent.strong, 0.16),
                            borderColor: activeTint,
                        },
                    ],
                    isFxClosed && styles.tabDisabled,
                ]}
                onPress={() => setTickerTypeLocal(type)}
                activeOpacity={isFxClosed ? 1 : 0.85}
                disabled={isFxClosed}
            >
                <View style={styles.tabContent}>
                    <Text
                        style={[
                            styles.tabText,
                            { color: hexToRgba(accent.primary, 0.8) },
                            isActive && [
                                styles.tabTextActive,
                                { color: accent.strong, fontWeight: '800' },
                            ],
                        ]}
                    >
                        {label}
                    </Text>
                    {showHolidayBadge && (
                        <View style={styles.holidayBadge}>
                            <Text style={styles.holidayText}>Holiday</Text>
                        </View>
                    )}
                </View>
                <View
                    style={[
                        styles.tabIndicator,
                        isActive && [
                            styles.tabIndicatorActive,
                            { backgroundColor: accent.strong },
                        ],
                    ]}
                />
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            {renderButton('fx', 'Forex')}
            {renderButton('crypto', 'Crypto')}
            {renderButton('WATCHLIST', 'Watchlist')}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
        marginTop: 6,
        marginBottom: 6,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(12,26,44,0.4)',
        gap: 6,
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    tabActive: {
        backgroundColor: 'rgba(79,134,216,0.12)',
    },
    tabDisabled: {
        opacity: 0.7,
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    tabText: {
        color: 'rgba(232,240,255,0.65)',
        fontSize: 13,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#E8F0FF',
    },
    tabIndicator: {
        marginTop: 4,
        height: 2,
        alignSelf: 'stretch',
        borderRadius: 999,
        backgroundColor: 'transparent',
    },
    tabIndicatorActive: {
        backgroundColor: '#4F86D8',
    },
    holidayBadge: {
        position: 'absolute',
        top: -8,
        left: 18,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: '#ff5c5cff',
    },
    holidayText: {
        color: '#1f2937',
        fontSize: 9,
        fontWeight: '700',
        lineHeight: 12,
    },
})

export default TopMenu
