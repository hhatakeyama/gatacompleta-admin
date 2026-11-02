"use client"

import { ActionIcon, Group, useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import {
  IconClipboardCheck,
  IconEyeCheck,
  IconFlame,
  IconGraph,
  IconLogout,
  IconSpeakerphone,
  IconTimelineEventExclamation,
  IconUsers,
  IconX,
} from "@tabler/icons-react"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useAuth } from "@/providers/AuthProvider"

import logo from "../../../../public/logo.jpg"
import { isAreaAcompanhante } from "../areas"
import classes from "./Navbar.module.css"

export default function Navbar() {
  // Hooks
  const theme = useMantineTheme()
  const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
  const { isAdmin, isAuthenticated, logout, menuOpen, setMenuOpen, userData } = useAuth()
  const pathname = usePathname()

  // Constants
  // A acompanhante usa a área /minha-conta, com navegação própria
  const adminAccess = isAdmin

  const menu = [
    { link: "/pendencias", label: "Pendências", icon: IconClipboardCheck, visible: adminAccess },
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
  if (isAreaAcompanhante(pathname)) return null

  return (
    <nav
      className={clsx(classes.navbar, {
        [classes.navbarFull]: isXs,
        [classes.navbarClosed]: isSm && !menuOpen,
      })}>
      <div className={classes.navbarMain}>
        <Group align="center" justify="space-between" mb={15}>
          <Link href="/" style={{ display: "flex" }}>
            {/* Arquivo local (sem Cloudinary) e LCP da página: carrega sem lazy loading */}
            <Image
              alt="GataCompleta"
              src={logo}
              width="auto"
              height={45}
              loading="eager"
              unoptimized
            />
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
