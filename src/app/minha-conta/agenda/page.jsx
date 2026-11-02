"use client"

import { Badge, Button, Card, Center, Group, Loader, Modal, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconCalendarPlus, IconMapPin, IconPencil, IconTrash } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useState } from "react"

import { dataBr, executar } from "@/components/minhaConta/acoes"
import Ajuda from "@/components/minhaConta/Ajuda"
import Confirmacao from "@/components/minhaConta/Confirmacao"
import useMinhaConta from "@/components/minhaConta/useMinhaConta"
import { api } from "@/utils"

import FormAgenda from "./FormAgenda"

function situacaoAgenda(agenda, hoje) {
  if (agenda.vigente) return { label: "No site hoje", color: "green" }
  if (agenda.data_fim < hoje) return { label: "Encerrada", color: "gray" }
  if (agenda.data_inicio > hoje) return { label: "Próxima", color: "blue" }
  return { label: "Ativa", color: "green" }
}

export default function Agenda() {
  // Hooks
  const { conta, isLoading, mutate } = useMinhaConta()
  const telaPequena = useMediaQuery("(max-width: 36em)")

  // States
  const [editando, setEditando] = useState(null) // null = fechado, {} = nova, agenda = edição
  const [removendo, setRemovendo] = useState(null)

  if (isLoading)
    return (
      <Center h={300}>
        <Loader color="pink" />
      </Center>
    )

  // Constants
  const hoje = dayjs().format("YYYY-MM-DD")
  const agendas = [...(conta?.agendas || [])].sort((a, b) => (a.data_inicio < b.data_inicio ? 1 : -1))
  const limite = conta?.limites?.agendas
  const noLimite = agendas.length >= limite

  // Actions
  const remover = async () => {
    if (await executar(() => api.delete(`/api/minha-conta/agendas/${removendo.id}`))) {
      setRemovendo(null)
      mutate()
    }
  }

  return (
    <Stack>
      <div>
        <Title order={3}>Agenda</Title>
        <Text size="sm" c="dimmed">
          Em quais cidades e dias seu perfil aparece no site.
        </Text>
      </div>

      <Button
        size="lg"
        color="pink"
        leftSection={<IconCalendarPlus />}
        onClick={() => setEditando({})}
        disabled={noLimite}
        fullWidth>
        Adicionar agenda
      </Button>
      {noLimite && (
        <Text size="sm" c="orange">
          Você chegou ao limite de {limite} agendas. Remova as encerradas para adicionar outra.
        </Text>
      )}

      {agendas.length === 0 && (
        <Card withBorder radius="md" p="lg">
          <Text ta="center" c="dimmed">
            Você ainda não tem agenda. Sem agenda, seu perfil não aparece na busca do site.
          </Text>
        </Card>
      )}

      {agendas.map(agenda => {
        const situacao = situacaoAgenda(agenda, hoje)
        return (
          <Card key={agenda.id} withBorder radius="md" p="md">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <div>
                <Group gap={6} wrap="nowrap">
                  <IconMapPin size={18} />
                  <Text fw={600}>
                    {agenda.cidade} / {agenda.estado_id}
                  </Text>
                </Group>
                <Text size="sm" mt={4}>
                  De {dataBr(agenda.data_inicio)} até {dataBr(agenda.data_fim)}
                </Text>
              </div>
              <Badge color={situacao.color} variant="light">
                {situacao.label}
              </Badge>
            </Group>
            <Group grow mt="md">
              <Button
                variant="default"
                leftSection={<IconPencil size={18} />}
                onClick={() => setEditando(agenda)}>
                Editar
              </Button>
              <Button
                variant="light"
                color="red"
                leftSection={<IconTrash size={18} />}
                onClick={() => setRemovendo(agenda)}>
                Remover
              </Button>
            </Group>
          </Card>
        )
      })}

      <Ajuda secao="agenda" />

      <Modal
        opened={!!editando}
        onClose={() => setEditando(null)}
        title={editando?.id ? "Editar agenda" : "Nova agenda"}
        fullScreen={telaPequena}
        centered>
        {editando && (
          <FormAgenda
            agenda={editando.id ? editando : null}
            maxDias={conta?.agenda_max_dias}
            onSuccess={() => {
              setEditando(null)
              mutate()
            }}
          />
        )}
      </Modal>

      <Confirmacao
        opened={!!removendo}
        onClose={() => setRemovendo(null)}
        onConfirm={remover}
        titulo="Remover agenda"
        mensagem={`Remover a agenda de ${removendo?.cidade} (${dataBr(removendo?.data_inicio)} a ${dataBr(removendo?.data_fim)})? ${removendo?.vigente ? "Seu perfil sai da busca dessa cidade agora." : ""}`}
        textoConfirmar="Sim, remover"
      />
    </Stack>
  )
}
