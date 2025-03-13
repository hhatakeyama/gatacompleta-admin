'use client'

import { Box, Button, Center, Divider, Group, LoadingOverlay, Modal, Pagination, ScrollArea, Stack, Table, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import Active from '@/components/displayers/DisplayStatus/Active'
import TipoAnuncio from '@/components/displayers/DisplayStatus/TipoAnuncio'
import { FormAnuncio } from '@/components/forms'
import guardAccount from '@/guards/AccountGuard'
import { useFetch } from '@/hooks'
import { useAuth } from '@/providers/AuthProvider'
import { api, dateToHuman } from '@/utils'

function Anuncios() {
  // Hooks
  const { isAuthenticated } = useAuth()

  // States
  const [pagina, setPagina] = useState(1)
  const [opened, setOpened] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [register, setRegister] = useState(false)

  // Fetch
  const { data, error, mutate } = useFetch([isAuthenticated === true ? '/admin/anuncios' : null, { pagina }])
  const { data: anuncios = [], last_page } = data || {}
  const loading = !data && !error

  // Actions
  const handleDelete = () => {
    setIsDeleting(true)
    if (opened?.id) {
      return api
        .delete(`/api/admin/anuncios/${opened.id}`)
        .then(response => {
          mutate?.()
          setOpened(null)
          showNotification({ title: 'Sucesso', message: response?.data?.message || 'Anúncio removido com sucesso!', color: 'green' })
        })
        .catch(response => {
          showNotification({
            title: 'Erro',
            message: response?.data?.message || 'Ocorreu um erro ao remover o anúncio. Tente novamente mais tarde.',
            color: 'red'
          })
        })
        .finally(() => setIsDeleting(false))
    }
  }

  return (
    <>
      <Stack mb="sm">
        <Group justify="space-between">
          <Title order={3}>Anúncios</Title>

          <Button onClick={() => setRegister(true)}>Novo Anúncio</Button>
        </Group>
      </Stack>

      <Stack pos="relative">
        <LoadingOverlay
          visible={loading}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />
        <ScrollArea h={anuncios.length > 15 ? "55vh" : "auto"} offsetScrollbars>
          <Table
            striped
            highlightOnHover
            withTableBorder
            miw={700}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Foto</Table.Th>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Início / Fim</Table.Th>
                <Table.Th>Mostrar</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Ativo</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {anuncios.length > 0 ? anuncios?.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td>{row.id}</Table.Td>
                  <Table.Td>
                    <Image alt="" src={`${process.env.NEXT_PUBLIC_API_DOMAIN}/storage/premium/${row.foto}`} width={80} height={30} />
                  </Table.Td>
                  <Table.Td>{row.acompanhante?.nome}</Table.Td>
                  <Table.Td>
                    {row.data_inicio ? dateToHuman(row.data_inicio, 'date') : ''}{' '}
                    ~ {row.data_fim ? dateToHuman(row.data_fim, 'date') : ''}
                  </Table.Td>
                  <Table.Td>
                    {row.cidade ? `${row.cidade?.nome} / ${row.estado_id}` : 'Home'}
                  </Table.Td>
                  <Table.Td><TipoAnuncio status={row.tipo} /></Table.Td>
                  <Table.Td><Active status={row.status} /></Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button size="compact-sm" component={Link} color="orange" title="Editar" href={`/anuncios/${row.id}`}>Editar</Button>
                      <Button size="compact-sm" color="red" title="Desativar" disabled={isDeleting} onClick={() => setOpened(row)}>Excluir</Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              )) : (
                <Table.Tr>
                  <Table.Td colSpan={9}>
                    <Text fw={500} ta="center">
                      Nenhuma acompanhante anunciando encontrada
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

      <Modal opened={register} onClose={() => setRegister(false)} title="Cadastrar categoria" centered size="xl">
        <FormAnuncio.Basic
          onClose={() => {
            setRegister(false)
            mutate()
          }}
        // onCallback={response => {
        //   if (response?.data?.id) router.push(`/anuncios/${response.data.id}`)
        // }}
        />
      </Modal>
      <Modal centered opened={!!opened} onClose={() => setOpened(null)} title="Excluir anúncio">
        <Stack>
          <Text>Tem certeza que deseja excluir o anúncio <strong>{opened?.id}</strong>?</Text>
          <Box>
            <Button color="red" onClick={handleDelete}>Excluir</Button>
          </Box>
        </Stack>
      </Modal>
    </>
  )
}

export default guardAccount(Anuncios)
