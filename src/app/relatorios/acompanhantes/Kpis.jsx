import { Group, Paper, SimpleGrid, Text, ThemeIcon } from "@mantine/core"
import {
  IconAlertTriangle,
  IconBrandWhatsapp,
  IconFlame,
  IconPhone,
  IconPhoneCall,
  IconQuestionMark,
  IconUserCheck,
  IconUserPause,
} from "@tabler/icons-react"

import { numero } from "./constantes"
import Variacao from "./Variacao"

function Kpi({ label, valor, icone: Icone, cor = "gray", detalhe, atual, anterior }) {
  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
          {label}
        </Text>
        <ThemeIcon variant="light" color={cor} size="md" radius="md">
          <Icone size={18} stroke={1.5} />
        </ThemeIcon>
      </Group>
      <Group gap="xs" align="flex-end" mt={4}>
        <Text fw={700} fz={28} lh={1.1}>
          {valor}
        </Text>
        {anterior !== undefined && <Variacao atual={atual} anterior={anterior} />}
      </Group>
      {detalhe && (
        <Text size="xs" c="dimmed" mt={4}>
          {detalhe}
        </Text>
      )}
    </Paper>
  )
}

export default function Kpis({ acompanhantes, contatos }) {
  const { anterior } = contatos

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
      <Kpi
        label="Ativas no site"
        valor={numero(acompanhantes.ativasNoSite)}
        icone={IconFlame}
        cor="pink"
        detalhe={`de ${numero(acompanhantes.total)} cadastradas · ${numero(acompanhantes.visiveisSemAgenda)} visíveis sem agenda vigente`}
      />
      <Kpi
        label="Contatos no período"
        valor={numero(contatos.total)}
        icone={IconPhoneCall}
        atual={contatos.total}
        anterior={anterior.total}
        detalhe={`${numero(anterior.total)} no período anterior`}
      />
      <Kpi
        label="WhatsApp"
        valor={numero(contatos.whatsapp)}
        icone={IconBrandWhatsapp}
        cor="teal"
        atual={contatos.whatsapp}
        anterior={anterior.whatsapp}
        detalhe={`${numero(anterior.whatsapp)} no período anterior`}
      />
      <Kpi
        label="Telefone"
        valor={numero(contatos.telefone)}
        icone={IconPhone}
        cor="blue"
        atual={contatos.telefone}
        anterior={anterior.telefone}
        detalhe={`${numero(anterior.telefone)} no período anterior`}
      />
      <Kpi
        label="Receberam contato"
        valor={numero(acompanhantes.comContato)}
        icone={IconUserCheck}
        cor="teal"
        detalhe="acompanhantes com ao menos 1 contato"
      />
      <Kpi
        label="Ativas sem contato"
        valor={numero(acompanhantes.ativasSemContato)}
        icone={IconAlertTriangle}
        cor="orange"
        detalhe="no site, mas sem nenhum contato no período"
      />
      <Kpi
        label="Fora do site"
        valor={numero(acompanhantes.pendentes + acompanhantes.pausadas + acompanhantes.desativadas)}
        icone={IconUserPause}
        detalhe={`${numero(acompanhantes.pendentes)} pendentes · ${numero(acompanhantes.pausadas)} pausadas · ${numero(acompanhantes.desativadas)} desativadas`}
      />
      <Kpi
        label="Contatos sem perfil"
        valor={numero(contatos.semIdentificacao)}
        icone={IconQuestionMark}
        detalhe="cliques que não puderam ser ligados a uma acompanhante"
      />
    </SimpleGrid>
  )
}
