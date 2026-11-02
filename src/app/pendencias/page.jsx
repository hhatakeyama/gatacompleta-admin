"use client"

import { Button, Card, Group, Loader, Stack, Text, Title } from "@mantine/core"
import Link from "next/link"

import Situacao from "@/components/displayers/DisplayStatus/Situacao"
import { guardAdmin } from "@/guards/RoleGuard"
import { useFetch } from "@/hooks"
import { useAuth } from "@/providers/AuthProvider"
import { dateToHuman } from "@/utils"

/**
 * O que as acompanhantes fizeram pelo autoatendimento e precisa da equipe:
 * cadastros novos, fotos/vídeos para aprovar e pedidos de exclusão.
 */
function Pendencias() {
  // Hooks
  const { isAuthenticated } = useAuth()

  // Fetch
  const { data, error } = useFetch([isAuthenticated === true ? "/admin/acompanhantes/pendencias" : null])

  return (
    <Stack>
      <div>
        <Title order={3}>Pendências</Title>
        <Text size="sm" c="dimmed">
          Cadastros feitos pelo site, fotos e vídeos aguardando aprovação e pedidos de exclusão.
        </Text>
      </div>

      {!data && !error && <Loader color="blue" />}
      {error && <Text c="red">Erro ao carregar as pendências.</Text>}
      {data?.length === 0 && <Text c="dimmed">Nenhuma pendência no momento.</Text>}

      {data?.map(item => (
        <Card key={item.id} withBorder radius="md" p="md">
          <Group justify="space-between" wrap="wrap">
            <div>
              <Text fw={600}>{item.nome}</Text>
              <Text size="xs" c="dimmed">
                {item.usuario?.email} · {item.tipo?.nome} · cadastrada em {dateToHuman(item.created_at)}
              </Text>
              <Situacao
                situacao={item.situacao}
                fotosPendentes={item.fotos_pendentes_count}
                videosPendentes={item.videos_pendentes_count}
              />
            </div>
            <Button component={Link} href={`/acompanhantes/${item.user_id}`}>
              Revisar
            </Button>
          </Group>
        </Card>
      ))}
    </Stack>
  )
}

export default guardAdmin(Pendencias)
