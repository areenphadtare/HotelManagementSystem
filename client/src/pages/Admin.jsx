import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getRooms, getBookings } from '../api'
import './Admin.css'

export default function Admin() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [availability, setAvailability] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      navigate('/app/dashboard')
      return
    }
    loadData()
  }, [isAdmin, navigate])

  const loadData = async () => {
    try {
      const roomData = await getRooms()
      const bookingData = await getBookings()
      setRooms(roomData)
      setBookings(bookingData)
    } catch (err) {
      console.error('Error loading data:', err)
    }
  }

  const checkAvailability = async () => {
    if (!selectedRoom || !checkInDate || !checkOutDate) {
      alert('Please select a room and dates')
      return
    }

    setLoading(true)
    try {
      const room = rooms.find((r) => r.id === selectedRoom)
      const roomBookings = bookings.filter((b) => b.roomId === selectedRoom)

      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutDate)

      const conflicts = roomBookings.filter((b) => {
        const bStart = new Date(b.start)
        const bEnd = new Date(b.end)
        return checkIn < bEnd && checkOut > bStart
      })

      setAvailability({
        room,
        available: conflicts.length === 0,
        conflicts,
        checkIn,
        checkOut
      })
    } catch (err) {
      console.error('Error checking availability:', err)
    } finally {
      setLoading(false)
    }
  }

  const getAvailableRooms = () => {
    if (!checkInDate || !checkOutDate) return rooms.length

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)

    let availableCount = 0
    rooms.forEach((room) => {
      const roomBookings = bookings.filter((b) => b.roomId === room.id)
      const hasConflict = roomBookings.some((b) => {
        const bStart = new Date(b.start)
        const bEnd = new Date(b.end)
        return checkIn < bEnd && checkOut > bStart
      })
      if (!hasConflict) availableCount++
    })
    return availableCount
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name}</p>
      </div>

      <div className="admin-content">
        <div className="admin-section">
          <h2>Check Room Availability</h2>
          <div className="availability-form">
            <div className="form-group">
              <label>Select Room</label>
              <select value={selectedRoom || ''} onChange={(e) => setSelectedRoom(e.target.value)}>
                <option value="">-- Select a Room --</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} (₹{room.price}/night) - Capacity: {room.capacity}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Check-in Date</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Check-out Date</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
              />
            </div>

            <button onClick={checkAvailability} disabled={loading} className="check-btn">
              {loading ? 'Checking...' : 'Check Availability'}
            </button>
          </div>

          {availability && (
            <div className={`availability-result ${availability.available ? 'available' : 'unavailable'}`}>
              <h3>{availability.room.name}</h3>
              <p className="status">
                Status: <strong>{availability.available ? '✓ AVAILABLE' : '✗ NOT AVAILABLE'}</strong>
              </p>
              <p>Check-in: {availability.checkIn.toLocaleDateString()}</p>
              <p>Check-out: {availability.checkOut.toLocaleDateString()}</p>
              {!availability.available && (
                <div className="conflicts">
                  <h4>Existing Bookings:</h4>
                  {availability.conflicts.map((booking) => (
                    <div key={booking.id} className="booking-conflict">
                      <p>
                        {new Date(booking.start).toLocaleDateString()} →{' '}
                        {new Date(booking.end).toLocaleDateString()}
                      </p>
                      <p>User: {booking.userId}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="admin-section">
          <h2>Summary</h2>
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Rooms</h3>
              <p className="number">{rooms.length}</p>
            </div>
            <div className="summary-card">
              <h3>Total Bookings</h3>
              <p className="number">{bookings.length}</p>
            </div>
            <div className="summary-card">
              <h3>Available Rooms</h3>
              <p className="number">{getAvailableRooms()}</p>
              {checkInDate && <small>{checkInDate} to {checkOutDate}</small>}
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2>All Bookings</h2>
          {bookings.length === 0 ? (
            <p className="no-data">No bookings yet</p>
          ) : (
            <div className="bookings-table">
              <table>
                <thead>
                  <tr>
                    <th>Room ID</th>
                    <th>User ID</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Days</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.roomId}</td>
                      <td>{booking.userId}</td>
                      <td>{new Date(booking.start).toLocaleDateString()}</td>
                      <td>{new Date(booking.end).toLocaleDateString()}</td>
                      <td>{booking.days}</td>
                      <td>₹{booking.total || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-section">
          <h2>All Rooms</h2>
          <div className="rooms-grid">
            {rooms.map((room) => (
              <div key={room.id} className="room-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {room.image && (
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      backgroundImage: `url(${room.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
                    }}
                  />
                )}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginTop: 0 }}>{room.name}</h3>
                  <p>
                    <strong>Price:</strong> ₹{room.price}/night
                  </p>
                  <p>
                    <strong>Capacity:</strong> {room.capacity} guests
                  </p>
                  <p>
                    <strong>Facilities:</strong> {room.facilities?.join(', ') || 'None'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
