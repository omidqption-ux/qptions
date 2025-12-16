import React, { memo, useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

type PaymentMethodProps = {
    logo: ImageSourcePropType
    title: string
    code: string
    isSelected?: boolean
    onPress?: () => void
    /** Legacy prop name kept for compatibility */
    onClick?: () => void
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
    logo,
    title,
    code,
    isSelected = false,
    onPress,
    onClick,
}) => {
    const handlePress = onPress || onClick
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePress}
            style={[
                styles.card,
                styles.cardDefault,
                isSelected ? styles.cardSelected : styles.cardUnselected,
            ]}
        >
            <View
                style={[
                    styles.overlay,
                    isSelected ? styles.overlayVisible : styles.overlayHidden,
                ]}
            />

            <View style={styles.row}>
                <View style={styles.textBlock}>
                    <Text
                        style={styles.title}
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                    <View style={styles.codeRow}>
                        <Image
                            source={logo}
                            style={{
                                width: 32,
                                height: 32,
                            }}
                            resizeMode="cover"
                        />
                        <Text style={styles.code} numberOfLines={1}>
                            {code}
                        </Text>
                    </View>
                </View>
                {isSelected && (
                    <View style={styles.checkWrap}>
                        <MaterialIcons
                            name="check-circle"
                            size={18}
                            color="#4F86D8"
                        />
                    </View>
                )}
            </View>
            <View
                style={[
                    styles.bottomLine,
                    isSelected && styles.bottomLineVisible,
                ]}
            />
        </TouchableOpacity>
    )
}

export default memo(PaymentMethod)

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#05070d',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 14,
    },
    cardDefault: {
        width: 170,
        height: 70
    },
    cardSelected: {
        borderWidth: 1,
        borderColor: 'rgba(79,134,216,0.45)',
        backgroundColor: 'rgba(79,134,216,0.08)',
    },
    cardUnselected: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(79,134,216,0.08)',
        opacity: 0,
    },
    overlayVisible: {
        opacity: 1,
    },
    overlayHidden: {
        opacity: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(12,26,44,0.4)',
        borderWidth: 1,
        borderColor: 'rgba(12,26,44,0.6)',
        padding: 6,
    },
    textBlock: {
        flex: 1,
        gap: 6,

    },
    title: {
        color: 'rgba(232,240,255,0.92)',
        fontWeight: '700',
        fontSize: 13,
    },
    codeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    code: {
        color: 'rgba(232,240,255,0.65)',
        fontSize: 12,
    },
    checkWrap: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(79,134,216,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(79,134,216,0.4)',
    },
    bottomLine: {
        marginTop: 38,
        height: 2,
        borderRadius: 999,
        backgroundColor: '#4F86D8',
        opacity: 0,
    },
    bottomLineVisible: {
        opacity: 1,
    },
})
