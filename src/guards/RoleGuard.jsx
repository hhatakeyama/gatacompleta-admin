"use client"

import { Button, Center, Loader, Stack, Text } from "@mantine/core"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { useAuth } from "@/providers/AuthProvider"

import guardAccount from "./AccountGuard"

// Página inicial de cada papel
export const homeAdmin = "/"
export const homeAcompanhante = "/minha-conta"

/**
 * Libera a página só para o papel informado ("admin" ou "acompanhante") e manda os demais
 * para a área deles. A segurança de verdade está na API (rotas /admin e /minha-conta separadas);
 * aqui é para ninguém ver telas que não são para o seu tipo de conta.
 */
function guardRole(Component, role) {
  function HasRole(props) {
    // Hooks
    const { isAdmin, isAcompanhante, logout, userData } = useAuth()
    const router = useRouter()

    // Constants
    const allowed = role === "admin" ? isAdmin : isAcompanhante
    const destination = isAdmin ? homeAdmin : isAcompanhante ? homeAcompanhante : null

    // Effects
    useEffect(() => {
      if (userData && !allowed && destination) router.replace(destination)
    }, [allowed, destination, router, userData])

    if (userData && !allowed && !destination)
      return (
        <Center style={{ height: "400px" }}>
          <Stack align="center">
            <Text>Sua conta não tem acesso a este painel.</Text>
            <Button onClick={() => logout?.()}>Sair</Button>
          </Stack>
        </Center>
      )

    if (!userData || !allowed)
      return (
        <Center style={{ height: "400px" }}>
          <Loader color="pink" />
        </Center>
      )

    return <Component {...props} />
  }

  return guardAccount(HasRole)
}

export const guardAdmin = Component => guardRole(Component, "admin")

export const guardAcompanhante = Component => guardRole(Component, "acompanhante")
