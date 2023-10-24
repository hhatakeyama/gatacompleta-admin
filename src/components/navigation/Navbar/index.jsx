'use client'

import { IconFlame, IconLogout, IconSpeakerphone, IconUsers } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/providers/AuthProvider';

import logo from '../../../../public/logo.jpg';
import classes from './Navbar.module.css';

const menu = [
  { link: '/acompanhantes', label: 'Acompanhantes', icon: IconFlame },
  { link: '/anuncios', label: 'Anúncios', icon: IconSpeakerphone },
  { link: '/usuarios', label: 'Usuários', icon: IconUsers },
];

export default function Navbar() {
  // Hooks
  const { isAuthenticated, logout, userData } = useAuth()
  const pathname = usePathname();

  // Constants
  const menuItens = menu.map((item) => (
    <a
      className={classes.link}
      data-active={item.link === pathname || undefined}
      href={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

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
  );
}