import React, { createContext, useContext, useState, useEffect } from 'react'
import { register as apiRegister, login as apiLogin, setAuthToken, getAuthToken } from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // initialize from localStorage/token
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser')
    const token = getAuthToken()
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
      setAuthToken(token)
    }
    setLoading(false)
  }, [])

  const login = async ({ email, password }) => {
    try {
      const res = await apiLogin(email, password)
      // apiLogin sets token internally
      if (res.user) {
        setUser(res.user)
        localStorage.setItem('authUser', JSON.stringify(res.user))
        return { ok: true, user: res.user }
      }
      return { ok: false, message: 'Login failed' }
    } catch (err) {
      return { ok: false, message: err.message }
    }
  }

  const signup = async ({ name, email, password, role = 'user' }) => {
    try {
      const res = await apiRegister(name, email, password, role)
      if (res.user) {
        setUser(res.user)
        localStorage.setItem('authUser', JSON.stringify(res.user))
        return { ok: true, user: res.user }
      }
      return { ok: false, message: 'Signup failed' }
    } catch (err) {
      return { ok: false, message: err.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('authUser')
    localStorage.removeItem('authToken')
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'

  return <AuthContext.Provider value={{ user, login, signup, logout, loading, isAdmin }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
