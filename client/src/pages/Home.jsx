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
      <h2 className="fade-up">Available Rooms</h2>
      <div className="rooms-grid" style={{marginTop:16}}>
        {rooms.map(room => (
          <div key={room.id} className="room-card card fade-up" style={{backgroundImage:`linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.03)), url(${room.image})`, backgroundSize:'cover', backgroundPosition:'center'}}>
            <h3>{room.name}</h3>
            <p className="muted">Capacity: {room.capacity} • {room.facilities.join(', ')}</p>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8}}>
              <div className="price">${room.price} / night</div>
              <Link to={`/app/booking?roomId=${room.id}`} className="btn small">Book</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}