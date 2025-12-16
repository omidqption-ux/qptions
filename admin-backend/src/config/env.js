import dotenv from 'dotenv'
dotenv.config()

export const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5001,
    MONGO_URI: process.env.NODE_ENV === 'production' ? process.env.MONGO_URI_SERVER : process.env.MONGO_URI,
    CORS_ORIGIN: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN_SERVER : process.env.CORS_ORIGIN,
    JWT_EXPIRES: process.env.JWT_EXPIRES || '7d',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH,
    COOKIE_ADMIN_ACCESS: process.env.COOKIE_ADMIN_ACCESS,
    COOKIE_ADMIN_REFRESH: process.env.COOKIE_ADMIN_REFRESH,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    ADMIN_PANEL_URL: process.env.ADMIN_PANEL_URL
}