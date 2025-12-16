export const GOOGLE_CLIENT_IDS = {
    expo: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || '',
    ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
    android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
    web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
}

export const GOOGLE_SCOPES = ['profile', 'email']
export const GOOGLE_REDIRECT_SCHEME = 'qption'
export const GOOGLE_LOGIN_ENDPOINT =
    process.env.EXPO_PUBLIC_GOOGLE_LOGIN_ENDPOINT || '/api/auth/google/mobile'
