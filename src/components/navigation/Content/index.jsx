"use client"

import { Box, Container, useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { usePathname } from "next/navigation"
import React from "react"

import { useAuth } from "@/providers/AuthProvider"

import { isAreaAcompanhante } from "../areas"

export default function Content({ children }) {
  // Hooks
  const { isAuthenticated } = useAuth()
  const theme = useMantineTheme()
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
  const pathname = usePathname()

  // Constants
  const showMenu = isAuthenticated === true && !isSm

  // Área da acompanhante e cadastro têm layout próprio
  if (isAreaAcompanhante(pathname)) return children

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
