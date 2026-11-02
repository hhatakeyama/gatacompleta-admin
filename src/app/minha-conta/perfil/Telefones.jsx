"use client"

import { Button, Card, Group, InputBase, Paper, Stack, Switch, Text, Title } from "@mantine/core"
import { IconBrandWhatsapp, IconPhonePlus, IconTrash } from "@tabler/icons-react"
import { useState } from "react"
import { IMaskInput } from "react-imask"

import { executar } from "@/components/minhaConta/acoes"
import Confirmacao from "@/components/minhaConta/Confirmacao"
import { api } from "@/utils"

function FormTelefone({ telefone, onSuccess, onCancel }) {
  // States
  const [numero, setNumero] = useState(telefone?.numero || "")
  const [whatsapp, setWhatsapp] = useState(telefone ? telefone.whatsapp : true)
  const [enviando, setEnviando] = useState(false)

  // Constants
  const valido = numero.replace(/\D/g, "").length >= 10

  // Actions
  const salvar = async () => {
    setEnviando(true)
    const dados = { numero, whatsapp }
    const ok = await executar(() =>
      telefone
        ? api.patch(`/api/minha-conta/telefones/${telefone.id}`, dados)
        : api.post("/api/minha-conta/telefones", dados),
    )
    setEnviando(false)
    if (ok) onSuccess?.()
  }

  return (
    <Stack gap="sm">
      <InputBase
        label="Telefone com DDD"
        placeholder="(11) 999999999"
        type="tel"
        size="md"
        component={IMaskInput}
        mask="(00) 000000000"
        value={numero}
        onAccept={value => setNumero(value)}
      />
      <Switch
        size="md"
        label="Este número tem WhatsApp"
        checked={whatsapp}
        onChange={event => setWhatsapp(event.currentTarget.checked)}
      />
      <Group grow>
        {onCancel && (
          <Button variant="default" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button color="pink" onClick={salvar} loading={enviando} disabled={!valido}>
          Salvar telefone
        </Button>
      </Group>
    </Stack>
  )
}

export default function Telefones({ conta, mutate }) {
  // States
  const [editando, setEditando] = useState(null) // "novo" ou id do telefone
  const [removendo, setRemovendo] = useState(null)

  // Constants
  const telefones = conta?.telefones || []
  const noLimite = telefones.length >= conta?.limites?.telefones

  // Actions
  const remover = async () => {
    if (await executar(() => api.delete(`/api/minha-conta/telefones/${removendo.id}`))) {
      setRemovendo(null)
      mutate()
    }
  }

  const concluir = () => {
    setEditando(null)
    mutate()
  }

  return (
    <Paper withBorder radius="md" p="md">
      <Title order={4}>Telefones</Title>
      <Text size="sm" c="dimmed" mb="sm">
        O primeiro telefone é o que aparece no botão de contato do site.
      </Text>

      <Stack>
        {telefones.map((telefone, posicao) => (
          <Card key={telefone.id} withBorder radius="md" p="sm">
            {editando === telefone.id ? (
              <FormTelefone telefone={telefone} onSuccess={concluir} onCancel={() => setEditando(null)} />
            ) : (
              <Group justify="space-between" wrap="nowrap">
                <div>
                  <Text fw={600}>{telefone.numero}</Text>
                  <Group gap={4}>
                    {telefone.whatsapp && <IconBrandWhatsapp size={16} color="#40c057" />}
                    <Text size="xs" c="dimmed">
                      {telefone.whatsapp ? "WhatsApp" : "Só ligação"}
                      {posicao === 0 ? " · aparece no site" : ""}
                    </Text>
                  </Group>
                </div>
                <Group gap="xs" wrap="nowrap">
                  <Button size="sm" variant="default" onClick={() => setEditando(telefone.id)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="red"
                    aria-label="Remover telefone"
                    onClick={() => setRemovendo(telefone)}>
                    <IconTrash size={18} />
                  </Button>
                </Group>
              </Group>
            )}
          </Card>
        ))}

        {editando === "novo" ? (
          <Card withBorder radius="md" p="sm">
            <FormTelefone onSuccess={concluir} onCancel={() => setEditando(null)} />
          </Card>
        ) : (
          !noLimite && (
            <Button
              variant="light"
              color="pink"
              size="md"
              leftSection={<IconPhonePlus />}
              onClick={() => setEditando("novo")}
              fullWidth>
              Adicionar telefone
            </Button>
          )
        )}
      </Stack>

      <Confirmacao
        opened={!!removendo}
        onClose={() => setRemovendo(null)}
        onConfirm={remover}
        titulo="Remover telefone"
        mensagem={`Remover o telefone ${removendo?.numero}?`}
        textoConfirmar="Sim, remover"
      />
    </Paper>
  )
}
