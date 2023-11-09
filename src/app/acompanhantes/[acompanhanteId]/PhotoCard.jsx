import { Button, ButtonGroup, Card, Group, Image, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconPlus, IconRotate, IconRotateClockwise, IconStar, IconStarFilled, IconX } from '@tabler/icons-react'
import React from 'react'

import { api } from '@/utils'
import errorHandler from '@/utils/errorHandler'

export default function PhotoCard({ acompanhanteData, fotoData, index, mutate }) {
  // Constants
  const newPhoto = !fotoData.id
  const destacado = fotoData.destaque === "1"

  // Actions
  const handleHighlight = () => {
    return api
      .post(`/admin/acompanhantes/${acompanhanteData.id}/fotos/${fotoData.id}/destacar`)
      .then(() => {
        mutate?.()
        notifications.show({
          title: 'Sucesso',
          message: 'Foto destacada com sucesso!',
          color: 'green'
        })
      })
      .catch(error => {
        notifications.show({
          title: 'Erro',
          message: errorHandler(error?.response?.data?.errors)?.messages || 'Erro ao destacar foto.',
          color: 'red'
        })
      })
  }

  const handleSort = () => {
    // "/acompanhantes/fotos/" + id + "/destacar"
    console.log(fotoData)
  }

  const handleRotate = (direcao) => {
    let rotacionar = "girar-esquerda"
    if (direcao === "right") {
      rotacionar = "girar-direita"
    }
    return api
      .post(`/admin/acompanhantes/${acompanhanteData.id}/fotos/${fotoData.id}/${rotacionar}`)
      .then(() => {
        mutate?.()
        notifications.show({
          title: 'Sucesso',
          message: 'Foto girada com sucesso!',
          color: 'green'
        })
      })
      .catch(error => {
        notifications.show({
          title: 'Erro',
          message: errorHandler(error?.response?.data?.errors)?.messages || 'Erro ao girar foto.',
          color: 'red'
        })
      })
  }

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      {newPhoto ? (
        <Card.Section inheritPadding py="xs">
          <Group justify="center">
            <TextInput defaultValue={index} styles={{ label: { textAlign: 'center', width: '100%' }, input: { textAlign: 'center', width: '50px' } }} />
            <Button color="green" leftSection={<IconPlus />}>Novo</Button>
          </Group>
        </Card.Section>
      ) : (
        <Card.Section inheritPadding py="xs">
          <Group justify="center">
            <TextInput defaultValue={index} styles={{ label: { textAlign: 'center', width: '100%' }, input: { textAlign: 'center', width: '50px' } }} onChange={() => handleSort()} />
            <Button variant={destacado ? "filled" : "outline"} color="yellow" onClick={() => !destacado ? handleHighlight(fotoData) : null} leftSection={destacado ? <IconStarFilled /> : <IconStar />}>
              {destacado ? "Destacado" : "Destacar"}
            </Button>
          </Group>
        </Card.Section>
      )}
      <Group justify="center">
        {newPhoto ? (
          <Image alt="Nova foto" color="violet" src={fotoData} radius="xs" width={200} height={200} fit="contain" />
        ) : (
          <Image alt={fotoData.nome} color="violet" src={`https://admin.gatacompleta.com${fotoData.path}/210x314-${fotoData.nome}`} radius="xs" width={200} height={200} fit="contain" />
        )}
      </Group>
      <Card.Section inheritPadding py="xs">
        <Group justify="center">
          <ButtonGroup>
            {!newPhoto && (
              <Button title="Rotacionar esquerda" color="blue" onClick={() => handleRotate('left')}>
                <IconRotate />
              </Button>
            )}
            <Button color="red" onClick={() => handleRemove()}>
              <IconX />
            </Button>
            {!newPhoto && (
              <Button title="Rotacionar direita" color="blue" onClick={() => handleRotate('right')}>
                <IconRotateClockwise />
              </Button>
            )}
          </ButtonGroup>
        </Group>
      </Card.Section>
    </Card>
  )
}
