import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  rewrites: async () => [
    {
      source: "/auth",
      destination: "/auth/login",
    },
  ],
}

export default nextConfig
