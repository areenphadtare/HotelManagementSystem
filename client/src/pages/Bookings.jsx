import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getRooms, getBookings } from "../api"

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Load rooms + bookings
  useEffect(() => {
    (async () => {
      try {
        const r = await getRooms()
        const b = await getBookings()
        setRooms(r || [])
        setBookings(b || [])
      } catch (err) {
        console.error("Error loading data:", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Check availability (based on today)
  const isRoomAvailable = (roomId) => {
    const today = new Date()

    const conflict = bookings.some(b => {
      return (
        b.roomId === roomId &&
        new Date(b.start) <= today &&
        new Date(b.end) >= today
      )
    })

    return !conflict
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Loading Rooms...</h2>
      </div>
    )
  }

  return (
    <div style={{ width: "100%", padding: "2rem" }}>
      <h2 className="fade-up">Available Rooms</h2>

      {rooms.length === 0 ? (
        <div className="card" style={{ marginTop: "2rem", padding: "2rem", textAlign: "center" }}>
          No rooms found.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            marginTop: "2rem"
          }}
        >
          {rooms.map(room => {
            const available = isRoomAvailable(room.id)

            return (
              <div
                key={room.id}
                className="card fade-up"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ fontSize: "2rem" }}>🏨</div>
                  <h3 style={{ margin: "0.5rem 0", color: "#e8f0fe" }}>
                    {room.name}
                  </h3>

                  <p style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
                    ${room.price} / night
                  </p>

                  <p
                    style={{
                      fontWeight: "600",
                      color: available ? "var(--success)" : "var(--danger)",
                      marginBottom: "1rem"
                    }}
                  >
                    {available ? "✅ Available" : "❌ Not Available"}
                  </p>

                  {room.facilities?.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <small style={{ color: "var(--muted)" }}>Facilities:</small>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                        {room.facilities.map(f => (
                          <span
                            key={f}
                            style={{
                              padding: "0.3rem 0.6rem",
                              background: "rgba(124,58,237,0.1)",
                              borderRadius: "5px",
                              fontSize: "0.8rem"
                            }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="btn"
                  disabled={!available}
                  style={{
                    opacity: available ? 1 : 0.6,
                    cursor: available ? "pointer" : "not-allowed"
                  }}
                  onClick={() =>
                    navigate(`/app/booking?roomId=${room.id}`)
                  }
                >
                  {available ? "Book Now" : "Unavailable"}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
