"use client"

import { Stack, Text, Title } from "@mantine/core"
import { useRouter } from "next/navigation"

import { guardAdmin } from "@/guards/RoleGuard"
import { useAuth } from "@/providers/AuthProvider"

function Relatorios() {
  // Hooks
  const router = useRouter()
  const { permissionsData } = useAuth()

  // Constants
  const { permissions } = permissionsData || {}

  // Validations
  if (permissions?.find(item => item !== "s" && item !== "a")) return router.push("/")

  return (
    <Stack>
      <Title order={3}>Relatórios</Title>

      <Text>Em Breve</Text>
    </Stack>
  )
}

export default guardAdmin(Relatorios)
