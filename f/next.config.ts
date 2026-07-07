import type { NextConfig } from "next";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));
const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:4000";

function getLanHosts(): string[] {
  const hosts = new Set<string>(["localhost", "127.0.0.1"]);
  const nets = os.networkInterfaces();

  for (const entries of Object.values(nets)) {
    for (const net of entries ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        hosts.add(net.address);
      }
    }
  }

  return [...hosts];
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getLanHosts(),
  turbopack: {
    root: frontendRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
    localPatterns: [
      {
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/ru", destination: "/", permanent: true },
      { source: "/cyrl", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/", permanent: true },
      { source: "/ru/:path*", destination: "/", permanent: true },
      { source: "/cyrl/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
