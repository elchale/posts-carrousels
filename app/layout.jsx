import './globals.css'

export const metadata = {
  title: 'Carruseles',
  description: 'Los carruseles listos de ComeHomeTag, Qolca y Propaga — guardar, copiar y publicar desde el celular.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'Carruseles', statusBarStyle: 'black-translucent' },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }, { url: '/icon-512.png', sizes: '512x512' }],
    apple: '/icon-180.png',
  },
  // Nothing here should ever end up in a search index.
  robots: { index: false, follow: false },
}

export const viewport = {
  themeColor: '#0e0e11',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
