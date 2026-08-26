export default function manifest() {
  return {
    name: 'Carruseles',
    short_name: 'Carruseles',
    description: 'Guardar, copiar y marcar como publicados los carruseles de las tres marcas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0e0e11',
    theme_color: '#0e0e11',
    orientation: 'portrait',
    icons: [
      { src: '/icon-180.png', sizes: '180x180', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
