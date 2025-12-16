import crypto from 'crypto'

const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY
const INFOBIP_BASE_URL = process.env.INFOBIP_API_BASE_URL
const INFOBIP_SENDER = process.env.INFOBIP_SENDER

export async function sendSMS(phoneNumber, otp) {
    try {
        const to = phoneNumber
        const payload = {
            messages: [
                {
                    from: INFOBIP_SENDER,
                    destinations: [{ to }],
                    text: `Your Qption verification code is: ${otp}`,
                },
            ],
        }

        const response = await fetch(`${INFOBIP_BASE_URL}/sms/2/text/advanced`, {
            method: 'POST',
            headers: {
                Authorization: `App ${INFOBIP_API_KEY}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const errorText = await response.text()
            return false
        }

        const result = await response.json()
        return true
    } catch (error) {
        return false
    }
}

export function generateOTP() {
    return crypto.randomInt(100000, 999999); // 6-digit OTP
}