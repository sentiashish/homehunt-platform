/** @type {import('next').NextConfig} */
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  devIndicators: false,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
