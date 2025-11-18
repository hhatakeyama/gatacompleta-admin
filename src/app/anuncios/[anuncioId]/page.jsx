"use client"

import { Box, Button, Group, Stack, Tabs, Title } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconSpeakerphone } from "@tabler/icons-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import React, { useState } from "react"

import Active from "@/components/displayers/DisplayStatus/Active"
import { FormAnuncio } from "@/components/forms"
import guardAccount from "@/guards/AccountGuard"
import { useFetch } from "@/hooks"
import { useAuth } from "@/providers/AuthProvider"

function Acompanhante() {
  // Hooks
  const { isAuthenticated } = useAuth()
  const { anuncioId } = useParams()
  const router = useRouter()

  // States
  const [tab, setTab] = useState("advertising")

  // Fetch
  const { data, error, mutate } = useFetch([
    isAuthenticated === true ? `/admin/anuncios/${anuncioId}` : null,
  ])

  // Constants
  const tabs = [
    {
      id: "advertising",
      label: "Anúncio",
      icon: <IconSpeakerphone style={{ height: 12, width: 12 }} />,
    },
  ]

  // Effects
  if (error?.response?.data?.message === "Unauthorized") {
    notifications.show({ title: "Erro", message: error?.response?.data?.message, color: "red" })
    return router.push("/")
  }

  return (
    <Stack>
      <Group align="flex-start" justify="space-between" wrap="nowrap">
        <Box>
          <Active status={data?.status} />
          <Title order={4}>{data?.acompanhante?.nome}</Title>
        </Box>

        <Button component={Link} href="/anuncios">
          Voltar
        </Button>
      </Group>

      <Tabs value={tab} onChange={setTab}>
        <Tabs.List mb="md">
          {tabs.map(item => (
            <Tabs.Tab key={item.id} value={item.id} leftSection={item.icon}>
              {item.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel value="advertising">
          {data && tab === "advertising" && (
            <FormAnuncio.Basic anuncioData={data} mutate={mutate} />
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}

export default guardAccount(Acompanhante)
