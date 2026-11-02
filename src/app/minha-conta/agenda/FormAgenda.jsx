"use client"

import { Alert, Button, Select, Stack, Text, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import dayjs from "dayjs"
import { useState } from "react"

import { errosDoFormulario, mensagemErro } from "@/components/minhaConta/acoes"
import { useFetch } from "@/hooks"
import { api } from "@/utils"

/**
 * Cadastro/edição de uma agenda: estado, cidade e período.
 */
export default function FormAgenda({ agenda, maxDias = 90, onSuccess }) {
  // States
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // Form
  const hoje = dayjs().format("YYYY-MM-DD")
  const form = useForm({
    initialValues: {
      estado_id: agenda?.estado_id || "",
      cidade_id: agenda?.cidade_id?.toString() || "",
      data_inicio: agenda?.data_inicio || hoje,
      data_fim: agenda?.data_fim || "",
    },
    validate: {
      estado_id: value => (!value ? "Escolha o estado" : null),
      cidade_id: value => (!value ? "Escolha a cidade" : null),
      data_inicio: value => (!value ? "Escolha o primeiro dia" : null),
      data_fim: (value, values) => {
        if (!value) return "Escolha o último dia"
        if (value < values.data_inicio) return "O último dia precisa ser depois do primeiro"
        if (value < hoje) return "O último dia precisa ser hoje ou depois"
        if (dayjs(value).diff(dayjs(values.data_inicio), "day") > maxDias)
          return `Cada agenda pode ter no máximo ${maxDias} dias`
        return null
      },
    },
  })

  // Fetch
  const { data: estados } = useFetch(["/admin/estados"])
  const { data: cidades, isValidating: carregandoCidades } = useFetch([
    form.values.estado_id ? `/admin/estados/${form.values.estado_id}/cidades` : null,
  ])
  const opcoesEstados = estados?.map(estado => ({ value: estado.id, label: estado.nome })) || []
  const opcoesCidades =
    cidades?.map(cidade => ({ value: cidade.id.toString(), label: cidade.nome })) || []

  // Actions
  const salvar = async values => {
    setErro(null)
    setEnviando(true)
    try {
      const response = agenda
        ? await api.patch(`/api/minha-conta/agendas/${agenda.id}`, values)
        : await api.post("/api/minha-conta/agendas", values)
      notifications.show({ color: "green", title: "Pronto!", message: response?.data?.message })
      onSuccess?.()
    } catch (error) {
      form.setErrors(errosDoFormulario(error))
      setErro(mensagemErro(error))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={form.onSubmit(salvar)}>
      <Stack>
        <Select
          label="Estado"
          placeholder="Toque para escolher"
          data={opcoesEstados}
          searchable
          size="md"
          nothingFoundMessage="Nenhum estado encontrado"
          {...form.getInputProps("estado_id")}
          onChange={value => {
            form.setFieldValue("estado_id", value || "")
            form.setFieldValue("cidade_id", "")
          }}
        />
        <Select
          label="Cidade"
          placeholder={form.values.estado_id ? "Digite o nome da cidade" : "Escolha o estado primeiro"}
          data={opcoesCidades}
          searchable
          size="md"
          disabled={!form.values.estado_id || carregandoCidades}
          nothingFoundMessage="Nenhuma cidade encontrada"
          {...form.getInputProps("cidade_id")}
        />
        <TextInput
          type="date"
          label="Primeiro dia"
          size="md"
          {...form.getInputProps("data_inicio")}
        />
        <TextInput
          type="date"
          label="Último dia"
          size="md"
          min={form.values.data_inicio || hoje}
          {...form.getInputProps("data_fim")}
        />
        <Text size="xs" c="dimmed">
          Seu perfil aparece no site nessa cidade do primeiro ao último dia (máximo de {maxDias}{" "}
          dias).
        </Text>

        {erro && (
          <Alert color="red" radius="md">
            {erro}
          </Alert>
        )}

        <Button type="submit" size="lg" color="pink" fullWidth loading={enviando}>
          Salvar agenda
        </Button>
      </Stack>
    </form>
  )
}
