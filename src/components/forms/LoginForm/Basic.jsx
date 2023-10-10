import { Alert, Anchor, Button, Container, Group, LoadingOverlay, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { useAuth } from '@/providers/AuthProvider'

export default function Basic({ onForgotPassword, onSubmit }) {
  // Hooks
  const { isLoggedIn, isValidating } = useAuth()
  const router = useRouter()

  // States
  const [error, setError] = useState(null)
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  // Actions
  const handleSubmit = async () => {
    setError(null)
    const response = await onSubmit?.(credentials)
    if (response?.error) {
      setError(response.error)
    }
  }

  // Effects
  useEffect(() => {
    if (isLoggedIn) router.push('/')
  }, [isLoggedIn, router])

  return (
    <Container size="xl" my={40} style={{ maxWidth: '400px', width: '100%' }}>
      <Title ta="center">
        Bem-vindo(a)!
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Faça seu login abaixo.
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" pos="relative">
        <LoadingOverlay visible={isValidating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <Stack>
          <TextInput label="E-mail" placeholder="Seu e-mail" value={credentials.email} onChange={e => setCredentials({ ...credentials, email: e.target.value})} required />
          <PasswordInput label="Senha" placeholder="Sua senha" value={credentials.password} onChange={e => setCredentials({ ...credentials, password: e.target.value})} required />
          <Group justify="space-between" mt="lg" style={{ display: 'none' }}>
            <Anchor component="button" size="sm" onClick={onForgotPassword}>
              Esqueceu a senha?
            </Anchor>
          </Group>
          <Button fullWidth onClick={handleSubmit}>
            Login
          </Button>

          {error && (
            <Alert color="red" title="Erro">{error}</Alert>
          )}
        </Stack>
      </Paper>
    </Container>
  )
}
