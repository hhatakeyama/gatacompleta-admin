"use client"

import {
  Alert,
  Button,
  Card,
  Center,
  Divider,
  FileButton,
  Group,
  Loader,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconInfoCircle, IconPhotoPlus } from "@tabler/icons-react"
import { useState } from "react"

import { executar, mensagemErro } from "@/components/minhaConta/acoes"
import Ajuda from "@/components/minhaConta/Ajuda"
import Confirmacao from "@/components/minhaConta/Confirmacao"
import useMinhaConta from "@/components/minhaConta/useMinhaConta"
import { api } from "@/utils"

import FotoCard from "./FotoCard"
import Videos from "./Videos"

const TAMANHO_MAXIMO = 20 * 1024 * 1024

export default function Fotos() {
  // Hooks
  const { conta, isLoading, mutate } = useMinhaConta()

  // States
  const [envio, setEnvio] = useState(null) // { atual, total }
  const [removendo, setRemovendo] = useState(null)
  const [versoes, setVersoes] = useState({}) // força recarregar a imagem depois de girar

  if (isLoading)
    return (
      <Center h={300}>
        <Loader color="pink" />
      </Center>
    )

  // Constants
  const fotos = conta?.fotos || []
  const limite = conta?.limites?.fotos
  const vagas = Math.max(limite - fotos.length, 0)

  // Actions
  // Envia uma foto por vez: mais estável em internet móvel e mostra o andamento
  const enviar = async arquivos => {
    if (!arquivos?.length) return
    const grandes = arquivos.filter(arquivo => arquivo.size > TAMANHO_MAXIMO)
    const selecionados = arquivos.filter(arquivo => arquivo.size <= TAMANHO_MAXIMO).slice(0, vagas)
    const erros = []
    let falhas = 0

    if (grandes.length) erros.push(`${grandes.length} foto(s) com mais de 20 MB não foram enviadas.`)
    if (arquivos.length - grandes.length > vagas)
      erros.push(`Só cabem mais ${vagas} foto(s): o limite é de ${limite} fotos.`)

    for (let i = 0; i < selecionados.length; i++) {
      setEnvio({ atual: i + 1, total: selecionados.length })
      const formData = new FormData()
      formData.append("file", selecionados[i])
      try {
        await api.post("/api/minha-conta/fotos", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } catch (error) {
        falhas++
        erros.push(`${selecionados[i].name}: ${mensagemErro(error, "não foi possível enviar.")}`)
      }
    }
    setEnvio(null)
    mutate()

    const enviadas = selecionados.length - falhas
    if (enviadas > 0)
      notifications.show({
        color: "green",
        title: "Fotos enviadas!",
        message: `${enviadas} foto(s) enviada(s). Elas aparecem no site depois de aprovadas.`,
      })
    if (erros.length)
      notifications.show({ color: "red", title: "Atenção", message: erros.join("\n"), autoClose: false })
  }

  const ordenar = async (foto, deslocamento) => {
    const ids = fotos.map(f => f.id)
    const de = ids.indexOf(foto.id)
    const para = de + deslocamento
    ;[ids[de], ids[para]] = [ids[para], ids[de]]
    if (await executar(() => api.put("/api/minha-conta/fotos/ordem", { ids }), { sucesso: "Ordem salva." }))
      mutate()
  }

  const acao = async (tipo, foto) => {
    if (tipo === "remover") return setRemovendo(foto)
    if (tipo === "frente") return ordenar(foto, -1)
    if (tipo === "tras") return ordenar(foto, 1)
    if (tipo === "capa") {
      if (await executar(() => api.post(`/api/minha-conta/fotos/${foto.id}/destacar`))) mutate()
      return
    }
    // Girar
    if (await executar(() => api.post(`/api/minha-conta/fotos/${foto.id}/girar/${tipo}`))) {
      setVersoes(atual => ({ ...atual, [foto.id]: Date.now() }))
    }
  }

  const remover = async () => {
    if (await executar(() => api.delete(`/api/minha-conta/fotos/${removendo.id}`))) {
      setRemovendo(null)
      mutate()
    }
  }

  return (
    <Stack>
      <div>
        <Title order={3}>Fotos e vídeos</Title>
        <Text size="sm" c="dimmed">
          A primeira foto e a capa são as que mais aparecem no site.
        </Text>
      </div>

      <Alert color="blue" icon={<IconInfoCircle />} radius="md">
        <Text size="sm">
          Fotos e vídeos novos passam pela aprovação da nossa equipe antes de aparecer no site.
        </Text>
      </Alert>

      <Group justify="space-between">
        <Title order={4}>Fotos</Title>
        <Text size="sm" c="dimmed">
          {fotos.length} de {limite}
        </Text>
      </Group>

      <FileButton onChange={enviar} accept="image/jpeg,image/png,image/webp" multiple>
        {props => (
          <Button
            {...props}
            size="lg"
            color="pink"
            leftSection={<IconPhotoPlus />}
            loading={!!envio}
            disabled={vagas === 0}
            fullWidth>
            Adicionar fotos
          </Button>
        )}
      </FileButton>
      {envio && (
        <div>
          <Text size="sm" mb={4}>
            Enviando foto {envio.atual} de {envio.total}... (não feche esta tela)
          </Text>
          <Progress value={((envio.atual - 1) * 100) / envio.total} color="pink" animated />
        </div>
      )}

      {fotos.length === 0 ? (
        <Card withBorder radius="md" p="lg">
          <Text ta="center" c="dimmed">
            Você ainda não tem fotos. Toque em &quot;Adicionar fotos&quot; para escolher da galeria.
          </Text>
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 2, xs: 3 }} spacing="sm">
          {fotos.map((foto, posicao) => (
            <FotoCard
              key={foto.id}
              foto={foto}
              posicao={posicao}
              total={fotos.length}
              versao={versoes[foto.id]}
              onAcao={acao}
            />
          ))}
        </SimpleGrid>
      )}

      <Divider my="md" />

      <Videos conta={conta} mutate={mutate} />

      <Ajuda secao="fotos" />

      <Confirmacao
        opened={!!removendo}
        onClose={() => setRemovendo(null)}
        onConfirm={remover}
        titulo="Remover foto"
        mensagem="A foto será apagada e não dá para recuperar. Continuar?"
        textoConfirmar="Sim, remover"
      />
    </Stack>
  )
}
