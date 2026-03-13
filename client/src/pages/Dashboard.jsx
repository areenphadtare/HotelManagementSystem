import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { getRooms, getUserBookings, cancelBooking } from '../api'
import './Dashboard.css'

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [userBookings, setUserBookings] = useState([])
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [availableRooms, setAvailableRooms] = useState([])
  const [message, setMessage] = useState('')

  const normalizeRoom = (room) => ({
    ...room,
    id: room.id || room._id || room._id?.toString()
  })

  const loadData = async () => {
    try {
      const roomData = (await getRooms()).map(normalizeRoom)
      const bookingData = await getUserBookings(user?.id)
      setRooms(roomData)
      setUserBookings(bookingData)
    } catch (err) {
      console.error('Error loading data:', err)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      navigate('/app/admin')
      return
    }
    loadData()
  }, [isAdmin, navigate, user?.id])

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const defaultStartDate = today.toISOString().split('T')[0]
  const defaultEndDate = tomorrow.toISOString().split('T')[0]
  const startDate = checkInDate || defaultStartDate
  const endDate = checkOutDate || defaultEndDate

  const checkAvailability = () => {
    if (!checkInDate || !checkOutDate) {
      setMessage('Please select check-in and check-out dates')
      return
    }

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)

    if (checkIn >= checkOut) {
      setMessage('Check-out date must be after check-in date')
      return
    }

    const available = rooms.filter((room) => {
      const roomId = room.id || (room._id && room._id.toString())
      const roomBookings = userBookings.filter((b) => String(b.roomId) === String(roomId))
      const hasConflict = roomBookings.some((b) => {
        const bStart = new Date(b.start)
        const bEnd = new Date(b.end)
        return checkIn < bEnd && checkOut > bStart
      })
      return !hasConflict
    })

    setAvailableRooms(available)
    setMessage('')
  }

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId)
        setMessage('✓ Booking cancelled successfully')
        loadData()
      } catch (err) {
        setMessage('Error cancelling booking: ' + err.message)
      }
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Welcome, {user?.name}</p>
      </div>

      {message && (
        <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Book a Room</h2>
          <div className="booking-form">
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

            <button onClick={checkAvailability} className="search-btn">
              Check Availability
            </button>
          </div>

          {availableRooms.length > 0 && (
            <div className="available-rooms">
              <h3>Available Rooms ({availableRooms.length})</h3>
              <div className="rooms-list">
                {availableRooms.map((room) => {
                  const days = Math.ceil(
                    (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
                  )
                  const total = days * room.price
                  const roomId = room.id || (room._id && room._id.toString())
                  return (
                    <div key={roomId} className="room-item" style={{ display: 'flex', gap: '1.5rem', overflow: 'hidden' }}>
                      {room.image && (
                        <div
                          style={{
                            width: '250px',
                            minWidth: '250px',
                            height: '200px',
                            backgroundImage: `url(${room.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '8px',
                          }}
                        />
                      )}
                      <div className="room-info" style={{ flex: 1 }}>
                        <h4>{room.name}</h4>
                        <p>
                          <strong>Price:</strong> ₹{room.price}/night × {days} days = ₹{total}
                        </p>
                        <p>
                          <strong>Capacity:</strong> {room.capacity} guests
                        </p>
                        <p>
                          <strong>Facilities:</strong> {room.facilities?.join(', ') || 'None'}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="book-btn"
                        style={{ alignSelf: 'center', height: 'fit-content' }}
                        onClick={() => navigate(`/app/booking?roomId=${roomId}&start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`)}
                      >
                        Book Now
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {checkInDate && checkOutDate && availableRooms.length === 0 && !message && (
            <div className="no-rooms-message">
              <p>No rooms available for these dates</p>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h2>My Bookings</h2>
          {userBookings.length === 0 ? (
            <p className="no-data">You have no bookings yet</p>
          ) : (
            <div className="bookings-list">
              {userBookings.map((booking) => {
                const room = rooms.find((r) => r.id === booking.roomId)
                return (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-details">
                      <h3>{room?.name || 'Unknown Room'}</h3>
                      <p>
                        <strong>Check-in:</strong> {new Date(booking.start).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Check-out:</strong> {new Date(booking.end).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Duration:</strong> {booking.days} nights
                      </p>
                      <p>
                        <strong>Total:</strong> ₹{booking.total}
                      </p>
                      {booking.facilities && booking.facilities.length > 0 && (
                        <p>
                          <strong>Facilities:</strong> {booking.facilities.join(', ')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="cancel-btn"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h2>All Rooms</h2>
          <div className="all-rooms-grid">
            {rooms.map((room) => (
              <div key={room.id} className="room-preview">
                {room.image && <img src={room.image} alt={room.name} />}
                <h4>{room.name}</h4>
                <p className="price">₹{room.price}/night</p>
                <p className="capacity">👥 {room.capacity} guests</p>
                <p className="facilities">{room.facilities?.join(', ') || 'Standard'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
