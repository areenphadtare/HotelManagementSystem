import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getRoomById, createBooking, getBookings } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Booking() {
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get('roomId')
  const [room, setRoom] = useState(null)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [selectedFacilities, setSelectedFacilities] = useState([])
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { (async () => {
    if (roomId) {
      const r = await getRoomById(roomId)
      setRoom(r)
      setSelectedFacilities(r?.facilities || [])
    }
  })() }, [roomId])

  const overlaps = (aStart, aEnd, bStart, bEnd) => {
    return aStart <= bEnd && aEnd >= bStart
  }

  const handleFacilityToggle = (f) => {
    setSelectedFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (!start || !end) return setError('Start and end dates required')
    const s = new Date(start)
    const eDate = new Date(end)
    if (s >= eDate) return setError('End date must be after start date')

    const bookings = await getBookings()
    const conflicts = bookings.filter(b => b.roomId === roomId && overlaps(new Date(b.start), new Date(b.end), s, eDate))
    if (conflicts.length) return setError('Room already booked for selected dates')

    const days = Math.ceil((eDate - s) / (1000*60*60*24))
    const booking = {
      id: Date.now().toString(),
      roomId,
      userId: user.id,
      start: s.toISOString(),
      end: eDate.toISOString(),
      days,
      facilities: selectedFacilities,
      total: (room?.price || 0) * days,
      createdAt: new Date().toISOString()
    }

    await createBooking(booking)
    navigate('/app/bookings')
  }

  return (
    <div>
      <h2 className="fade-up">Book Room</h2>
      {room ? (
        <div className="card fade-up" style={{ marginTop: '2rem', maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem' }}>🏨</div>
            <div>
              <h3 style={{ margin: '0', fontSize: '1.5rem', color: '#e8f0fe' }}>{room.name}</h3>
              <p style={{ margin: '0.25rem 0 0 0', color: 'var(--muted)' }}>Price: ${room.price} / night</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="booking-form" style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
            {/* Date Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: '600', color: '#7c3aed', marginBottom: '0.5rem', display: 'block' }}>Check-in</label>
                <input type="date" value={start} onChange={e => setStart(e.target.value)} required style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#7c3aed', marginBottom: '0.5rem', display: 'block' }}>Check-out</label>
                <input type="date" value={end} onChange={e => setEnd(e.target.value)} required style={{ width: '100%' }} />
              </div>
            </div>

            {/* Facilities */}
            {room.facilities && room.facilities.length > 0 && (
              <fieldset style={{ border: 'none', padding: '1rem', background: 'rgba(124,58,237,0.05)', borderRadius: '8px', margin: '0' }}>
                <legend style={{ fontWeight: '600', color: '#7c3aed', marginBottom: '1rem', cursor: 'pointer' }}>✓ Add Facilities</legend>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {room.facilities.map(f => (
                    <label
                      key={f}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: selectedFacilities.includes(f) ? 'rgba(124,58,237,0.15)' : 'transparent',
                        border: selectedFacilities.includes(f) ? '1.5px solid #7c3aed' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFacilities.includes(f)}
                        onChange={() => handleFacilityToggle(f)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span className="muted">{f}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Price Summary */}
            {start && end && (() => {
              const s = new Date(start)
              const eDate = new Date(end)
              const days = Math.max(0, Math.ceil((eDate - s) / (1000 * 60 * 60 * 24)))
              const total = room.price * days
              return (
                <div style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.04))',
                  border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: '8px',
                }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Nights</div>
                      <div style={{ color: '#06b6d4', fontWeight: '700', fontSize: '1.2rem' }}>{days}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Per Night</div>
                      <div style={{ color: 'var(--muted)', fontWeight: '600' }}>${room.price}</div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '1rem', paddingTop: '1rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total</div>
                    <div style={{ color: '#7c3aed', fontWeight: '700', fontSize: '1.4rem' }}>${total}</div>
                  </div>
                </div>
              )
            })()}

            {/* Error Message */}
            {error && <p style={{ color: 'var(--danger)', fontWeight: '500', margin: '0' }}>❌ {error}</p>}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn" type="submit" style={{ flex: 1 }}>Confirm Booking</button>
              <button type="button" className="btn secondary" onClick={() => window.history.back()}>Back</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
          <p>Select a room from <a href="/app" style={{ color: '#7c3aed', fontWeight: '600' }}>Home</a>.</p>
        </div>
      )}
    </div>
  )
}
