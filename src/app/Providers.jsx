'use client'

import { MantineProvider } from '@mantine/core'
import { SWRConfig } from 'swr'

import AuthProvider from '@/providers/AuthProvider'
import { fetcher } from '@/utils'

export default function Providers({ children }) {
  return (
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      <MantineProvider defaultColorScheme="dark">
        <AuthProvider>
          {children}
        </AuthProvider>
      </MantineProvider>
    </SWRConfig>
  )
}