import express from 'express'
import Booking from '../models/Booking'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = express.Router()

// create booking with conflict check
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { roomId, start, end, facilities, total } = req.body
  if (!roomId || !start || !end) return res.status(400).json({ message: 'Missing fields' })

  const s = new Date(start)
  const e = new Date(end)
  if (s >= e) return res.status(400).json({ message: 'End must be after start' })

  // conflict check: existing booking where start <= e && end >= s
  const conflicts = await Booking.find({ roomId, $expr: { $and: [ { $lte: [ '$start', e ] }, { $gte: [ '$end', s ] } ] } })
  // the above $expr query may be less portable; do a simpler query
  const simpleConf = await Booking.find({ roomId, start: { $lte: e }, end: { $gte: s } })
  if (simpleConf.length) return res.status(409).json({ message: 'Room already booked for these dates' })

  const days = Math.ceil((e.getTime() - s.getTime()) / (1000*60*60*24))
  const booking = await Booking.create({ roomId, userId: req.userId, start: s, end: e, days, facilities, total })
  res.json(booking)
})

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const bookings = await Booking.find({ userId: req.userId }).sort({ start: -1 })
  res.json(bookings)
})

export default router
