import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Faceless Video Generator',
  description: 'Create viral YouTube videos with AI automation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
