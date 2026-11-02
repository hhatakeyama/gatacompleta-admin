"use client"

import { Box, Container, Group, Text, UnstyledButton } from "@mantine/core"
import {
  IconCalendar,
  IconHelpCircle,
  IconHome,
  IconPhoto,
  IconSettings,
  IconUser,
} from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import Situacao from "@/components/minhaConta/Situacao"
import useMinhaConta from "@/components/minhaConta/useMinhaConta"
import { guardAcompanhante } from "@/guards/RoleGuard"

import logo from "../../../public/logo.jpg"
import classes from "./MinhaConta.module.css"

// Telas que já mostram a situação da conta no próprio conteúdo
const telasComSituacao = ["/minha-conta", "/minha-conta/conta"]

const menu = [
  { link: "/minha-conta", label: "Início", icon: IconHome },
  { link: "/minha-conta/agenda", label: "Agenda", icon: IconCalendar },
  { link: "/minha-conta/fotos", label: "Fotos", icon: IconPhoto },
  { link: "/minha-conta/perfil", label: "Perfil", icon: IconUser },
  { link: "/minha-conta/conta", label: "Conta", icon: IconSettings },
]

/**
 * Layout da área da acompanhante: pensado para celular, com barra de navegação inferior.
 */
function MinhaContaLayout({ children }) {
  // Hooks
  const pathname = usePathname()
  const { conta, mutate } = useMinhaConta()

  // Constants
  const ativo = link =>
    link === "/minha-conta" ? pathname === link : pathname.startsWith(link)

  return (
    <>
      <header className={classes.topo}>
        <Container size={640} px="md">
          <Group justify="space-between" h={56} wrap="nowrap">
            <Link href="/minha-conta" style={{ display: "flex" }}>
              <Image alt="Gata Completa" src={logo} width="auto" height={36} unoptimized />
            </Link>
            <UnstyledButton
              component={Link}
              href="/minha-conta/ajuda"
              className={classes.ajuda}
              aria-label="Ajuda">
              <IconHelpCircle size={22} />
              <Text size="sm" fw={500}>
                Ajuda
              </Text>
            </UnstyledButton>
          </Group>
        </Container>
      </header>

      <Container size={640} px="md" className={classes.conteudo}>
        {/* Exclusão agendada bloqueia alterações: o aviso aparece em todas as telas */}
        {conta?.situacao === "exclusao_agendada" && !telasComSituacao.includes(pathname) && (
          <Box mb="md">
            <Situacao conta={conta} mutate={mutate} />
          </Box>
        )}
        {children}
      </Container>

      <nav className={classes.menu} aria-label="Menu da minha conta">
        {menu.map(item => (
          <Link
            key={item.link}
            href={item.link}
            className={classes.menuItem}
            data-active={ativo(item.link) || undefined}>
            <item.icon size={24} stroke={1.6} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}

export default guardAcompanhante(MinhaContaLayout)
