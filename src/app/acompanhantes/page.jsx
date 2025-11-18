"use client"

import {
  Box,
  Button,
  Center,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  Pagination,
  rem,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { IconExternalLink, IconSearch } from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

import Active from "@/components/displayers/DisplayStatus/Active"
import { FormAcompanhante } from "@/components/forms"
import guardAccount from "@/guards/AccountGuard"
import { useFetch } from "@/hooks"
import { useAuth } from "@/providers/AuthProvider"
import { api, dateToHuman } from "@/utils"

function Acompanhantes() {
  // Hooks
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // States
  const [pagina, setPagina] = useState(1)
  const [search, setSearch] = useState("")
  const [searchFilter, setSearchFilter] = useState("")
  const [opened, setOpened] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [register, setRegister] = useState(false)

  // Fetch
  const { data, error, mutate } = useFetch([
    isAuthenticated === true ? "/admin/acompanhantes" : null,
    { busca: searchFilter, pagina },
  ])
  const { data: acompanhantes = [], last_page } = data || {}
  const loading = !data && !error

  // Actions
  const handleChangeOrdem = (acompanhanteId, value) => {
    return api
      .patch(`/api/admin/acompanhantes/${acompanhanteId}/ordem`, { ordem: value })
      .then(response => {
        mutate()
        showNotification({
          title: "Sucesso",
          message: response?.message || "Ordem da acompanhante atualizada com sucesso!",
          color: "green",
        })
      })
      .catch(response => {
        showNotification({
          title: "Erro",
          message:
            response?.message ||
            "Ocorreu um erro ao atualizar ordem da acompanhante. Tente novamente mais tarde.",
          color: "red",
        })
      })
  }

  const handleDelete = () => {
    setIsDeleting(true)
    if (opened?.user_id) {
      return api
        .delete(`/api/admin/acompanhantes/${opened.user_id}`)
        .then(response => {
          mutate?.()
          setOpened(null)
          showNotification({
            title: "Sucesso",
            message: response?.data?.message || "Acompanhante desativada com sucesso!",
            color: "green",
          })
        })
        .catch(response => {
          showNotification({
            title: "Erro",
            message:
              response?.data?.message ||
              "Ocorreu um erro ao desativar acompanhante. Tente novamente mais tarde.",
            color: "red",
          })
        })
        .finally(() => setIsDeleting(false))
    }
  }

  return (
    <>
      <Stack mb="sm">
        <Group justify="space-between">
          <Title order={3}>Acompanhantes</Title>
          <Button onClick={() => setRegister(true)}>Nova Acompanhante</Button>
        </Group>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              placeholder="Buscar por nome ou e-mail"
              leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              value={search}
              onChange={event => setSearch(event.target.value)}
              onBlur={event => {
                setPagina(1)
                setSearchFilter(event.target.value)
              }}
            />
          </Grid.Col>
        </Grid>
      </Stack>

      <Stack pos="relative">
        <LoadingOverlay
          visible={loading}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "pink", type: "bars" }}
        />
        <ScrollArea h={acompanhantes.length > 15 ? "55vh" : "auto"} offsetScrollbars>
          <Table striped highlightOnHover withTableBorder miw={700}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Foto</Table.Th>
                <Table.Th>Acompanhante</Table.Th>
                <Table.Th>Status / Expira em</Table.Th>
                <Table.Th>Ordem</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {acompanhantes.length > 0 ? (
                acompanhantes?.map(row => {
                  const expira = row.periodoAtual?.data_fim
                    ? new Date(row.periodoAtual.data_fim)
                    : false
                  // const aviso = new Date("Y-m-d")
                  // const dataFim = new Date("d/m/Y")
                  // if (expira) {
                  //   aviso = date("Y-m-d", strtotime('-7 day', strtotime(expira)))
                  //   const dataFimArray = expira.split("-")
                  //   dataFim = dataFimArray[2] + "/" + dataFimArray[1] + "/" + dataFimArray[0]
                  // }
                  let texto = ""
                  if (row.telefones?.[0] && row.url) {
                    const whatsapp = row.telefones[0].numero
                    const dataInicio = dateToHuman(row.created_at)
                    texto = `Olá ${row.nome}, aqui é o Rodrigo do time do site Gata Completa.\n
                  Você tem um anúncio conosco ativo desde ${dataInicio} e o motivo do contato é para saber se você ainda está realizando serviços como acompanhante.\n\n
            
                  Os dados do seu anúncio são:\n
                    Link: ${row.url}\n\n
            
                  Cidade Atual: ${row.cidadeAtual}\n
                    WhatsApp: ${whatsapp}\n\n
            
                  Os dados acima estão corretos? Precisa alterar algo?\n\n
                  
                  Obrigado por sua atenção.`
                  }
                  const fotoDestaque =
                    row.fotoDestaque && row.fotoDestaque.length > 0
                      ? row.fotoDestaque[0].path + "/210x314-" + row.fotoDestaque[0].nome
                      : row.fotos && row.fotos.length > 0
                        ? row.fotos[0].path + "/210x314-" + row.fotos[0].nome
                        : "/img/sem-foto.jpg"
                  return (
                    <Table.Tr key={row.user_id}>
                      <Table.Td>{row.user_id}</Table.Td>
                      <Table.Td>
                        <Image
                          alt=""
                          src={`${process.env.NEXT_PUBLIC_API_DOMAIN}${fotoDestaque}`}
                          width={54}
                          height={80}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Box display="flex" style={{ alignItems: "center", gap: "5px" }}>
                          {row.nome}
                          {row.url ? (
                            <a
                              href={row.url}
                              style={{ display: "flex" }}
                              target="_blank"
                              rel="noreferrer">
                              <IconExternalLink size="18" />
                            </a>
                          ) : null}
                        </Box>
                        {row.usuario.email}
                      </Table.Td>
                      <Table.Td>
                        <Box>
                          <Active status={row.status} />
                        </Box>
                        {expira ? dateToHuman(expira) : ""}
                      </Table.Td>
                      <Table.Td>
                        <TextInput
                          defaultValue={row.ordem}
                          placeholder="Ordem"
                          w="100px"
                          onBlur={e => {
                            const { value } = e.target || {}
                            if (Number(value) !== Number(row.ordem))
                              handleChangeOrdem(row.user_id, value)
                          }}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          {row.whatsapp && row.url && (
                            <Button
                              size="compact-sm"
                              component="a"
                              color="green"
                              title="WhatsApp"
                              href={`https://wa.me/+55${row.whatsapp}?text=${texto}`}>
                              WhatsApp
                            </Button>
                          )}
                          <Button
                            size="compact-sm"
                            component={Link}
                            color="blue"
                            title="Agenda"
                            href={`/acompanhantes/${row.user_id}/agendas`}>
                            Agenda
                          </Button>
                          <Button
                            size="compact-sm"
                            component={Link}
                            color="orange"
                            title="Editar"
                            href={`/acompanhantes/${row.user_id}`}>
                            Editar
                          </Button>
                          {row.status === "1" && (
                            <Button
                              size="compact-sm"
                              color="red"
                              title="Desativar"
                              disabled={isDeleting}
                              onClick={() => setOpened(row)}>
                              Desativar
                            </Button>
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  )
                })
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text fw={500} ta="center">
                      Nenhuma acompanhante encontrada
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

      <Modal
        opened={register}
        onClose={() => setRegister(false)}
        title="Cadastrar categoria"
        centered
        size="xl">
        <FormAcompanhante.Basic
          onClose={() => {
            setRegister(false)
            mutate()
          }}
          onCallback={response => {
            if (response?.data?.id) router.push(`/acompanhantes/${response.data.id}`)
          }}
        />
      </Modal>
      <Modal
        centered
        opened={!!opened}
        onClose={() => setOpened(null)}
        title="Desativar acompanhante">
        <Stack>
          <Text>
            Tem certeza que deseja desativar a acompanhante <strong>{opened?.nome}</strong>?
          </Text>
          <Box>
            <Button color="red" onClick={handleDelete}>
              Desativar
            </Button>
          </Box>
        </Stack>
      </Modal>
    </>
  )
}

export default guardAccount(Acompanhantes)
