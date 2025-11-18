"use client"

import { redirect, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { FormLogin } from "@/components/forms"
import guardAccount from "@/guards/AccountGuard"
import { useAuth } from "@/providers/AuthProvider"

function Login() {
  // Hooks
  const { isAuthenticated, login } = useAuth()
  const pathname = usePathname()
  const search = useSearchParams()

  // States
  const [forgotPassword, setForgotPassword] = useState(false)

  // Constants
  const redirectCallback = search.get("redirectCallback")

  useEffect(() => {
    if (isAuthenticated === true) {
      if (redirectCallback) redirect(redirectCallback)
      redirect("/")
    }
  }, [isAuthenticated, pathname, redirectCallback, search])

  return (
    <>
      {forgotPassword ? (
        <FormLogin.ForgotPassword onBack={() => setForgotPassword(false)} onSubmit={login} />
      ) : (
        <FormLogin.Basic onForgotPassword={() => setForgotPassword(true)} onSubmit={login} />
      )}
    </>
  )
}

export default guardAccount(Login)
