import mongoose from 'mongoose'

const loginHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    IP: {
      type: String,
    },
    deviceOs: {
      type: String,
    },
    browser: {
      type: String,
      default: 'Unknown'
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);
// Optional method to mask sensitive fields before sending the user object
loginHistorySchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v; // Remove Mongoose version key
  delete obj._id; // Remove _id
  delete obj.userId; // Remove userId
  return obj;
};
const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);
export default LoginHistory