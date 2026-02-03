import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="nav">
      <div className="nav-left">
        <NavLink to="/app" className="nav-link">Home</NavLink>
        <NavLink to="/app/housekeeping" className="nav-link">Housekeeping</NavLink>
        <NavLink to="/app/booking" className="nav-link">Booking</NavLink>
        <NavLink to="/app/bookings" className="nav-link">My Bookings</NavLink>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="username">{user.name}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <NavLink to="/login" className="nav-link">Login</NavLink>
        )}
      </div>
    </nav>
  )
}
