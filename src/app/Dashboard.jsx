'use client'

import { Box, Group, Paper, RingProgress, SimpleGrid, Text } from '@mantine/core'

export default function Dashboard({ dashboardData }) {
  // Constants
  const { ativas, expirando, inativas } = dashboardData || {}
  const total = ativas + expirando + inativas
  const data = [
    { label: 'Ativas', stats: ativas, progress: ativas * 100 / total, color: 'teal' },
    { label: 'Expirando', stats: expirando, progress: expirando * 100 / total, color: 'orange' },
    { label: 'Inativas', stats: inativas, progress: inativas * 100 / total, color: 'red' },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }}>
      {data.map(stat => {
        return (
          <Paper withBorder radius="md" p="xs" key={stat.label}>
            <Group>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: stat.progress, color: stat.color }]}
              />

              <Box>
                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                  {stat.label}
                </Text>
                <Text fw={700} size="xl">
                  {stat.stats}
                </Text>
              </Box>
            </Group>
          </Paper>
        );
      })}
    </SimpleGrid>
  )
}
