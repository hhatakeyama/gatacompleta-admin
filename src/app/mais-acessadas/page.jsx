'use client'

import { Box, Center, Grid, LoadingOverlay, Pagination, rem, ScrollArea, Select, Stack, Table, Text, TextInput, Title } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import guardAccount from '@/guards/AccountGuard'
import { useFetch } from '@/hooks'
import { useAuth } from '@/providers/AuthProvider'

function MaisAcessadas() {
  // Hooks
  const router = useRouter()
  const { isAuthenticated, permissionsData } = useAuth()

  // Constants
  const { permissions } = permissionsData || {}

  // States
  const [search, setSearch] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [evento, setEvento] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [pagina, setPagina] = useState(1)

  // Fetch
  const { data, error } = useFetch([
    isAuthenticated === true ? '/admin/events/paginasMaisAcessadas' : null,
    { busca: searchFilter, evento, dataInicio, dataFim, pagina }
  ])
  const { data: paginasMaisAcessadas = [], last_page } = data || {}
  const loading = !data && !error

  // Validations
  if (permissions?.find(item => item !== 's' && item !== 'a')) return router.push('/')

  return (
    <Stack>
      <Title order={3}>Mais acessadas</Title>

      <Grid>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TextInput
            placeholder="Buscar por mensagem ou URL"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            value={search}
            onChange={event => setSearch(event.target.value)}
            onBlur={event => setSearchFilter(event.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <Select
            placeholder="Evento"
            data={[{ value: '', label: 'Todos' }, { value: 'whatsapp', label: 'Whatsapp' }, { value: 'telefone', label: 'Telefone' }]}
            onChange={option => setEvento(option)}
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TextInput
            placeholder="Data Início"
            type="date"
            value={dataInicio}
            onChange={event => setDataInicio(event.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TextInput
            placeholder="Data Fim"
            type="date"
            value={dataFim}
            onChange={event => setDataFim(event.target.value)}
          />
        </Grid.Col>
      </Grid>

      <Box pos="relative">
        <LoadingOverlay
          visible={loading}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />
        <ScrollArea h={paginasMaisAcessadas.length > 15 ? "55vh" : "auto"} offsetScrollbars>
          <Table
            striped
            highlightOnHover
            withTableBorder
            miw={700}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Evento</Table.Th>
                <Table.Th>Mensagem</Table.Th>
                <Table.Th>Acessos</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginasMaisAcessadas.length > 0 ? paginasMaisAcessadas.map((row) => {
                return (
                  <Table.Tr key={row.id}>
                    <Table.Td>{row.evento}</Table.Td>
                    <Table.Td>{row.url}</Table.Td>
                    <Table.Td>{row.count}</Table.Td>
                  </Table.Tr>
                )
              }) : (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text fw={500} ta="center">
                      Nenhum evento encontrado
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
            <Table.Tfoot>
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Center>
                    <Pagination total={last_page} defaultValue={pagina} onChange={setPagina} />
                  </Center>
                </Table.Td>
              </Table.Tr>
            </Table.Tfoot>
          </Table>
        </ScrollArea>
      </Box>
    </Stack>
  )
}

export default guardAccount(MaisAcessadas)
