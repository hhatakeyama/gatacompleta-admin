"use client"

import { Button, Paper, Stack, Text, Title } from "@mantine/core"
import { IconBrandWhatsapp } from "@tabler/icons-react"

import { linkSuporte } from "@/components/minhaConta/acoes"
import Ajuda from "@/components/minhaConta/Ajuda"
import { ajuda } from "@/components/minhaConta/ajudaConteudo"

export default function CentralDeAjuda() {
  return (
    <Stack>
      <div>
        <Title order={3}>Ajuda</Title>
        <Text size="sm" c="dimmed">
          Toque em uma pergunta para ver a resposta.
        </Text>
      </div>

      {Object.entries(ajuda).map(([secao, { titulo }]) => (
        <Ajuda key={secao} secao={secao} titulo={titulo} />
      ))}

      <Paper withBorder radius="md" p="md" mt="md">
        <Title order={5}>Não encontrou sua dúvida?</Title>
        <Text size="sm" my="sm">
          Fale com a equipe do Gata Completa pelo WhatsApp.
        </Text>
        <Button
          component="a"
          href={linkSuporte()}
          target="_blank"
          rel="noreferrer"
          size="md"
          color="green"
          leftSection={<IconBrandWhatsapp />}
          fullWidth>
          Falar com a equipe
        </Button>
      </Paper>
    </Stack>
  )
}
