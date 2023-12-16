'use client'

import { IconEyeCheck, IconFlame, IconGraph, IconLogout, IconSpeakerphone, IconTimelineEventExclamation, IconUser, IconUsers } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useAuth } from '@/providers/AuthProvider'

import logo from '../../../../public/logo.jpg'
import classes from './Navbar.module.css'

export default function Navbar() {
  // Hooks
  const { isAuthenticated, logout, permissionsData, userData } = useAuth()
  const pathname = usePathname()

  // Constants
  const { permissions } = permissionsData || {}
  const adminAccess = !!permissions?.find(perm => perm === 's' || perm === 'a') || false
  const acompanhanteAccess = !!permissions?.find(perm => perm === 'g') || false

  const menu = [
    { link: `/acompanhantes/${userData?.id}`, label: 'Perfil', icon: IconUser, visible: acompanhanteAccess },
    { link: '/acompanhantes', label: 'Acompanhantes', icon: IconFlame, visible: adminAccess },
    { link: '/anuncios', label: 'Anúncios', icon: IconSpeakerphone, visible: adminAccess },
    { link: '/usuarios', label: 'Usuários', icon: IconUsers, visible: adminAccess },
    { link: '/eventos', label: 'Eventos', icon: IconTimelineEventExclamation, visible: adminAccess },
    { link: '/mais-acessadas', label: 'Mais Acessadas', icon: IconEyeCheck, visible: adminAccess },
    { link: '/relatorios', label: 'Relatórios', icon: IconGraph, visible: adminAccess },
  ].filter(item => item.visible)
  const menuItens = menu.map((item) => (
    <a
      className={classes.link}
      data-active={pathname.indexOf(item.link) !== -1 || undefined}
      href={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ))

  if (!isAuthenticated && !userData) return null

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Link href="/" className={classes.header} justify="space-between">
          <Image alt="GataCompleta" src={logo} width="auto" height={45} />
        </Link>
        {isAuthenticated && menuItens}
      </div>
      {isAuthenticated && (
        <div className={classes.footer}>
          <a href="#" className={classes.link} onClick={(event) => {
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