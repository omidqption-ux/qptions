import News from '../models/News.js'

const POLY_BASE = "https://api.polygon.io/v2/reference/news"
const POLYGON_API_KEY = process.env.POLYGON_API_KEY
const cache = new Map()
const TTL_MS = 30_000

export const getLatestNews = async (req, res) => {
     try {
          const {
               ticker,
               limit = "40",
               cursor,
               order = "desc",
               sort = "published_utc",
          } = req.query;

          let upstreamUrl;

          if (cursor) {
               // If cursor is a full URL (Polygon next_url), call it directly
               if (/^https?:\/\//i.test(cursor)) {
                    const u = new URL(cursor);

                    // 🔒 Basic SSRF guard: only allow polygon.io hosts
                    if (!/\.?polygon\.io$/i.test(u.hostname)) {
                         return res.status(400).json({ status: "error", message: "Invalid cursor host" });
                    }

                    upstreamUrl = u.toString();
               } else {
                    // If cursor is just the opaque cursor token, append it as usual
                    const qs = new URLSearchParams();
                    if (ticker) qs.set("ticker", String(ticker));
                    qs.set("limit", String(Math.min(Math.max(parseInt(String(limit), 10) || 20, 1), 50)));
                    qs.set("cursor", String(cursor));
                    qs.set("order", String(order));
                    qs.set("sort", String(sort));
                    upstreamUrl = `${POLY_BASE}?${qs.toString()}`;
               }
          } else {
               // First page (no cursor): build from params
               const qs = new URLSearchParams();
               if (ticker) qs.set("ticker", String(ticker));
               qs.set("limit", String(Math.min(Math.max(parseInt(String(limit), 10) || 20, 1), 50)));
               qs.set("order", String(order));
               qs.set("sort", String(sort));
               upstreamUrl = `${POLY_BASE}?${qs.toString()}`;
          }

          //  Cache key is the exact upstream URL
          const ck = upstreamUrl;
          const now = Date.now();
          const hit = cache.get(ck);
          if (hit && now - hit.t < TTL_MS) {
               return res.status(200).json(hit.body);
          }

          const upstream = await fetch(upstreamUrl, {
               headers: { Authorization: `Bearer ${POLYGON_API_KEY}` },
               cache: "no-store",
               timeout: 10_000,
          });

          if (!upstream.ok) {
               const text = await upstream.text().catch(() => "");
               return res.status(upstream.status).json({
                    status: "error",
                    message: `Polygon ${upstream.status}`,
                    details: text.slice(0, 500),
               });
          }

          const data = await upstream.json();

          // Strip any apiKey from next_url but keep it as a FULL URL (so your client can pass it back verbatim)
          const safeNext = data.next_url
               ? data.next_url.replace(/([?&])apiKey=[^&]+/i, "$1").replace(/[?&]$/, "")
               : null;

          const safe = { ...data, next_url: safeNext };

          cache.set(ck, { t: now, body: safe });
          res.set("Cache-Control", "private, max-age=15");
          return res.status(200).json(safe);
     } catch (err) {
          return res.status(500).json({ status: "error", message: err?.message || "Server error" });
     }
}

export const getCompanyNews = async (req, res) => {
     const { page, limit } = req.query
     try {
          const count = await News.countDocuments()
          const news = await News.find()
               .skip((page - 1) * limit)
               .limit(limit)
               .sort({ updatedAt: -1 })
          return res.status(200).json({ news, count })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const setCompanyNews = async (req, res) => {
     const { news } = req.body
     try {
          await News.create(news)
          return res
               .status(200)
               .json({ message: 'news was added successfully' })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const editCompanyNews = async (req, res) => {
     const { news } = req.body
     try {
          await News.findByIdAndUpdate({ _id: news._id }, news)
          return res
               .status(200)
               .json({ message: 'news was updated successfully' })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const deleteCompanyNews = async (req, res) => {
     const { newsId } = req.query
     try {
          await News.findByIdAndDelete(newsId)
          return res
               .status(200)
               .json({ message: 'News was deleted successfully' })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}