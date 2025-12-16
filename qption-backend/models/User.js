import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'


// Define the User Schema
const userSchema = new mongoose.Schema(
     {
          username: {
               type: String,
               required: false,
               unique: true,
          },
          firstName: {
               type: String,
               required: false,
               trim: true,
          },
          lastName: {
               type: String,
               required: false,
               trim: true,
          },
          country: {
               type: String,
               required: false,
               trim: true,
          },
          dateOfBirth: {
               type: String,
               required: false,
               trim: true,
          },
          googleId: {
               type: String,
               required: false,
               unique: true, // Google ID must be unique
               sparse: true, // Allow null values
          },
          email: {
               type: String,
               required: false,
               unique: true,
               sparse: true,
               match: [
                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    'Please provide a valid email address',
               ],
          },
          phone: {
               type: String,
               required: false,
               match: [
                    /^$|\+[1-9]\d{7,14}$/,
                    'Please provide a valid phone number',
               ], // Assuming a (code)number phone number
               unique: true,
               sparse: true,
          },
          password: {
               type: String,
               required: [false, 'Password is required'],
               minlength: [8, 'Password must be at least 8 characters long'],
               select: false, // Exclude password field in queries by default
          },
          role: {
               type: String,
               enum: ['user', 'admin'], // Only "user" or "admin" roles allowed
               default: 'user',
          },
          isActive: {
               type: Boolean,
               default: true,
          },
          isPhoneVerified: {
               type: Boolean,
               default: false,
          },
          isEmailVerified: {
               type: Boolean,
               default: false,
          },
          isIDVerified: {
               type: Boolean,
               default: false,
          },
          OTP: {
               type: String,
               default: '',
          },
          validationOTP: {
               otp: {
                    type: String,
                    default: '',
               },
               createdAt: { type: Date, default: Date.now },
          },
          phoneVerificationOTP: {
               otp: {
                    type: String,
                    default: '',
               },
               createdAt: { type: Date, default: Date.now },
          },
          emailVerificationOTP: {
               otp: {
                    type: String,
                    default: '',
               },
               createdAt: { type: Date, default: Date.now },
          },
          profileImage: {
               type: String,
               required: false,
          },
          referralCode: {
               type: String,
               required: false,
               trim: true,
          },
          userSettings: {
               soundControl: {
                    notification: {
                         type: Boolean,
                         default: true,
                    },
                    balance: {
                         type: Boolean,
                         default: true,
                    },
               },
               notifications: {
                    emailNotifications: {
                         type: Boolean,
                         default: true,
                    },
                    updatesFromYourManager: {
                         type: Boolean,
                         default: true,
                    },
                    companysNews: {
                         type: Boolean,
                         default: true,
                    },
                    companyPromotions: {
                         type: Boolean,
                         default: true,
                    },
                    companysTradingAnalytics: {
                         type: Boolean,
                         default: true,
                    },
                    tradingStatements: {
                         type: Boolean,
                         default: true,
                    },
                    educationEmails: {
                         type: Boolean,
                         default: true,
                    },
               },
               theme: {
                    darkMode: {
                         type: Boolean,
                         default: true,
                    },
                    background: {
                         type: Boolean,
                         default: true,
                    },
               },
               indicators: {
                    signals: {
                         type: Boolean,
                         default: false,
                    },
                    analytics: {
                         type: Boolean,
                         default: true,
                    },
                    marketWatch: {
                         type: Boolean,
                         default: false,
                    },
               },
               timeZone: {
                    automaticDetection: {
                         type: Boolean,
                         default: true,
                    },
                    timeZone: {
                         type: String,
                         default: '0',
                    },
               },
               islamicAccount: {
                    type: Boolean,
                    default: false,
               },
          },
          balance: {
               amount: {
                    type: Number,
                    default: 0,
               },
               bonus: {
                    type: Number,
                    default: 0,
               },
               demo: {
                    type: Number,
                    default: 50000,
               },
               updatedAt: { type: Date, default: Date.now },
          },
          followersCount: {
               type: Number,
               default: 0,
               timestamps: true,
          },
          Referrals: [
               {
                    user: {
                         type: mongoose.Schema.Types.ObjectId,
                         ref: 'User',
                         required: true,
                    },
                    createdAt: {
                         type: Date,
                         default: Date.now,
                    },
               },
          ],
          followers: [
               {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    default: [],
               },
          ],
          following: [
               {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    default: [],
               },
          ],
          leaderTraders: [
               {
                    leadTraderId: {
                         type: mongoose.Schema.Types.ObjectId,
                         ref: 'User',
                    },
                    factor: {
                         type: String,
                    },
                    isActive: {
                         type: Boolean,
                         default: true,
                    },
               },
          ],
     },
     {
          timestamps: true, // Automatically add createdAt and updatedAt fields
     }
)
userSchema.index(
     { referralCode: 1 },
     {
          unique: true,
          partialFilterExpression: { referralCode: { $type: 'string' } },
     },
     { createdAt: 1 }
)
// Pre-save middleware for password hashing
userSchema.pre('save', async function (next) {
     if (!this.username) {
          const idPrefix = this._id.toString().slice(-4) // Last 4 hex digits of _id
          this.username = `Q-${idPrefix}`
     }
     if (!this.isModified('password')) {
          return next() // Skip hashing if the password hasn't been modified
     }
     const salt = await bcrypt.genSalt(10)
     this.password = await bcrypt.hash(this.password, salt)
     if (!this.email && !this.phone) {
          this.invalidate('email', 'Either email or phone is required')
          this.invalidate('phone', 'Either email or phone is required')
     }
     next()
})

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (
     enteredPassword,
     userPassword
) {
     return await bcrypt.compare(enteredPassword, userPassword)
}

// Optional method to mask sensitive fields before sending the user object
userSchema.methods.toJSON = function () {
     const obj = this.toObject()
     delete obj.__v // Remove Mongoose version key
     return obj
}

export default mongoose.model('User', userSchema)
