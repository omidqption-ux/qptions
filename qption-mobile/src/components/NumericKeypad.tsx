import React, { useMemo, useState } from 'react'
import {
  LayoutChangeEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native'

export type KeypadAnchor = {
  x: number
  y: number
  width: number
  height: number
}

type NumericKeypadProps = {
  visible: boolean
  anchor?: KeypadAnchor | null
  side?: 'left' | 'right'
  onClose: () => void
  onAppend: (ch: string) => void
  onBackspace: () => void
  onClear: () => void
  onDone: () => void
}

export default function NumericKeypad({
  visible,
  anchor = null,
  side = 'left',
  onClose,
  onAppend,
  onBackspace,
  onClear,
  onDone,
}: NumericKeypadProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions()
  const [sheetSize, setSheetSize] = useState({ width: 200, height: 260 })

  const resolvedAnchor = anchor && visible ? anchor : null
  const placementStyle = useMemo(() => {
    if (!resolvedAnchor) return null

    const gutter = 12
    const keypadWidth = sheetSize.width || 200
    const keypadHeight = sheetSize.height || 260

    const fitsLeft = resolvedAnchor.x >= keypadWidth + gutter
    const fitsRight =
      screenWidth - (resolvedAnchor.x + resolvedAnchor.width) >= keypadWidth + gutter

    let placeLeft = side === 'left'
    if (placeLeft && !fitsLeft && fitsRight) placeLeft = false
    if (!placeLeft && !fitsRight && fitsLeft) placeLeft = true

    const left = placeLeft
      ? Math.max(gutter, resolvedAnchor.x - keypadWidth - gutter)
      : Math.min(
        screenWidth - keypadWidth - gutter,
        resolvedAnchor.x + resolvedAnchor.width + gutter,
      )

    const idealTop = resolvedAnchor.y + resolvedAnchor.height / 2 - keypadHeight / 2
    const top = Math.min(
      Math.max(gutter, idealTop),
      screenHeight - keypadHeight - gutter,
    )

    return {
      position: 'absolute' as const,
      left,
      top,
      width: keypadWidth,
    }
  }, [anchor, resolvedAnchor, screenHeight, screenWidth, sheetSize.height, sheetSize.width, side])

  const handleSheetLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    if (width !== sheetSize.width || height !== sheetSize.height) {
      setSheetSize({ width, height })
    }
  }

  const overlayStyle = [styles.overlay, resolvedAnchor ? styles.overlayAnchor : styles.overlayDefault]

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={overlayStyle} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            resolvedAnchor ? placementStyle : styles.sheetDefault,
          ]}
          onPress={(e) => e.stopPropagation()}
          onLayout={handleSheetLayout}
        >
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['0', '⌫'],
          ].map((row) => (
            <View key={row.join('')} style={styles.row}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.keyButton}
                  onPress={() => {
                    if (key === '⌫') {
                      onBackspace()
                    } else {
                      onAppend(key)
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.keyText}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.clearKey} onPress={onClear} activeOpacity={0.85}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.doneKey}
              onPress={() => {
                onDone()
                onClose()
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.045)',
  },
  overlayDefault: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  overlayAnchor: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 0,
  },
  sheet: {
    minWidth: 190,
    maxWidth: 220,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#05070d',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 14,
    gap: 6,
  },
  sheetDefault: {
    width: '100%',
    maxWidth: 200,
    alignSelf: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  keyButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    color: '#E8F0FF',
    fontWeight: '700',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  clearKey: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  clearText: {
    color: '#E8F0FF',
    fontWeight: '700',
  },
  doneKey: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  doneText: {
    color: '#E8F0FF',
    fontWeight: '700',
  },
})
