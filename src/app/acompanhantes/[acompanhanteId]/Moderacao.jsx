"use client"

import { Alert, Button, Group, Stack, Text } from "@mantine/core"
import { IconCheck, IconLock, IconLockOpen } from "@tabler/icons-react"
import { useState } from "react"

import Situacao from "@/components/displayers/DisplayStatus/Situacao"
import { dataBr, executar } from "@/components/minhaConta/acoes"
import Confirmacao from "@/components/minhaConta/Confirmacao"
import { api } from "@/utils"

/**
 * Ações do admin sobre o autoatendimento: aprovar cadastro feito pelo site
 * e bloquear/desbloquear o acesso da acompanhante ao painel.
 */
export default function Moderacao({ acompanhanteData, mutate }) {
  // States
  const [bloqueando, setBloqueando] = useState(false)

  // Constants
  const userId = acompanhanteData?.user_id
  const bloqueado = !!acompanhanteData?.usuario?.bloqueado_em
  const fotosPendentes = acompanhanteData?.fotos?.filter(foto => foto.status === "0").length
  const videosPendentes = acompanhanteData?.videos?.filter(video => video.status === "0").length
  const dataExclusao = acompanhanteData?.exclusao_agendada_em
    ? new Date(new Date(acompanhanteData.exclusao_agendada_em).getTime() + 7 * 86400000).toISOString()
    : null

  // Actions
  const aprovar = async () => {
    if (await executar(() => api.post(`/api/admin/acompanhantes/${userId}/aprovar`))) mutate()
  }
  const alternarBloqueio = async () => {
    const acao = bloqueado ? "desbloquear" : "bloquear"
    if (await executar(() => api.post(`/api/admin/acompanhantes/${userId}/${acao}`))) {
      setBloqueando(false)
      mutate()
    }
  }

  return (
    <Stack gap="xs">
      <Situacao
        situacao={acompanhanteData?.situacao}
        fotosPendentes={fotosPendentes}
        videosPendentes={videosPendentes}
      />

      {acompanhanteData?.situacao === "pendente" && (
        <Alert color="yellow" title="Cadastro feito pelo site aguardando aprovação">
          <Text size="sm" mb="sm">
            Confira os dados, as fotos e os vídeos. Remova o que não puder ir para o site antes de
            aprovar: a aprovação libera o perfil e todas as fotos e vídeos enviados até agora.
          </Text>
          <Button color="green" leftSection={<IconCheck />} onClick={aprovar}>
            Aprovar cadastro
          </Button>
        </Alert>
      )}

      {acompanhanteData?.situacao === "exclusao_agendada" && (
        <Alert color="red" title="Exclusão agendada pela acompanhante">
          <Text size="sm">
            O perfil não aparece no site. Os dados serão apagados definitivamente em{" "}
            {dataBr(dataExclusao)}, a não ser que ela cancele a exclusão.
          </Text>
        </Alert>
      )}

      <Group>
        <Button
          size="xs"
          variant="light"
          color={bloqueado ? "green" : "red"}
          leftSection={bloqueado ? <IconLockOpen size={16} /> : <IconLock size={16} />}
          onClick={() => setBloqueando(true)}>
          {bloqueado ? "Desbloquear acesso ao painel" : "Bloquear acesso ao painel"}
        </Button>
      </Group>

      <Confirmacao
        opened={bloqueando}
        onClose={() => setBloqueando(false)}
        onConfirm={alternarBloqueio}
        titulo={bloqueado ? "Desbloquear acesso" : "Bloquear acesso"}
        mensagem={
          bloqueado
            ? "A acompanhante volta a conseguir entrar no painel."
            : "A acompanhante não consegue mais entrar no painel e as sessões abertas são encerradas. O perfil no site não muda (use o status para isso)."
        }
        textoConfirmar={bloqueado ? "Desbloquear" : "Bloquear"}
        cor={bloqueado ? "green" : "red"}
      />
    </Stack>
  )
}
