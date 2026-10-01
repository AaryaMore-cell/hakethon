import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nexa — Where Knowledge Becomes Action',
  description:
    'Nexa is an enterprise-grade AI platform for knowledge centralization, workflow automation, document intelligence, and decision support. Built for teams that move fast.',
  keywords: ['enterprise AI', 'knowledge management', 'workflow automation', 'document intelligence', 'Nexa'],
  openGraph: {
    title: 'Nexa — Enterprise Intelligence Platform',
    description: 'Where Knowledge Becomes Action.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}

