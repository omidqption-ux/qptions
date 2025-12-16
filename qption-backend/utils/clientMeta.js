// src/utils/clientMeta.js
import UAParser from 'ua-parser-js'
import requestIp from 'request-ip'

export function getClientMeta(req) {
    const ua = new UAParser(req.headers['user-agent'] || '')
    const ip = (req.clientIp || requestIp.getClientIp(req) || '').replace('::ffff:', '')
    const browser = ua.getBrowser().name || 'Unknown'
    const deviceOs = ua.getOS().name || 'Unknown'
    const deviceType = ua.getDevice().type || 'Desktop'
    return { ip, browser, deviceOs, deviceType }
}
