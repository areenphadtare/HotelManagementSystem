import express from 'express'
import Room from '../models/Room'

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

// For simplicity, allow creating rooms without auth for now
router.post('/', async (req, res) => {
  const { name, capacity, facilities, price, image } = req.body
  const room = await Room.create({ name, capacity, facilities, price, image })
  res.json(room)
})

export default router
