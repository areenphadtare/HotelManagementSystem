import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ message: 'Missing Authorization header' })

  const [type, token] = header.split(' ')
  if (type !== 'Bearer' || !token) return res.status(401).json({ message: 'Invalid Authorization header' })

  try {
    const secret = process.env.JWT_SECRET || 'devsecret'
    const payload = jwt.verify(token, secret) as any
    req.userId = payload.id
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}