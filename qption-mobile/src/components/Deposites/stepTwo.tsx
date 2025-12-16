import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../store'
import {
  setAmountInPaymentMethod,
  setDepositAmount,
  setPaymentInfo,
} from '../../store/slices/depositSlice'
import api from '../../services/api'
import { MaterialIcons } from '@expo/vector-icons'
import NumericKeypad, { KeypadAnchor } from '../NumericKeypad'

const QUICK_AMOUNTS = [20, 50, 100, 200, 300, 400, 500, 1000, 5000, 10000, 20000, 50000]

type StepTwoProps = {
  setDepositStep?: (step: number) => void;
  closeDepModal: () => void
}

export default function StepTwo({ setDepositStep, closeDepModal }: StepTwoProps) {
  const dispatch = useDispatch()

  const { method, amount, amountInPaymentMethod } = useSelector(
    (store: RootState) => store.deposit,
  )

  const [minDeposit, setMinDeposit] = useState<number>(0)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [loadingMin, setLoadingMin] = useState(false)
  const [loadingPay, setLoadingPay] = useState(false)
  const [amountText, setAmountText] = useState('')
  const [keypadOpen, setKeypadOpen] = useState(false)
  const [keypadAnchor, setKeypadAnchor] = useState<KeypadAnchor | null>(null)
  const inputRef = useRef<TextInput | null>(null)

  const logoUri = useMemo(() => {
    if (!method?.logo) return null
    return method.logo
  }, [method?.logo])

  const resetQuote = () => {
    dispatch(
      setAmountInPaymentMethod({
        amountInPaymentMethod: 0,
      }),
    )
  }

  const fetchMinDeposit = async () => {
    if (!method?.code) return
    try {
      setLoadingMin(true)
      const response = await api.post('/api/deposit/getMinDeposit', {
        currency_from: method.code,
      })
      const value = Math.ceil(response.data.data?.fiat_equivalent ?? 0)
      setMinDeposit(value)
    } catch {
      setMinDeposit(0)
    } finally {
      setLoadingMin(false)
    }
  }

  const fetchQuote = async () => {
    if (!amount || !method?.code) return
    try {
      setLoadingQuote(true)
      const response = await api.post('/api/deposit/getEstimatedPriceCrypto', {
        amount,
        currency_from: 'usd',
        currency_to: method.code,
      })
      dispatch(
        setAmountInPaymentMethod({
          amountInPaymentMethod: response.data.data?.estimated_amount ?? 0,
        }),
      )
    } catch {
      resetQuote()
    } finally {
      setLoadingQuote(false)
    }
  }

  const handlePay = async () => {
    if (!method?.code || !method?.title || !amount || amount < minDeposit) return
    try {
      setLoadingPay(true)
      const response = await api.post('/api/deposit/createpayment', {
        pay_currency_title: method.title,
        pay_currency: method.code.toLowerCase(),
        price_amount: amount,
        price_currency: 'usd',
      })
      dispatch(setPaymentInfo({ paymentInfo: response.data.data }))
      setDepositStep?.(2)
    } catch {
      // ignore for now
    } finally {
      setLoadingPay(false)
    }
  }

  const updateAmountFromText = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '')
    const numeric = cleaned === '' ? 0 : Number(cleaned)
    setAmountText(cleaned)
    if (Number.isNaN(numeric)) {
      dispatch(setDepositAmount(0))
      resetQuote()
      return
    }
    dispatch(setDepositAmount(numeric))
  }

  const handleAmountChange = (text: string | number) => {
    updateAmountFromText(typeof text === 'number' ? String(text) : text)
  }

  const appendChar = (ch: string) => {
    if (ch === '.') return
    updateAmountFromText(amountText + ch)
  }

  const handleBackspace = () => {
    if (!amountText) return
    updateAmountFromText(amountText.slice(0, -1))
  }

  const handleClear = () => updateAmountFromText('')
  const handleOpenKeypad = () => {
    if (inputRef.current?.measureInWindow) {
      inputRef.current.measureInWindow((x, y, width, height) => {
        setKeypadAnchor({ x, y, width, height })
        setKeypadOpen(true)
      })
      return
    }
    setKeypadOpen(true)
  }
  const handleCloseKeypad = () => {
    setKeypadOpen(false)
    setKeypadAnchor(null)
  }

  function formatAmountForDisplay(text: string) {
    if (!text) return ''
    const intPartNumber = Number(text)
    if (Number.isNaN(intPartNumber)) return ''
    const formattedInt = new Intl.NumberFormat('en-US').format(intPartNumber)
    if (!formattedInt) return ''
    return `$${formattedInt}`
  }

  const displayAmount = useMemo(() => formatAmountForDisplay(amountText), [amountText])

  useEffect(() => {
    if (!amount) {
      setAmountText('')
      return
    }
    setAmountText(String(amount))
  }, [amount])

  useEffect(() => {
    if (!method?.code) return
    dispatch(setPaymentInfo({
      paymentInfo: {
        pay_address: "",
        pay_amount: 0,
        pay_currency: "",
        pay_network: "",
        deposit_amount: "",
      }
    }))
    dispatch(setDepositAmount(0))
    setAmountText('')
    setKeypadOpen(false)
    setKeypadAnchor(null)
    resetQuote()
    fetchMinDeposit()
  }, [dispatch, method?.code])

  useEffect(() => {
    if (amount && amount >= minDeposit) {
      fetchQuote()
    } else {
      resetQuote()
    }
  }, [amount, minDeposit])

  const payDisabled =
    !method?.code || !amount || amount < minDeposit || loadingPay || loadingQuote || loadingMin

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => setDepositStep?.(0)}
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

      <View style={styles.card}>
        <View style={styles.methodRow}>
          <View style={styles.methodText}>
            <View style={styles.methodHeaderRow}>
              <View style={styles.methodHeaderLeft}>
                {logoUri ? (
                  <Image source={logoUri} style={styles.logo} resizeMode="cover" />
                ) : (
                  <View style={styles.logoPlaceholder} />
                )}
                <Text style={styles.methodTitle}>{method.title}</Text>
              </View>
              <View style={styles.methodMetaRow}>
                <Text style={styles.methodMetaLabel}>Min Deposit:</Text>
                {loadingMin ? (
                  <ActivityIndicator size={12} color="#00D2FF" />
                ) : (
                  <Text style={styles.methodMetaValue}>${minDeposit || 0}</Text>
                )}
              </View>
            </View>
          </View>
        </View>
        <View style={styles.fieldRow}>
          <TouchableOpacity
            style={styles.fieldLeft}
            activeOpacity={0.85}
            onPress={handleOpenKeypad}
          >
            <Text style={styles.fieldLabel}>Amount (USD)</Text>
            <TextInput
              ref={inputRef}
              keyboardType="number-pad"
              editable={false}
              showSoftInputOnFocus={false}
              value={displayAmount}
              onChangeText={handleAmountChange}
              placeholder="$0"
              placeholderTextColor="rgba(232,240,255,0.5)"
              style={[
                styles.input,
                amount && amount < minDeposit ? styles.inputInvalid : undefined,
              ]}
            />
          </TouchableOpacity>
          <View style={styles.fieldRight}>
            {amount > minDeposit && (
              <>
                {loadingQuote ? (
                  <ActivityIndicator size={12} color="#8CD9FF" />
                ) : (
                  <>
                    <Text style={styles.quoteText}>
                      {amountInPaymentMethod
                        ? new Intl.NumberFormat('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 9,
                        }).format(Number(amountInPaymentMethod))
                        : '--'}
                    </Text>
                    {logoUri ? (
                      <Image source={logoUri} style={styles.logoSmall} resizeMode="cover" />
                    ) : (
                      <View style={styles.logoPlaceholder} />
                    )}
                  </>
                )}
              </>
            )}
          </View>
        </View>

        <View style={styles.quickAmounts}>
          {QUICK_AMOUNTS.map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.quickChip,
                amount === val && styles.quickChipActive,
              ]}
              onPress={() => {
                setKeypadOpen(false)
                handleAmountChange(val)
              }}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.quickChipText,
                  amount === val && styles.quickChipTextActive,
                ]}
              >
                ${new Intl.NumberFormat('en-US').format(val)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.payButton, payDisabled && styles.payButtonDisabled]}
            onPress={handlePay}
            activeOpacity={0.85}
            disabled={payDisabled}
          >
            {loadingPay ? (
              <ActivityIndicator color="#E8F0FF" />
            ) : (
              <View style={styles.payButtonContent}>
                <MaterialIcons name="payment" size={18} color="#E8F0FF" />
                <Text style={styles.payButtonText}>Pay</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

      </View >
      <View style={styles.footer}>
        <Text style={styles.note}>
          Exchange rate is frozen for 20 minutes. If no payment arrives in that window, the payment
          will expire.
        </Text>
      </View>
      <NumericKeypad
        visible={keypadOpen}
        anchor={keypadAnchor}
        onClose={handleCloseKeypad}
        onAppend={appendChar}
        onBackspace={handleBackspace}
        onClear={handleClear}
        onDone={handleCloseKeypad}
      />
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    position: 'relative',
  },
  title: {
    color: '#E8F0FF',
    fontWeight: '700',
    fontSize: 14,
  },
  subtitle: {
    color: 'rgba(232,240,255,0.85)',
    fontSize: 13,
  },
  card: {
    width: 440,
    margin: 'auto',
    marginTop: 6,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#05070d',
    borderWidth: 0,
    borderColor: 'transparent',
    gap: 12,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    justifyContent: 'center',
  },
  logo: {
    width: 44,
    height: 44,
    marginTop: 5
  },
  logoSmall: {
    width: 34,
    height: 34,
  },
  logoPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  methodText: {
    flex: 1,
    gap: 4,
  },
  methodHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
  },
  methodMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  methodHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  methodTitle: {
    color: '#E8F0FF',
    fontWeight: '700',
    fontSize: 17,
  },
  methodMeta: {
    color: 'rgba(232,240,255,0.7)',
    fontSize: 12,
  },
  methodMetaLabel: {
    color: '#E8F0FF',
    fontSize: 11,
    fontWeight: '700',
  },
  methodMetaValue: {
    color: '#00D2FF',
    fontSize: 11,
    fontWeight: '700',
  },
  banner: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(140,217,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(140,217,255,0.2)',
  },
  bannerText: {
    color: '#90CAF9',
    fontSize: 12,
    lineHeight: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  fieldLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  fieldLabel: {
    color: '#E8F0FF',
    fontSize: 13,
    fontWeight: '600',
  },
  fieldCode: {
    color: '#81a1dbff',
    fontSize: 10,
    fontWeight: '400',
  },
  input: {
    width: 120,
    height: 38,
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#E8F0FF',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  inputInvalid: {
    borderColor: 'rgba(250,204,21,0.7)',
    color: '#FACC15',
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: -2,
  },
  quickChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  quickChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  quickChipText: {
    color: '#E8F0FF',
    fontWeight: '600',
    fontSize: 12,
  },
  quickChipTextActive: {
    color: '#E8F0FF',
  },
  quoteBox: {
    minWidth: 140,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  quoteText: {
    color: '#E8F0FF',
    fontSize: 11,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#E8F0FF',
    fontWeight: '700',
    letterSpacing: 0.3,
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
  payButton: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F4FB6',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    minWidth: 120,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#E8F0FF',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  note: {
    color: '#90CAF9',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  }
})
