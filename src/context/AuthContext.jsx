import { createContext, useContext, useEffect, useState } from 'react'
import { api, setAuthToken } from '../api'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    if (token) setAuthToken(token)
  }, [token])

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('token')
      setAuthToken(null)
      setUser(null)
    } else {
      localStorage.setItem('token', token)
    }
  }, [token])

  async function login(email, password) {
    const { data } = await api.post('/api/auth/login', { email, password })
    setUser(data.user); setToken(data.token)
  }
  async function signup(name, email, password) {
    const { data } = await api.post('/api/auth/signup', { name, email, password })
    setUser(data.user); setToken(data.token)
  }
  function logout() {
    setToken(''); setUser(null)
  }

  const value = { user, token, login, signup, logout }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}
