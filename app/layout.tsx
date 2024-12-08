import './globals.css'
import ThemeProvider from '@utils/Theme'
import Toast from '@utils/Toaster'
import { AnalyticsWrapper } from '@utils/analytics';
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'BeeNote',
  description: 'Your online language learning notes',
  icons: {
    icon: '/logo.png'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
}

export default function RootLayout({children}:{children: React.ReactNode}) {
  return (
    <html lang="en" data-theme="bumblebee">
      <body>
        <ThemeProvider>
          <Toast/>
          {children}
          <AnalyticsWrapper />
        </ThemeProvider>
      </body>
    </html>
  )
}
