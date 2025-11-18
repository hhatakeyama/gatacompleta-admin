"use client"

import { Box, Container, Group, useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import Link from "next/link"

import { useAuth } from "@/providers/AuthProvider"

import classes from "./Footer.module.css"

const links = [{ link: "/", label: "Gata Completa" }]

export default function Footer() {
  // Hooks
  const { isAuthenticated } = useAuth()
  const theme = useMantineTheme()
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  // Constants
  const showMenu = isAuthenticated === true && !isSm

  const items = links.map(link => (
    <Link key={link.label} href={link.link} size="sm">
      {link.label}
    </Link>
  ))

  return (
    <Box className={classes.footer} pl={showMenu ? "300px" : "0"}>
      <Container className={classes.inner} size="xl">
        <Group className={classes.links}>{items}</Group>
      </Container>
    </Box>
  )
}
