"use client"

import { Box, Container, useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import React from "react"

import { useAuth } from "@/providers/AuthProvider"

export default function Content({ children }) {
  // Hooks
  const { isAuthenticated } = useAuth()
  const theme = useMantineTheme()
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  // Constants
  const showMenu = isAuthenticated === true && !isSm

  return (
    <Box
      style={{
        paddingBottom: "65px",
        paddingLeft: showMenu ? "300px" : "0",
        paddingTop: "95px",
        position: "absolute",
        width: "100%",
      }}>
      <Container size="xl">{children}</Container>
    </Box>
  )
}
