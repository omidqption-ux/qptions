import mongoose from 'mongoose'

const photoSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  createdAt: { type: Date, default: Date.now },
})
export default mongoose.model('Photo', photoSchema);
