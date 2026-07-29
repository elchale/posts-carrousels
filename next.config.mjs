/** @type {import('next').NextConfig} */
const nextConfig = {
  // Slides are served straight from public/ as pre-sized derivatives, so the image
  // optimizer would only add a quota and a cache layer we don't need.
  images: { unoptimized: true },
  // No basePath and no absolute URLs anywhere: the app works on localhost, on the
  // vercel.app subdomain and on any custom domain without a rebuild.
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Slide files are immutable — a re-render writes a new deployment.
        source: '/:kind(posts|preview|thumb)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default nextConfig
