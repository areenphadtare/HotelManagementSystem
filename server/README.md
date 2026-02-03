# Server (Express + MongoDB)

Quick start:

- Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
- Install dependencies: `npm install`
- Seed sample data: `npm run seed`
- Dev: `npm run dev` (uses `ts-node-dev`)
- Build: `npm run build`, Start: `npm run start`

API endpoints:
- POST `/api/auth/register` { name, email, password }
- POST `/api/auth/login` { email, password }
- GET `/api/rooms` - list rooms
- POST `/api/bookings` (auth) - create booking
- GET `/api/bookings/me` (auth) - my bookings
- GET `/api/reviews/room/:roomId` - room reviews
- POST `/api/reviews` (auth) - create review

Remember to set `MONGO_URI` to your MongoDB connection string (Atlas or local).