"use client"

import { Button, Modal, Stack, Text } from "@mantine/core"
import { useState } from "react"

/**
 * Pergunta "tem certeza?" antes de ações que apagam ou escondem algo.
 */
export default function Confirmacao({
  opened,
  onClose,
  onConfirm,
  titulo,
  mensagem,
  textoConfirmar = "Sim, continuar",
  cor = "red",
  children,
}) {
  const [carregando, setCarregando] = useState(false)

  const confirmar = async () => {
    setCarregando(true)
    try {
      await onConfirm?.()
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title={titulo} centered>
      <Stack>
        {mensagem && <Text size="sm">{mensagem}</Text>}
        {children}
        <Button color={cor} size="md" fullWidth onClick={confirmar} loading={carregando}>
          {textoConfirmar}
        </Button>
        <Button variant="default" size="md" fullWidth onClick={onClose} disabled={carregando}>
          Cancelar
        </Button>
      </Stack>
    </Modal>
  )
}
