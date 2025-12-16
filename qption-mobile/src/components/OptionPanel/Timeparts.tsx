// components/TimeDisplay/TimeLarge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTimeParts } from '../../utils/timeAgo';

interface TimeLargeProps {
    totalSeconds: number;
}

const TimeLarge: React.FC<TimeLargeProps> = ({ totalSeconds }) => {
    const { hh, mm, ss } = formatTimeParts(totalSeconds);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{hh}</Text>
            <Text style={styles.text}>:</Text>
            <Text style={styles.text}>{mm}</Text>
            <Text style={styles.text}>:</Text>
            <Text style={styles.text}>{ss}</Text>
        </View>
    );
};

export default TimeLarge;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    text: {
        fontSize: 16,
        color: '#E5E7EB',
        marginHorizontal: 6,
    },
});
