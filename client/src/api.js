// API client using real HTTP calls to the backend server
const API_URL = 'http://localhost:4000/api'

let authToken = localStorage.getItem('authToken')

export function setAuthToken(token) {
  authToken = token
  localStorage.setItem('authToken', token)
}

export function getAuthToken() {
  return authToken || localStorage.getItem('authToken')
}

// Seed sample data for compatibility with existing UI imports.
// Tries the backend first; if the server is unreachable this becomes a no-op.
export async function seedSampleData() {
  try {
    const rooms = await getRooms()
    if (Array.isArray(rooms) && rooms.length) return
  } catch (e) {
    // server may be offline — fall back to populating localStorage with sample data
  }

  const sample = [
    { id: 'r1', name: 'Standard Room', capacity: 2, facilities: ['wifi', 'ac'], price: 5000, image: '/assets/room1.svg' },
    { id: 'r2', name: 'Deluxe Room', capacity: 3, facilities: ['wifi', 'ac', 'tv'], price: 8000, image: '/assets/room2.svg' },
    { id: 'r3', name: 'Suite', capacity: 5, facilities: ['wifi', 'ac', 'tv', 'minibar'], price: 15000, image: '/assets/room3.svg' },
    { id: 'r4', name: 'Family Suite', capacity: 4, facilities: ['wifi', 'extra bed'], price: 12000, image: '/assets/room4.svg' },
    { id: 'r5', name: 'Honeymoon Suite', capacity: 2, facilities: ['view', 'romantic setup'], price: 18000, image: '/assets/room5.svg' },
    { id: 'r6', name: 'Presidential', capacity: 6, facilities: ['private pool', 'butler'], price: 45000, image: '/assets/room6.svg' }
  ]

  // Save sample data locally for offline / legacy UI
  localStorage.setItem('rooms', JSON.stringify(sample))
  localStorage.setItem('bookings', JSON.stringify([]))
  localStorage.setItem('reviews', JSON.stringify([]))
}

// Auth endpoints
export async function register(name, email, password, role = 'user') {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  })
  if (!res.ok) throw new Error('Registration failed')
  const data = await res.json()
  setAuthToken(data.token)
  return data
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error('Login failed')
  const data = await res.json()
  setAuthToken(data.token)
  return data
}

// Room endpoints
export async function getRooms() {
  try {
    const res = await fetch(`${API_URL}/rooms`)
    if (!res.ok) throw new Error('Failed to fetch rooms')
    const data = await res.json()
    // if server returned no rooms but we have local sample, use that
    if (Array.isArray(data) && data.length === 0) {
      const local = JSON.parse(localStorage.getItem('rooms') || '[]')
      if (Array.isArray(local) && local.length) return local
    }
    return data
  } catch (err) {
    // fallback to local storage if server unavailable
    return JSON.parse(localStorage.getItem('rooms') || '[]')
  }
}

export async function getRoomById(id) {
  try {
    const res = await fetch(`${API_URL}/rooms/${id}`)
    if (!res.ok) throw new Error('Failed to fetch room')
    return res.json()
  } catch (err) {
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]')
    return rooms.find(r => r.id === id)
  }
}

export async function createRoom(name, capacity, facilities, price, image) {
  const res = await fetch(`${API_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, capacity, facilities, price, image })
  })
  if (!res.ok) throw new Error('Failed to create room')
  return res.json()
}

export async function checkRoomAvailability(roomId, start, end) {
  try {
    const res = await fetch(`${API_URL}/rooms/availability/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, start, end })
    })
    if (!res.ok) throw new Error('Failed to check availability')
    return res.json()
  } catch (err) {
    // simple local availability check
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    const s = new Date(start)
    const e = new Date(end)
    const conflicts = bookings.filter(b => b.roomId === roomId && new Date(b.start) <= e && new Date(b.end) >= s)
    return { available: conflicts.length === 0, conflicts }
  }
}

export async function getAllRoomsAvailability(start, end) {
  try {
    const res = await fetch(`${API_URL}/rooms/availability/all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start, end })
    })
    if (!res.ok) throw new Error('Failed to fetch availability')
    return res.json()
  } catch (err) {
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]')
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    const s = new Date(start)
    const e = new Date(end)
    return Promise.all(
      rooms.map(async (room) => {
        const conflicts = bookings.filter(b => b.roomId === room.id && new Date(b.start) <= e && new Date(b.end) >= s)
        return { ...room, available: conflicts.length === 0 }
      })
    )
  }
}

// Booking endpoints
export async function createBooking(booking) {
  const token = getAuthToken()
  // try server
  if (token) {
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(booking)
      })
      if (res.ok) return res.json()
    } catch (e) {
      // ignore and fall back
    }
  }
  // fallback to localStorage
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
  bookings.push(booking)
  localStorage.setItem('bookings', JSON.stringify(bookings))
  return booking
}

// Update booking: try server, else fallback to localStorage
export async function updateBooking(bookingId, updates) {
  const token = getAuthToken()
  if (token) {
    try {
      const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })
      if (res.ok) return res.json()
    } catch (e) {
      // ignore and fallback to local
    }
  }

  // fallback to localStorage
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
  const idx = bookings.findIndex(b => b.id === bookingId)
  if (idx === -1) throw new Error('Booking not found')
  bookings[idx] = { ...bookings[idx], ...updates }
  localStorage.setItem('bookings', JSON.stringify(bookings))
  return bookings[idx]
}

export async function getUserBookings(userId) {
  // Try to fetch bookings from the server, but fall back to local storage when offline.
  const all = await getBookings()
  if (!userId) return all
  return Array.isArray(all) ? all.filter((b) => b.userId === userId) : []
}

// Backward-compatible getBookings: try server (user-specific if logged in), else localStorage
export async function getBookings() {
  const token = getAuthToken()
  if (token) {
    try {
      const res = await fetch(`${API_URL}/bookings/me`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) return res.json()
    } catch (e) {
      // ignore and fallback
    }
  }

  // fallback to localStorage for offline / legacy mode
  return JSON.parse(localStorage.getItem('bookings') || '[]')
}

export async function cancelBooking(bookingId) {
  const token = getAuthToken()
  // try server delete if possible (server may not implement it)
  if (token) {
    try {
      const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) return true
    } catch (e) {
      // ignore and fallback to local
    }
  }

  // fallback to localStorage
  let bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
  bookings = bookings.filter(b => b.id !== bookingId)
  localStorage.setItem('bookings', JSON.stringify(bookings))
  return true
}
