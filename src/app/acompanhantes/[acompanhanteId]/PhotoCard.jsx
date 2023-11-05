import { Button, ButtonGroup, Card, Group, Image, TextInput } from '@mantine/core'
import { IconPlus, IconRotate, IconRotateClockwise, IconStar, IconStarFilled, IconX } from '@tabler/icons-react'
import React from 'react'

export default function PhotoCard({ acompanhanteData, fotoData, index }) {
  // Constants
  const newPhoto = !fotoData.id
  const destacado = fotoData.destaque === "1"
  
  // Actions
  const handleHighlight = (foto) => {
    // "/acompanhantes/fotos/" + id + "/destacar"
    console.log(foto)
  }

  const handleSort = (foto) => {
    // "/acompanhantes/fotos/" + id + "/destacar"
    console.log(foto)
  }

  const handleRotate = (foto, direcao) => {
    let rotacionar = "girar-esquerda"
    if (direcao === "right") {
      rotacionar = "girar-direita"
    }
    const url = `/admin/acompanhantes/${acompanhanteData.id}/fotos/${fotoData.id}/${rotacionar}/`
    console.log(foto, direcao, url)
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
            <TextInput defaultValue={index} styles={{ label: { textAlign: 'center', width: '100%' }, input: { textAlign: 'center', width: '50px' } }} onChange={() => handleSort(foto)} />
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
              <Button title="Rotacionar esquerda" color="blue" onClick={() => handleRotate(fotoData, 'left')}>
                <IconRotate />
              </Button>
            )}
            <Button color="red" onClick={() => handleRemove(fotoData)}>
              <IconX />
            </Button>
            {!newPhoto && (
              <Button title="Rotacionar direita" color="blue" onClick={() => handleRotate(fotoData, 'right')}>
                <IconRotateClockwise />
              </Button>
            )}
          </ButtonGroup>
        </Group>
      </Card.Section>
    </Card>
  )
}
