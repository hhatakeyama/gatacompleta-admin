"use client"

import {
  Button,
  Center,
  Loader,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { useEffect, useState } from "react"

import { errosDoFormulario, executar } from "@/components/minhaConta/acoes"
import Ajuda from "@/components/minhaConta/Ajuda"
import useMinhaConta from "@/components/minhaConta/useMinhaConta"
import { api } from "@/utils"

import Telefones from "./Telefones"

// Mesmas opções do cadastro feito pelo admin
const cabelos = [
  { value: "1", label: "Loira" },
  { value: "2", label: "Morena" },
  { value: "3", label: "Mestiça" },
  { value: "4", label: "Mulata" },
  { value: "5", label: "Oriental" },
  { value: "6", label: "Ruiva" },
]
const olhos = [
  { value: "1", label: "Azul" },
  { value: "2", label: "Castanho" },
  { value: "3", label: "Castanho Claro" },
  { value: "4", label: "Castanho Escuro" },
  { value: "5", label: "Castanho Esverdeado" },
  { value: "6", label: "Mel" },
  { value: "7", label: "Preto" },
  { value: "8", label: "Verde" },
]
const simNao = [
  { value: "1", label: "Sim" },
  { value: "0", label: "Não" },
]

const camposTexto = [
  "sobre",
  "idade",
  "altura",
  "peso",
  "busto",
  "cintura",
  "quadril",
  "manequim",
  "cache",
  "duracao",
  "observacao_horario",
  "acessorios",
  "atende",
  "locais",
  "viagem",
  "anal",
  "adicionais",
]

const valoresIniciais = perfil => ({
  ...Object.fromEntries(camposTexto.map(campo => [campo, perfil?.[campo] || ""])),
  cabelo_id: perfil?.cabelo_id?.toString() || null,
  olho_id: perfil?.olho_id?.toString() || null,
  dia_inteiro: perfil?.dia_inteiro ?? null,
})

export default function Perfil() {
  // Hooks
  const { conta, isLoading, mutate } = useMinhaConta()
  const form = useForm({ initialValues: valoresIniciais() })

  // States
  const [salvando, setSalvando] = useState(false)

  // Effects
  useEffect(() => {
    if (conta?.perfil) {
      form.setValues(valoresIniciais(conta.perfil))
      form.resetDirty(valoresIniciais(conta.perfil))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conta?.perfil])

  if (isLoading)
    return (
      <Center h={300}>
        <Loader color="pink" />
      </Center>
    )

  // Actions
  const salvar = async values => {
    setSalvando(true)
    const ok = await executar(() => api.patch("/api/minha-conta/perfil", values), {
      onErro: error => form.setErrors(errosDoFormulario(error)),
    })
    setSalvando(false)
    if (ok) mutate()
  }

  const campo = (nome, label, props = {}) => (
    <TextInput label={label} size="md" maxLength={100} {...props} {...form.getInputProps(nome)} />
  )

  return (
    <Stack>
      <div>
        <Title order={3}>Perfil</Title>
        <Text size="sm" c="dimmed">
          {conta?.nome}
          {conta?.tipo ? ` · ${conta.tipo}` : ""} (para mudar nome ou categoria, fale com a equipe)
        </Text>
      </div>

      <form onSubmit={form.onSubmit(salvar)}>
        <Stack>
          <Paper withBorder radius="md" p="md">
            <Title order={4} mb="sm">
              Sobre você
            </Title>
            <Textarea
              size="md"
              autosize
              minRows={4}
              maxLength={2000}
              placeholder="Conte um pouco sobre você e seu atendimento"
              {...form.getInputProps("sobre")}
            />
          </Paper>

          <Paper withBorder radius="md" p="md">
            <Title order={4} mb="sm">
              Características
            </Title>
            <SimpleGrid cols={2} spacing="sm">
              {campo("idade", "Idade")}
              {campo("altura", "Altura", { placeholder: "Ex.: 1,65" })}
              {campo("peso", "Peso", { placeholder: "Ex.: 58 kg" })}
              {campo("manequim", "Manequim")}
              {campo("busto", "Busto")}
              {campo("cintura", "Cintura")}
              {campo("quadril", "Quadril")}
              <Select label="Cabelo" size="md" data={cabelos} clearable {...form.getInputProps("cabelo_id")} />
              <Select label="Olhos" size="md" data={olhos} clearable {...form.getInputProps("olho_id")} />
            </SimpleGrid>
          </Paper>

          <Paper withBorder radius="md" p="md">
            <Title order={4} mb="sm">
              Atendimento
            </Title>
            <Stack gap="sm">
              <SimpleGrid cols={2} spacing="sm">
                {campo("cache", "Cachê", { placeholder: "Ex.: R$ 300" })}
                {campo("duracao", "Duração", { placeholder: "Ex.: 1 hora" })}
              </SimpleGrid>
              <Select
                label="Atende o dia inteiro?"
                size="md"
                data={simNao}
                clearable
                {...form.getInputProps("dia_inteiro")}
              />
              <Textarea
                label="Horários"
                size="md"
                autosize
                maxLength={2000}
                placeholder="Ex.: de segunda a sábado, das 10h às 22h"
                {...form.getInputProps("observacao_horario")}
              />
              {campo("atende", "Atende", { placeholder: "Ex.: homens, mulheres, casais", maxLength: 255 })}
              {campo("locais", "Onde atende", { placeholder: "Ex.: local próprio, motel", maxLength: 255 })}
              <SimpleGrid cols={2} spacing="sm">
                {campo("viagem", "Viaja?", { placeholder: "Ex.: a combinar" })}
                {campo("anal", "Anal?", { placeholder: "Ex.: sim, não" })}
              </SimpleGrid>
              <Textarea
                label="Acessórios"
                size="md"
                autosize
                maxLength={2000}
                {...form.getInputProps("acessorios")}
              />
              <Textarea
                label="Informações adicionais"
                size="md"
                autosize
                maxLength={2000}
                {...form.getInputProps("adicionais")}
              />
            </Stack>
          </Paper>

          <Button
            type="submit"
            size="lg"
            color="pink"
            fullWidth
            loading={salvando}
            disabled={!form.isDirty()}>
            Salvar alterações
          </Button>
        </Stack>
      </form>

      <Telefones conta={conta} mutate={mutate} />

      <Ajuda secao="perfil" />
    </Stack>
  )
}
