'use client'

import { Button, Center, Grid, Group, LoadingOverlay, Pagination, rem, ScrollArea, Stack, Table, Text, TextInput, Title } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import Active from '@/components/displayers/DisplayStatus/Active'
import guardAccount from '@/guards/AccountGuard'
import { useFetch } from '@/hooks'
import { useAuth } from '@/providers/AuthProvider'
import { dateToHuman } from '@/utils'

function Usuarios() {
  // Hooks
  const router = useRouter()
  const { isAuthenticated, permissionsData } = useAuth()

  // Constants
  const { permissions } = permissionsData || {}

  // States
  const [search, setSearch] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [pagina, setPagina] = useState(1)

  // Fetch
  const { data, error } = useFetch([
    isAuthenticated === true ? '/admin/usuarios' : null,
    { busca: searchFilter, pagina }
  ])
  const { data: usuarios = [], last_page } = data || {}
  const loading = !data && !error

  // Validations
  if (permissions?.find(item => item !== 's' && item !== 'a'))
    return router.push('/')

  return (
    <Stack>
      <Title order={3}>Usuários</Title>

      <Grid>
        <Grid.Col span={{ xs: 12, sm: 6 }}>
          <TextInput
            placeholder="Buscar por nome ou e-mail"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            value={search}
            onChange={event => setSearch(event.target.value)}
            onBlur={event => setSearchFilter(event.target.value)}
          />
        </Grid.Col>
      </Grid>

      <Stack pos="relative">
        <LoadingOverlay
          visible={loading}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />
        <ScrollArea h={usuarios.length > 15 ? "55vh" : "auto"} offsetScrollbars>
          <Table
            striped
            highlightOnHover
            withTableBorder
            miw={700}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Nome</Table.Th>
                <Table.Th>E-mail</Table.Th>
                <Table.Th>Ativo</Table.Th>
                <Table.Th>Data Cadastro</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {usuarios.length > 0 ? usuarios.map((row) => {
                return (
                  <Table.Tr key={row.id}>
                    <Table.Td>{row.id}</Table.Td>
                    <Table.Td>{row.name}</Table.Td>
                    <Table.Td>{row.email}</Table.Td>
                    <Table.Td><Active status={row.status} /></Table.Td>
                    <Table.Td>{row.created_at ? dateToHuman(row.created_at) : ''}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Button size="compact-sm" component={Link} color="orange" title="Editar" href={`/usuarios/${row.id}`}>Editar</Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                )
              }) : (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text fw={500} ta="center">
                      Nenhum usuário encontrado
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

export default guardAccount(Usuarios)
