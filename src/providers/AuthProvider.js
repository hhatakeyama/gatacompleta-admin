'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

import { useFetch } from '@/hooks'
import { api, getCookie, removeCookie, setCookie } from '@/utils'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

function useProvideAuth() {
  // Hooks
  const { cache } = useSWRConfig()

  // Constants
  const { token: cookieToken, expiry: cookieExpiry } = getCookie('gatacompleta-cms-token') || {}

  // States
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  // Fetch
  const { data: userData, isValidating: userIsValidating } = useFetch([
    isAuthenticated ? '/accounts/me/' : null
  ])

  const { data: permissionsData, isValidating: permissionsIsValidating } = useFetch([
    isAuthenticated ? '/accounts/permissions/' : null
  ])

  // Login with credentials
  const login = async (credentials) => {
    const response = await api
      .post('/authentication/login/', {
        email: credentials.login,
        password: credentials.password
      })
      .then(response => {
        const { data } = response || {}
        if (data?.token) {
          const date = new Date()
          date.setDate(date.getDate() + 1)
          const tokenData = { expiry: date.toISOString(), token: data?.token }
          setCookie('gatacompleta-cms-token', tokenData)
          setIsAuthenticated(true)
        } else {
          return { error: 'E-mail ou senha inválidos' }
        }
      })
      .catch(error => {
        return {
          error:
            error?.response?.data?.message === 'Unauthorized'
              ? 'E-mail ou senha inválidos'
              : 'Ocorreu um erro inesperado. Tente novamente mais tarde'
        }
      })

    return response
  }

  // Logout user from API
  const logout = async () => {
    try {
      await api.post('/authentication/logout/')
    } finally {
      removeCookie('gatacompleta-cms-token')
      setIsAuthenticated(false)
    }
  }

  // Send reset password link
  const forgotPassword = async (email) => {
    const response = await api.post('/password-reset/', { email })
    return response
  }

  // Reset password
  const resetPassword = async (password, uidb64, hash) => {
    const response = await api.post('/password-reset/confirm/', {
      password,
      uidb64,
      token: hash
    })
    return response
  }

  // Verify if token is valid or expired
  const verifyToken = useCallback(() => {
    let expired = true
    if (cookieToken) {
      const expiryDate = new Date(cookieExpiry)
      const nowDate = new Date()

      expired = nowDate.getTime() > expiryDate.getTime()

      if (expired) {
        removeCookie('gatacompleta-cms-token')
      }
    }

    return !expired
  }, [cookieToken, cookieExpiry])

  // Effects
  useEffect(() => {
    const isValidToken = verifyToken()
    setIsAuthenticated(!!isValidToken)
  }, [verifyToken, cookieToken])

  // Clear all SWR cache (experimental)
  useEffect(() => {
    cache?.clear?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  return {
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyToken,
    isAuthenticated,
    isValidating: userIsValidating || permissionsIsValidating,
    userData,
    permissionsData
  }
}

export default function AuthProvider({ children }) {
  const auth = useProvideAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
