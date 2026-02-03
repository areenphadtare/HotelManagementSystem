import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

import Room from '../models/Room'
import User from '../models/User'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hoteldev'

async function main() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB for seeding')

  await Room.deleteMany({})
  await User.deleteMany({})

  const rooms = [
    { name: 'Standard Room', capacity: 2, facilities: ['wifi','ac'], price: 50, image: 'https://images.unsplash.com/photo-1560440770-69b1b82a0d9f?w=1000&q=60&auto=format&fit=crop' },
    { name: 'Deluxe Room', capacity: 3, facilities: ['wifi','ac','tv'], price: 90, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&q=60&auto=format&fit=crop' },
    { name: 'Suite', capacity: 5, facilities: ['wifi','ac','tv','minibar'], price: 150, image: 'https://images.unsplash.com/photo-1501117716987-c8e5e6a58b0a?w=1000&q=60&auto=format&fit=crop' }
  ]

  await Room.create(rooms)

  const pw = await bcrypt.hash('adminpass', 10)
  await User.create({ name: 'Admin', email: 'admin@example.com', password: pw })

  console.log('Seed completed')
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})