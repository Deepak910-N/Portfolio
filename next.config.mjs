/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Portfolio',
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: '/Portfolio',
  },
};

export default nextConfig;
