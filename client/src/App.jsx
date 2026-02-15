import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AppMain from './pages/AppMain'
import Home from './pages/Home'
import Housekeeping from './pages/Housekeeping'
import Booking from './pages/Booking'
import Bookings from './pages/Bookings'
import './App.css'

// Protected Route Wrapper
function RequireAuth({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected App Routes */}
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppMain />
            </RequireAuth>
          }
        >
          <Route index element={<Home />} />
          <Route path="housekeeping" element={<Housekeeping />} />
          <Route path="booking" element={<Booking />} />
          <Route path="bookings" element={<Bookings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </AuthProvider>
  )
}
