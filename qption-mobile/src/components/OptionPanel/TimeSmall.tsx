// components/TimeDisplay/TimeSmall.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTimeParts } from '../../utils/timeAgo';

interface TimeSmallProps {
    totalSeconds: number;
    color?: string;
}

const TimeSmall: React.FC<TimeSmallProps> = ({ totalSeconds, color }) => {
    const { hh, mm, ss } = formatTimeParts(totalSeconds);

    return (
        <View style={styles.container}>
            <Text selectable={false} style={[styles.text, styles.segment, color && { color }]}>{hh}</Text>
            <Text selectable={false} style={[styles.text, color && { color } ]}>:</Text>
            <Text selectable={false} style={[styles.text, styles.segment, color && { color }]}>{mm}</Text>
            <Text selectable={false} style={[styles.text, color && { color } ]}>:</Text>
            <Text selectable={false} style={[styles.text, styles.segment, color && { color }]}>{ss}</Text>
        </View>
    );
};

export default TimeSmall;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
    },
    text: {
        fontSize: 12,
        color: '#E5E7EB',
    },
    segment: {
        flex: 1 / 3,
        textAlign: 'center',
    },
});
