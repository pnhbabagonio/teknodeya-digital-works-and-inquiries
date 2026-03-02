// components/providers.tsx
'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
    >
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E1E1E',
            color: '#F1F5F9',
            border: '1px solid rgba(255,255,255,0.05)',
          },
        }}
      />
    </ThemeProvider>
  )
}