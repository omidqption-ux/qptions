import mongoose from 'mongoose'
const roleSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    permissions: [{ type: String, required: true }] // e.g. 'user:read', 'user:write'
}, { timestamps: true })
export default mongoose.model('Role', roleSchema)