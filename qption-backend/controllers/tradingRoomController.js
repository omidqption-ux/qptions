// controllers/tradingRoom.controller.js
import TradingRoom from '../models/TradingRoom.js';

const ALLOWED_MODES = new Set(['real', 'demo', 'bonus']);

/** Core helper: create-or-get a room for user+mode (no duplicates). */
async function ensureRoomForMode(userId, mode, extraUpdate = {}) {
     if (!ALLOWED_MODES.has(mode)) {
          const err = new Error('Invalid mode'); err.status = 400; throw err;
     }

     // Only set userId/mode on insert; optionally $set other fields if you pass them
     const update = {
          $setOnInsert: { userId, mode },
          ...(Object.keys(extraUpdate).length ? { $set: extraUpdate } : {}),
     };

     const options = {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
     };

     return TradingRoom.findOneAndUpdate({ userId, mode }, update, options);
}

/** Generic endpoint if you want to pass mode via params/body/query. */
export const setTradingRoomGeneric = async (req, res) => {
     try {
          const userId = req.user?._id;
          const mode =
               String(req.params.mode || req.body.mode || req.query.mode || 'real')
                    .toLowerCase();

          const room = await ensureRoomForMode(userId, mode);
          return res.status(201).json(room);
     } catch (error) {
          return res.status(error.status || 500).json({ message: error.message });
     }
};

// Thin wrappers (keep your current routes unchanged)
export const setTradingRoom = async (req, res) => {
     try {
          const room = await ensureRoomForMode(req.user._id, 'real');
          return res.status(201).json(room);
     } catch (error) {
          return res.status(error.status || 500).json({ message: error.message });
     }
};

export const setTradingRoomDemo = async (req, res) => {
     try {
          const room = await ensureRoomForMode(req.user._id, 'demo');
          return res.status(201).json(room);
     } catch (error) {
          return res.status(error.status || 500).json({ message: error.message });
     }
};

export const setTradingRoomBonus = async (req, res) => {
     try {
          const room = await ensureRoomForMode(req.user._id, 'bonus');
          return res.status(201).json(room);
     } catch (error) {
          return res.status(error.status || 500).json({ message: error.message });
     }
};
