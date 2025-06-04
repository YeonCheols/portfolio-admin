/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ycseng.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'ywlmykjlvcpfabodffof.supabase.co',
        pathname: '/storage/v1/object/public/portfolio-img/main/**',
      },
    ],
  },
};

export default nextConfig;
