import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IReview extends Document {
  roomId: Types.ObjectId
  userId: Types.ObjectId
  rating: number
  comment?: string
  createdAt: Date
}

const ReviewSchema: Schema = new Schema<IReview>({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IReview>('Review', ReviewSchema)
