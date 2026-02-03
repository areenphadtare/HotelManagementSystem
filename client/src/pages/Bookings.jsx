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

    // check conflicts with other bookings for same room
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
        <p>No bookings yet.</p>
      ) : (
        <div style={{display:'grid', gap:12, marginTop:12}}>
          {bookings.map(b => (
            <div key={b.id} className="card fade-up" style={{padding:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontWeight:700}}>Room {b.roomId}</div>
                <div className="muted">{new Date(b.start).toLocaleDateString()} → {new Date(b.end).toLocaleDateString()} ({b.days} days)</div>
                <div className="muted">Facilities: {(b.facilities || []).join(', ') || '—'}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:700}}>${b.total || 0}</div>
                {editing === b.id ? (
                  <div style={{marginTop:8}}>
                    <input type="date" value={newEnd} onChange={e => setNewEnd(e.target.value)} />
                    <div style={{display:'flex', gap:8, marginTop:8}}>
                      <button className="btn small" onClick={() => handleSave(b)}>Save</button>
                      <button className="btn small" onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                    {error && <div className="error">{error}</div>}
                  </div>
                ) : (
                  <div style={{display:'flex', gap:8, marginTop:8}}>
                    <button className="btn small" onClick={() => handleExtend(b)}>Extend</button>
                    <button className="btn small" onClick={() => handleCancel(b.id)}>Cancel</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
