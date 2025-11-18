"use client"

import {
  Center,
  Grid,
  LoadingOverlay,
  Pagination,
  rem,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

import guardAccount from "@/guards/AccountGuard"
import { useFetch } from "@/hooks"
import { useAuth } from "@/providers/AuthProvider"
import { dateToHuman } from "@/utils"

function Eventos() {
  // Hooks
  const router = useRouter()
  const { isAuthenticated, permissionsData } = useAuth()

  // Constants
  const { permissions } = permissionsData || {}

  // States
  const [search, setSearch] = useState("")
  const [searchFilter, setSearchFilter] = useState("")
  const [evento, setEvento] = useState("")
  const [pagina, setPagina] = useState(1)

  // Fetch
  const { data, error } = useFetch([
    isAuthenticated === true ? "/admin/events" : null,
    { busca: searchFilter, pagina, evento },
  ])
  const { data: eventos = [], last_page } = data || {}
  const loading = !data && !error

  // Validations
  if (permissions?.find(item => item !== "s" && item !== "a")) return router.push("/")

  return (
    <Stack>
      <Title order={3}>Eventos</Title>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            placeholder="Buscar por mensagem"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            value={search}
            onChange={event => setSearch(event.target.value)}
            onBlur={event => setSearchFilter(event.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Select
            placeholder="Evento"
            data={[
              { value: "", label: "Todos" },
              { value: "whatsapp", label: "Whatsapp" },
              { value: "telefone", label: "Telefone" },
            ]}
            onChange={option => setEvento(option)}
          />
        </Grid.Col>
      </Grid>

      <Stack pos="relative">
        <LoadingOverlay
          visible={loading}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "pink", type: "bars" }}
        />
        <ScrollArea h={eventos.length > 15 ? "55vh" : "auto"} offsetScrollbars>
          <Table striped highlightOnHover withTableBorder miw={700}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Evento</Table.Th>
                <Table.Th>Mensagem</Table.Th>
                <Table.Th>URL</Table.Th>
                <Table.Th>Data Evento</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {eventos.length > 0 ? (
                eventos.map(row => {
                  return (
                    <Table.Tr key={row.id}>
                      <Table.Td>{row.id}</Table.Td>
                      <Table.Td>{row.evento}</Table.Td>
                      <Table.Td>{row.mensagem}</Table.Td>
                      <Table.Td>{row.url}</Table.Td>
                      <Table.Td>{row.created_at ? dateToHuman(row.created_at) : ""}</Table.Td>
                    </Table.Tr>
                  )
                })
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text fw={500} ta="center">
                      Nenhum evento encontrado
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
        {last_page > 1 && (
          <Center>
            <Pagination total={last_page} defaultValue={pagina} onChange={setPagina} />
          </Center>
        )}
      </Stack>
    </Stack>
  )
}

export default guardAccount(Eventos)
