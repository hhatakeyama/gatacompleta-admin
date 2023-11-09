'use client'

import { Box, Center, Grid, Loader, Stack } from '@mantine/core'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import PhotoCard from '@/app/acompanhantes/[acompanhanteId]/PhotoCard'
import { AcompanhanteForm } from '@/components/forms'
import { useFetch } from '@/hooks'
import { useAuth } from '@/providers/AuthProvider'

export default function Photos() {
  // Hooks
  const { isAuthenticated } = useAuth()
  const { acompanhanteId } = useParams()
  const router = useRouter()

  // States
  const [picture, setPicture] = useState(null)

  // Fetch
  const { data, mutate } = useFetch([isAuthenticated ? `/admin/acompanhantes/${acompanhanteId}` : null])

  // Actions
  const handleFileUpload = (payload) => {
    if (payload?.length > 1) return null

    const filteredFiles = payload.find(
      (file, index, array) =>
        file?.size < 5242880 && index === array.findIndex(fItem => fItem.name === file.name)
    )

    if (filteredFiles) {
      const reader = new FileReader()
      reader.onloadend = () => {
        return api
          .post(`/admin/acompanhantes/${acompanhanteData?.usuario?.id}/fotos`, { picture: reader.result }) // Verificar usuário logado no painel
          .then(() => {
            form.reset()
            setTimeout(() => mutate(), 2000)
            notifications.show({
              title: 'Sucesso',
              message: 'Dados atualizados com sucesso!',
              color: 'green'
            })
          })
          .catch(error => {
            notifications.show({
              title: 'Erro',
              message:
                errorHandler(error.response.data.errors).messages ||
                'Erro ao atualizar os dados. Entre em contato com o administrador do site ou tente novamente mais tarde.',
              color: 'red'
            })
          })
          .finally(() => setIsSubmitting(false))
        // patchProfile({ picture: reader.result }, 'Foto atualizada com sucesso')
      }
      reader.readAsDataURL(filteredFiles)
      setPicture(filteredFiles ? URL.createObjectURL(filteredFiles) : '')
    }
  }

  // Effects
  useEffect(() => {
    if (isAuthenticated === false) return router.push('/')
  }, [isAuthenticated, router])

  if (isAuthenticated === null) return <Center style={{ height: '400px' }}><Loader color="blue" /></Center>

  return (
    <Stack align="center">
      <Box maw={600} mt="sm">
        {data && <AcompanhanteForm.Photos onFileUpload={handleFileUpload} />}
      </Box>
      <Grid>
        {data?.fotos?.map((foto, index) => {
          return (
            <Grid.Col key={foto.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <PhotoCard acompanhanteData={data} fotoData={foto} index={index + 1} mutate={mutate} />
            </Grid.Col>
          )
        })}
        {picture && (
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <PhotoCard acompanhanteData={data} fotoData={picture} index={(data?.fotos?.length || 0) + 1} />
          </Grid.Col>
        )}
      </Grid>
    </Stack>
  )
}
