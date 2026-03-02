import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

export default nextConfig