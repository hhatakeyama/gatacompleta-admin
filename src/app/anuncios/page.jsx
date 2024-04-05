'use client'

import { Box, Button, Center, Container, Divider, Group, LoadingOverlay, Modal, Pagination, ScrollArea, Stack, Table, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import Active from '@/components/displayers/DisplayStatus/Active'
import TipoAnuncio from '@/components/displayers/DisplayStatus/TipoAnuncio'
import { FormAnuncio } from '@/components/forms'
import guardAccount from '@/guards/AccountGuard'
import { useFetch } from '@/hooks'
import { useAuth } from '@/providers/AuthProvider'
import { api, dateToHuman } from '@/utils'

import classes from './Anuncios.module.css'

function Anuncios() {
  // Hooks
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // States
  const [pagina, setPagina] = useState(1)
  const [opened, setOpened] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [register, setRegister] = useState(false)

  // Fetch
  const { data, error, mutate } = useFetch([isAuthenticated ? '/admin/anuncios' : null, { pagina }])
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

  function Th({ children }) {
    return (
      <Table.Th width="auto" className={classes.th}>
        {children}
      </Table.Th>
    )
  }

  return (
    <>
      <Container size="100%" mb="50px">
        <Stack mb="md">
          <Group justify="space-between">
            <Text>Anúncios</Text>

            <Button onClick={() => setRegister(true)}>Adicionar Anúncio</Button>
          </Group>
          <Divider />
        </Stack>

        <Stack pos="relative">
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
            loaderProps={{ type: 'bars' }}
          />
          <ScrollArea h={anuncios.length > 15 ? "55vh" : "auto"} offsetScrollbars>
            <Table horizontalSpacing="xs" verticalSpacing="xs" miw={700}>
              <Table.Tbody>
                <Table.Tr>
                  <Th>ID</Th>
                  <Th>Foto</Th>
                  <Th>Nome</Th>
                  <Th>Data Início</Th>
                  <Th>Data Fim</Th>
                  <Th>Mostrar</Th>
                  <Th>Tipo</Th>
                  <Th>Ativo</Th>
                  <Th>Ações</Th>
                </Table.Tr>
              </Table.Tbody>
              <Table.Tbody>
                {anuncios.length > 0 ? anuncios?.map((row) => (
                  <Table.Tr key={row.id} className={classes.tr}>
                    <Table.Td className={classes.td}>{row.id}</Table.Td>
                    <Table.Td className={classes.td}>
                      <Image alt="" src={`${process.env.NEXT_PUBLIC_API_DOMAIN}/storage/premium/${row.foto}`} width={80} height={30} />
                    </Table.Td>
                    <Table.Td className={classes.td}>{row.acompanhante?.nome}</Table.Td>
                    <Table.Td className={classes.td}>{row.data_inicio ? dateToHuman(row.data_inicio, 'date') : ''}</Table.Td>
                    <Table.Td className={classes.td}>{row.data_fim ? dateToHuman(row.data_fim, 'date') : ''}</Table.Td>
                    <Table.Td className={classes.td}>
                      {row.cidade ? `${row.cidade?.nome} / ${row.estado_id}` : 'Home'}
                    </Table.Td>
                    <Table.Td className={classes.td}><TipoAnuncio status={row.tipo} /></Table.Td>
                    <Table.Td className={classes.td}><Active status={row.status} /></Table.Td>
                    <Table.Td className={classes.td}>
                      <Group gap="xs">
                        <Button size="compact-sm" component="a" color="orange" title="Editar" href={`/anuncios/${row.id}`}>Editar</Button>
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
      </Container>

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
