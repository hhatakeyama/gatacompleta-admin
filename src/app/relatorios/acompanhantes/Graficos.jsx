import "dayjs/locale/pt-br"

import { BarChart, LineChart } from "@mantine/charts"
import { Grid, Paper, Text, Title, useComputedColorScheme } from "@mantine/core"
import dayjs from "dayjs"

import { CORES_SERIES, numero } from "./constantes"

const TOP = 10

function Cartao({ titulo, subtitulo, children }) {
  return (
    <Paper withBorder radius="md" p="md" h="100%">
      <Title order={5}>{titulo}</Title>
      {subtitulo && (
        <Text size="xs" c="dimmed" mb="md">
          {subtitulo}
        </Text>
      )}
      {children}
    </Paper>
  )
}

export default function Graficos({ serie, ranking }) {
  const esquema = useComputedColorScheme("dark")
  const cores = CORES_SERIES[esquema] || CORES_SERIES.dark
  const series = [
    { name: "whatsapp", label: "WhatsApp", color: cores.whatsapp },
    { name: "telefone", label: "Telefone", color: cores.telefone },
  ]

  const top = ranking
    .filter(item => item.total > 0)
    .slice(0, TOP)
    .map(item => ({ nome: item.nome, whatsapp: item.whatsapp, telefone: item.telefone }))

  return (
    <Grid>
      <Grid.Col span={{ base: 12, lg: 7 }}>
        <Cartao titulo="Contatos por dia" subtitulo="Cliques em WhatsApp e ligação nos perfis do site">
          <LineChart
            h={300}
            data={serie}
            dataKey="data"
            series={series}
            curveType="linear"
            strokeWidth={2}
            withDots={serie.length <= 31}
            withLegend
            legendProps={{ verticalAlign: "top", height: 40 }}
            gridAxis="y"
            valueFormatter={numero}
            xAxisProps={{ tickFormatter: valor => dayjs(valor).format("DD/MM"), minTickGap: 16 }}
            tooltipProps={{ labelFormatter: valor => dayjs(valor).locale("pt-br").format("ddd, DD/MM/YYYY") }}
          />
        </Cartao>
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 5 }}>
        <Cartao titulo={`Top ${TOP} acompanhantes`} subtitulo="Mais contatos no período">
          {top.length ? (
            <BarChart
              h={Math.max(160, top.length * 30 + 60)}
              data={top}
              dataKey="nome"
              type="stacked"
              orientation="vertical"
              series={series}
              withLegend
              legendProps={{ verticalAlign: "top", height: 40 }}
              gridAxis="x"
              barProps={{ radius: 2 }}
              valueFormatter={numero}
              yAxisProps={{ width: 110 }}
            />
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              Nenhum contato no período
            </Text>
          )}
        </Cartao>
      </Grid.Col>
    </Grid>
  )
}
