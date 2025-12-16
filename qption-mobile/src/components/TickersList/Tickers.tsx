import React, { useEffect, useState, useMemo, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated, Dimensions, Platform } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import TopMenu from './TopMenu'
import api from '../../services/api'
import {
    setSymbols,
    setActiveTicker,
    setActiveTickerDemo,
    setActiveTickerBonus,
    addToWatchList,
    removeFormWatchList,
    TickerSymbol,
} from '../../store/slices/tradingRoomSlices/tickerSlice'
import type { AppDispatch, RootState } from '../../store'
import SearchBox from './SearchBox/SearchBox'
import { getModeAccent, hexToRgba } from '../../theme/modeAccent'

type Props = {
    visible: boolean
    onClose: () => void
}

const Tickers: React.FC<Props> = ({ visible, onClose }) => {
    const baseWidth = Math.min(Dimensions.get('window').width - 24, 480)
    const dropdownWidth = Math.max(300, baseWidth * 0.4)
    const dispatch = useDispatch<AppDispatch>()
    const { tickerType, fxSymbols, cryptoSymbols, WATCHLISTSymbols, activeTicker, activeTickerDemo, activeTickerBonus } = useSelector((s: RootState) => s.ticker)
    const mode = useSelector((s: RootState) => s.tradingRoom.mode)
    const { timer } = useSelector((s: RootState) => s.trade)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const anim = useRef(new Animated.Value(0)).current
    const [shouldRender, setShouldRender] = useState(false)

    const symbols = useMemo(() => {
        switch (tickerType) {
            case 'crypto':
                return cryptoSymbols
            case 'WATCHLIST':
                return WATCHLISTSymbols
            default:
                return fxSymbols
        }
    }, [tickerType, fxSymbols, cryptoSymbols, WATCHLISTSymbols])

    const fetchSymbols = async (q?: string) => {
        try {
            setLoading(true)
            if (tickerType === 'fx') {
                const res = await api.get('/api/tickers/forexSymbols', { params: q ? { q } : undefined })
                dispatch(setSymbols({ tickerType: 'fx', symbols: res.data?.items || [] }))
            } else if (tickerType === 'crypto') {
                const res = await api.get('/api/tickers/cryptoSymbols', { params: q ? { q } : undefined })
                dispatch(setSymbols({ tickerType: 'crypto', symbols: res.data?.items || [] }))
            }
        } catch {
            // ignore
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSymbols(search.trim() || undefined)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tickerType])

    const selectedActiveTicker =
        mode === 'demo'
            ? activeTickerDemo
            : mode === 'bonus'
                ? activeTickerBonus
                : activeTicker

    const handleSelect = (symbol: TickerSymbol) => {
        const payload = {
            ...symbol,
            payoutPercentage: symbol.payoutPercentage ?? 0,
            market: symbol.market || (tickerType === 'fx' ? 'fx' : 'crypto'),
            currency_symbol: symbol.currency_symbol || 'USD',
            base_currency_symbol: symbol.base_currency_symbol || symbol.symbol?.split(':')?.[1] || '',
        }
        if (mode === 'demo') {
            dispatch(setActiveTickerDemo(payload as any))
        } else if (mode === 'bonus') {
            dispatch(setActiveTickerBonus(payload as any))
        } else {
            dispatch(setActiveTicker(payload as any))
        }
        onClose()
    }

    const filteredSymbols = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return symbols
        return symbols.filter((s) => s.symbol?.toLowerCase().includes(q))
    }, [symbols, search])

    useEffect(() => {
        if (visible) setShouldRender(true)
        Animated.timing(anim, {
            toValue: visible ? 1 : 0,
            duration: 150,
            useNativeDriver: false,
        }).start(() => {
            if (!visible) setShouldRender(false)
        })
    }, [visible, anim])

    const accent = useMemo(() => getModeAccent(mode), [mode])

    const adjustedPayout = (base?: number | null) => {
        if (base === null || base === undefined || Number.isNaN(base)) return null
        let deduction = 0
        if (timer > 600) {
            deduction = 6
            const extraBlocks = Math.floor((timer - 600) / 1800)
            deduction += extraBlocks * 6
        }
        const next = Math.max(0, base - deduction)
        return next
    }

    if (!shouldRender) return null

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    width: dropdownWidth,
                    opacity: anim,
                    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }) }],
                },
            ]}
        >
            <TopMenu setLoading={setLoading} setValue={setSearch} />
            <View style={styles.listWrapper}>
                <FlatList
                    data={filteredSymbols}
                    keyExtractor={(item) => item.symbol}
                    refreshing={loading}
                    onRefresh={() => fetchSymbols(search.trim() || undefined)}
                    indicatorStyle="white"
                    showsVerticalScrollIndicator
                    scrollEnabled
                    nestedScrollEnabled
                    contentContainerStyle={{ paddingBottom: 8 }}
                    style={styles.list}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => {
                        const inWatchlist = WATCHLISTSymbols.some((wl) => wl.symbol === item.symbol)
                        const isActive = selectedActiveTicker?.symbol === item.symbol
                        const activeTint = hexToRgba(accent.strong, 0.4)
                        return (
                            <TouchableOpacity
                                style={[
                                    styles.item,
                                    isActive && [
                                        styles.itemActive,
                                        {
                                            backgroundColor: hexToRgba(accent.strong, 0.14),
                                            borderColor: activeTint,
                                        },
                                    ],
                                ]}
                                onPress={() => handleSelect(item)}
                            >
                                <TouchableOpacity
                                    style={styles.starHit}
                                    onPress={(e) => {
                                        e.stopPropagation()
                                        if (inWatchlist) {
                                            dispatch(removeFormWatchList(item.symbol))
                                        } else {
                                            dispatch(addToWatchList(item as any))
                                        }
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.star,
                                            { color: accent.primary },
                                            isActive && { color: accent.soft },
                                        ]}
                                    >
                                        {inWatchlist ? '★' : '☆'}
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.symbolBlock}>
                                    <Text
                                        style={[
                                            styles.symbol,
                                            { color: accent.primary },
                                            isActive && { color: accent.soft },
                                        ]}
                                    >
                                        {item.symbol.slice(2)}
                                    </Text>
                                </View>
                                {typeof item.payoutPercentage === 'number' && (
                                    <Text
                                        style={[
                                            styles.payout,
                                            { color: accent.primary },
                                            isActive && { color: accent.soft },
                                        ]}
                                    >
                                        {adjustedPayout(item.payoutPercentage) ?? item.payoutPercentage}%
                                    </Text>
                                )}
                            </TouchableOpacity>
                        )
                    }}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>{loading ? 'Loading...' : 'No symbols found.'}</Text>
                        </View>
                    }
                />
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    card: {
        top: 4,
        alignSelf: 'flex-start',
        backgroundColor: '#05070d',
        borderRadius: 12,
        padding: 12,
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
        zIndex: 500,
    },
    listWrapper: {
        marginTop: 8,
        borderRadius: 10,
        height: 190,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    list: {
        height: '100%',
        width: '100%',
        // web-only scrollbar styling
        scrollbarWidth: 'thin' as any,
        scrollbarColor: '#2F6BB5 rgba(47,107,181,0.2)' as any,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    itemActive: {
        backgroundColor: 'rgba(79,134,216,0.14)',
        borderColor: 'rgba(79,134,216,0.4)',
    },
    starHit: {
        paddingRight: 6,
        paddingVertical: 4,
    },
    star: {
        color: '#E8F0FF',
        fontSize: 16,
        width: 18,
        textAlign: 'center',
    },
    starActive: {
        color: '#E8F0FF',
    },
    symbol: {
        color: '#E8F0FF',
        fontWeight: '600',
        flexShrink: 1,
    },
    symbolActive: {
        color: '#E8F0FF',
    },
    symbolBlock: {
        flex: 1,
    },
    payout: {
        color: '#E8F0FF',
        fontWeight: '700',
        textAlign: 'right',
    },
    payoutActive: {
        color: '#E8F0FF',
    },
    empty: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    emptyText: {
        color: 'rgba(232,240,255,0.7)',
    },
})

export default Tickers
