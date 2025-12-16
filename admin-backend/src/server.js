import { createServer } from 'http'
import app from './app.js'
import connectMongo from './db/mongoose.js'
import { env } from './config/env.js'
import { initSocket } from './socket.js'
import { startNotificationWatcher } from './notificationWatcher.js'

await connectMongo()
const server = createServer(app)

initSocket(server)
startNotificationWatcher()

server.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`)
})
