import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserProfile {
     username: string
     firstName: string
     lastName: string
     dateOfBirth: string
     email: string
     phone: string
     country: string
     isPhoneVerified: boolean
     isEmailVerified: boolean
     isIDVerified: boolean
     profileImage: string
}

export interface SoundControlSettings {
     balance: boolean
     notification: boolean
}

export interface NotificationSettings {
     emailNotifications: boolean
     updatesFromYourManager: boolean
     companysNews: boolean
     companyPromotions: boolean
     companysTradingAnalytics: boolean
     tradingStatements: boolean
     educationEmails: boolean
}

export interface ThemeSettings {
     darkMode: boolean
     background: boolean
}

export interface IndicatorSettings {
     signals: boolean
     analytics: boolean
     marketWatch: boolean
}

export interface TimeZoneSettings {
     automaticDetection: boolean
     timeZone: string
}

export interface UserSettings {
     soundControl: SoundControlSettings
     notifications: NotificationSettings
     theme: ThemeSettings
     indicators: IndicatorSettings
     timeZone: TimeZoneSettings
     islamicAccount: boolean
}

export type BalanceMode = 'demo' | 'real' | 'bonus'

export interface Referral {
     // adjust this to your real shape if you have one
     [key: string]: any
}
export interface Balance {
     balance: number;
     bonusBalance: number;
     demoBalance: number;
}
export interface UserState {
     profile: UserProfile
     userSettings: UserSettings
     balance: number
     bonusBalance: number
     demoBalance: number
     isLogin: boolean | null
     isIDVerified: boolean
     referalLink: string
     referrals: Referral[]
}

const initialState: UserState = {
     profile: {
          username: '',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          email: '',
          phone: '',
          country: '',
          isPhoneVerified: false,
          isEmailVerified: false,
          isIDVerified: false,
          profileImage: '',
     },
     userSettings: {
          soundControl: {
               balance: true,
               notification: true,
          },
          notifications: {
               emailNotifications: true,
               updatesFromYourManager: true,
               companysNews: true,
               companyPromotions: true,
               companysTradingAnalytics: true,
               tradingStatements: true,
               educationEmails: true,
          },
          theme: {
               darkMode: true,
               background: true,
          },
          indicators: {
               signals: false,
               analytics: true,
               marketWatch: false,
          },
          timeZone: {
               automaticDetection: true,
               timeZone: 'Europe/Sofia',
          },
          islamicAccount: false,
     },
     balance: 0,
     bonusBalance: 0,
     demoBalance: 0,
     isLogin: null,
     isIDVerified: false,
     referalLink: '',
     referrals: [],
}

export const userSlice = createSlice({
     name: 'user',
     initialState,
     reducers: {
          setUserProfile: (state, action: PayloadAction<UserProfile>) => {
               state.profile = action.payload
          },
          updateUserProfile: (
               state,
               action: PayloadAction<{
                    fieldName: keyof UserProfile
                    fieldValue: UserProfile[keyof UserProfile]
               }>
          ) => {
               const { fieldName, fieldValue } = action.payload
               state.profile[fieldName] = fieldValue as never
          },
          setUserBalances: (state, action: PayloadAction<Balance>) => {
               state.balance = action.payload.balance
               state.demoBalance = action.payload.demoBalance
               state.bonusBalance = action.payload.bonusBalance
          },
          setUserSettings: (state, action: PayloadAction<UserSettings>) => {
               state.userSettings = action.payload
          },
          updateBalance: (state, action: PayloadAction<number>) => {
               state.balance = action.payload
          },
          setIsLogin: (state, action: PayloadAction<boolean | null>) => {
               state.isLogin = action.payload
          },
          setDemoBalance: (state, action: PayloadAction<number>) => {
               state.demoBalance = action.payload
          },
          addDemoBalance: (state, action: PayloadAction<number>) => {
               state.demoBalance = state.demoBalance + action.payload
          },
          deductBalance: (
               state,
               action: PayloadAction<{ mode: BalanceMode; amount: number }>
          ) => {
               const { mode, amount } = action.payload
               if (mode === 'demo') {
                    state.demoBalance = state.demoBalance - amount
               } else if (mode === 'real') {
                    state.balance = state.balance - amount
               } else {
                    state.bonusBalance = state.bonusBalance - amount
               }
          },
          setIsIDVerified: (state, action: PayloadAction<boolean>) => {
               state.isIDVerified = action.payload
          },
          setUsername: (state, action: PayloadAction<string>) => {
               state.profile.username = action.payload
          },
          setUserBonusBalance: (state, action: PayloadAction<number>) => {
               state.bonusBalance = action.payload
          },
          setReferalLink: (state, action: PayloadAction<string>) => {
               state.referalLink = action.payload
          },
          setReferrals: (state, action: PayloadAction<Referral[]>) => {
               state.referrals = action.payload
          },
     },
})

export const {
     setUserProfile,
     setUserBalances,
     updateUserProfile,
     setUserSettings,
     updateBalance,
     setIsLogin,
     setDemoBalance,
     deductBalance,
     addDemoBalance,
     setIsIDVerified,
     setUsername,
     setUserBonusBalance,
     setReferalLink,
     setReferrals,
} = userSlice.actions

export default userSlice.reducer
