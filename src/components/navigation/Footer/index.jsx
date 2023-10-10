'use client'

import { Anchor, Container, Group } from '@mantine/core';

import { useAuth } from '@/providers/AuthProvider';

import classes from './Footer.module.css';

const links = [
  { link: '#', label: 'Contact' },
  { link: '#', label: 'Privacy' },
  { link: '#', label: 'Blog' },
  { link: '#', label: 'Careers' },
];

export default function Footer() {
  // Hooks
  const { isLoggedIn } = useAuth()
  
  // Constants
  const items = links.map((link) => (
    <Anchor
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer} style={{ left: isLoggedIn ? '300px' : '0', width: isLoggedIn ? 'calc(100% - 300px)' : '100%' }}>
      <Container className={classes.inner} size="full">
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}