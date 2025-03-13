'use client'

import { Box, Grid, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import React, { useEffect, useState } from 'react'

import PhotoCard from '@/app/acompanhantes/[acompanhanteId]/PhotoCard'
import { FormAcompanhante } from '@/components/forms'
import { api } from '@/utils'

export default function Photos({ acompanhanteData, mutate }) {
  // States
  const [photos, setPhotos] = useState([])

  // Actions
  const handleFileUpload = async payload => {
    await Promise.all(payload.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      if (file?.size < 5242880) {
        api
          .post(`/api/admin/acompanhantes/${acompanhanteData?.usuario?.id}/fotos`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          .catch(error => error?.response);
      }
    })).then(requests => {
      const failedRequests = requests?.filter(request => request?.status && ![200, 201].includes(request?.status));
      if (failedRequests.length) {
        notifications.show({
          title: 'Erro',
          title: `Erro no envio de ${failedRequests.length} arquivo(s)`,
          color: 'red',
        });
      } else {
        setTimeout(() => mutate(), 2000)
        notifications.show({
          title: 'Sucesso',
          message: 'Fotos carregadas com sucesso!',
          color: 'green'
        })
      }
    }).catch(() => {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao carregar as fotos. Entre em contato com o administrador do site ou tente novamente mais tarde.',
        color: 'red'
      })
    });
  }

  // Effects
  useEffect(() => {
    if (acompanhanteData?.fotos) setPhotos(acompanhanteData.fotos)
  }, [acompanhanteData.fotos])

  return (
    <Stack align="center">
      <Box maw={600} mt="sm">
        {acompanhanteData && <FormAcompanhante.Photos onFileUpload={handleFileUpload} />}
      </Box>
      <Grid w="100%">
        {photos?.map((foto) => (
          <Grid.Col key={foto.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <PhotoCard acompanhanteData={acompanhanteData} fotoData={foto} index={foto.ordem} mutate={mutate} />
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  )
}
