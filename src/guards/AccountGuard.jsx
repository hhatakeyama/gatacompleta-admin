"use client"

import { Center, Loader } from "@mantine/core"
import { redirect, usePathname } from "next/navigation"
import { useEffect } from "react"

import { useAuth } from "@/providers/AuthProvider"

const publicRoutes = ['/accounts/login']

export default function guardAccount(Component) {
  return function IsAuth(props) {
    // Hooks
    const { isAuthenticated, isValidating } = useAuth()
    const pathname = usePathname()

    // Effects
    useEffect(() => {
      if (publicRoutes.indexOf(pathname) === -1 && isValidating === false && isAuthenticated === false)
        redirect(`/accounts/login?redirectCallback=${pathname}`)
    }, [isAuthenticated, isValidating, pathname])

    if (isAuthenticated === null) return <Center style={{ height: '400px' }}><Loader color="blue" /></Center>

    return <Component {...props} />
  }
}