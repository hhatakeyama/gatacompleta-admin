/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "",
  reactStrictMode: true,
  images: {
    unoptimized: true,
    loader: "cloudinary",
    remotePatterns: [
      { hostname: "localhost" },
      { hostname: "admin.gatacompleta.com" },
      { hostname: "dev.gatacompleta.com" },
      { hostname: "gatacompleta.com" },
    ],
    path: "https://res.cloudinary.com/gatacompleta/image/fetch/",
  },
}

module.exports = nextConfig
