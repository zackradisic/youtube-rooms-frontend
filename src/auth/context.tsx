import React, { createContext, useState, useContext, useEffect } from 'react'
import Cookies from 'js-cookie'

import api, { setCredentials } from '../services/api'
import { useHistory } from 'react-router-dom'
import { User } from '../api/youtube-rooms-API'

export type AuthToken = {
  accessToken: string,
  accessExpiresAt: number,
  refreshToken: string,
  refreshExpiresAt: number
}

type AuthContextValue = {
  isAuthenticated: boolean,
  loading: boolean,
  user: User | null,
  setUser?: React.Dispatch<React.SetStateAction<User | null>>
  getUserInfo: () => Promise<void>,
  test: string
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  loading: false,
  user: null,
  setUser: undefined,
  getUserInfo: async () => {},
  test: ''
})

export const AuthProvider = ({ children }: { children: React.ReactChild[] | React.ReactChild }) => {
  const [user, setUser] = useState<(User | null)>(null)
  const [loading, setLoading] = useState(true)
  const history = useHistory()

  useEffect(() => {
    const loadUserFromCookies = async () => {
      const token = Cookies.get('accessToken')
      if (token) {
        console.log(token)
        api.defaults.headers.Authorization = 'Bearer ' + token
        try {
          const { data: user } = await api.get('/me')
          if (user) setUser(user)
        } catch (err) {
          if (err.response) {
            if (err.response.status === 401) { // Access and refresh token are invalid
              alert('Your session has expired, please log back in.')
              // logout()
              history.push('/signup')
            }
          }
        }
        // Add some logic to handle invalid or expired token
      } else {
        await getUserInfo()
      }
      setLoading(false)
    }

    loadUserFromCookies()
  }, [])

  const getUserInfo = async () => {
    const { data: user } = await api.get('/me', { withCredentials: true })
    console.log(user)
    if (user) setUser(user)
  }

  const test = 'hello'

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, setUser, getUserInfo, test }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)

/*
export const RequiresAuthentication = (Component: () => JSX.Element) => () => {
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!isAuthenticated && !loading) router.push('/signup')
  }, [loading, isAuthenticated])

  return (
    <Component />
  )
}
*/

export default useAuth
