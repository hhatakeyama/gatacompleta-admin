import { Anchor, Badge, Group, Paper, ScrollArea, Table, Text, Title } from "@mantine/core"
import dayjs from "dayjs"
import Link from "next/link"
import { useMemo } from "react"

import { numero, SITUACOES } from "./constantes"
import Variacao from "./Variacao"

// Acompanhantes que receberam reclamações (problemas relatados pelo site) no período
export default function Reclamacoes({ reclamacoes, ranking }) {
  const linhas = useMemo(
    () =>
      ranking
        .filter(item => item.reclamacoes > 0)
        .sort(
          (a, b) =>
            b.reclamacoes - a.reclamacoes ||
            (b.ultimaReclamacao || "").localeCompare(a.ultimaReclamacao || ""),
        ),
    [ranking],
  )

  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" align="flex-start" mb="md">
        <div>
          <Title order={5}>Reclamações</Title>
          <Text size="xs" c="dimmed">
            Problemas relatados pelos visitantes no perfil da acompanhante (anônimos)
          </Text>
        </div>
        <div>
          <Group gap="xs" justify="flex-end" align="flex-end">
            <Text fw={700} fz={22} lh={1.1}>
              {numero(reclamacoes.total)}
            </Text>
            <Variacao atual={reclamacoes.total} anterior={reclamacoes.anterior} inverter />
          </Group>
          <Text size="xs" c="dimmed" ta="right">
            {numero(reclamacoes.anterior)} no período anterior
            {reclamacoes.semIdentificacao > 0 &&
              ` · ${numero(reclamacoes.semIdentificacao)} sem perfil identificado`}
          </Text>
        </div>
      </Group>

      <ScrollArea offsetScrollbars>
        <Table striped highlightOnHover withTableBorder miw={600} verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Cidade</Table.Th>
              <Table.Th>Situação</Table.Th>
              <Table.Th ta="right">Reclamações</Table.Th>
              <Table.Th>Última</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {!linhas.length && (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text fw={500} ta="center">
                    Nenhuma reclamação no período
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
            {linhas.map(item => {
              const situacao = SITUACOES[item.situacao] || { label: item.situacao, color: "gray" }
              return (
                <Table.Tr key={item.id}>
                  <Table.Td>
                    <Anchor
                      component={Link}
                      href={`/acompanhantes/${item.user_id}?aba=reclamacoes`}
                      size="sm"
                      fw={500}>
                      {item.nome}
                    </Anchor>
                  </Table.Td>
                  <Table.Td>{item.cidade || "—"}</Table.Td>
                  <Table.Td>
                    <Badge size="sm" variant="light" color={situacao.color}>
                      {situacao.label}
                    </Badge>
                  </Table.Td>
                  <Table.Td ta="right" fw={700}>
                    {numero(item.reclamacoes)}
                  </Table.Td>
                  <Table.Td style={{ whiteSpace: "nowrap" }}>
                    {dayjs(item.ultimaReclamacao).format("DD/MM/YYYY HH:mm")}
                  </Table.Td>
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <Text size="xs" c="dimmed" mt="sm">
        {numero(reclamacoes.acompanhantes)} acompanhante(s) com reclamação no período
      </Text>
    </Paper>
  )
}
