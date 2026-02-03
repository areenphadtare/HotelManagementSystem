// Minimal client-side "API" using localStorage for now.
// Later this will be replaced with real HTTP calls to the server.

export async function seedSampleData() {
  const rooms = JSON.parse(localStorage.getItem('rooms') || 'null')
  if (rooms) return
  const sample = [
    { id: 'r1', name: 'Standard Room', capacity: 2, facilities: ['wifi', 'ac'], price: 50, image: 'https://images.unsplash.com/photo-1560440770-69b1b82a0d9f?w=1000&q=60&auto=format&fit=crop' },
    { id: 'r2', name: 'Deluxe Room', capacity: 3, facilities: ['wifi', 'ac', 'tv'], price: 90, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&q=60&auto=format&fit=crop' },
    { id: 'r3', name: 'Suite', capacity: 5, facilities: ['wifi', 'ac', 'tv', 'minibar'], price: 150, image: 'https://images.unsplash.com/photo-1501117716987-c8e5e6a58b0a?w=1000&q=60&auto=format&fit=crop' },
  ]
  localStorage.setItem('rooms', JSON.stringify(sample))
  localStorage.setItem('bookings', JSON.stringify([]))
  localStorage.setItem('reviews', JSON.stringify([]))
}

export async function getRooms() {
  await seedSampleData()
  return JSON.parse(localStorage.getItem('rooms') || '[]')
}

export async function getRoomById(id) {
  const rooms = await getRooms()
  return rooms.find((r) => r.id === id)
}

export async function getBookings() {
  return JSON.parse(localStorage.getItem('bookings') || '[]')
}

export async function createBooking(booking) {
  const bookings = await getBookings()
  bookings.push(booking)
  localStorage.setItem('bookings', JSON.stringify(bookings))
  return booking
}

export async function getUserBookings(userId) {
  const bookings = await getBookings()
  return bookings.filter((b) => b.userId === userId)
}

export async function updateBooking(bookingId, updates) {
  const bookings = await getBookings()
  const idx = bookings.findIndex(b => b.id === bookingId)
  if (idx === -1) throw new Error('Booking not found')
  bookings[idx] = { ...bookings[idx], ...updates }
  localStorage.setItem('bookings', JSON.stringify(bookings))
  return bookings[idx]
}

export async function cancelBooking(bookingId) {
  let bookings = await getBookings()
  bookings = bookings.filter(b => b.id !== bookingId)
  localStorage.setItem('bookings', JSON.stringify(bookings))
  return true
}
