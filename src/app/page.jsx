'use client'

import { Button, Center, Container, Group, Loader, Stack, Text } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useFetch } from '@/hooks'
import { useAuth } from '@/providers/AuthProvider'

import Dashboard from './Dashboard'

export default function Home() {
  // Hooks
  const router = useRouter()
  const { isAuthenticated, permissionsData, userData } = useAuth()

  // Fetch
  const { data, error } = useFetch([isAuthenticated ? '/admin/dashboard' : null])
  const isLoading = !data && !error

  // Effects
  useEffect(() => {
    if (isAuthenticated === false) return router.push('/accounts/login')
  }, [isAuthenticated, router])

  if (isAuthenticated === null) return <Center style={{ height: '400px' }}><Loader color="blue" /></Center>

  return (
    <Container>
      <Stack>
        {permissionsData?.permissions?.indexOf('s') !== -1 && (
          <>
            <Text><strong>Acompanhantes</strong></Text>
            {isLoading ? <Loader color="blue" /> : (
              <Dashboard dashboardData={data} />
            )}
          </>
        )}
        <Text>Olá <strong>{userData?.name}</strong>, seja bem-vindo ao painel do Gata Completa.</Text>
        <Text>Acesse o menu abaixo.</Text>

        <Group>
          {permissionsData?.permissions?.indexOf('s') !== -1 && (
            <>
              <Button component="a" href="/anuncios">Anúncios</Button>
              <Button component="a" href="/acompanhantes">Acompanhantes</Button>
              <Button component="a" href="/usuarios">Usuários</Button>
            </>
          )}
          {permissionsData?.permissions?.indexOf('g') !== -1 && (
            <>
              <Button component="a" href="/acompanhante">Acompanhante</Button>
            </>
          )}
        </Group>
      </Stack>
    </Container>
  )
}
