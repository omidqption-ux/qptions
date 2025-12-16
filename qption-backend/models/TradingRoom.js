// models/TradingRoom.js
import mongoose from 'mongoose'

const tradeSchema = new mongoose.Schema({
     openTime: Number,
     closeTime: Number,
     amount: Number,
     buyOrSell: {
          type: String,
          required: true,
          enum: ['buy', 'sell'],
          lowercase: true,     // auto-coerce to lowercase on save
          trim: true
     },
     isWin: { type: Boolean, default: true },
     initialPrice: Number,
     finalPrice: Number,
     percentage: Number,
     pair: String,
     netProfit: Number,
     isCopy: {
          leadTraderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          factor: String,
     },
     status: { type: String, enum: ['opened', 'inprocess', 'closed'], default: 'opened', index: true },
     // keep mode on each trade too (nice for auditing/filtering)
     mode: { type: String, enum: ['real', 'demo', 'bonus'], default: 'real', index: true },
}, { timestamps: true })

const tradingRoomSchema = new mongoose.Schema(
     {
          userId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
               index: true,
          },
          mode: {
               type: String,
               enum: ['real', 'demo', 'bonus'],
               required: true,
               index: true,
          },
          trades: [tradeSchema],
     },
     { timestamps: true }
);

// One room per user per mode
tradingRoomSchema.index({ userId: 1, mode: 1 }, { unique: true });

export default mongoose.model('TradingRoom', tradingRoomSchema);

