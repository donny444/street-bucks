/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_DOCKER_SERVER_URL: process.env.NEXT_PUBLIC_DOCKER_SERVER_URL,
  },
  images: {
    domains: [
      process.env.NEXT_PUBLIC_SERVER_URL.replace(/^https?:\/\//, ""),
      process.env.NEXT_PUBLIC_DOCKER_SERVER_URL.replace(/^https?:\/\//, ""),
      "localhost",
    ],
  },
  async redirects() {
    return [
      {
        source: "/menus",
        destination: "/menus/hot",
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
