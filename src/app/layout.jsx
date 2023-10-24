import '@mantine/core/styles.css';

import { Box, ColorSchemeScript, Group, Stack } from '@mantine/core';

import Content from '@/components/navigation/Content';
import Footer from '@/components/navigation/Footer';
import Header from '@/components/navigation/Header';
import Navbar from '@/components/navigation/Navbar';

import Providers from './Providers';

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
        <Providers>
          <Stack gap={0}>
            <Group gap={0} align="top">
              <Navbar />

              <Box style={{ left: 0, paddingTop: '95px', position: 'absolute', width: '100%' }}>
                <Header />
                <Content>
                  {children}
                </Content>
                <Footer />
              </Box>
            </Group>
          </Stack>
        </Providers>
      </body>
    </html >
  );
}