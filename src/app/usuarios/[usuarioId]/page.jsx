"use client"

import { Box, Group, Stack, Tabs, Text, Title } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconAt, IconUser } from "@tabler/icons-react"
import { useParams, useRouter } from "next/navigation"
import React, { useState } from "react"

import Active from "@/components/displayers/DisplayStatus/Active"
import { FormUsuario } from "@/components/forms"
import guardAccount from "@/guards/AccountGuard"
import { useFetch } from "@/hooks"
import { useAuth } from "@/providers/AuthProvider"

function Usuario() {
  // Hooks
  const { isAuthenticated } = useAuth()
  const { usuarioId } = useParams()
  const router = useRouter()

  // States
  const [tab, setTab] = useState("profile")

  // Fetch
  const { data, error, mutate } = useFetch([
    isAuthenticated === true ? `/admin/usuarios/${usuarioId}` : null,
  ])

  // Constants
  const tabs = [
    { id: "profile", label: "Perfil", icon: <IconUser style={{ height: 12, width: 12 }} /> },
  ]

  // Validations
  if (error?.response?.data?.message === "Unauthorized") {
    notifications.show({ title: "Erro", message: error?.response?.data?.message, color: "red" })
    return router.push("/")
  }

  return (
    <Stack>
      <Group wrap="nowrap">
        <Box>
          <Active status={data?.status} />
          <Title order={4}>
            {data?.id} - {data?.name}
          </Title>
          <Group wrap="nowrap" gap={10} mt={3}>
            <IconAt stroke={1.5} size="1rem" />
            <Text fz="xs" c="dimmed">
              {data?.email}
            </Text>
          </Group>
        </Box>
      </Group>

      <Tabs value={tab} onChange={setTab}>
        <Tabs.List mb="md">
          {tabs.map(item => (
            <Tabs.Tab key={item.id} value={item.id} leftSection={item.icon}>
              {item.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel value="profile">
          {data && tab === "profile" && <FormUsuario.Basic usuarioData={data} mutate={mutate} />}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}

export default guardAccount(Usuario)
