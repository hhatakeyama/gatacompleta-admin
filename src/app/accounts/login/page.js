'use client'

import { Stack } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { LoginForm } from '@/components/forms'
import { useAuth } from '@/providers/AuthProvider'

export default function Login() {
  // Hooks
  const { isAuthenticated, isValidating, login, userData } = useAuth()
  const router = useRouter()

  // States
  const [forgotPassword, setForgotPassword] = useState(false)

  useEffect(() => {
    if (!!isAuthenticated && !isValidating && !!userData) router.push('/')
  }, [isAuthenticated, isValidating, router, userData])

  return (
    <Stack>
      {forgotPassword ? (
        <LoginForm.ForgotPassword onBack={() => setForgotPassword(false)} onSubmit={login} />
      ) : (
        <LoginForm.Basic onForgotPassword={() => setForgotPassword(true)} onSubmit={login} />
      )}
    </Stack>
  )
}
