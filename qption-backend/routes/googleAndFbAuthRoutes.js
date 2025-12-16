import express from 'express'
import passport from '../config/passportConfig.js'
import { saveLoginHistory } from '../controllers/authController.js'
import {
     generateAccessToken,
     generateRefreshToken,
} from '../utils/generateToken.js'

const isProd = process.env.NODE_ENV === 'production'
const cookieDomain = isProd ? '.qption.com' : 'localhost'

const router = express.Router()
// Google authentication routes
router.get(
     '/google',
     passport.authenticate('google', {
          scope: ['profile', 'email', 'openid'],
          prompt: 'select_account',
          accessType: 'offline',
          includeGrantedScopes: true
     })
)

// Google Callback Route
router.get(
     '/google/callback',
     passport.authenticate('google', {
          failureRedirect: isProd
               ? 'https://panel.qption.com/TradingRoom'
               : 'http://localhost:3001/TradingRoom',
     }),
     (req, res) => {          // Successful authentication
          saveLoginHistory(req.user, req)
          const tokenAccess = generateAccessToken(
               { userId: req.user._id },
               process.env.JWT_SECRET
          )
          const tokenRefresh = generateRefreshToken(
               { userId: req.user._id },
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
          return res.redirect(
               isProd
                    ? 'https://panel.qption.com/TradingRoom'
                    : 'http://localhost:3001/TradingRoom'
          )
     }
)

// Logout Route
router.get('/logout', (req, res) => {
     req.logout((err) => {
          if (err) return next(err)
          res.redirect('/')
     })
})
export default router