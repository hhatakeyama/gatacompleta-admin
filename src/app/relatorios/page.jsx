'use client'

import { Container, Stack, Text } from '@mantine/core'
import { useRouter } from 'next/navigation'

import guardAccount from '@/guards/AccountGuard'
import { useAuth } from '@/providers/AuthProvider'

function Relatorios() {
  // Hooks
  const router = useRouter()
  const { permissionsData } = useAuth()

  // Constants
  const { permissions } = permissionsData || {}

  // Validations
  if (permissions?.find(item => item !== 's' && item !== 'a')) return router.push('/')

  return (
    <Container size="100%" mb="50px">
      <Stack>
        <Text>Relatórios</Text>

        <Text>Em Breve</Text>
      </Stack>
    </Container>
  )
}

export default guardAccount(Relatorios)
