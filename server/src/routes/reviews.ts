import express from 'express'
import Review from '../models/Review'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = express.Router()

router.get('/room/:roomId', async (req, res) => {
  const reviews = await Review.find({ roomId: req.params.roomId }).sort({ createdAt: -1 })
  res.json(reviews)
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { roomId, rating, comment } = req.body
  if (!roomId || !rating) return res.status(400).json({ message: 'Missing fields' })
  const review = await Review.create({ roomId, userId: req.userId, rating, comment })
  res.json(review)
})

export default router
