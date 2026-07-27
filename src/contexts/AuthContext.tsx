import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const sbUser = session.user
        const mappedUser: User = {
          id: sbUser.id,
          email: sbUser.email || '',
          fullName: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || '',
          avatarUrl: sbUser.user_metadata?.avatar_url || '',
          role: 'owner',
        }
        setUser(mappedUser)
        localStorage.setItem('fuxion_auth_user', JSON.stringify(mappedUser))
        localStorage.setItem('fuxion_auth_token', session.access_token)
      } else {
        setUser(null)
        localStorage.removeItem('fuxion_auth_user')
        localStorage.removeItem('fuxion_auth_token')
      }
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const sbUser = session.user
        const mappedUser: User = {
          id: sbUser.id,
          email: sbUser.email || '',
          fullName: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || '',
          avatarUrl: sbUser.user_metadata?.avatar_url || '',
          role: 'owner',
        }
        setUser(mappedUser)
        localStorage.setItem('fuxion_auth_user', JSON.stringify(mappedUser))
        localStorage.setItem('fuxion_auth_token', session.access_token)
      } else {
        setUser(null)
        localStorage.removeItem('fuxion_auth_user')
        localStorage.removeItem('fuxion_auth_token')
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) throw error
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    localStorage.removeItem('fuxion_auth_user')
    localStorage.removeItem('fuxion_auth_token')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
