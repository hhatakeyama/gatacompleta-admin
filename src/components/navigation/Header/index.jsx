"use client"

import {
  Avatar,
  Box,
  Burger,
  Button,
  Container,
  Group,
  Menu,
  rem,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconChevronDown, IconLogout, IconUser } from "@tabler/icons-react"
import cx from "clsx"
import Link from "next/link"
import { useState } from "react"

import { useAuth } from "@/providers/AuthProvider"

import classes from "./Header.module.css"

export default function Header() {
  // Hooks
  const { isAuthenticated, logout, menuOpen, userData, setMenuOpen } = useAuth()
  const theme = useMantineTheme()
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  // Constants
  const showMenu = isAuthenticated === true && !isSm

  // States
  const [userMenuOpened, setUserMenuOpened] = useState(false)

  return (
    <Box className={classes.header} pl={showMenu ? "300px" : "0"}>
      <Container size="xl">
        <Group justify="space-between" h={60}>
          <Box>
            <Burger
              opened={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              hiddenFrom="sm"
              size="sm"
            />
          </Box>

          {userData ? (
            <Menu
              width={260}
              position="bottom-end"
              transitionProps={{ transition: "pop-top-right" }}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              withinPortal
              styles={{ dropdown: { zIndex: 1001 } }}>
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
                  <Group gap={7}>
                    <Avatar src={userData?.image} alt={userData?.name} radius="xl" size={20} />
                    <Text fw={500} size="sm" lh={1} mr={3}>
                      {userData?.name}
                    </Text>
                    <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconUser style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                  component={Link}
                  href="/accounts/perfil">
                  Perfil
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={
                    <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                  onClick={event => {
                    event.preventDefault()
                    logout?.()
                  }}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Group visibleFrom="sm">
              <Button component={Link} href="/accounts/login" variant="default">
                Login
              </Button>
            </Group>
          )}
        </Group>
      </Container>
    </Box>
  )
}
