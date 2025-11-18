"use client"

import { ActionIcon, Group, useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import {
  IconEyeCheck,
  IconFlame,
  IconGraph,
  IconLogout,
  IconSpeakerphone,
  IconTimelineEventExclamation,
  IconUser,
  IconUsers,
  IconX,
} from "@tabler/icons-react"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useAuth } from "@/providers/AuthProvider"

import logo from "../../../../public/logo.jpg"
import classes from "./Navbar.module.css"

export default function Navbar() {
  // Hooks
  const theme = useMantineTheme()
  const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
  const { isAuthenticated, logout, menuOpen, permissionsData, setMenuOpen, userData } = useAuth()
  const pathname = usePathname()

  // Constants
  const { permissions } = permissionsData || {}
  const adminAccess = !!permissions?.find(perm => perm === "s" || perm === "a") || false
  const acompanhanteAccess = !!permissions?.find(perm => perm === "g") || false

  const menu = [
    {
      link: `/acompanhantes/${userData?.id}`,
      label: "Perfil",
      icon: IconUser,
      visible: acompanhanteAccess,
    },
    { link: "/acompanhantes", label: "Acompanhantes", icon: IconFlame, visible: adminAccess },
    { link: "/anuncios", label: "Anúncios", icon: IconSpeakerphone, visible: adminAccess },
    { link: "/usuarios", label: "Usuários", icon: IconUsers, visible: adminAccess },
    {
      link: "/eventos",
      label: "Eventos",
      icon: IconTimelineEventExclamation,
      visible: adminAccess,
    },
    { link: "/mais-acessadas", label: "Mais Acessadas", icon: IconEyeCheck, visible: adminAccess },
    { link: "/relatorios", label: "Relatórios", icon: IconGraph, visible: adminAccess },
  ].filter(item => item.visible)
  const menuItens = menu.map(item => (
    <Link
      className={classes.link}
      data-active={pathname.indexOf(item.link) !== -1 || undefined}
      href={item.link}
      key={item.label}
      onClick={() => setMenuOpen(false)}>
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ))

  if (!isAuthenticated && !userData) return null

  return (
    <nav
      className={clsx(classes.navbar, {
        [classes.navbarFull]: isXs,
        [classes.navbarClosed]: isSm && !menuOpen,
      })}>
      <div className={classes.navbarMain}>
        <Group align="center" justify="space-between" mb={15}>
          <Link href="/" style={{ display: "flex" }}>
            <Image alt="GataCompleta" src={logo} width="auto" height={45} />
          </Link>

          {isSm && (
            <ActionIcon
              variant="transparent"
              color="white"
              size="lg"
              onClick={() => setMenuOpen(false)}>
              <IconX size={30} />
            </ActionIcon>
          )}
        </Group>
        {isAuthenticated && menuItens}
      </div>
      {isAuthenticated && (
        <div className={classes.footer}>
          <a
            href="#"
            className={classes.link}
            onClick={event => {
              event.preventDefault()
              logout?.()
            }}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </a>
        </div>
      )}
    </nav>
  )
}
