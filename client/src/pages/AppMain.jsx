import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { seedSampleData } from '../api'

export default function AppMain() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    seedSampleData()
    if (!user) navigate('/login')
  }, [user])

  return (
    <div>
      <Navbar />
      <header className="app-hero">
        <div className="container">
          <h1 className="fade-up">Welcome back{user ? `, ${user.name}` : ''}</h1>
          <p className="muted">Manage your room bookings, housekeeping requests, and reviews from one place.</p>
        </div>
      </header>
      <main className="container app-content">
        <Outlet />
      </main>
    </div>
  )
}
