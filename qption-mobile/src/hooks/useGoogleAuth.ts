import { useCallback, useEffect, useMemo, useState } from 'react'
import { Platform } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { makeRedirectUri } from 'expo-auth-session'
import api from '../services/api'
import {
    GOOGLE_CLIENT_IDS,
    GOOGLE_SCOPES,
    GOOGLE_REDIRECT_SCHEME,
    GOOGLE_LOGIN_ENDPOINT,
} from '../config/googleAuth'

WebBrowser.maybeCompleteAuthSession()

type UseGoogleAuthOptions = {
    onSuccess: (userId?: string | null) => void
}

export function useGoogleAuth({ onSuccess }: UseGoogleAuthOptions) {
    const [googleError, setGoogleError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const hasClientId = useMemo(
        () => Object.values(GOOGLE_CLIENT_IDS).some((v) => typeof v === 'string' && v.length > 0),
        [],
    )

    // Force native auth session (Custom Tabs / ASWebAuthSession) instead of the Expo proxy/browser.
    // Note: Expo Go cannot round-trip without the proxy; use a dev/production build for this path.
    const useProxy = Platform.OS === 'web' ? false : false
    const redirectUri = useMemo(
        () =>
            makeRedirectUri({
                scheme: GOOGLE_REDIRECT_SCHEME,
                useProxy,
            }),
        [useProxy],
    )

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: GOOGLE_CLIENT_IDS.expo,
        iosClientId: GOOGLE_CLIENT_IDS.ios,
        androidClientId: GOOGLE_CLIENT_IDS.android,
        webClientId: GOOGLE_CLIENT_IDS.web,
        scopes: GOOGLE_SCOPES,
        redirectUri,
    })

    const startGoogleAuth = useCallback(async () => {
        setGoogleError(null)
        if (!hasClientId) {
            setGoogleError('Google client IDs are not configured. Add EXPO_PUBLIC_GOOGLE_* client IDs.')
            return
        }
        if (!request) {
            setGoogleError('Google sign-in is not ready yet. Please try again in a moment.')
            return
        }
        try {
            await promptAsync({ useProxy, showInRecents: false, preferEphemeralSession: true })
        } catch (e: any) {
            setGoogleError(e?.message || 'Google sign-in failed to open')
        }
    }, [hasClientId, promptAsync, request, useProxy])

    useEffect(() => {
        const finishAuth = async () => {
            if (!response) return
            if (response.type !== 'success') {
                if (response.type !== 'dismiss' && response.type !== 'cancel') {
                    setGoogleError(response.error?.message || 'Google sign-in was cancelled')
                }
                return
            }

            const { authentication } = response
            const idToken = authentication?.idToken
            const accessToken = authentication?.accessToken

            if (!idToken && !accessToken) {
                setGoogleError('Google did not return a token')
                return
            }

            setSubmitting(true)
            try {
                const res = await api.post(GOOGLE_LOGIN_ENDPOINT, {
                    idToken,
                    accessToken,
                })

                if (res.data?.ok) {
                    onSuccess(res.data?.userId)
                } else {
                    setGoogleError(res.data?.message || 'Google sign-in failed')
                }
            } catch (e: any) {
                setGoogleError(e?.response?.data?.message || e?.message || 'Google sign-in failed')
            } finally {
                setSubmitting(false)
            }
        }
        finishAuth()
    }, [response, onSuccess])

    return {
        startGoogleAuth,
        googleLoading: submitting || request?.inProgress === true,
        googleError,
        clearGoogleError: () => setGoogleError(null),
    }
}
