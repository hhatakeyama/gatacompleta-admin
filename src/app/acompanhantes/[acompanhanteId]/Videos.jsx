'use client'

import { Box, Center, Grid, Loader, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { AcompanhanteForm } from '@/components/forms'
import { useAuth } from '@/providers/AuthProvider'
import { api } from '@/utils'

export default function Videos({ acompanhanteData, mutate }) {
  // Hooks
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // States
  const [videos, setVideos] = useState([])

  // Actions
  const handleFileUpload = async payload => {
    await Promise.all(payload.map(async file => {
      if (file?.size < (1024 * 100000)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('fileName', file.name)
        await api
          .post(`/admin/acompanhantes/${acompanhanteData?.usuario?.id}/videos`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          .catch(error => error?.response)
      }
    })).then(requests => {
      const failedRequests = requests?.filter(request => request?.status && ![200, 201].includes(request?.status))
      if (failedRequests.length) {
        notifications.show({
          title: 'Erro',
          title: `Erro no envio de ${failedRequests.length} arquivo(s)`,
          color: 'red',
        })
      } else {
        setTimeout(() => mutate(), 2000)
        notifications.show({
          title: 'Sucesso',
          message: 'Vídeos carregados com sucesso!',
          color: 'green'
        })
      }
    }).catch(() => {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao carregar os vídeos. Entre em contato com o administrador do site ou tente novamente mais tarde.',
        color: 'red'
      })
    })
  }

  // Effects
  useEffect(() => {
    if (acompanhanteData?.videos) setVideos(acompanhanteData.videos)
  }, [acompanhanteData.videos])

  useEffect(() => {
    if (isAuthenticated === false) return router.push('/')
  }, [isAuthenticated, router])

  if (isAuthenticated === null) return <Center style={{ height: '400px' }}><Loader color="blue" /></Center>

  return (
    <Stack align="center">
      <Box maw={600} mt="sm">
        {acompanhanteData && <AcompanhanteForm.Videos onFileUpload={handleFileUpload} />}
      </Box>
      <Grid>
        {videos?.map((video) => (
          <Grid.Col key={video.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            {JSON.stringify(video)}
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  )
}
