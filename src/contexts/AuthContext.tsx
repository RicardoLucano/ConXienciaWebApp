import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User } from '../types'
import { mockUser } from '../data/mockData'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('fuxion_auth_user')
    return raw ? JSON.parse(raw) : null
  })

  const login = () => {
    setUser(mockUser)
    localStorage.setItem('fuxion_auth_user', JSON.stringify(mockUser))
    // Store a mock session token so the backend receives authorization headers
    localStorage.setItem('fuxion_auth_token', 'mock_jwt_token_for_local_development')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fuxion_auth_user')
    localStorage.removeItem('fuxion_auth_token')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
