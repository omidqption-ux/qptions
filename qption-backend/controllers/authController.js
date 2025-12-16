import User from '../models/User.js'
import LoginHistory from '../models/LoginHistory.js'
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite'
import requestIp from 'request-ip'
import Session from '../models/Sessions.js'
import jwt from 'jsonwebtoken'
import {
     generateAccessToken,
     generateRefreshToken,
} from '../utils/generateToken.js'
import { sendEmailValidation } from '../utils/mailer.js'
import { generateOTP, sendSMS } from '../utils/sendSms.js'
import { formatPhoneNumber } from '../utils/trimPhoneNumber.js'
import { getSecondsDifferenceFromNow } from '../utils/getSecsFromNow.js'

const isProd = process.env.NODE_ENV === 'production'
const cookieDomain = isProd ? '.qption.com' : undefined

export const registerUser = async (req, res) => {
     const { email, password, phone, country, ref } = req.body
     try {
          if (!email && !phone) {
               return res.status(400).json({
                    message: 'Either phone number or email is required',
               })
          }
          // Check if the user already exists
          const emailExists = email && (await User.findOne({ email }))
          const phoneExists = phone && (await User.findOne({ phone }))
          if (emailExists || phoneExists) {
               return res.status(400).json({ message: 'User already exists' })
          }
          //   Ensures at least one uppercase letter.
          //   Ensures at least one digit
          //   Ensures a minimum length of 8 characters
          const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
          if (!passwordRegex.test(password)) {
               return res.status(400).json({
                    message: 'Password must be at least 8 characters long, contain at least one uppercase letter, and at least one digit.',
               })
          }
          // Create the new user with either phone or email
          const user = await User.create(
               phone
                    ? {
                         phone,
                         password,
                         country,
                    }
                    : {
                         email,
                         password,
                    }
          )
          if (ref) {
               const referrer = await User.findOne({ referralCode: ref })
               if (referrer) {
                    referrer.Referrals.push({
                         user: user._id,
                         createdAt: new Date(),
                    })
                    await referrer.save()
               }
          }
          saveLoginHistory(user, req)
          const tokenAccess = generateAccessToken(
               { userId: user._id },
               process.env.JWT_SECRET
          )
          const tokenRefresh = generateRefreshToken(
               { userId: user._id },
               process.env.JWT_SECRET_REFRESH
          )
          res.cookie(process.env.COOKIE_ACCESS, tokenAccess, {
               httpOnly: true,
               secure: isProd, // Ensure it's only set on HTTPS in production
               sameSite: isProd ? 'none' : 'lax',
               domain: cookieDomain,
               path: '/',
               maxAge: 3600000 * 24,
          })
          res.cookie(process.env.COOKIE_REFRESH, tokenRefresh, {
               httpOnly: true,
               secure: isProd, // Ensure it's only set on HTTPS in production
               sameSite: isProd ? 'none' : 'lax',
               domain: cookieDomain,
               path: '/',
               maxAge: 3600000 * 24 * 365,
          })
          return res.status(200).json({ ok: true })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const isLoginUser = async (req, res) => {
     try {
          const token = req.cookies[process.env.COOKIE_ACCESS]
          if (!token) {
               return res.json({ isLogin: false })
          }
          jwt.verify(
               token,
               process.env.JWT_SECRET,
               (err, user) => {
                    if (err) {
                         return res.json({
                              isLogin: false,
                              userId: user.userId,
                         })
                    }
                    return res.json({ isLogin: true, userId: user.userId })
               }
          )
     } catch (error) {
          return res.json({ isLogin: false })
     }
}
export const loginUser = async (req, res) => {
     const { email, phone, password } = req.body
     try {
          const user = await User.findOne(email ? { email } : { phone }).select(
               '+password'
          )
          if (!user || !user.password) {
               return res.status(401).json({
                    message: `Invalid ${email ? 'email' : 'phone'} or password`,
               })
          }
          if (
               (await user.matchPassword(password, user.password)) &&
               user.isActive
          ) {
               saveLoginHistory(user, req)
               const tokenAccess = generateAccessToken(
                    { userId: user._id },
                    process.env.JWT_SECRET
               )
               const tokenRefresh = generateRefreshToken(
                    { userId: user._id },
                    process.env.JWT_SECRET_REFRESH
               )
               res.cookie(process.env.COOKIE_ACCESS, tokenAccess, {
                    httpOnly: true,
                    secure: isProd, // Ensure it's only set on HTTPS in production
                    sameSite: isProd ? 'none' : 'lax',
                    domain: cookieDomain,
                    path: '/',
                    maxAge: 3600000 * 24,
               })
               res.cookie(process.env.COOKIE_REFRESH, tokenRefresh, {
                    httpOnly: true,
                    secure: isProd, // Ensure it's only set on HTTPS in production
                    sameSite: isProd ? 'none' : 'lax',
                    domain: cookieDomain,
                    path: '/',
                    maxAge: 3600000 * 24 * 360,
               })
               return res.status(200).json({ ok: true })
          } else {
               return res.status(401).json({
                    message: `Invalid ${email ? 'email' : 'phone'} or password`,
               })
          }
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const saveLoginHistory = async (user, req) => {
     try {
          // 1) IP (robust)
          const rawIp =
               req.clientIp ||
               requestIp.getClientIp(req) ||
               req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
               req.socket?.remoteAddress ||
               ''
          const ip = String(rawIp).replace('::ffff:', '') || '0.0.0.0'

          // 2) User-Agent (robust)
          const userAgent = (req.headers['user-agent'] || '').slice(0, 1024) // cap length

          // 3) Parse UA safely
          const parser = new UAParser(userAgent)
          const ua = parser.getResult()
          const deviceType = ua.device?.type || 'Desktop'
          const osName = ua.os?.name || 'Unknown'
          const osVersion = ua.os?.version || ''
          const browserName = ua.browser?.name || 'Unknown'
          const browserVersion = ua.browser?.version || ''

          // Always non-empty strings for required fields:
          const deviceOs = `${deviceType}/${osName}${osVersion ? ' ' + osVersion : ''}`
          const browser = `${browserName}${browserVersion ? ' ' + browserVersion : ''}`

          // 4) Geo
          const geo = geoip.lookup(ip) || {}
          const country = geo.country || 'Unknown'
          const city = geo.city || 'Unknown'

          // 5) Upsert Session (unique by userId+ip+userAgent)
          const now = new Date()
          await Session.findOneAndUpdate(
               { userId: user._id, ipAddress: ip, userAgent },
               {
                    $setOnInsert: {
                         userId: user._id,
                         ipAddress: ip,
                         userAgent,
                         deviceOs,          // required
                         browser,           // required
                         country,
                         city,
                         createdAt: now,
                    },
                    $set: { lastActive: now },
               },
               { upsert: true, new: true }
          )

          // 6) Append LoginHistory (optional, separate collection)
          await LoginHistory.create({
               userId: user._id,
               ipAddress: ip,        // use consistent field name (not "IP")
               userAgent,
               deviceOs,
               browser,
               country,
               city,
               createdAt: now,
          })
     } catch (e) {
          // Never block login on telemetry failures
          console.warn('[login history warn]', e?.message || e)
     }
}
export const sendValidationOtpEmail = async (req, res) => {
     const email = req.body.email
     const ref = req.body.ref
     if (!email) {
          return res.status(400).json({ message: 'Provide an email ' })
     }
     try {
          const user = await User.findOne({ email })
          const otp = generateOTP()
          if (user) {
               user.validationOTP = {
                    otp,
                    createdAt: Date.now(),
               }
               await user.save()
          } else {
               if (ref) {
                    const referrer = await User.findOne({ referralCode: ref })
                    if (referrer) {
                         referrer.Referrals.push({
                              user: user._id,
                              createdAt: new Date(),
                         })
                         await referrer.save()
                    }
               }
               const newUser = new User({
                    email,
                    validationOTP: {
                         otp,
                    },
               })
               await newUser.save()
          }
          sendEmailValidation({
               to: email,
               otp: otp,
          })
          return res.status(200).json({ message: 'Please check your email.' })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const sendValidationOtpSMS = async (req, res) => {
     const phone = req.body.phone
     const ref = req.body.ref
     if (!phone) {
          return res.status(400).json({ message: 'Provide a phone number' })
     }
     try {
          const user = await User.findOne({ phone })
          const otp = generateOTP()
          if (user) {
               user.validationOTP = {
                    otp,
                    createdAt: Date.now(),
               }
               await user.save()
          } else {
               if (ref) {
                    const referrer = await User.findOne({ referralCode: ref })
                    if (referrer) {
                         referrer.Referrals.push({
                              user: user._id,
                              createdAt: new Date(),
                         })
                         await referrer.save()
                    }
               }
               const newUser = new User({
                    phone,
                    validationOTP: {
                         otp,
                    },
               })
               await newUser.save()
          }

          const response = await sendSMS(phone, otp)
          if (!response || response.status > 300)
               return res.status(500).json({ message: 'Error sending message to your number' })
          return res
               .status(200)
               .json({ message: 'Login code sent to your phone' })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const otpUserLogin = async (req, res) => {
     const { otp, email, phone } = req.body
     try {
          const user = await User.findOne(email ? { email } : { phone })
          if (user) {
               if (
                    getSecondsDifferenceFromNow(user.validationOTP.createdAt) >
                    119
               ) {
                    return res.status(400).json({ message: 'Code was expired' })
               }
               if (user.validationOTP.otp === otp) {
                    saveLoginHistory(user, req)
                    const tokenAccess = generateAccessToken(
                         { userId: user._id },
                         process.env.JWT_SECRET
                    )
                    const tokenRefresh = generateRefreshToken(
                         { userId: user._id },
                         process.env.JWT_SECRET_REFRESH
                    )
                    res.cookie(process.env.COOKIE_ACCESS, tokenAccess, {
                         httpOnly: true,
                         secure: isProd, // Ensure it's only set on HTTPS in production
                         sameSite: isProd ? 'none' : 'lax',
                         domain: cookieDomain,
                         path: '/',
                         maxAge: 3600000 * 24,
                    })
                    res.cookie(process.env.COOKIE_REFRESH, tokenRefresh, {
                         httpOnly: true,
                         secure: isProd, // Ensure it's only set on HTTPS in production
                         sameSite: isProd ? 'none' : 'lax',
                         domain: cookieDomain,
                         path: '/',
                         maxAge: 3600000 * 24 * 365,
                    })
                    if (email) {
                         user.isEmailVerified = true
                         user.save()
                    } else if (phone) {
                         user.isPhoneVerified = true
                         user.save()
                    }
                    return res.status(200).json()
               } else {
                    return res.status(401).json({ message: `Invalid code` })
               }
          }
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const refreshToken = async (req, res) => {
     const tokenRefresh = req.signedCookies[process.env.COOKIE_REFRESH]
     if (!tokenRefresh) {
          res.clearCookie(process.env.COOKIE_REFRESH, {
               httpOnly: true,
               secure: process.env.NODE_ENV !== 'development', // Ensure it's only set on HTTPS in production
               path: '/',
          })
          return res.status(423).json({ loginRetry: false })
     }
     try {
          jwt.verify(
               tokenRefresh,
               process.env.JWT_SECRET_REFRESH,
               (err, user) => {
                    if (err) {
                         res.clearCookie(process.env.COOKIE_REFRESH, {
                              httpOnly: true,
                              secure: process.env.NODE_ENV !== 'development', // Ensure it's only set on HTTPS in production
                              path: '/',
                         })
                         return res.status(423).json({ loginRetry: false })
                    }
                    const newAccessToken = generateAccessToken(
                         { userId: user.userId },
                         process.env.JWT_SECRET
                    )
                    res.cookie(process.env.COOKIE_ACCESS, newAccessToken, {
                         httpOnly: true,
                         secure: isProd, // Ensure it's only set on HTTPS in production
                         sameSite: isProd ? 'none' : 'lax',
                         domain: cookieDomain,
                         path: '/',
                         maxAge: 3600000 * 24,
                    })
               }
          )
          return res.status(200).json({ loginRetry: true })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const logOutUser = async (req, res) => {
     try {
          res.clearCookie(process.env.COOKIE_ACCESS, {
               httpOnly: true,
               secure: isProd, // Ensure it's only set on HTTPS in production
               sameSite: isProd ? 'none' : 'lax',
               domain: cookieDomain,
               path: '/',
          })
          res.clearCookie(process.env.COOKIE_REFRESH, {
               httpOnly: true,
               secure: isProd, // Ensure it's only set on HTTPS in production
               sameSite: isProd ? 'none' : 'lax',
               domain: cookieDomain,
               path: '/',
          })
          const existingSession = await Session.findOne({
               userId: req.user._id
          })
          if (existingSession) {
               await existingSession.deleteOne()
          }
          return res.status(200).json()
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}