'use client'

import { Box, Grid, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import React, { useEffect, useState } from 'react'

import { FormAcompanhante } from '@/components/forms'
import { api } from '@/utils'

import VideoCard from './VideoCard'

export default function Videos({ acompanhanteData, mutate }) {
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
          .post(`/api/admin/acompanhantes/${acompanhanteData?.usuario?.id}/videos`, formData, {
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

  return (
    <Stack align="center">
      <Box maw={600} mt="sm">
        {acompanhanteData && <FormAcompanhante.Videos onFileUpload={handleFileUpload} />}
      </Box>
      <Grid w="100%">
        {videos?.map((video) => (
          <Grid.Col key={video.id} span={{ base: 12, sm: 6 }}>
            <VideoCard acompanhanteData={acompanhanteData} videoData={video} index={video.ordem} mutate={mutate} />
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  )
}
