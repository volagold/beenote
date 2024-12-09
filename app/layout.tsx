import './globals.css'
import ThemeProvider from '@utils/Theme'
import Toast from '@utils/Toaster'
import { AnalyticsWrapper } from '@utils/analytics';
import { AuthProvider } from './providers';
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BeeNote',
  description: 'Your online language learning notes',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({children}:{children: React.ReactNode}) {
  return (
    <html lang="en" data-theme="bumblebee">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <Toast/>
            {children}
            <AnalyticsWrapper />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
