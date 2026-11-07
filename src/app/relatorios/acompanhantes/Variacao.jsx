import { Group, Text } from "@mantine/core"
import { IconArrowDownRight, IconArrowUpRight, IconMinus } from "@tabler/icons-react"

import { variacao } from "./constantes"

// Variação em relação ao período anterior: ícone + texto (nunca só a cor).
// `inverter`: aumento é ruim (ex.: reclamações), então sobe em vermelho e cai em verde.
export default function Variacao({ atual, anterior, size = "xs", inverter = false }) {
  const percentual = variacao(atual, anterior)

  if (percentual === null) {
    return (
      <Text size={size} c="dimmed">
        {atual > 0 ? "novo" : "—"}
      </Text>
    )
  }

  const Icone = percentual > 0 ? IconArrowUpRight : percentual < 0 ? IconArrowDownRight : IconMinus
  const [corAumento, corQueda] = inverter ? ["red", "teal"] : ["teal", "red"]
  const cor = percentual > 0 ? corAumento : percentual < 0 ? corQueda : "dimmed"

  return (
    <Group gap={2} wrap="nowrap" c={cor}>
      <Icone size={14} stroke={2} />
      <Text size={size} fw={600} c={cor}>
        {percentual > 0 ? "+" : ""}
        {percentual.toFixed(0)}%
      </Text>
    </Group>
  )
}
