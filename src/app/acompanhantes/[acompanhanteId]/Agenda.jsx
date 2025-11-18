"use client"

import { Box, Button, Card, Grid, Modal, Stack } from "@mantine/core"
import React, { useState } from "react"

import { FormAcompanhante } from "@/components/forms"

export default function Agenda({ acompanhanteData, mutate }) {
  // States
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Stack>
        <Box>
          <Button onClick={() => setOpened(true)}>Adicionar Agenda</Button>
        </Box>
        {acompanhanteData?.periodos.length > 0 && (
          <Grid>
            {acompanhanteData?.periodos?.map(periodo => (
              <Grid.Col key={periodo.id} span={{ base: 12, lg: 6 }}>
                <Card style={{ width: "100%" }}>
                  <FormAcompanhante.Agenda
                    acompanhanteData={acompanhanteData}
                    agendaData={periodo}
                    onSuccess={() => mutate()}
                  />
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Stack>
      <Modal centered opened={opened} onClose={() => setOpened(false)} title="Nova agenda">
        <FormAcompanhante.Agenda
          acompanhanteData={acompanhanteData}
          onSuccess={() => {
            mutate()
            setOpened(false)
          }}
        />
      </Modal>
    </>
  )
}
