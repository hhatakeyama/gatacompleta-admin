'use client'

import { Button, Stack } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuth } from '@/providers/AuthProvider'

export default function Home() {
  // Hooks
  const router = useRouter()
  const { isLoggedIn } = useAuth()

  // Effects
  useEffect(() => {
    if (!isLoggedIn) return router.push('/accounts/login')
  }, [isLoggedIn, router])

  return (
    <main>
      <Stack>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
        <Button>Teste</Button>
      </Stack>
    </main>
  )
}
