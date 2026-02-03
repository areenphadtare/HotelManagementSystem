import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoutes from './routes/auth'
import roomRoutes from './routes/rooms'
import bookingRoutes from './routes/bookings'
import reviewRoutes from './routes/reviews'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hoteldev'
const PORT = Number(process.env.PORT || 4000)

async function main() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('Mongo connection error', err)
    process.exit(1)
  }

  const app = express()
  app.use(cors())
  app.use(express.json())

  app.use('/api/auth', authRoutes)
  app.use('/api/rooms', roomRoutes)
  app.use('/api/bookings', bookingRoutes)
  app.use('/api/reviews', reviewRoutes)

  app.get('/', (req, res) => res.send({ ok: true, msg: 'Hotel API running' }))

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
  })
}

main()
