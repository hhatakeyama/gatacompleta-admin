"use client"

import { Alert, Button, Stack, Text } from "@mantine/core"
import {
  IconBrandWhatsapp,
  IconCircleCheck,
  IconClock,
  IconExternalLink,
  IconPlayerPause,
  IconTrash,
  IconUserOff,
} from "@tabler/icons-react"

import { api } from "@/utils"

import { dataBr, executar, linkSuporte } from "./acoes"

/**
 * Explica em linguagem simples a situação da conta e oferece a próxima ação.
 */
export default function Situacao({ conta, mutate }) {
  const reativar = async () => {
    if (await executar(() => api.post("/api/minha-conta/reativar"))) mutate()
  }
  const cancelarExclusao = async () => {
    if (await executar(() => api.post("/api/minha-conta/cancelar-exclusao"))) mutate()
  }

  const situacoes = {
    pendente: {
      cor: "yellow",
      icone: <IconClock />,
      titulo: "Cadastro aguardando aprovação",
      texto:
        "Nossa equipe vai conferir seu cadastro. Enquanto isso, já envie suas fotos e cadastre sua agenda: assim seu perfil fica pronto para aparecer no site assim que for aprovado.",
    },
    ativa: {
      cor: "green",
      icone: <IconCircleCheck />,
      titulo: "Seu perfil está ativo",
      texto: conta?.url
        ? "Seu perfil está aparecendo no site hoje."
        : "Seu perfil só aparece no site nos dias da sua agenda. Hoje você não tem agenda: cadastre uma no menu Agenda.",
      acao: conta?.url && (
        <Button
          component="a"
          href={conta.url}
          target="_blank"
          rel="noreferrer"
          variant="light"
          color="green"
          leftSection={<IconExternalLink size={18} />}>
          Ver meu perfil no site
        </Button>
      ),
    },
    pausada: {
      cor: "gray",
      icone: <IconPlayerPause />,
      titulo: "Seu perfil está pausado",
      texto: "Seu perfil não aparece no site. Suas fotos, agenda e textos continuam guardados.",
      acao: (
        <Button color="green" onClick={reativar}>
          Reativar meu perfil
        </Button>
      ),
    },
    desativada: {
      cor: "orange",
      icone: <IconUserOff />,
      titulo: "Seu anúncio está desativado",
      texto:
        "Nossa equipe desativou seu anúncio. Para voltar a aparecer no site, fale com a gente pelo WhatsApp.",
      acao: (
        <Button
          component="a"
          href={linkSuporte("Olá, meu anúncio no Gata Completa está desativado")}
          target="_blank"
          rel="noreferrer"
          color="green"
          leftSection={<IconBrandWhatsapp size={18} />}>
          Falar com a equipe
        </Button>
      ),
    },
    exclusao_agendada: {
      cor: "red",
      icone: <IconTrash />,
      titulo: "Exclusão da conta agendada",
      texto: `Sua conta e todos os seus dados serão apagados em ${dataBr(conta?.exclusao_em)}. Seu perfil já não aparece no site. Mudou de ideia? Cancele a exclusão.`,
      acao: (
        <Button color="green" onClick={cancelarExclusao}>
          Cancelar exclusão
        </Button>
      ),
    },
  }

  const situacao = situacoes[conta?.situacao]
  if (!situacao) return null

  return (
    <Alert color={situacao.cor} icon={situacao.icone} title={situacao.titulo} radius="md">
      <Stack gap="sm">
        <Text size="sm">{situacao.texto}</Text>
        {situacao.acao}
      </Stack>
    </Alert>
  )
}
