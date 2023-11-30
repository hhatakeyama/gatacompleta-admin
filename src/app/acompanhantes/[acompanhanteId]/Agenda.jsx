'use client'

import { Card, Center, Loader, Modal, Stack } from '@mantine/core'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { AcompanhanteForm } from '@/components/forms'
import { useAuth } from '@/providers/AuthProvider'

export default function Agenda({ acompanhanteData }) {
  // Hooks
  const { isAuthenticated } = useAuth()
  const { acompanhanteId } = useParams()
  const router = useRouter()

  // States
  const [opened, setOpened] = useState(false)

  // Effects
  useEffect(() => {
    if (isAuthenticated === false) return router.push('/')
  }, [isAuthenticated, router])

  if (isAuthenticated === null) return <Center style={{ height: '400px' }}><Loader color="blue" /></Center>

  return (
    <>
      <Stack>
        {acompanhanteData?.periodos?.map(periodo => (
          <Card key={periodo.id} style={{ width: '100%' }}>
            <AcompanhanteForm.Agenda acompanhanteId={acompanhanteId} agendaData={periodo} onSuccess={() => mutate()} />
          </Card>
        ))}
      </Stack>
      <Modal centered opened={!!opened} onClose={() => setOpened(null)} title="Nova agenda">
        <AcompanhanteForm.Agenda acompanhanteId={acompanhanteId} onSuccess={() => mutate()} />
      </Modal>
    </>
  )
}
