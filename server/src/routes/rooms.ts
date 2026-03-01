import express from 'express'
import Room from '../models/Room'
import Booking from '../models/Booking'

const router = express.Router()

router.get('/', async (req, res) => {
  const rooms = await Room.find()
  res.json(rooms)
})

router.get('/:id', async (req, res) => {
  const room = await Room.findById(req.params.id)
  if (!room) return res.status(404).json({ message: 'Room not found' })
  res.json(room)
})

// Check room availability
router.post('/availability/check', async (req, res) => {
  const { roomId, start, end } = req.body
  if (!roomId || !start || !end) {
    return res.status(400).json({ message: 'Missing fields' })
  }

  const s = new Date(start)
  const e = new Date(end)
  if (s >= e) {
    return res.status(400).json({ message: 'End must be after start' })
  }

  // Check for conflicting bookings
  const conflicts = await Booking.find({
    roomId,
    start: { $lte: e },
    end: { $gte: s }
  })

  res.json({ available: conflicts.length === 0, conflicts })
})

// Get all rooms with availability status
router.post('/availability/all', async (req, res) => {
  const { start, end } = req.body
  if (!start || !end) {
    return res.status(400).json({ message: 'Missing fields' })
  }

  const s = new Date(start)
  const e = new Date(end)
  if (s >= e) {
    return res.status(400).json({ message: 'End must be after start' })
  }

  const rooms = await Room.find()
  const roomsWithAvailability = await Promise.all(
    rooms.map(async (room) => {
      const conflicts = await Booking.find({
        roomId: room._id,
        start: { $lte: e },
        end: { $gte: s }
      })
      return {
        ...room.toObject(),
        available: conflicts.length === 0
      }
    })
  )

  res.json(roomsWithAvailability)
})

// For simplicity, allow creating rooms without auth for now
router.post('/', async (req, res) => {
  const { name, capacity, facilities, price, image } = req.body
  const room = await Room.create({ name, capacity, facilities, price, image })
  res.json(room)
})

export default router
