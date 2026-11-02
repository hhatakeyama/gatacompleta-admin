"use client"

import { Accordion, Paper, Text, ThemeIcon, Title } from "@mantine/core"
import { IconHelpCircle } from "@tabler/icons-react"

import { ajuda } from "./ajudaConteudo"

/**
 * Bloco "Dúvidas sobre esta tela" com perguntas e respostas da seção informada.
 */
export default function Ajuda({ secao, titulo = "Dúvidas sobre esta tela" }) {
  const itens = ajuda[secao]?.itens || []

  return (
    <Paper withBorder radius="md" p="md" mt="xl">
      <Title order={5} mb="xs" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ThemeIcon variant="light" color="pink" radius="xl">
          <IconHelpCircle size={18} />
        </ThemeIcon>
        {titulo}
      </Title>
      <Accordion variant="separated" radius="md">
        {itens.map(item => (
          <Accordion.Item key={item.pergunta} value={item.pergunta}>
            <Accordion.Control>
              <Text fw={500} size="sm">
                {item.pergunta}
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="sm" style={{ whiteSpace: "pre-line" }}>
                {item.resposta}
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Paper>
  )
}
