import React, { memo, useCallback, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { RootState } from '../../store';
import {
    changeSeriesType,
    changeCandleTime,
} from '../../store/slices/tradingRoomSlices/chartSlice';
import { playClick } from '../../utils/sounds';

type SeriesType = 'LineSeries' | 'CandlestickSeries';

interface SeriesTypeSelectProps {
    value: SeriesType;
    candleTime: number;
}

const CANDLE_SECONDS = [5, 10, 15, 30, 60];

const SeriesTypeSelect: React.FC<SeriesTypeSelectProps> = memo(
    ({ value, candleTime }) => {
        const dispatch = useDispatch();
        const { userSettings } = useSelector((store: RootState) => store.user);

        const [open, setOpen] = useState(false);

        const handleOpen = () => {
            userSettings?.soundControl?.notification && playClick();
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
        };

        const setSeriesType = useCallback(
            (type: SeriesType) => {
                dispatch(changeSeriesType(type));
                // if you want it to close immediately when switching type:
                // handleClose();
            },
            [dispatch],
        );

        const setCandleBucket = useCallback(
            (bucket: number) => {
                setSeriesType('CandlestickSeries');
                dispatch(changeCandleTime(bucket));
                handleClose();
            },
            [dispatch, setSeriesType],
        );

        const renderCurrentIcon = () => {
            if (value === 'CandlestickSeries') {
                return (
                    <MaterialCommunityIcons
                        symbol="chart-candlestick"
                        size={18}
                        color="#E5E7EB"
                    />
                );
            }
            return (
                <MaterialCommunityIcons
                    name="chart-line"
                    size={18}
                    color="#E5E7EB"
                />
            );
        };

        return (
            <View>
                {/* Trigger button */}
                <TouchableOpacity
                    onPress={handleOpen}
                    activeOpacity={0.8}
                    style={styles.trigger}
                >
                    {renderCurrentIcon()}
                </TouchableOpacity>

                {/* Menu Modal */}
                <Modal
                    visible={open}
                    transparent
                    animationType="fade"
                    onRequestClose={handleClose}
                    presentationStyle="overFullScreen"
                >
                    {/* Click-away backdrop */}
                    <Pressable style={styles.backdrop} onPress={handleClose}>
                        {/* Inner menu panel – stop propagation so inside taps don't close automatically */}
                        <Pressable
                            onPress={e => e.stopPropagation()}
                            style={styles.menuPanel}
                        >
                            {/* Series type row */}
                            <View style={styles.typeRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.typeButton,
                                        value === 'LineSeries' && styles.typeButtonActive,
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setSeriesType('LineSeries');
                                        handleClose();
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="chart-line"
                                        size={18}
                                        color={value === 'LineSeries' ? '#E5E7EB' : '#9CA3AF'}
                                    />
                                    <Text
                                        style={[
                                            styles.typeLabel,
                                            value === 'LineSeries' && styles.typeLabelActive,
                                        ]}
                                    >
                                        Line
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.typeButton,
                                        value === 'CandlestickSeries' && styles.typeButtonActive,
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setSeriesType('CandlestickSeries');
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        symbol="chart-candlestick"
                                        size={18}
                                        color={
                                            value === 'CandlestickSeries' ? '#E5E7EB' : '#9CA3AF'
                                        }
                                    />
                                    <Text
                                        style={[
                                            styles.typeLabel,
                                            value === 'CandlestickSeries' && styles.typeLabelActive,
                                        ]}
                                    >
                                        Candle
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Divider */}
                            {value === 'CandlestickSeries' && (
                                <>
                                    <View style={styles.divider} />
                                    {/* Candle seconds buttons */}
                                    <View style={styles.candleRow}>
                                        {CANDLE_SECONDS.map(sec => (
                                            <TouchableOpacity
                                                key={sec}
                                                onPress={() => setCandleBucket(sec)}
                                                activeOpacity={0.8}
                                                style={[
                                                    styles.candleButton,
                                                    sec === candleTime && styles.candleButtonActive,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.candleText,
                                                        sec === candleTime && styles.candleTextActive,
                                                    ]}
                                                >
                                                    {sec}s
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </>
                            )}

                            {/* Close icon row (optional) */}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleClose}
                            >
                                <MaterialIcons
                                    name="close"
                                    size={18}
                                    color="#9CA3AF"
                                />
                            </TouchableOpacity>
                        </Pressable>
                    </Pressable>
                </Modal>
            </View>
        );
    },
);

export default SeriesTypeSelect;

const styles = StyleSheet.create({
    trigger: {
        backgroundColor: '#20293E',
        borderRadius: 8,
        height: 30,
        width: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.045)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuPanel: {
        backgroundColor: '#05070d',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 8,
        minWidth: 200,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 14,
    },
    typeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    typeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    typeButtonActive: {
        backgroundColor: '#111827',
    },
    typeLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginLeft: 6,
    },
    typeLabelActive: {
        color: '#E5E7EB',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#4B5563',
        marginVertical: 8,
    },
    candleRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    } as any,
    candleButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: 'transparent',
    },
    candleButtonActive: {
        backgroundColor: '#1F2937',
    },
    candleText: {
        fontSize: 11,
        color: '#60A5FA',
    },
    candleTextActive: {
        color: '#E5E7EB',
        fontWeight: '600',
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginTop: 4,
    },
});
