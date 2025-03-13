'use client'

import { Button, Group, Loader, Stack, Text } from '@mantine/core'

import guardAccount from '@/guards/AccountGuard'
import { useFetch } from '@/hooks'
import { useAuth } from '@/providers/AuthProvider'

import Dashboard from './Dashboard'

function Home() {
  // Hooks
  const { isAuthenticated, permissionsData, userData } = useAuth()

  // Fetch
  const { data, error } = useFetch([isAuthenticated === true ? '/admin/dashboard' : null])
  const isLoading = !data && !error

  return (
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
  )
}

export default guardAccount(Home)
