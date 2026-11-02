import { Badge, Group } from "@mantine/core"
import React from "react"

const situacoes = {
  pendente: { label: "Aguardando aprovação", color: "yellow" },
  pausada: { label: "Pausada por ela", color: "gray" },
  exclusao_agendada: { label: "Exclusão agendada", color: "red" },
}

/**
 * Situação do autoatendimento (cadastro pendente, pausa, exclusão) e mídias aguardando aprovação.
 * "ativa" e "desativada" já aparecem no badge de status (Active).
 */
export default function Situacao({ situacao, fotosPendentes = 0, videosPendentes = 0 }) {
  const item = situacoes[situacao]
  if (!item && !fotosPendentes && !videosPendentes) return null

  return (
    <Group gap={4}>
      {item && (
        <Badge size="sm" color={item.color}>
          {item.label}
        </Badge>
      )}
      {fotosPendentes > 0 && (
        <Badge size="sm" color="yellow" variant="light">
          {fotosPendentes} foto(s) para aprovar
        </Badge>
      )}
      {videosPendentes > 0 && (
        <Badge size="sm" color="yellow" variant="light">
          {videosPendentes} vídeo(s) para aprovar
        </Badge>
      )}
    </Group>
  )
}
