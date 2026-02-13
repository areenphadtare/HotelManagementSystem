import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRooms } from '../api'

export default function Home() {
  const [rooms, setRooms] = useState([])
  useEffect(() => { (async () => {
    const r = await getRooms()
    setRooms(r)
  })() }, [])

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="fade-up">Available Rooms</h2>
        <p className="muted">Choose from our selection of premium rooms with world-class amenities</p>
      </div>
      <div className="rooms-grid" style={{ marginTop: '2rem' }}>
        {rooms.map(room => (
          <div
            key={room.id}
            className="room-card card fade-up"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1)), url(${room.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem' }}>{room.name}</h3>
              <p style={{ margin: '0', color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
                Capacity: {room.capacity} guests
              </p>
              <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                {room.facilities.join(' • ')}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
              <div>
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Starting from</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent-2)' }}>${room.price}<span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>/night</span></div>
              </div>
              <Link
                to={`/app/booking?roomId=${room.id}`}
                className="btn small"
                style={{ padding: '0.6rem 1rem' }}
              >
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>
      {rooms.length === 0 && (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem' }}>Loading rooms...</p>
        </div>
      )}
    </div>
  )
}