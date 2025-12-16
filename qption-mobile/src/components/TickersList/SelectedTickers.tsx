import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import Tickers from './Tickers'
import { getModeAccent } from '../../theme/modeAccent'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

const SelectedTickers: React.FC = () => {
    const { activeTicker, activeTickerDemo, activeTickerBonus } = useSelector((store: RootState) => store.ticker)
    const mode = useSelector((store: RootState) => store.tradingRoom.mode)
    const aiActive = useSelector((store: RootState) => store.trade.aiActive)
    const [visible, setVisible] = useState(false)
    const accent = getModeAccent(mode)

    const selectedTicker =
        mode === 'demo'
            ? activeTickerDemo
            : mode === 'bonus'
                ? activeTickerBonus
                : activeTicker
    const marketIcon =
        (selectedTicker as any)?.market === 'crypto'
            ? 'bitcoin'
            : 'trending-up'

    const toggleModal = () => {
        if (aiActive) return;
        setVisible((p) => !p)
    }
    const closeModal = () => setVisible(false)

    useEffect(() => {
        if (aiActive) setVisible(false);
    }, [aiActive]);
    return (
        <View style={styles.container}>
            {selectedTicker.symbol ? (
                <TouchableOpacity style={styles.selector} onPress={toggleModal} >
                    <MaterialCommunityIcons name={marketIcon as any} size={16} color={accent.strong} />
                    <Text style={[styles.symbol, { color: accent.primary }]}>
                        {selectedTicker.symbol.slice(2)}
                    </Text>
                    <View style={[styles.arrowWrap, visible && styles.arrowPressed]}>
                        <MaterialIcons
                            name="expand-more"
                            size={16}
                            color={accent.primary}
                            style={styles.arrowIcon}
                        />
                    </View>
                </TouchableOpacity>
            ) : null}
            {visible && (
                <Modal
                    transparent
                    visible={visible}
                    animationType="fade"
                    onRequestClose={closeModal}
                    presentationStyle="overFullScreen"
                >
                    <View style={styles.modalOverlay} pointerEvents="box-none">
                        <TouchableOpacity style={styles.globalBackdrop} onPress={closeModal} />
                        <View style={styles.dropdownContainer} pointerEvents="box-none">
                            <Tickers visible={visible} onClose={closeModal} />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 8,
        position: 'relative',
        zIndex: 50,
        overflow: 'visible',
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(31, 76, 143, 0.15)',
        width: 100,
        justifyContent: 'center',
    },
    arrowWrap: {
        transform: [{ translateY: 0 }],
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowPressed: {
        transform: [{ translateY: 2 }],
    },
    arrowIcon: {
        textShadowColor: 'rgba(0,0,0,0.35)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    symbol: {
        color: '#E8F0FF',
        fontWeight: '600',
        fontSize: 12,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 22,
    },
    globalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2200,
        backgroundColor: 'rgba(0,0,0,0.045)',
        width: '100%',
    },
    dropdownContainer: {
        position: 'absolute',
        top: 50,
        left: 80,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100000,
    },
})

export default SelectedTickers
