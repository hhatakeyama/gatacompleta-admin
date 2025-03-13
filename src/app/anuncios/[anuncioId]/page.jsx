'use client'

import { Button, Container, Group, Stack, Tabs, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconSpeakerphone } from '@tabler/icons-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'

import Active from '@/components/displayers/DisplayStatus/Active'
import { FormAnuncio } from '@/components/forms'
import guardAccount from '@/guards/AccountGuard'
import { useFetch } from '@/hooks'
import { useAuth } from '@/providers/AuthProvider'

import classes from './Anuncio.module.css'

function Acompanhante() {
  // Hooks
  const { isAuthenticated } = useAuth()
  const { anuncioId } = useParams()
  const router = useRouter()

  // States
  const [tab, setTab] = useState('advertising')

  // Fetch
  const { data, error, mutate } = useFetch([isAuthenticated ? `/admin/anuncios/${anuncioId}` : null])
  
  // Constants
  const tabs = [
    { id: 'advertising', label: 'Anúncio', icon: <IconSpeakerphone style={{ height: 12, width: 12 }} /> },
  ]

  // Effects
  if (error?.response?.data?.message === "Unauthorized") {
    notifications.show({ title: "Erro", message: error?.response?.data?.message, color: 'red' })
    return router.push('/')
  }

  return (
    <Container size="100%" mb="50px">
      <Stack>
        <Group align="flex-start" justify="space-between" wrap="nowrap">
          <div>
            <Active status={data?.status} />
            <Text fz="lg" fw={500} className={classes.profileName}>
              {data?.acompanhante?.nome}
            </Text>
          </div>

          <Button component="a" href="/anuncios">Voltar</Button>
        </Group>

        <Tabs value={tab} onChange={setTab}>
          <Tabs.List>
            {tabs.map(item => (
              <Tabs.Tab key={item.id} value={item.id} leftSection={item.icon}>
                {item.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel value="advertising">
            {data && tab === 'advertising' && (
              <Container size="100%" mb="xl" mt="xs">
                <FormAnuncio.Basic anuncioData={data} mutate={mutate} />
              </Container>
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  )
}

export default guardAccount(Acompanhante)
