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
        <div className="room-detail card fade-up" style={{marginTop:12}}>
          <h3>{room.name}</h3>
          <p className="muted">Price: ${room.price} / night</p>
          <form onSubmit={handleSubmit} className="booking-form" style={{display:'grid', gap:10, marginTop:8}}>
            <label>Start date</label>
            <input type="date" value={start} onChange={e => setStart(e.target.value)} required />
            <label>End date</label>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)} required />

            <fieldset style={{border:'none', padding:0}}>
              <legend>Facilities</legend>
              <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                {room.facilities.map(f => (
                  <label key={f} style={{display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.02)', padding:'0.35rem 0.5rem', borderRadius:8}}>
                    <input type="checkbox" checked={selectedFacilities.includes(f)} onChange={() => handleFacilityToggle(f)} /> <span className="muted">{f}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {start && end && (() => {
              const s = new Date(start)
              const eDate = new Date(end)
              const days = Math.max(0, Math.ceil((eDate - s) / (1000*60*60*24)))
              return <p>Total: <strong>${room.price * days}</strong> ({days} nights)</p>
            })()}

            {error && <p className="error">{error}</p>}
            <div style={{display:'flex', gap:8}}>
              <button className="btn" type="submit">Confirm Booking</button>
              <button type="button" className="btn secondary" onClick={() => window.history.back()}>Back</button>
            </div>
          </form>
        </div>
      ) : (
        <p>Select a room from <a href="/app">Home</a>.</p>
      )}
    </div>
  )
}
