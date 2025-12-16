import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthWebViewScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { url, title, fallbackUrl } = route.params || {};
    const [loading, setLoading] = useState(true);
    const [currentUrl, setCurrentUrl] = useState<string | undefined>(url);
    const [hasSwapped, setHasSwapped] = useState(false);

    if (!currentUrl) {
        return (
            <SafeAreaView style={styles.fallback}>
                <Text style={styles.fallbackText}>Missing auth URL</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <FontAwesome name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title || 'Continue'}</Text>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.webviewContainer}>
                <WebView
                    source={{ uri: currentUrl }}
                    startInLoadingState
                    setSupportMultipleWindows={false}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    originWhitelist={['*']}
                    onError={() => {
                        if (fallbackUrl && !hasSwapped) {
                            setHasSwapped(true);
                            setCurrentUrl(fallbackUrl);
                            setLoading(true);
                            return;
                        }
                        setLoading(false);
                    }}
                    style={styles.webview}
                />
                {loading && (
                    <View style={styles.loadingOverlay} pointerEvents="none">
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1F35',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        color: '#F5F7FA',
        fontWeight: '700',
        fontSize: 16,
    },
    headerSpacer: {
        width: 36,
    },
    webviewContainer: {
        flex: 1,
        position: 'relative',
    },
    webview: {
        flex: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    fallback: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F1F35',
        gap: 12,
    },
    fallbackText: {
        color: '#F5F7FA',
        fontWeight: '600',
    },
});
