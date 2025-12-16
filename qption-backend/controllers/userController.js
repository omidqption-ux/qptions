import { sendEmailValidation } from '../utils/mailer.js'
import { generateOTP, sendSMS } from '../utils/sendSms.js'
import DeletedUser from '../models/DeletedUsers.js'
import LoginHistory from '../models/LoginHistory.js'
import Session from '../models/Sessions.js'
import { formatPhoneNumber } from '../utils/trimPhoneNumber.js'
import { getSecondsDifferenceFromNow } from '../utils/getSecsFromNow.js'
import User from '../models/User.js'
import TradingRoom from '../models/TradingRoom.js'
import { createNotification } from '../utils/notifications.js'

export const getUserProfile = async (req, res) => {
     const user = req.user
     if (user) {
          return res.status(201).json({
               username: user.username,
               firstName: user.firstName,
               lastName: user.lastName,
               dateOfBirth: user.dateOfBirth,
               email: user.email,
               phone: user.phone,
               country: user.country,
               isPhoneVerified: user.isPhoneVerified,
               isEmailVerified: user.isEmailVerified,
               profileImage: user.profileImage,
               isIDVerified: user.isIDVerified ? user.isIDVerified : false,
          })
     } else {
          return res.status(404).json({ message: 'User not found' })
     }
}
export const getUserBalance = async (req, res) => {
     const user = req.user
     if (user) {
          return res.status(201).json({
               balance: user.balance.amount,
               demoBalance: user.balance.demo,
               bonusBalance: user.balance.bonus
          })
     } else {
          return res.status(404).json({ message: 'User not found' })
     }
}
export const getUserSetings = async (req, res) => {
     const user = req.user
     if (user) {
          return res.json({ ...user.userSettings })
     } else {
          return res.status(201).status(404).json({ message: 'User not found' })
     }
}
export const updateUserProfile = async (req, res) => {
     const user = req.user
     try {
          if (user) {
               if ('username' in req.body) user.username = req.body.username
               if ('firstName' in req.body) user.firstName = req.body.firstName
               if ('lastName' in req.body) user.lastName = req.body.lastName
               if ('email' in req.body) user.email = req.body.email
               if ('phone' in req.body) user.phone = req.body.phone
               if ('dateOfBirth' in req.body)
                    user.dateOfBirth = req.body.dateOfBirth
               if ('country' in req.body) user.country = req.body.country

               const updatedUser = await user.save()
               return res.json({
                    user: updatedUser,
                    message: 'Profile updated successfully',
               })
          } else {
               return res.status(404).json({ message: 'User not found' })
          }
     } catch (error) {
          if (error.code === 11000)
               return res.status(500).json({
                    message: 'Email or phone already taken ',
               })
          else return res.status(500).json({ message: error.message })
     }
}

export const sendPhoneVerification = async (req, res) => {
     const user = req.user
     const sentPhoneRaw = req.body.phone
     if (!sentPhoneRaw) {
          return res.status(400).json({ message: 'phone number is mandatory' });
     }
     try {
          if (user.phone !== sentPhoneRaw) {
               const exists = await User.findOne({
                    phone: sentPhoneRaw,
                    _id: { $ne: user._id }
               }).select('_id').lean()
               if (exists) {
                    return res.status(409).json({ message: 'Phone number is already in use' });
               }
               user.phone = sentPhoneRaw
               if (typeof user.isPhoneVerified !== 'undefined') {
                    user.isPhoneVerified = false;
               }
          }
          const otp = generateOTP()
          await sendSMS(user.phone, otp)
          user.phoneVerificationOTP = {
               otp,
               createdAt: Date.now(),
          }
          await user.save()
          return res.status(201).json({
               message: 'Verification code sent to your phone',
          })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const verifyUserPhone = async (req, res) => {
     const { userOTP } = req.body
     const user = req.user
     if (!user.phone) {
          return res.status(400).json({ message: 'Provide phone number' })
     }
     if (user.phoneVerificationOTP.otp !== userOTP) {
          return res.status(400).json({ message: 'Wrong Verification code' })
     }
     if (
          getSecondsDifferenceFromNow(user.phoneVerificationOTP.createdAt) > 119
     ) {
          return res.status(400).json({ message: 'Code was expired' })
     }
     try {
          user.isPhoneVerified = true
          await user.save()
          return res
               .status(201)
               .json({ message: 'phone verified successfully' })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const verifyUserEmail = async (req, res) => {
     const { userOTP } = req.body
     const user = req.user
     if (!user.email) {
          return res.status(400).json({ message: 'Provide email' })
     }
     if (user.emailVerificationOTP.otp !== userOTP) {
          return res.status(400).json({ message: 'wrong code' })
     }
     if (
          getSecondsDifferenceFromNow(user.emailVerificationOTP.createdAt) > 119
     ) {
          return res.status(400).json({ message: 'Code was expired' })
     }
     try {
          user.isEmailVerified = true
          await user.save()
          return res
               .status(201)
               .json({ message: 'Email verified successfully' })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const sendEmailVerification = async (req, res) => {
     const user = req.user
     const sentEmail = req.body.email
     const normalizedEmail = String(sentEmail).trim().toLowerCase()

     if (!sentEmail) {
          return res.status(400).json({ message: 'Provide an email' })
     }


     try {
          if (user.email !== normalizedEmail) {
               const exists = await User.findOne({
                    email: normalizedEmail,
                    _id: { $ne: user._id }
               }).select('_id').lean()

               if (exists) {
                    return res.status(409).json({ message: 'Email is already in use' })
               }
               user.email = normalizedEmail
               user.isEmailVerified = false
          }
          const otp = generateOTP()
          user.emailVerificationOTP = {
               otp,
               createdAt: Date.now(),
          }
          sendEmailValidation({
               to: normalizedEmail,
               otp,
          })
          await user.save()
          return res.status(201).json({
               message: 'Verification email sent. Please check your email.',
          })
     } catch (e) {
          return res.status(500).json({ message: error.message })
     }
}
export const uploadProfilePicture = async (req, res) => {
     const user = req.user
     try {
          const { photo } = req.body
          user.profileImage = photo
          await user.save()
          return res.status(201).json({
               success: true,
               photo,
               message: 'uploaded successfully',
          })
     } catch (error) {
          return res.status(500).json({
               success: false,
               message: 'File upload failed.',
          })
     }
}
export const saveUserNotificationSettings = async (req, res) => {
     const user = req.user
     try {
          if (user) {
               user.userSettings.notifications = req.body
               await user.save()
               return res.status(201).json({
                    notifications: user.userSettings.notifications,
                    message: 'Setting Updated successfully',
               })
          } else {
               return res.status(404).json({ message: 'User not found' })
          }
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const saveUserSoundSettings = async (req, res) => {
     const user = req.user
     try {
          if (user) {
               user.userSettings.soundControl = req.body
               await user.save()
               return res.status(201).json({
                    soundControl: user.userSettings.soundControl,
                    message: 'Sound settings updated successfully',
               })
          } else {
               return res.status(404).json({ message: 'User not found' })
          }
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const saveUserThemeSettings = async (req, res) => {
     const user = req.user
     try {
          if (user) {
               user.userSettings.theme = req.body
               await user.save()
               return res.status(201).json({
                    theme: user.userSettings.theme,
                    message: 'Theme updated successfully',
               })
          } else {
               return res.status(404).json({ message: 'User not found' })
          }
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const saveUserIndicatorsSettings = async (req, res) => {
     const user = req.user
     try {
          if (user) {
               user.userSettings.indicators = req.body
               await user.save()
               return res.status(201).json({
                    indicators: user.userSettings.indicators,
                    message: 'Indicators updated successfully',
               })
          } else {
               return res.status(404).json({ message: 'User not found' })
          }
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const saveUserTimeZoneSettings = async (req, res) => {
     const user = req.user
     try {
          if (user) {
               user.userSettings.timeZone = req.body
               await user.save()
               return res.status(201).json({
                    timeZone: user.userSettings.timeZone,
                    message: 'Timezone updated successfully',
               })
          } else {
               return res.status(404).json({ message: 'User not found' })
          }
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const saveIslamiAccountSettings = async (req, res) => {
     const user = req.user
     try {
          if (user) {
               user.userSettings.islamicAccount = req.body.islamicAccount
               await user.save()
               res.status(201).json({
                    islamicAccount: user.userSettings.islamicAccount,
                    message: 'Islamic account updated successfully',
               })
          } else {
               return res.status(404).json({ message: 'User not found' })
          }
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const deleteUserAccount = async (req, res) => {
     const user = req.user
     try {
          if (user) {
               const deletedUser = new DeletedUser({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    country: user.country,
                    dateOfBirth: user.dateOfBirth,
                    email: user.email,
                    phone: user.phone,
               })
               await deletedUser.save()
               await user.deleteOne({ _id: user._id })
               res.clearCookie(process.env.COOKIE_ACCESS, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development', // Ensure it's only set on HTTPS in production
                    path: '/',
               })
               res.clearCookie(process.env.COOKIE_REFRESH, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development', // Ensure it's only set on HTTPS in production
                    path: '/',
               })
               return res.status(201).json({
                    islamicAccount: user.userSettings.islamicAccount,
                    message: 'Your account was deleted permanently',
               })
          } else {
               return res.status(404).json({ message: 'User not found' })
          }
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const changeUserPsassword = async (req, res) => {
     const { oldPassword, password } = req.body
     try {
          const user = await User.findById(req.user._id).select('+password')
          if (user) {
               const isMatch = await user.matchPassword(
                    oldPassword,
                    user.password
               )
               if (!isMatch) {
                    return res
                         .status(400)
                         .json({ message: 'Incorrect old password' })
               }
               user.password = password
               await user.save()
               return res.status(201).json({
                    message: 'password changed successfully',
               })
          } else {
               return res.status(404).json({ message: 'User not found' })
          }
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getUserLoginHistory = async (req, res) => {
     const user = req.user
     const { page = 1, limit = 10 } = req.query
     try {
          if (user) {
               const totalCount = await LoginHistory.countDocuments({
                    userId: user._id,
               })
               const loginHistories = await LoginHistory.find({
                    userId: user._id,
               })
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)

               return res.status(201).json({
                    loginHistories,
                    totalPages: Math.ceil(totalCount / limit),
               })
          } else {
               return res.status(404).json({ message: 'User not found' })
          }
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const sendPhoneOtp = async (req, res) => {
     const user = req.user
     if (!user.phone) {
          return res
               .status(400)
               .json({ message: 'Set phone number in your profile' })
     }
     try {
          const otp = generateOTP()
          await sendSMS(user.phone, otp)
          user.validationOTP.otp = otp
          user.validationOTP.createdAt = Date.now()
          await user.save()
          return res.status(201).json({
               message: 'Code sent to : ' + formatPhoneNumber(user.phone),
          })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const sendUserEmailOtp = async (req, res) => {
     const user = req.user
     if (!user.email) {
          return res
               .status(400)
               .json({ message: 'Set email address in your profile' })
     }
     try {
          const otp = generateOTP()

          sendEmailValidation({
               to: user.email,
               otp,
          })
          user.validationOTP.otp = otp
          user.validationOTP.createdAt = Date.now()
          await user.save()
          return res
               .status(201)
               .json({ message: 'Code sent to : ' + user.email })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const setUserPassword = async (req, res) => {
     const user = req.user
     const { otp, password } = req.body

     if (user.validationOTP.otp !== otp) {
          return res.status(400).json({ message: 'wrong Code' })
     }
     if (getSecondsDifferenceFromNow(user.validationOTP.createdAt) > 119) {
          return res.status(400).json({ message: 'Code was expired' })
     }
     try {
          user.password = password
          user.save()
          return res.status(200).json({ message: 'New password was set' })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getUserActiveSessions = async (req, res) => {
     try {
          const userId = req.user._id
          try {
               const sessions = await Session.find({ userId })
                    .sort({ createdAt: -1 })
                    .limit(10) //  can not login in more than 10 sessions
               return res.status(201).json(sessions)
          } catch (error) {
               return res
                    .status(500)
                    .json({ error: 'Failed to retrieve sessions' })
          }
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const terminateAUserSession = async (req, res) => {
     const { sessionId } = req.body
     try {
          const session = await Session.findById(sessionId)
          if (!session) {
               return res.status(404).json({ message: 'Session not found' })
          }
          await session.deleteOne({ _id: sessionId })
          return res
               .status(201)
               .json({ message: 'Session terminated successfully' })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getCurrentSession = async (req, res) => {
     const user = req.user
     const { clientIp } = req.body
     try {
          const userAgent = req.headers['user-agent']
          const currentSession = await Session.findOne({
               userId: user._id,
               ipAddress: clientIp,
               userAgent,
          })
          return res.status(200).json({ currentSession })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}

export const getAllUsers = async (req, res) => {
     const { limit, page } = req.query
     try {
          const totalCount = await User.countDocuments()
          const users = await User.find({}, { profileImage: 0 })
               .sort({ createdAt: -1 })
               .skip(limit * (page - 1))
               .limit(limit)

          if (users) {
               return res.status(201).json({
                    users: users.map((user) => ({
                         id: user._id,
                         firstName: user.firstName,
                         lastName: user.lastName,
                         dateOfBirth: user.dateOfBirth,
                         email: user.email,
                         phone: user.phone,
                         country: user.country,
                         isPhoneVerified: user.isPhoneVerified,
                         isEmailVerified: user.isEmailVerified,
                         balance: user.balance.amount,
                         demoBalance: user.balance.demo,
                    })),
                    total: totalCount,
               })
          } else {
               return res.status(405).json({ message: 'Did not found users' })
          }
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getUserByIdForAdmin = async (req, res) => {
     const { userId } = req.query
     try {
          if (userId) {
               const user = await User.findById(userId)
               return res.status(201).json({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dateOfBirth: user.dateOfBirth,
                    email: user.email,
                    phone: user.phone,
                    country: user.country,
               })
          } else {
               return res.status(404).json({ message: 'User not found' })
          }
     } catch (e) {
          return res.status(500).json({ message: error.message })
     }
}
export const getIdVerificationStatus = async (req, res) => {
     const user = req.user
     try {
          return res.status(201).json({
               isIDVerified: user.isIDVerified,
          })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getUserId = async (req, res) => {
     const user = req.user
     try {
          return res.status(201).json({
               userId: user._id,
          })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getUserPublicInfo = async (req, res) => {
     const { userId } = req.query
     if (!userId) {
          return res.status(400).json({ message: 'User ID is required' })
     }
     try {
          const user = await User.findById(userId, {
               username: 1,
               profileImage: 1,
               followersCount: 1,
               _id: 1,
          })
          if (!user) {
               return res.status(404).json({ message: 'User not found' })
          }
          return res.status(200).json(user)
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const followUser = async (req, res) => {
     const { userId } = req.body
     try {
          const user = await User.findById(userId)
          if (!user) {
               return res.status(404).json({ message: 'User not found' })
          }
          const currentUser = req.user

          if (userId === currentUser._id.toString()) {
               return res
                    .status(404)
                    .json({ message: 'You can not follow yourself' })
          }
          if (currentUser.following.includes(userId)) {
               return res.status(400).json({ message: 'Already following' })
          }
          currentUser.following.push(userId)
          user.followers.push(currentUser._id)
          user.followersCount += 1
          await currentUser.save()
          await user.save()
          createNotification({
               userId: user._id,
               category: 'follow',
               title: 'New Follower',
               body: `${currentUser.username} followed you`,
          })
          createNotification({
               userId: currentUser._id,
               category: 'follow',
               title: 'Following',
               body: `You are following ${user.username}`,
          })
          return res.status(200).json({
               user: {
                    username: user.username,
                    profileImage: user.profileImage,
                    _id: user._id,
               },
          })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const unFollowUser = async (req, res) => {
     const { userId } = req.body
     try {
          const user = await User.findById(userId)
          if (!user) {
               return res.status(404).json({ message: 'User not found' })
          }
          const currentUser = req.user
          if (!currentUser.following.includes(userId)) {
               return res.status(400).json({ message: 'Not following' })
          }
          currentUser.following.pull(userId)
          user.followers.pull(currentUser._id)
          user.followersCount -= 1
          await currentUser.save()
          await user.save()
          createNotification({
               userId: currentUser._id,
               category: 'follow',
               title: 'UnFollowing',
               body: `You are unFollowing ${user.username}`,
          })
          return res.status(200).json()
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const removeFollower = async (req, res) => {
     const { userId } = req.body
     try {
          const user = await User.findById(userId)
          if (!user) {
               return res.status(404).json({ message: 'User not found' })
          }
          const currentUser = req.user
          if (!currentUser.followers.includes(userId)) {
               return res.status(400).json({ message: 'Not following' })
          }
          currentUser.followers.pull(userId)
          currentUser.followersCount -= 1
          user.following.pull(currentUser._id)
          await currentUser.save()
          await user.save()
          createNotification({
               userId: currentUser._id,
               category: 'follow',
               title: 'Remove Following',
               body: `You remove a follower ${user.username}`,
          })
          return res.status(200).json()
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const isFollowing = async (req, res) => {
     const { userId } = req.body
     try {
          const user = await User.findById(userId)
          if (!user) {
               return res.status(404).json({ message: 'User not found' })
          }
          const currentUser = req.user
          if (currentUser.following.includes(userId)) {
               return res.status(200).json({ isFollowing: true })
          } else {
               return res.status(200).json({ isFollowing: false })
          }
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const updateUsername = async (req, res) => {
     const user = req.user
     const { username } = req.body
     try {
          const existingUser = await User.findOne({ username })
          if (existingUser) {
               return res.status(400).json({
                    success: false,
                    message: 'Username already taken. Please choose another one.',
               })
          }
          user.username = username
          await user.save()

          res.status(200).json({
               message: 'Username updated successfully.',
               username,
          })
     } catch (error) {
          res.status(500).json({
               message: error.message,
          })
     }
}
export const getFollowers = async (req, res) => {
     const userId = req.user._id
     try {
          const user = await User.findById(userId).populate(
               'followers',
               'username profileImage'
          )
          if (!user) {
               return res.status(404).json({ error: 'User not found.' })
          }
          res.status(200).json(user.followers)
     } catch (error) {
          res.status(500).json({ message: error.message })
     }
}
export const getFollowing = async (req, res) => {
     const userId = req.user._id
     try {
          const user = await User.findById(userId).populate(
               'following',
               'username profileImage'
          )
          if (!user) {
               return res.status(404).json({ error: 'User not found.' })
          }
          res.status(200).json(user.following)
     } catch (error) {
          res.status(500).json({ message: error.message })
     }
}
export const addLeaderTrader = async (req, res) => {
     const user = req.user
     const { leadTraderId, factor } = req.body
     try {
          if (!leadTraderId || !factor) {
               return res
                    .status(400)
                    .json({ message: 'leadTraderId and factor are required.' })
          }
          // Check if this leader trader has already been added for the user
          const alreadyExists = user.leaderTraders.some(
               (trader) => trader.leadTraderId.toString() === leadTraderId
          )
          if (alreadyExists) {
               return res
                    .status(400)
                    .json({ message: 'You are already copying this trader .' })
          }
          user.leaderTraders.push({ leadTraderId, factor, isActive: true })
          await user.save()
          await user.populate(
               'leaderTraders.leadTraderId',
               'username profileImage'
          )
          const addedTrader = user.leaderTraders.find(
               (trader) =>
                    trader.leadTraderId &&
                    trader.leadTraderId._id.toString() === leadTraderId
          )
          res.status(200).json({
               addedTrader,
               message: 'Leader trader added successfully.',
          })
     } catch (error) {
          res.status(500).json({ message: error.message })
     }
}
export const getLeaderTraders = async (req, res) => {
     const userId = req.user._id
     try {
          const user = await User.findById(userId).populate(
               'leaderTraders.leadTraderId', // Populate the referenced User
               'username profileImage' // Only select these fields from the leader trader's user document
          )

          if (!user) {
               return res.status(404).json({ error: 'User not found.' })
          }
          res.status(200).json(user.leaderTraders)
     } catch (error) {
          res.status(500).json({ message: error.message })
     }
}
export const removeLeaderTrader = async (req, res) => {
     const user = req.user
     const { leadTraderId } = req.body

     try {
          const index = user.leaderTraders.findIndex(
               (trader) => trader.leadTraderId.toString() === leadTraderId
          )

          if (index === -1) {
               return res
                    .status(404)
                    .json({ message: 'You do not copy this trader.' })
          }

          user.leaderTraders.splice(index, 1)
          await user.save()

          res.status(200).json({
               message: 'You do not copy this trader anymore.',
          })
     } catch (error) {
          res.status(500).json({ message: error.message })
     }
}
export const changeFactorOfLeader = async (req, res) => {
     const { leadTraderId, factor } = req.body
     try {
          // Validate that both leadTraderId and factor are provided
          if (!leadTraderId || !factor) {
               return res
                    .status(400)
                    .json({ message: 'leadTraderId and factor are required.' })
          }
          // Use findOneAndUpdate with the positional operator to update the factor within the leaderTraders array
          const updatedUser = await User.findOneAndUpdate(
               {
                    _id: req.user._id,
                    'leaderTraders.leadTraderId': leadTraderId,
               },
               { $set: { 'leaderTraders.$.factor': factor } },
               { new: true, runValidators: true }
          ).populate('leaderTraders.leadTraderId', 'username profileImage')

          // If the user or the leader trader is not found, return an error
          if (!updatedUser) {
               return res
                    .status(404)
                    .json({ message: 'User or Leader trader not found.' })
          }

          // Find the updated leader trader in the updated document
          const updatedTrader = updatedUser.leaderTraders.find(
               (trader) =>
                    trader.leadTraderId &&
                    trader.leadTraderId._id.toString() === leadTraderId
          )

          // Return the updated leader trader in the response
          res.status(200).json({
               leader: updatedTrader,
               message: 'Leader trader factor updated successfully.',
          })
     } catch (error) {
          res.status(500).json({ message: error.message })
     }
}
export const getUserBonusAmount = async (req, res) => {
     const userId = req.user._id
     try {
          const user = await User.findById(userId, 'balance.bonus')

          if (!user) {
               return res.status(404).json({ message: 'User not found' })
          }
          res.status(200).json({ bonus: user.balance.bonus })
     } catch (error) {
          res.status(500).json({ message: error.message })
     }
}
export const generateReferralLink = async (req, res) => {
     const userId = req.user.id

     try {
          const user = await User.findById(userId)
          if (!user) {
               return res.status(404).json({ error: 'User not found' })
          }

          if (user.referralCode) {
               return res.json({
                    referralLink: `https://qption.com/register?ref=${user.referralCode}`,
               })
          }
          const newReferralCode = Math.random().toString(36).slice(2, 10)
          user.referralCode = newReferralCode
          await user.save()
          return res.json({
               referralLink: `https://qption.com/register?ref=${newReferralCode}`,
          })
     } catch (error) {
          return res.status(500).json({ error: error.message })
     }
}
export const getUserReferrals = async (req, res) => {
     try {
          // Retrieve pagination and sorting parameters from the query string.
          const page = parseInt(req.query.page, 10) || 1
          const limit = parseInt(req.query.limit, 10) || 10
          const sortColumn = req.query.sortColumn || 'createdAt' // Default sort column.
          const sortDirection = req.query.sortDirection || 'desc' // Default sort direction.

          // Retrieve the authenticated user and populate the nested "Referrals.user" field.
          const user = await User.findById(req.user.id).populate({
               path: 'Referrals.user',
               // Select the needed referral fields.
               select: 'username firstName lastName profileImage',
          })

          if (!user) {
               return res.status(404).json({ message: 'User not found' })
          }
          if (!user.Referrals || user.Referrals.length === 0) {
               return res.status(200).json({ referrals: [] })
          }

          // Extract referral IDs from the populated subdocuments.
          const referralIds = user.Referrals.map(
               (referral) => referral.user._id
          )

          // Aggregate TradingRoom data for the referrals:
          // and group by userId to sum the "amount" field.
          const referralTradeTotals = await TradingRoom.aggregate([
               { $match: { userId: { $in: referralIds }, mode: 'real' } },
               { $unwind: '$trades' },
               {
                    $group: {
                         _id: '$userId',
                         totalTradeAmount: { $sum: '$trades.amount' },
                    },
               },
          ])

          // Create a mapping of userId to total trade amount.
          const tradeTotalsMap = {}
          referralTradeTotals.forEach((item) => {
               tradeTotalsMap[item._id.toString()] = item.totalTradeAmount
          })

          // Map the referrals to include user details, referral creation date, and trade totals.
          let referralsData = user.Referrals.map((referral) => ({
               _id: referral.user._id,
               username: referral.user.username,
               firstName: referral.user.firstName,
               lastName: referral.user.lastName,
               profileImage: referral.user.profileImage,
               createdAt: referral.createdAt,
               totalTradeAmount:
                    tradeTotalsMap[referral.user._id.toString()] || 0,
          }))

          // Sort the referralsData array based on sortColumn and sortDirection.
          referralsData.sort((a, b) => {
               let aVal = a[sortColumn]
               let bVal = b[sortColumn]

               // If the fields are strings, compare case-insensitively.
               if (typeof aVal === 'string') aVal = aVal.toLowerCase()
               if (typeof bVal === 'string') bVal = bVal.toLowerCase()

               if (aVal < bVal) {
                    return sortDirection === 'asc' ? -1 : 1
               }
               if (aVal > bVal) {
                    return sortDirection === 'asc' ? 1 : -1
               }
               return 0
          })

          // Paginate: calculate starting and ending indices for the current page.
          const startIndex = (page - 1) * limit
          const endIndex = page * limit
          const paginatedData = referralsData.slice(startIndex, endIndex)

          return res.status(200).json({
               referrals: paginatedData,
               page,
               limit,
               totalReferrals: referralsData.length,
          })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getUserBalanceAndUsername = async (req, res) => {
     const userId = req.user.id
     try {
          const user = await User.findById(userId).select(
               'username balance profileImage'
          )
          if (!user) {
               return res.status(404).json({ message: 'User Not Found' })
          }
          return res.status(200).json({
               _id: user._id,
               username: user.username || "",
               balance: user.balance.amount,
               demoBalance: user.balance.demo,
               bonusBalance: user.balance.bonus,
               avatar: user.profileImage || "",
               email: user.email || "",
               phone: user.phone || ""
          })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const refreshDemoBalance = async (req, res) => {
     const userId = req.user.id
     try {
          const user = await User.findById(userId)
          if (!user) {
               return res.status(404).json({ message: 'User Not Found' })
          }
          user.balance.demo = 50000
          await user.save()
          return res.status(201).json({
               demoBalance: user.balance.demo,
          })
     } catch (e) {
          res.status(500).json({ message: e.message })
     }
}