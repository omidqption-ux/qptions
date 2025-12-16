import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js'
import { env } from '../config/env.js'

const isProd = env.NODE_ENV === 'production'
const cookieDomain = isProd ? '.qption.com' : undefined

export const logoutAdmin = async (req, res) => {
    try {
        res.clearCookie(env.COOKIE_ADMIN_ACCESS, {
            signed: true,
            httpOnly: true,
            secure: isProd, // Ensure it's only set on HTTPS in production
            sameSite: isProd ? 'none' : 'lax',
            domain: cookieDomain,
            path: '/',
            maxAge: 3600000 * 24,
        })
        res.clearCookie(env.COOKIE_ADMIN_REFRESH, {
            signed: true,
            httpOnly: true,
            secure: isProd, // Ensure it's only set on HTTPS in production
            sameSite: isProd ? 'none' : 'lax',
            domain: cookieDomain,
            path: '/',
            maxAge: 3600000 * 24 * 365,
        })
        return res.status(200).json({ isLogin: false })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body
    try {
        const admin = await Admin.findOne({ username: email }).select(
            '+password'
        )

        if (!admin || !admin.password) {
            return res.status(500).json({
                message: `Invalid email or password`,
            })
        }
        if (
            (await admin.matchPassword(password, admin.password)) &&
            admin.isActive
        ) {
            const tokenAdminAccess = generateAccessToken(
                { adminId: admin._id },
                env.COOKIE_SECRET
            )
            const tokenAdminRefresh = generateRefreshToken(
                { userId: admin._id },
                env.COOKIE_SECRET
            )
            res.cookie(env.COOKIE_ADMIN_ACCESS, tokenAdminAccess, {
                signed: true,
                httpOnly: true,
                secure: isProd, // Ensure it's only set on HTTPS in production
                sameSite: isProd ? 'none' : 'lax',
                domain: cookieDomain,
                path: '/',
                maxAge: 3600000 * 24,
            })
            res.cookie(env.COOKIE_ADMIN_REFRESH, tokenAdminRefresh, {
                signed: true,
                httpOnly: true,
                secure: isProd, // Ensure it's only set on HTTPS in production
                sameSite: isProd ? 'none' : 'lax',
                domain: cookieDomain,
                path: '/',
                maxAge: 3600000 * 24 * 365,
            })
            return res.status(200).json({ isLogin: true })
        } else {
            return res.status(500).json({
                message: `Invalid email or password`,
            })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const refreshTokenAdmin = async (req, res) => {
    const tokenRefresh = req.signedCookies[env.COOKIE_ADMIN_REFRESH]
    if (!tokenRefresh) {
        res.clearCookie(env.COOKIE_ADMIN_REFRESH, {
            signed: true,
            httpOnly: true,
            secure: isProd, // Ensure it's only set on HTTPS in production
            sameSite: isProd ? 'none' : 'lax',
            domain: cookieDomain,
            path: '/',
            maxAge: 3600000 * 24 * 365,
        })
        return res.status(423).json({ loginRetry: false })
    }
    try {
        jwt.verify(
            tokenRefresh,
            env.COOKIE_SECRET,
            (err, user) => {
                if (err) {
                    res.clearCookie(env.COOKIE_ADMIN_REFRESH, {
                        signed: true,
                        httpOnly: true,
                        secure: isProd, // Ensure it's only set on HTTPS in production
                        sameSite: isProd ? 'none' : 'lax',
                        domain: cookieDomain,
                        path: '/',
                        maxAge: 3600000 * 24 * 365,
                    })
                    return res.status(423).json({ loginRetry: false })
                }
                const newAccessToken = generateAccessToken(
                    { userId: user.userId },
                    env.COOKIE_SECRET
                )
                const tokenAdminRefresh = generateRefreshToken(
                    { userId: user.userId },
                    env.COOKIE_SECRET
                )
                res.cookie(env.COOKIE_ADMIN_ACCESS, newAccessToken, {
                    signed: true,
                    httpOnly: true,
                    secure: isProd, // Ensure it's only set on HTTPS in production
                    sameSite: isProd ? 'none' : 'lax',
                    domain: cookieDomain,
                    path: '/',
                    maxAge: 3600000 * 24,
                })
                res.cookie(env.COOKIE_ADMIN_REFRESH, tokenAdminRefresh, {
                    signed: true,
                    httpOnly: true,
                    secure: isProd, // Ensure it's only set on HTTPS in production
                    sameSite: isProd ? 'none' : 'lax',
                    domain: cookieDomain,
                    path: '/',
                    maxAge: 3600000 * 24 * 365,
                })
            }
        )
        return res.status(200).json({ loginRetry: true })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const isLoginAdmin = async (req, res) => {
    try {
        const tokenRefresh = req.signedCookies[env.COOKIE_ADMIN_REFRESH]
        if (!tokenRefresh) {
            return res.json({ isLogin: false })
        }
        jwt.verify(
            tokenRefresh,
            env.COOKIE_SECRET,
            (err) => {
                if (err) return res.json({ isLogin: false })
                else return res.json({ isLogin: true })
            }
        )
    } catch (error) {
        return res.json({ isLogin: false })
    }
}