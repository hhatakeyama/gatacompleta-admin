import { Button, ButtonGroup, Card, Group } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconX } from "@tabler/icons-react"
import React from "react"

import { api } from "@/utils"

export default function VideoCard({ acompanhanteData, videoData, mutate }) {
  // Actions
  const handleRemove = () => {
    return api
      .delete(`/api/admin/acompanhantes/${acompanhanteData.usuario.id}/videos/${videoData.id}`)
      .then(() => {
        mutate?.()
        notifications.show({
          title: "Sucesso",
          message: "Vídeo deletado com sucesso!",
          color: "green",
        })
      })
      .catch(error => {
        notifications.show({
          title: "Erro",
          message: error?.response?.data?.message || "Erro ao deletar vídeo.",
          color: "red",
        })
      })
  }

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <Group justify="center">
        <video width="100%" height="auto" controls>
          <source
            src={`${process.env.NEXT_PUBLIC_API_DOMAIN}${videoData.path}/${videoData.nome}`}
            type="video/mp4"
          />
          <source
            src={`${process.env.NEXT_PUBLIC_API_DOMAIN}${videoData.path}/${videoData.nome}`}
            type="video/ogg"
          />
          Formato não suportado pelo seu navegador.
        </video>
      </Group>
      <Card.Section inheritPadding py="xs">
        <Group justify="center">
          <ButtonGroup>
            <Button color="red" onClick={handleRemove}>
              <IconX />
            </Button>
          </ButtonGroup>
        </Group>
      </Card.Section>
    </Card>
  )
}
