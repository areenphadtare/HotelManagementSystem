import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserBookings, updateBooking, cancelBooking } from '../api'

export default function Bookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [editing, setEditing] = useState(null)
  const [newEnd, setNewEnd] = useState('')
  const [error, setError] = useState(null)

  const load = async () => {
    if (user) {
      const b = await getUserBookings(user.id)
      setBookings(b)
    }
  }

  useEffect(() => { load() }, [user])

  const handleExtend = (b) => {
    setEditing(b.id)
    setNewEnd(b.end.split('T')[0])
    setError(null)
  }

  const handleSave = async (b) => {
    const s = new Date(b.start)
    const eDate = new Date(newEnd)
    if (eDate <= s) return setError('End date must be after start')

    const all = JSON.parse(localStorage.getItem('bookings') || '[]')
    const conflicts = all.filter(x => x.roomId === b.roomId && x.id !== b.id && (new Date(x.start) <= eDate && new Date(x.end) >= s))
    if (conflicts.length) return setError('New end date conflicts with another booking')

    await updateBooking(b.id, { end: eDate.toISOString(), days: Math.ceil((eDate - s)/(1000*60*60*24)) })
    setEditing(null)
    load()
  }

  const handleCancel = async (id) => {
    await cancelBooking(id)
    load()
  }

  return (
    <div>
      <h2 className="fade-up">My Bookings</h2>
      {bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', marginTop: '2rem' }}>
          <p style={{ fontSize: '1.1rem', margin: '0' }}>No bookings yet.</p>
          <p style={{ color: 'var(--muted)', margin: '0.5rem 0 0 0' }}>Start by booking a room from the home page</p>
        </div>
      ) : (
        <div style={{ display:'grid', gap: '1.5rem', marginTop: '2rem' }}>
          {bookings.map(b => (
            <div
              key={b.id}
              className="card fade-up"
              style={{
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '2rem',
                alignItems: 'start',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>🏨</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#e8f0fe' }}>Room {b.roomId}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                      {new Date(b.start).toLocaleDateString()} → {new Date(b.end).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', margin: '1rem 0' }}>
                  <div style={{ padding: '0.75rem', background: 'rgba(124,58,237,0.05)', borderRadius: '6px' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Duration</div>
                    <div style={{ color: '#06b6d4', fontWeight: '600' }}>{b.days} nights</div>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(124,58,237,0.05)', borderRadius: '6px' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Total</div>
                    <div style={{ color: '#7c3aed', fontWeight: '600' }}>${b.total || 0}</div>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.05)', borderRadius: '6px' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Status</div>
                    <div style={{ color: 'var(--success)', fontWeight: '600' }}>Active</div>
                  </div>
                </div>
                {(b.facilities || []).length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Facilities:</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {(b.facilities || []).map(f => (
                        <span key={f} style={{ padding: '0.35rem 0.75rem', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '6px', fontSize: '0.85rem' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '180px' }}>
                {editing === b.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input
                      type="date"
                      value={newEnd}
                      onChange={e => setNewEnd(e.target.value)}
                      style={{ padding: '0.65rem' }}
                    />
                    <button
                      className="btn small"
                      onClick={() => handleSave(b)}
                      style={{ width: '100%' }}
                    >
                      Save
                    </button>
                    <button
                      className="btn small secondary"
                      onClick={() => setEditing(null)}
                      style={{ width: '100%' }}
                    >
                      Cancel
                    </button>
                    {error && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', textAlign: 'center' }}>{error}</div>}
                  </div>
                ) : (
                  <>
                    <button
                      className="btn small"
                      onClick={() => handleExtend(b)}
                      style={{ width: '100%' }}
                    >
                      Extend
                    </button>
                    <button
                      className="btn small secondary"
                      onClick={() => handleCancel(b.id)}
                      style={{ width: '100%' }}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
