import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css';

import { Notifications } from '@mantine/notifications';

import Content from '@/components/navigation/Content'
import Footer from '@/components/navigation/Footer'
import Header from '@/components/navigation/Header'
import Navbar from '@/components/navigation/Navbar'

import classes from './Global.module.css'
import Providers from './Providers'

export const metadata = {
  title: 'GataCompleta Admin',
  description: 'Painel de gerenciamento de acompanhantes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex,nofollow"></meta>
      </head>
      <body className={classes.body}>
        <Providers>
          <Notifications autoClose={10000} position="top-right" zIndex={50} />
          <Navbar />
          <Header />
          <Content>
            {children}
          </Content>
          <Footer />
        </Providers>
      </body>
    </html >
  )
}