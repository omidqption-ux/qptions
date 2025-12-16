// Minimal, Express 5–safe sanitizers
import xss from 'xss'

const isObj = v => v && typeof v === 'object'

function stripMongoDanger(o) {
    if (!isObj(o)) return
    if (Array.isArray(o)) {
        for (const v of o) stripMongoDanger(v)
        return
    }
    for (const k of Object.keys(o)) {
        // Remove keys like $gt, $set and dotted paths (query selector injection)
        if (k.startsWith('$') || k.includes('.')) {
            delete o[k]
            continue
        }
        const v = o[k]
        if (isObj(v)) stripMongoDanger(v)
    }
}

function deepXssSanitize(o) {
    if (!isObj(o)) return
    if (Array.isArray(o)) {
        for (let i = 0; i < o.length; i++) deepXssSanitize(o[i])
        return
    }
    for (const k of Object.keys(o)) {
        const v = o[k]
        if (typeof v === 'string') {
            // sanitize the string value in place
            o[k] = xss(v)
        } else if (isObj(v)) {
            deepXssSanitize(v)
        }
    }
}

export default function sanitize() {
    return (req, _res, next) => {
        // IMPORTANT: mutate in place; do NOT reassign req.query/req.params
        if (req.body) { stripMongoDanger(req.body); deepXssSanitize(req.body) }
        if (req.params) { stripMongoDanger(req.params); deepXssSanitize(req.params) }
        if (req.query) { stripMongoDanger(req.query); deepXssSanitize(req.query) }
        next()
    }
}
