import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IBooking extends Document {
  roomId: Types.ObjectId
  userId: Types.ObjectId
  start: Date
  end: Date
  days: number
  facilities?: string[]
  total?: number
  createdAt: Date
}

const BookingSchema: Schema = new Schema<IBooking>({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  days: { type: Number, required: true },
  facilities: { type: [String], default: [] },
  total: { type: Number },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IBooking>('Booking', BookingSchema)
