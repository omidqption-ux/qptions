// scripts/seed-admin.ts
import mongoose from 'mongoose'
import '../config/env.js'
import Admin from '../models/Admin.js'

async function main() {
    await mongoose.connect(process.env.MONGO_URI)
    const username = 'info@qption.com'
    const password = '2212zZzZ'
    const role = 'superAdmin'

    const exists = await Admin.findOne({ username }).lean()
    if (exists) {
        console.log('Already exists')
    } else {
        await new Admin({ username, password, role, fullName: 'Default Admin' }).save()
        console.log('Created default admin')
    }
    await mongoose.disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
//// node -r dotenv/config scripts/seed-admin.ts
