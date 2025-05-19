/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      },
    ],
  },
};

export default nextConfig;
