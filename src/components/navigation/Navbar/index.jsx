'use client'

import {
  Icon2fa,
  IconBellRinging,
  IconDatabaseImport,
  IconFingerprint,
  IconKey,
  IconLogout,
  IconReceipt2,
  IconSettings,
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { useAuth } from '@/providers/AuthProvider';

import logo from '../../../../public/logo.jpg';
import classes from './Navbar.module.css';

const menu = [
  { link: '', label: 'Notifications', icon: IconBellRinging },
  { link: '', label: 'Billing', icon: IconReceipt2 },
  { link: '', label: 'Security', icon: IconFingerprint },
  { link: '', label: 'SSH Keys', icon: IconKey },
  { link: '', label: 'Databases', icon: IconDatabaseImport },
  { link: '', label: 'Authentication', icon: Icon2fa },
  { link: '', label: 'Other Settings', icon: IconSettings },
];

export default function Navbar() {
  // Hooks
  const { isAuthenticated, isValidating, logout, userData } = useAuth()

  // States
  const [active, setActive] = useState('Billing');

  // Constants
  const menuItens = menu.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  if (!isAuthenticated && !isValidating && !userData) return null

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