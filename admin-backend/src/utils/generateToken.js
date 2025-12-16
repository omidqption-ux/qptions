import jwt from 'jsonwebtoken'

export function generateAccessToken(payload, secretKey, expiresIn = '24h') {
     return jwt.sign(payload, secretKey, { expiresIn })
}
export function generateRefreshToken(payload, secretKey, expiresIn = '7d') {
     return jwt.sign(payload, secretKey, { expiresIn })
}