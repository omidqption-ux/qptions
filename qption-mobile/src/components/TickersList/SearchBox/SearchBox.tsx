import React, { useEffect, useRef, useState } from 'react'
import { View, TextInput, StyleSheet, TextInput as RNTextInput } from 'react-native'

type Props = {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    autoFocus?: boolean
}

const SearchBox: React.FC<Props> = ({ value, onChange, placeholder = 'Search a ticker', autoFocus = true }) => {
    const inputRef = useRef<RNTextInput | null>(null)

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus()
        }
    }, [autoFocus])

    return (
        <View style={styles.container}>
            <TextInput
                ref={inputRef}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={styles.input}
                underlineColorAndroid="transparent"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 6,
    },
    input: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: '#E8F0FF',
        backgroundColor: 'rgba(255,255,255,0.05)',
        fontSize: 14,
        outlineStyle: 'none' as any,
    },
})

export default SearchBox
