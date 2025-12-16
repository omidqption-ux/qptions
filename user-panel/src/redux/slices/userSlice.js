import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
     isLogin: false,
     isIDVerified: false,
     referalLink: '',
     referrals: [],
}

export const userSlice = createSlice({
     name: 'user',
     initialState,
     reducers: {
          setUserProfile: (state, action) => {
               state.profile = action.payload
          },
          updateUserProfile: (state, action) => {
               state.profile[action.payload.fieldName] =
                    action.payload.fieldValue
          },
          setUserBalance: (state, action) => {
               state.balance = action.payload
          },
          setUserSettings: (state, action) => {
               state.userSettings = action.payload
          },
          updateBalance: (state, action) => {
               state.balance = action.payload
          },
          setIsLogin: (state, action) => {
               state.isLogin = action.payload
          },
          setDemoBalance: (state, action) => {
               state.demoBalance = action.payload
          },
          addDemoBalance: (state, action) => {
               state.demoBalance = state.demoBalance + action.payload
          },
          deductBalance: (state, action) => {
               if (action.payload.mode === 'demo')
                    state.demoBalance =
                         state.demoBalance - action.payload.amount
               else if (action.payload.mode === 'real')
                    state.balance = state.balance - action.payload.amount
               else state.bonusBalance = state.bonusBalance - action.payload.amount
          },
          setIsIDVerified: (state, action) => {
               state.isIDVerified = action.payload
          },
          setUsername: (state, action) => {
               state.profile.username = action.payload
          },
          setUserBonusBalance: (state, action) => {
               state.bonusBalance = action.payload
          },
          setReferalLink: (state, action) => {
               state.referalLink = action.payload
          },
          setReferrals: (state, action) => {
               state.referrals = action.payload
          },
     },
})

export const {
     setUserProfile,
     setUserBalance,
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
