import mongoose from 'mongoose'

const deletedUserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);



// Optional method to mask sensitive fields before sending the user object
deletedUserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v; // Remove Mongoose version key
  return obj;
};

const DeletedUser = mongoose.model("DeletedUser", deletedUserSchema);
export default DeletedUser