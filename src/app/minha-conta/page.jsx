"use client"

import { Alert, Button, Center, Loader, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core"
import { IconAlertCircle, IconCheck, IconChevronRight, IconClock, IconPoint } from "@tabler/icons-react"
import Link from "next/link"

import Ajuda from "@/components/minhaConta/Ajuda"
import Situacao from "@/components/minhaConta/Situacao"
import useMinhaConta from "@/components/minhaConta/useMinhaConta"

export default function Inicio() {
  // Hooks
  const { conta, isLoading, mutate } = useMinhaConta()

  if (isLoading)
    return (
      <Center h={300}>
        <Loader color="pink" />
      </Center>
    )

  // Constants
  const fotosPendentes = conta?.fotos?.filter(foto => !foto.aprovada).length || 0
  const videosPendentes = conta?.videos?.filter(video => !video.aprovado).length || 0
  const passos = [
    {
      feito: conta?.fotos?.length > 0,
      texto: "Enviar suas fotos",
      link: "/minha-conta/fotos",
    },
    {
      feito: conta?.agendas?.some(agenda => agenda.vigente),
      texto: "Ter uma agenda para hoje",
      link: "/minha-conta/agenda",
    },
    {
      feito: conta?.telefones?.length > 0,
      texto: "Cadastrar seu telefone",
      link: "/minha-conta/perfil",
    },
    {
      feito: !!conta?.perfil?.sobre,
      texto: "Escrever sobre você",
      link: "/minha-conta/perfil",
    },
  ]

  return (
    <Stack>
      <Title order={3}>Olá, {conta?.nome}!</Title>

      <Situacao conta={conta} mutate={mutate} />

      {(fotosPendentes > 0 || videosPendentes > 0) && (
        <Alert color="yellow" icon={<IconClock />} radius="md" title="Aguardando aprovação">
          <Text size="sm">
            {fotosPendentes > 0 && `${fotosPendentes} foto(s)`}
            {fotosPendentes > 0 && videosPendentes > 0 && " e "}
            {videosPendentes > 0 && `${videosPendentes} vídeo(s)`} aguardando aprovação da equipe.
            Elas aparecem no site assim que forem aprovadas.
          </Text>
        </Alert>
      )}

      <Paper withBorder radius="md" p="md">
        <Title order={5} mb="sm">
          Seu perfil está completo?
        </Title>
        <Stack gap="xs">
          {passos.map(passo => (
            <Button
              key={passo.texto}
              component={Link}
              href={passo.link}
              variant={passo.feito ? "subtle" : "light"}
              color={passo.feito ? "green" : "pink"}
              size="md"
              justify="space-between"
              fullWidth
              leftSection={
                <ThemeIcon
                  size="sm"
                  radius="xl"
                  color={passo.feito ? "green" : "gray"}
                  variant={passo.feito ? "filled" : "light"}>
                  {passo.feito ? <IconCheck size={14} /> : <IconAlertCircle size={14} />}
                </ThemeIcon>
              }
              rightSection={<IconChevronRight size={18} />}>
              <Text>{passo.texto}</Text>
            </Button>
          ))}
        </Stack>
      </Paper>

      <Ajuda secao="inicio" titulo="Primeiros passos" />
    </Stack>
  )
}
