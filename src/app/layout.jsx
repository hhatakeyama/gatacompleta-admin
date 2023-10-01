import '@mantine/core/styles.css';

import { Box, ColorSchemeScript, Container, Group, MantineProvider, Stack } from '@mantine/core';

import Footer from '@/components/navigation/Footer';
import Header from '@/components/navigation/Header';
import Navbar from '@/components/navigation/Navbar';
import AuthProvider from '@/providers/AuthProvider';

export const metadata = {
  title: 'GataCompleta Admin',
  description: 'Painel de gerenciamento de acompanhantes',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <AuthProvider>
            <Stack gap={0}>
              <Group gap={0} align="top">
                <Navbar />

                <Box style={{ left: '300px', paddingTop: '95px', position: 'absolute', width: 'calc(100% - 300px)' }}>
                  <Header />
                  <Container style={{ marginBottom: '60px' }}>
                    {children}
                  </Container>
                  <Footer />
                </Box>
              </Group>
            </Stack>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}