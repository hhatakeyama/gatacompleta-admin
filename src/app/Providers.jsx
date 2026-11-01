"use client"

import { createTheme, MantineProvider, v8CssVariablesResolver } from "@mantine/core"
import { SWRConfig } from "swr"

import AuthProvider from "@/providers/AuthProvider"
import { fetcher } from "@/utils"

// Mantém o visual do Mantine 7/8: raio padrão "sm" e variante light com transparência
const theme = createTheme({ defaultRadius: "sm" })

export default function Providers({ children }) {
  return (
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      <MantineProvider
        theme={theme}
        cssVariablesResolver={v8CssVariablesResolver}
        defaultColorScheme="dark">
        <AuthProvider>{children}</AuthProvider>
      </MantineProvider>
    </SWRConfig>
  )
}
