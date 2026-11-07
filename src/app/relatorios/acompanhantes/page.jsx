"use client"

import {
  Alert,
  Anchor,
  Box,
  Button,
  Grid,
  Group,
  LoadingOverlay,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react"
import dayjs from "dayjs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { guardAdmin } from "@/guards/RoleGuard"
import { useFetch } from "@/hooks"
import { useAuth } from "@/providers/AuthProvider"

import Graficos from "./Graficos"
import Kpis from "./Kpis"
import Ranking from "./Ranking"
import Reclamacoes from "./Reclamacoes"

const PERIODOS = [
  { value: "7", label: "7 dias" },
  { value: "30", label: "30 dias" },
  { value: "90", label: "90 dias" },
  { value: "personalizado", label: "Personalizado" },
]

const FORMATO = "YYYY-MM-DD"
const intervalo = dias => ({
  inicio: dayjs().subtract(Number(dias) - 1, "day").format(FORMATO),
  fim: dayjs().format(FORMATO),
})

function RelatorioAcompanhantes() {
  // Hooks
  const router = useRouter()
  const { isAuthenticated, permissionsData } = useAuth()

  // Constants
  const { permissions } = permissionsData || {}

  // States
  const [periodo, setPeriodo] = useState("30")
  const [datas, setDatas] = useState(() => intervalo(30))

  // Fetch
  const datasValidas = datas.inicio && datas.fim && datas.inicio <= datas.fim
  const { data, error, isValidating } = useFetch(
    [
      isAuthenticated === true && datasValidas ? "/admin/relatorios/acompanhantes" : null,
      { dataInicio: datas.inicio, dataFim: datas.fim },
    ],
    { keepPreviousData: true },
  )
  const loading = (!data && !error) || isValidating

  // Validations
  if (permissions?.find(item => item !== "s" && item !== "a")) return router.push("/")

  const alterarPeriodo = valor => {
    setPeriodo(valor)
    if (valor !== "personalizado") setDatas(intervalo(valor))
  }

  return (
    <Stack>
      <Box>
        <Button component={Link} href="/relatorios" variant="subtle">
          <Group gap={4}>
            <IconArrowLeft size={14} />
            Relatórios
          </Group>
        </Button>
        <Title order={3}>Acompanhantes e contatos</Title>
        <Text size="sm" c="dimmed">
          Quem está ativa no site e quem está recebendo mais ligações e mensagens de WhatsApp
        </Text>
      </Box>

      <Grid align="flex-end">
        <Grid.Col span={{ base: 12, md: "content" }}>
          <SegmentedControl data={PERIODOS} value={periodo} onChange={alterarPeriodo} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 2 }}>
          <TextInput
            label="De"
            type="date"
            value={datas.inicio}
            max={datas.fim}
            onChange={event => {
              setPeriodo("personalizado")
              setDatas(atual => ({ ...atual, inicio: event.target.value }))
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 2 }}>
          <TextInput
            label="Até"
            type="date"
            value={datas.fim}
            min={datas.inicio}
            onChange={event => {
              setPeriodo("personalizado")
              setDatas(atual => ({ ...atual, fim: event.target.value }))
            }}
          />
        </Grid.Col>
      </Grid>

      {!datasValidas && (
        <Alert color="orange" icon={<IconAlertCircle />}>
          Informe um período válido: a data inicial deve ser anterior ou igual à final.
        </Alert>
      )}
      {error && (
        <Alert color="red" icon={<IconAlertCircle />}>
          {error?.response?.data?.message || "Não foi possível carregar o relatório."}
        </Alert>
      )}

      <Stack pos="relative" mih={200}>
        <LoadingOverlay
          visible={loading}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "pink", type: "bars" }}
        />
        {data && (
          <>
            <Text size="xs" c="dimmed">
              Período de {dayjs(data.periodo.inicio).format("DD/MM/YYYY")} a{" "}
              {dayjs(data.periodo.fim).format("DD/MM/YYYY")} ({data.periodo.dias} dias), comparado a{" "}
              {dayjs(data.periodo.inicioAnterior).format("DD/MM/YYYY")} –{" "}
              {dayjs(data.periodo.fimAnterior).format("DD/MM/YYYY")}
            </Text>
            <Kpis acompanhantes={data.acompanhantes} contatos={data.contatos} />
            <Graficos serie={data.serie} ranking={data.ranking} />
            <Ranking ranking={data.ranking} periodo={data.periodo} />
            {data.reclamacoes && (
              <Reclamacoes reclamacoes={data.reclamacoes} ranking={data.ranking} />
            )}
          </>
        )}
      </Stack>
    </Stack>
  )
}

export default guardAdmin(RelatorioAcompanhantes)
