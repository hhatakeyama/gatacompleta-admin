'use client'

import { Button, Center, Chip, Container, Group, Loader, rem, ScrollArea, Table, Text, TextInput, UnstyledButton } from '@mantine/core'
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { useFetch } from '@/hooks'
import { useAuth } from '@/providers/AuthProvider'

import classes from './TableSort.module.css';

export default function Acompanhantes() {
  // Hooks
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // States
  const [search, setSearch] = useState('')
  const [acompanhantes, setAcompanhantes] = useState([]);

  // Fetch
  const { data } = useFetch([isAuthenticated ? '/admin/acompanhantes/' : null, { busca: search }])

  // Effects
  useEffect(() => {
    if (isAuthenticated === false) return router.push('/')
  }, [isAuthenticated, router])

  useEffect(() => {
    setAcompanhantes(data?.data)
  }, [data])

  if (isAuthenticated === null) return <Center style={{ height: '400px' }}><Loader color="blue" /></Center>;

  function Th({ children }) {
    return (
      <Table.Th width="auto" className={classes.th}>
        <Text fw={500} fz="sm">
          {children}
        </Text>
      </Table.Th>
    );
  }

  const rows = acompanhantes?.map((row) => {
    const expira = row.periodos[row.periodos.length - 1] ? new Date(row.periodos[row.periodos.length - 1].data_fim) : false;
    // const aviso = new Date("Y-m-d");
    // const dataFim = new Date("d/m/Y");
    // if (expira) {
    //   aviso = date("Y-m-d", strtotime('-7 day', strtotime(expira)));
    //   const dataFimArray = expira.split("-");
    //   dataFim = dataFimArray[2] + "/" + dataFimArray[1] + "/" + dataFimArray[0];
    // }
    let texto = '';
    if (row?.telefones && row.telefones.length > 0 && row.telefones[0] && row.url) {
      const whatsapp = row.telefones[0].numero;
      // $dataInicio = date_format(row.created_at, "d/m/Y");
      texto = `Olá ${row.nome}, aqui é o Rodrigo do time do site Gata Completa.\n
      Você tem um anúncio conosco ativo desde $dataInicio e o motivo do contato é para saber se você ainda está realizando serviços como acompanhante.\n\n

      Os dados do seu anúncio são:\n
        Link: ${row.url}\n\n

      Cidade Atual: ${row.cidadeAtual}\n
        WhatsApp: ${whatsapp}\n\n

      Os dados acima estão corretos? Precisa alterar algo?\n\n
      
      Obrigado por sua atenção.`;
    }
    const fotoDestaque = row.fotoDestaque && row.fotoDestaque.length > 0 ?
      row.fotoDestaque[0].path + '/210x314-' + row.fotoDestaque[0].nome : (row.fotos && row.fotos.length > 0 ? row.fotos[0].path + '/210x314-' + row.fotos[0].nome : '/img/sem-foto.jpg')
    return (
      <Table.Tr key={row.id} className={classes.tr}>
        <Table.Td className={classes.td}>{row.id}</Table.Td>
        <Table.Td className={classes.td}><Image alt="" src={"https://admin.gatacompleta.com" + fotoDestaque} width={54} height={80} /></Table.Td>
        <Table.Td className={classes.td}>{row.nome}</Table.Td>
        <Table.Td className={classes.td}>{row.usuario.email}</Table.Td>
        <Table.Td className={classes.td}>
          {row.status === '1' ? (
            <Chip size="sm" color="green" defaultChecked>Ativo</Chip>
          ) : (
            <Chip size="sm" color="red" defaultChecked>Inativo</Chip>
          )}
        </Table.Td>
        <Table.Td className={classes.td}>{expira?.toLocaleDateString?.()}</Table.Td>
        <Table.Td className={classes.td}>{row.ordem}</Table.Td>
        <Table.Td className={classes.td}>
          {row.whatsapp && row.url &&
            <Button size="compact-sm" component="a" color="green" title="WhatsApp" href={`https://wa.me/+55${row.whatsapp}?text=${texto}`}>WhatsApp</Button>
          }
          <Button size="compact-sm" component="a" color="blue" title="Agenda" href={`/acompanhantes/${row.id}/agenda`}>Agenda</Button>
          <Button size="compact-sm" component="a" color="orange" title="Editar" href={`/acompanhantes/${row.id}`}>Editar</Button>
          <Button size="compact-sm" color="red" title="Excluir" onClick={() => { }}>Excluir</Button>
        </Table.Td>
      </Table.Tr >
    )
  }) || [];

  return (
    <Container size="xl">
      <ScrollArea>
        <TextInput
          placeholder="Buscar por nome ou e-mail"
          mb="md"
          leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          value={search}
          onChange={event => setSearch(event.target.value)}
        />
        <Table horizontalSpacing="xs" verticalSpacing="xs" miw={700}>
          <Table.Tbody>
            <Table.Tr>
              <Th>ID</Th>
              <Th>Foto</Th>
              <Th>Nome</Th>
              <Th>E-mail</Th>
              <Th>Ativo</Th>
              <Th>Expira em</Th>
              <Th>Ordem</Th>
              <Th>Ações</Th>
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text fw={500} ta="center">
                    Nenhuma acompanhante encontrada
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Container>
  )
}
