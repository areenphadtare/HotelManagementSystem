import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('authUser')
    if (u) setUser(JSON.parse(u))
  }, [])

  const login = async ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find((u) => u.email === email && u.password === password)
    if (found) {
      localStorage.setItem('authUser', JSON.stringify(found))
      setUser(found)
      return { ok: true, user: found }
    }
    return { ok: false, message: 'Invalid credentials' }
  }

  const signup = async ({ name, email, password }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find((u) => u.email === email)) return { ok: false, message: 'Email already exists' }
    const newUser = { id: Date.now().toString(), name, email, password }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('authUser', JSON.stringify(newUser))
    setUser(newUser)
    return { ok: true, user: newUser }
  }

  const logout = () => {
    localStorage.removeItem('authUser')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
