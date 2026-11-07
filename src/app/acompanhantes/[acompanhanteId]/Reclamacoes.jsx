import { Alert, Anchor, Center, Group, Loader, Paper, Stack, Text } from "@mantine/core"
import { IconAlertCircle, IconMoodHappy } from "@tabler/icons-react"
import dayjs from "dayjs"

// Problemas relatados pelos visitantes no perfil (anônimos; a acompanhante não vê)
export default function Reclamacoes({ reclamacoes, error }) {
  if (error) {
    return (
      <Alert color="red" icon={<IconAlertCircle />}>
        {error?.response?.data?.message || "Não foi possível carregar as reclamações."}
      </Alert>
    )
  }

  if (!reclamacoes) {
    return (
      <Center py="xl">
        <Loader color="pink" type="bars" />
      </Center>
    )
  }

  if (!reclamacoes.length) {
    return (
      <Alert color="teal" icon={<IconMoodHappy />}>
        Nenhuma reclamação relatada no perfil desta acompanhante.
      </Alert>
    )
  }

  return (
    <Stack gap="sm">
      <Text size="xs" c="dimmed">
        Mensagens enviadas pelo formulário “Relatar problema” do perfil no site. São anônimas e não
        são mostradas à acompanhante.
      </Text>
      {reclamacoes.map(reclamacao => (
        <Paper key={reclamacao.id} withBorder radius="md" p="md">
          <Group justify="space-between" mb={6} gap="xs">
            <Text size="sm" fw={600}>
              {dayjs(reclamacao.created_at).format("DD/MM/YYYY [às] HH:mm")}
            </Text>
            {/^https?:\/\//i.test(reclamacao.url || "") && (
              <Anchor href={reclamacao.url} target="_blank" rel="noreferrer" size="xs">
                Perfil relatado
              </Anchor>
            )}
          </Group>
          <Text size="sm" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
            {reclamacao.mensagem}
          </Text>
        </Paper>
      ))}
    </Stack>
  )
}
