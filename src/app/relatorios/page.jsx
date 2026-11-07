"use client"

import { Card, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from "@mantine/core"
import { IconChartBar } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { guardAdmin } from "@/guards/RoleGuard"
import { useAuth } from "@/providers/AuthProvider"

const RELATORIOS = [
  {
    href: "/relatorios/acompanhantes",
    titulo: "Acompanhantes e contatos",
    descricao:
      "Acompanhantes ativas no site, ranking de ligações e WhatsApp, evolução diária e quem está sem contatos.",
    icone: IconChartBar,
  },
]

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

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {RELATORIOS.map(relatorio => (
          <Card
            key={relatorio.href}
            component={Link}
            href={relatorio.href}
            withBorder
            radius="md"
            padding="lg">
            <Group wrap="nowrap" align="flex-start">
              <ThemeIcon variant="light" color="pink" size="xl" radius="md">
                <relatorio.icone size={24} stroke={1.5} />
              </ThemeIcon>
              <div>
                <Text fw={600}>{relatorio.titulo}</Text>
                <Text size="sm" c="dimmed">
                  {relatorio.descricao}
                </Text>
              </div>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  )
}

export default guardAdmin(Relatorios)
