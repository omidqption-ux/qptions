import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useSelector } from 'react-redux'
import * as Clipboard from 'expo-clipboard'
import type { RootState } from '../../store'
import DepositCounter from './Counter'
import { MaterialIcons } from '@expo/vector-icons'
import { formatNumber } from '../../utils/numberFormat'

type StepThreeProps = {
  setDepositStep?: (step: number) => void;
  closeDepModal: () => void
}

export default function StepThree({ setDepositStep, closeDepModal }: StepThreeProps) {
  const { method, paymentInfo } = useSelector((store: RootState) => store.deposit)
  const [copiedField, setCopiedField] = useState<'amount' | 'address' | null>(null)

  const payAddress = paymentInfo?.pay_address ?? ''
  const payAmount = paymentInfo?.pay_amount ?? ''
  const payCurrency = (paymentInfo?.pay_currency ?? '').toUpperCase()
  const payNetwork = paymentInfo?.pay_network ?? ''
  const depositAmount = paymentInfo?.deposit_amount ?? ''
  const formattedPayAmount = useMemo(
    () => formatNumber(payAmount, { minimumFractionDigits: 2, maximumFractionDigits: 8 }),
    [payAmount],
  )

  const logoUri = useMemo(() => {
    if (!method?.logo) return null
    return method.logo
  }, [method.logo])

  const qrUri = useMemo(() => {
    if (!payAddress) return null
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      payAddress,
    )}`
  }, [payAddress])

  const handleCopy = async (value: string, field: 'amount' | 'address') => {
    if (!value) return
    try {
      await Clipboard.setStringAsync(value)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 1600)
    } catch {
      // ignore copy errors
    }
  }

  const missingDetails = !payAddress || !payAmount

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => setDepositStep?.(1)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="arrow-back-ios" size={20} color="#E8F0FF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.closeIcon}
        onPress={closeDepModal}
        activeOpacity={0.8}
      >
        <MaterialIcons name="close" size={20} color="#E8F0FF" />
      </TouchableOpacity>
      <View style={styles.header}>
        <View style={styles.methodInfo}>
          {logoUri ? (
            <Image source={logoUri} style={styles.logo} resizeMode="cover" />
          ) : (
            <View style={styles.logoPlaceholder} />
          )}
          <View style={styles.methodText}>
            <Text style={styles.methodTitle}>{method?.title || 'Payment method'}</Text>
            <Text style={styles.methodMeta}>
              Deposit Amount: ${formatNumber(depositAmount, { maximumFractionDigits: 2 }) || '--'}
            </Text>
          </View>
        </View>
        <DepositCounter setDepositStep={setDepositStep} />
      </View>

      {missingDetails ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Payment details are not ready.</Text>
          <Text style={styles.emptyText}>Go back and regenerate the payment.</Text>
          <TouchableOpacity
            onPress={() => setDepositStep?.(1)}
            style={styles.backButton}
            activeOpacity={0.85}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.detailsRow}>
          <View style={styles.fieldsColumn}>
            <View style={[styles.fieldGroup]}>
              <Text style={styles.fieldLabel}>Amount to send </Text>
              <View style={styles.copyRow}>
                <Text style={styles.fieldValue}>
                  {formattedPayAmount}
                </Text>
                <TouchableOpacity
                  onPress={() => handleCopy(`${payAmount} ${payCurrency}`, 'amount')}
                  style={styles.copyButton}
                  activeOpacity={0.85}
                >
                  <MaterialIcons
                    name={copiedField === 'amount' ? 'done' : 'content-copy'}
                    size={18}
                    color={copiedField === 'amount' ? '#00D2FF' : '#E8F0FF'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.fieldGroup]}>
              <Text style={styles.fieldLabel}>Destination address ({payNetwork || 'network'})</Text>
              <View style={styles.copyRow}>
                <Text style={styles.fieldValue} numberOfLines={1}>
                  {payAddress}
                </Text>
                <TouchableOpacity
                  onPress={() => handleCopy(payAddress, 'address')}
                  style={styles.copyButton}
                  activeOpacity={0.85}
                >
                  <MaterialIcons
                    name={copiedField === 'address' ? 'done' : 'content-copy'}
                    size={18}
                    color={copiedField === 'address' ? '#00D2FF' : '#E8F0FF'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.qrColumn}>
            <Text style={styles.qrHint}>
              Or scan the QR code to pay with {payNetwork || 'your wallet'}.
            </Text>
            {qrUri ? (
              <Image source={{ uri: qrUri }} style={styles.qr} resizeMode="contain" />
            ) : (
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrPlaceholderText}>QR unavailable</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    position: 'relative',
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#05070d',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    width: 340,
    marginHorizontal: 'auto'
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logo: {
    width: 46,
    height: 46,
  },
  logoPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  methodText: {
    gap: 4,
    flexShrink: 1,
  },
  methodTitle: {
    color: '#E8F0FF',
    fontWeight: '700',
    fontSize: 15,
  },
  methodMeta: {
    color: 'rgba(232,240,255,0.7)',
    fontSize: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'stretch',
  },
  qrColumn: {
    width: 140,
    alignItems: 'center',
    gap: 6,
    paddingLeft: 12,
  },
  fieldsColumn: {
    flex: 1,
    gap: 10,
    paddingRight: 0,
    paddingVertical: 0,
    paddingLeft: 0,
  },
  emptyCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    gap: 8,
    alignItems: 'flex-start',
  },
  emptyText: {
    color: 'rgba(232,240,255,0.75)',
    fontSize: 13,
  },
  backButton: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  backButtonText: {
    color: '#E8F0FF',
    fontWeight: '700',
  },
  backIcon: {
    position: 'absolute',
    top: 0,
    left: 4,
    zIndex: 10,
    padding: 6,
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 4,
    zIndex: 10,
  },
  noticeCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(140,217,255,0.08)',
    gap: 6,
  },
  noticeTitle: {
    color: '#E8F0FF',
    fontWeight: '700',
    fontSize: 13,
  },
  noticeList: {
    gap: 4,
  },
  noticeItem: {
    color: 'rgba(232,240,255,0.8)',
    fontSize: 12,
    lineHeight: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    color: '#E8F0FF',
    fontWeight: '700',
    fontSize: 13,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  fieldValue: {
    flex: 1,
    color: '#E8F0FF',
    fontSize: 13,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  copyButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  qrRow: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 5,
    gap: 5,
  },
  qr: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  qrPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  qrPlaceholderText: {
    color: 'rgba(232,240,255,0.7)',
    fontSize: 12,
  },
  qrHint: {
    textAlign: 'center',
    color: 'rgba(232,240,255,0.75)',
    fontSize: 12,
    lineHeight: 16,
  },
})
