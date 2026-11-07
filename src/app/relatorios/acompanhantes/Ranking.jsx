import {
  Anchor,
  Badge,
  Button,
  Center,
  Grid,
  Group,
  Pagination,
  Paper,
  rem,
  ScrollArea,
  SegmentedControl,
  Table,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core"
import { IconChevronDown, IconChevronUp, IconDownload, IconSearch, IconSelector } from "@tabler/icons-react"
import dayjs from "dayjs"
import Link from "next/link"
import { useMemo, useState } from "react"

import { stringCompare } from "@/utils"

import { numero, SITUACOES, variacao } from "./constantes"
import Variacao from "./Variacao"

const POR_PAGINA = 25

const FILTROS = [
  { value: "ativas", label: "Ativas no site" },
  { value: "semContato", label: "Ativas sem contato" },
  { value: "comContato", label: "Com contato" },
  { value: "todas", label: "Todas" },
]

const filtrar = {
  ativas: item => item.ativaNoSite,
  semContato: item => item.ativaNoSite && item.total === 0,
  comContato: item => item.total > 0,
  todas: () => true,
}

const valorOrdenacao = {
  nome: item => item.nome || "",
  cidade: item => item.cidade || "",
  whatsapp: item => item.whatsapp,
  telefone: item => item.telefone,
  total: item => item.total,
  variacao: item => variacao(item.total, item.totalAnterior) ?? -Infinity,
  ultimoContato: item => item.ultimoContato || "",
}

function Th({ children, campo, ordenacao, setOrdenacao, ta }) {
  const ativo = ordenacao.campo === campo
  const Icone = ativo ? (ordenacao.desc ? IconChevronDown : IconChevronUp) : IconSelector

  return (
    <Table.Th
      ta={ta}
      aria-sort={ativo ? (ordenacao.desc ? "descending" : "ascending") : undefined}
      style={{ whiteSpace: "nowrap" }}>
      <UnstyledButton
        onClick={() =>
          setOrdenacao(atual => ({ campo, desc: atual.campo === campo ? !atual.desc : true }))
        }>
        <Group gap={4} wrap="nowrap" justify={ta === "right" ? "flex-end" : "flex-start"}>
          <Text fw={700} size="sm">
            {children}
          </Text>
          <Icone style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
        </Group>
      </UnstyledButton>
    </Table.Th>
  )
}

function exportarCsv(linhas, periodo) {
  const cabecalho = ["Nome", "Cidade", "Situação", "Ativa no site", "Agenda até", "WhatsApp", "Telefone", "Total", "Período anterior", "Último contato"]
  const celula = valor => `"${String(valor ?? "").replace(/"/g, "\"\"")}"`
  const conteudo = [
    cabecalho,
    ...linhas.map(item => [
      item.nome,
      item.cidade,
      SITUACOES[item.situacao]?.label || item.situacao,
      item.ativaNoSite ? "Sim" : "Não",
      item.agendaFim ? dayjs(item.agendaFim).format("DD/MM/YYYY") : "",
      item.whatsapp,
      item.telefone,
      item.total,
      item.totalAnterior,
      item.ultimoContato ? dayjs(item.ultimoContato).format("DD/MM/YYYY HH:mm") : "",
    ]),
  ]
    .map(linha => linha.map(celula).join(";"))
    .join("\n")

  const url = URL.createObjectURL(new Blob([`﻿${conteudo}`], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = `contatos-acompanhantes_${periodo.inicio}_${periodo.fim}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function Ranking({ ranking, periodo }) {
  // States
  const [busca, setBusca] = useState("")
  const [filtro, setFiltro] = useState("ativas")
  const [ordenacao, setOrdenacao] = useState({ campo: "total", desc: true })
  const [pagina, setPagina] = useState(1)

  // Constants
  const linhas = useMemo(() => {
    const valor = valorOrdenacao[ordenacao.campo]
    return ranking
      .filter(filtrar[filtro])
      .filter(item => !busca || stringCompare(item.nome || "", busca) || stringCompare(item.cidade || "", busca))
      .sort((a, b) => {
        const [va, vb] = [valor(a), valor(b)]
        const comparacao = typeof va === "string" ? va.localeCompare(vb, "pt-BR") : va - vb
        return ordenacao.desc ? -comparacao : comparacao
      })
  }, [ranking, filtro, busca, ordenacao])
  const totalPaginas = Math.ceil(linhas.length / POR_PAGINA)
  const paginaAtual = Math.min(pagina, Math.max(totalPaginas, 1))
  const visiveis = linhas.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)
  const thProps = { ordenacao, setOrdenacao }

  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" mb="md">
        <div>
          <Title order={5}>Contatos por acompanhante</Title>
          <Text size="xs" c="dimmed">
            Variação comparada ao período anterior de mesma duração
          </Text>
        </div>
        <Button
          variant="light"
          size="xs"
          leftSection={<IconDownload size={16} />}
          disabled={!linhas.length}
          onClick={() => exportarCsv(linhas, periodo)}>
          Exportar CSV
        </Button>
      </Group>

      <Grid mb="sm">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <ScrollArea type="never">
            <SegmentedControl
              data={FILTROS}
              value={filtro}
              onChange={valor => {
                setFiltro(valor)
                setPagina(1)
              }}
            />
          </ScrollArea>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <TextInput
            placeholder="Buscar por nome ou cidade"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            value={busca}
            onChange={event => {
              setBusca(event.target.value)
              setPagina(1)
            }}
          />
        </Grid.Col>
      </Grid>

      <ScrollArea offsetScrollbars>
        <Table striped highlightOnHover withTableBorder miw={900} verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={40}>#</Table.Th>
              <Th campo="nome" {...thProps}>Nome</Th>
              <Th campo="cidade" {...thProps}>Cidade</Th>
              <Table.Th>Situação</Table.Th>
              <Th campo="whatsapp" ta="right" {...thProps}>WhatsApp</Th>
              <Th campo="telefone" ta="right" {...thProps}>Telefone</Th>
              <Th campo="total" ta="right" {...thProps}>Total</Th>
              <Th campo="variacao" ta="right" {...thProps}>Variação</Th>
              <Th campo="ultimoContato" {...thProps}>Último contato</Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {!visiveis.length && (
              <Table.Tr>
                <Table.Td colSpan={9}>
                  <Text fw={500} ta="center">
                    Nenhuma acompanhante encontrada
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
            {visiveis.map((item, indice) => {
              const situacao = SITUACOES[item.situacao] || { label: item.situacao, color: "gray" }
              return (
                <Table.Tr key={item.id}>
                  <Table.Td c="dimmed">{(paginaAtual - 1) * POR_PAGINA + indice + 1}</Table.Td>
                  <Table.Td>
                    <Anchor component={Link} href={`/acompanhantes/${item.user_id}`} size="sm" fw={500}>
                      {item.nome}
                    </Anchor>
                  </Table.Td>
                  <Table.Td>{item.cidade || "—"}</Table.Td>
                  <Table.Td>
                    <Group gap={4} wrap="nowrap">
                      <Badge size="sm" variant="light" color={situacao.color}>
                        {situacao.label}
                      </Badge>
                      {item.situacao === "ativa" && (
                        <Badge size="sm" variant="outline" color={item.ativaNoSite ? "teal" : "orange"}>
                          {item.ativaNoSite
                            ? `Agenda até ${dayjs(item.agendaFim).format("DD/MM")}`
                            : "Sem agenda"}
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td ta="right">{numero(item.whatsapp)}</Table.Td>
                  <Table.Td ta="right">{numero(item.telefone)}</Table.Td>
                  <Table.Td ta="right" fw={700}>
                    {numero(item.total)}
                  </Table.Td>
                  <Table.Td>
                    <Group justify="flex-end">
                      <Variacao atual={item.total} anterior={item.totalAnterior} />
                    </Group>
                  </Table.Td>
                  <Table.Td style={{ whiteSpace: "nowrap" }}>
                    {item.ultimoContato ? dayjs(item.ultimoContato).format("DD/MM/YYYY HH:mm") : "—"}
                  </Table.Td>
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <Group justify="space-between" mt="sm">
        <Text size="xs" c="dimmed">
          {numero(linhas.length)} acompanhante(s)
        </Text>
        {totalPaginas > 1 && (
          <Center>
            <Pagination total={totalPaginas} value={paginaAtual} onChange={setPagina} size="sm" />
          </Center>
        )}
      </Group>
    </Paper>
  )
}
