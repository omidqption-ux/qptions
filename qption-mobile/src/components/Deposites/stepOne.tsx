import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import PaymentMethod from './PaymentMethod'
import { setDepositMethod } from '../../store/slices/depositSlice'
import { ImageSourcePropType } from 'react-native'

type PaymentMethodItem = {
  title: string
  code: string
  logo: ImageSourcePropType
  chain?: string
  minDeposit?: number
}

type StepOneProps = {
  setDepositStep?: (step: number) => void
  closeDepModal: () => void
  onMethodSelected?: (method: PaymentMethodItem) => void
}

const STABLE_COINS: PaymentMethodItem[] = [
  { title: 'Tether USD (Tron)', code: 'USDTTRC20', logo: require('../../../assets/payments/usdt-trc20.png') },
  { title: 'Tether USD (Ethereum)', code: 'USDTERC20', logo: require('../../../assets/payments/tether_erc.png') },
  {
    title: 'USD Coin',
    code: 'USDC',
    logo: require('../../../assets/payments/usdc.png'),
  },
]

const MAJOR_COINS: PaymentMethodItem[] = [
  { title: 'Bitcoin', code: 'BTC', logo: require('../../../assets/payments/btc.png') },
  { title: 'Ethereum', code: 'ETH', logo: require('../../../assets/payments/ethereum.png') },
  { title: 'Ripple', code: 'XRP', logo: require('../../../assets/payments/ripple.png') },
  { title: 'Tron', code: 'TRX', logo: require('../../../assets/payments/tron.png') },
]

export default function StepOne({ setDepositStep, onMethodSelected, closeDepModal }: StepOneProps) {
  const dispatch = useDispatch()
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const allMethods = useMemo(() => [...STABLE_COINS, ...MAJOR_COINS], [])

  const handleSelect = (method: PaymentMethodItem) => {
    setSelectedCode(method.code)
    dispatch(
      setDepositMethod({
        title: method.title,
        code: method.code,
        logo: method.logo,
        chain: method.chain ?? '',
        minDeposit: method.minDeposit ?? 0,
      }),
    )
    onMethodSelected?.(method)
    setDepositStep?.(1)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        style={styles.closeIcon}
        onPress={closeDepModal}
        activeOpacity={0.8}
      >
        <MaterialIcons name="close" size={20} color="#E8F0FF" />
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="bitcoin" size={18} color="#E8F0FF" />
        <Text style={styles.headerText}>Choose a method</Text>
      </View>

      <View style={styles.methodGrid}>
        {allMethods.map((method) => (
          <View key={method.code} style={styles.methodItem}>
            <PaymentMethod
              onPress={() => handleSelect(method)}
              code={method.code}
              title={method.title}
              logo={method.logo}
              isSelected={selectedCode === method.code}
            />
          </View>
        ))}
      </View>
    </ScrollView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    height: '100%',
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#05070d',
  },
  content: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  headerText: {
    color: '#E8F0FF',
    fontWeight: '700',
    fontSize: 14,
  },
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  methodItem: {
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    gap: 8,
    alignItems: 'center',
  },
  helperText: {
    color: 'rgba(232,240,255,0.78)',
    fontSize: 13,
    textAlign: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 4,
    zIndex: 10,
  },
})
