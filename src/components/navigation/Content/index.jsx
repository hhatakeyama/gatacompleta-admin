'use client'

import { Box, Container } from '@mantine/core'
import React from 'react'

import { useAuth } from '@/providers/AuthProvider'

export default function Content({ children }) {
  // Hooks
  const { isLoggedIn } = useAuth()

  return (
    <Box style={{ marginBottom: '60px', left: isLoggedIn ? '300px' : '0', width: isLoggedIn ? 'calc(100% - 300px)' : '100%', position: 'absolute' }}>
      <Container>
        {children}
      </Container>
    </Box>
  )
}
