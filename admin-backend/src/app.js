import loadExpress from './loaders/express.js'
import { env } from './config/env.js'

const app = loadExpress({ corsOrigin: env.CORS_ORIGIN, trustProxy: true })
export default app
