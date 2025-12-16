import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Admin from '../models/Admin.js'

function allowPreflight(req, res) {
     if (req.method === 'OPTIONS') {
          res.sendStatus(204);
          return true;
     }
     return false;
}

export const verifyToken = async (req, res, next) => {
     if (allowPreflight(req, res)) return
     try {
          // Support both signed and plain cookies (depending on cookie-parser setup)
          const cookieName = process.env.COOKIE_ACCESS;
          const token = req.cookies?.[cookieName];

          if (!token) {
               return res.status(401).json({ error: 'No token' });
          }

          // Synchronous verify (throws on error) -> easy try/catch
          const payload = jwt.verify(token, process.env.JWT_SECRET);
          if (!payload?.userId) {
               return res.status(401).json({ error: 'Invalid token payload' });
          }

          const user = await User.findById(payload.userId);
          if (!user) {
               return res.status(401).json({ error: 'User not found' });
          }

          req.user = user;
          return next();
     } catch (err) {
          // Token invalid/expired, bad signature, etc.
          return res.status(401).json({ error: 'Not authorized' });
     }
}

export const verifyTokenAdmin = async (req, res, next) => {
     if (allowPreflight(req, res)) return;

     try {
          const cookieName = process.env.COOKIE_ADMIN_ACCESS;
          const token = req.cookies?.[cookieName];

          if (!token) {
               return res.status(401).json({ error: 'No token' });
          }

          const payload = jwt.verify(token, process.env.JWT_SECRET);
          if (!payload?.adminId) {
               return res.status(401).json({ error: 'Invalid token payload' });
          }

          const admin = await Admin.findById(payload.adminId);
          if (!admin) {
               return res.status(401).json({ error: 'Admin not found' });
          }

          req.user = admin;
          return next();
     } catch (err) {
          return res.status(401).json({ error: 'Not authorized' });
     }
}
