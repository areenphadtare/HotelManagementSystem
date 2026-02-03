import mongoose, { Schema, Document } from 'mongoose'

export interface IRoom extends Document {
  name: string
  capacity: number
  facilities: string[]
  price: number
  image?: string
}

const RoomSchema: Schema = new Schema<IRoom>({
  name: { type: String, required: true },
  capacity: { type: Number, default: 1 },
  facilities: { type: [String], default: [] },
  price: { type: Number, default: 0 },
  image: { type: String }
})

export default mongoose.model<IRoom>('Room', RoomSchema)
