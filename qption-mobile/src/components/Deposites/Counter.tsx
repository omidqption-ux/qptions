import React, { useEffect, useRef, useState } from 'react'
import { Text, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { resetDeposit } from '../../store/slices/depositSlice'
import { formatSeconds } from '../../utils/timeAgo'

type DepositCounterProps = {
  setDepositStep?: (step: number) => void
}

export default function DepositCounter({ setDepositStep }: DepositCounterProps) {
  const dispatch = useDispatch()
  const [counter, setCounter] = useState(15 * 60)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          dispatch(resetDeposit())
          setDepositStep?.(0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [dispatch, setDepositStep])

  return (
    <Text style={[styles.text, counter < 60 ? styles.textWarning : styles.textDefault]}>
      {formatSeconds(counter)}
    </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    width: 60,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textDefault: {
    color: '#00d2ff',
  },
  textWarning: {
    color: '#ffb74d',
  },
})
