import mongoose from 'mongoose'

export async function runInTxn(work) {
     const session = await mongoose.startSession()
     try {
          let result
          await session.withTransaction(async () => {
               result = await work(session)
          })
          return result
     } catch (err) {
          console.error('[runInTxn] Transaction aborted:', err)
          throw err
     } finally {
          session.endSession()
     }
}
