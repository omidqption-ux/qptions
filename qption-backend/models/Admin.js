// models/Admin.ts
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const adminSchema = new mongoose.Schema(
     {
          fullName: { type: String, trim: true },
          username: { type: String, required: true, trim: true, unique: true, index: true }, // <- unique
          password: {
               type: String,
               required: [true, 'Password is required'],
               minlength: [8, 'Password must be at least 8 characters long'],
               select: false,
          },
          role: {
               type: String,
               enum: ['superAdmin', 'admin', 'accountant', 'blogger', 'manager'],
               required: true,
          },
          isActive: { type: Boolean, default: true },
     },
     { timestamps: true }
)

// Hash password if modified
adminSchema.pre('save', async function (next) {
     if (this.isModified('password')) {
          const salt = await bcrypt.genSalt(10)
          this.password = await bcrypt.hash(this.password, salt)
     }
     next()
})

adminSchema.methods.matchPassword = async function (enteredPassword, userPassword) {
     return bcrypt.compare(enteredPassword, userPassword)
}

adminSchema.methods.toJSON = function () {
     const obj = this.toObject()
     delete obj.__v
     return obj
}

export default mongoose.model('Admin', adminSchema)
