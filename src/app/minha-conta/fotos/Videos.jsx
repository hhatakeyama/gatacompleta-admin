"use client"

import { Badge, Button, Card, FileButton, Group, Progress, Stack, Text, Title } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconTrash, IconVideoPlus } from "@tabler/icons-react"
import { useState } from "react"

import { executar, mensagemErro, urlMidia } from "@/components/minhaConta/acoes"
import Confirmacao from "@/components/minhaConta/Confirmacao"
import { api } from "@/utils"

const TAMANHO_MAXIMO = 200 * 1024 * 1024

export default function Videos({ conta, mutate }) {
  // States
  const [progresso, setProgresso] = useState(null)
  const [removendo, setRemovendo] = useState(null)

  // Constants
  const videos = conta?.videos || []
  const limite = conta?.limites?.videos
  const noLimite = videos.length >= limite

  // Actions
  const enviar = async arquivo => {
    if (!arquivo) return
    if (arquivo.size > TAMANHO_MAXIMO) {
      notifications.show({ color: "red", title: "Vídeo muito grande", message: "Envie vídeos de até 200 MB." })
      return
    }

    const formData = new FormData()
    formData.append("file", arquivo)
    setProgresso(0)
    try {
      const response = await api.post("/api/minha-conta/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: evento =>
          setProgresso(evento.total ? Math.round((evento.loaded * 100) / evento.total) : 0),
      })
      notifications.show({ color: "green", title: "Pronto!", message: response?.data?.message })
      mutate()
    } catch (error) {
      notifications.show({ color: "red", title: "Ops!", message: mensagemErro(error, "Não foi possível enviar o vídeo.") })
    } finally {
      setProgresso(null)
    }
  }

  const remover = async () => {
    if (await executar(() => api.delete(`/api/minha-conta/videos/${removendo.id}`))) {
      setRemovendo(null)
      mutate()
    }
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={4}>Vídeos</Title>
        <Text size="sm" c="dimmed">
          {videos.length} de {limite}
        </Text>
      </Group>

      <FileButton onChange={enviar} accept="video/*">
        {props => (
          <Button
            {...props}
            size="md"
            variant="light"
            color="pink"
            leftSection={<IconVideoPlus />}
            loading={progresso !== null}
            disabled={noLimite}
            fullWidth>
            Adicionar vídeo
          </Button>
        )}
      </FileButton>
      {progresso !== null && (
        <div>
          <Text size="sm" mb={4}>
            Enviando vídeo... {progresso}% (não feche esta tela)
          </Text>
          <Progress value={progresso} color="pink" animated />
        </div>
      )}

      {videos.map(video => (
        <Card key={video.id} withBorder radius="md" p="sm">
          <video
            src={urlMidia(video.path, video.nome)}
            controls
            preload="metadata"
            style={{ width: "100%", maxHeight: 320, borderRadius: 8, background: "#000" }}
          />
          <Group justify="space-between" mt="xs">
            {video.aprovado ? (
              <Badge color="green" variant="light">
                No site
              </Badge>
            ) : (
              <Badge color="yellow">Aguardando aprovação</Badge>
            )}
            <Button
              variant="light"
              color="red"
              size="sm"
              leftSection={<IconTrash size={16} />}
              onClick={() => setRemovendo(video)}>
              Remover
            </Button>
          </Group>
        </Card>
      ))}

      <Confirmacao
        opened={!!removendo}
        onClose={() => setRemovendo(null)}
        onConfirm={remover}
        titulo="Remover vídeo"
        mensagem="O vídeo será apagado e não dá para recuperar. Continuar?"
        textoConfirmar="Sim, remover"
      />
    </Stack>
  )
}
