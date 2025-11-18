"use client"

import { Card, Grid, Stack } from "@mantine/core"
import { useParams } from "next/navigation"
import React from "react"

import { FormAcompanhante } from "@/components/forms"
import { useFetch } from "@/hooks"
import { useAuth } from "@/providers/AuthProvider"

export default function Phones() {
  // Hooks
  const { isAuthenticated } = useAuth()
  const { acompanhanteId } = useParams()

  // Fetch
  const { data, mutate } = useFetch([
    isAuthenticated === true ? `/admin/acompanhantes/${acompanhanteId}` : null,
  ])

  return (
    <Stack>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Stack>
            {data?.telefones?.map(telefone => (
              <Card key={telefone.id} style={{ width: "100%" }}>
                <FormAcompanhante.Phones
                  acompanhanteId={data?.id}
                  phoneData={telefone}
                  onSuccess={() => mutate()}
                />
              </Card>
            ))}
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          Novo Telefone
          <Card>
            <FormAcompanhante.Phones acompanhanteId={data?.id} onSuccess={() => mutate()} />
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
