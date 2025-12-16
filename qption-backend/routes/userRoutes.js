import express from 'express'
import { verifyToken, verifyTokenAdmin } from '../middlewares/authMiddleware.js'
const router = express.Router()
import {
     getUserProfile,
     getUserSetings,
     updateUserProfile,
     sendEmailVerification,
     sendPhoneVerification,
     verifyUserPhone,
     uploadProfilePicture,
     saveUserNotificationSettings,
     saveUserSoundSettings,
     saveUserThemeSettings,
     saveUserIndicatorsSettings,
     saveUserTimeZoneSettings,
     saveIslamiAccountSettings,
     deleteUserAccount,
     changeUserPsassword,
     getUserLoginHistory,
     getUserBalance,
     sendPhoneOtp,
     sendUserEmailOtp,
     setUserPassword,
     verifyUserEmail,
     getUserActiveSessions,
     terminateAUserSession,
     getAllUsers,
     getUserByIdForAdmin,
     getIdVerificationStatus,
     getUserId,
     getUserPublicInfo,
     followUser,
     unFollowUser,
     isFollowing,
     getCurrentSession,
     updateUsername,
     getFollowing,
     getFollowers,
     removeFollower,
     addLeaderTrader,
     getLeaderTraders,
     removeLeaderTrader,
     changeFactorOfLeader,
     getUserBonusAmount,
     generateReferralLink,
     getUserReferrals,
     getUserBalanceAndUsername,
     refreshDemoBalance,
} from '../controllers/userController.js'

router.post('/isFollowing', verifyToken, isFollowing)
router.post('/followUser', verifyToken, followUser)
router.post('/unFollowUser', verifyToken, unFollowUser)
router.get('/getUserPublicInfo', verifyToken, getUserPublicInfo)
router.get('/getUserId', verifyToken, getUserId)
router.get('/getIdVerificationStatus', verifyToken, getIdVerificationStatus)
router.get('/profile', verifyToken, getUserProfile)
router.get('/settings', verifyToken, getUserSetings)
router.get('/balance', verifyToken, getUserBalance)
router.put('/profile', verifyToken, updateUserProfile)
router.put('/profile/upload', verifyToken, uploadProfilePicture)
router.post('/sendEmailVerification', verifyToken, sendEmailVerification)
router.post('/sendPhoneVerification', verifyToken, sendPhoneVerification)
router.put('/verifyPhone', verifyToken, verifyUserPhone)
router.put(
     '/userNotificationSettings',
     verifyToken,
     saveUserNotificationSettings
)
router.put('/userSoundSettings', verifyToken, saveUserSoundSettings)
router.put('/userThemeSettings', verifyToken, saveUserThemeSettings)
router.put('/userIndicatorsSettings', verifyToken, saveUserIndicatorsSettings)
router.put('/userTimeZoneSettings', verifyToken, saveUserTimeZoneSettings)
router.put(
     '/userIslamicAccountSettings',
     verifyToken,
     saveIslamiAccountSettings
)
router.delete('/deleteAccount', verifyToken, deleteUserAccount)
router.put('/changePassword', verifyToken, changeUserPsassword)
router.get('/userLoginHistory', verifyToken, getUserLoginHistory)
router.post('/sendPhoneOtp', verifyToken, sendPhoneOtp)
router.post('/sendEmailOtp', verifyToken, sendUserEmailOtp)
router.put('/setPassword', verifyToken, setUserPassword)
router.put('/verifyEmail', verifyToken, verifyUserEmail)
router.get('/activeSessions', verifyToken, getUserActiveSessions)
router.post('/terminateASession', verifyToken, terminateAUserSession)
router.get('/users', verifyTokenAdmin, getAllUsers)
router.get('/UserByIdForAdmin', verifyTokenAdmin, getUserByIdForAdmin)
router.post('/getCurrentSession', verifyToken, getCurrentSession)
router.post('/updateUsername', verifyToken, updateUsername)
router.get('/getFollowing', verifyToken, getFollowing)
router.get('/getFollowers', verifyToken, getFollowers)
router.post('/removeFollower', verifyToken, removeFollower)
router.post('/addLeaderTrader', verifyToken, addLeaderTrader)
router.get('/getLeaderTraders', verifyToken, getLeaderTraders)
router.post('/removeLeaderTrader', verifyToken, removeLeaderTrader)
router.post('/changeFactorOfLeader', verifyToken, changeFactorOfLeader)
router.get('/getUserBonusAmount', verifyToken, getUserBonusAmount)
router.get('/generateReferralLink', verifyToken, generateReferralLink)
router.get('/getUserReferrals', verifyToken, getUserReferrals)
router.get('/getUserBalanceAndUsername', verifyToken, getUserBalanceAndUsername)
router.put('/refreshDemoBalance', verifyToken, refreshDemoBalance)
export default router