// O Cloudinary (image/fetch) baixa as imagens a partir da URL pública da API,
// então não funciona quando a API roda localmente
const apiLocal = /\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(process.env.NEXT_PUBLIC_API_DOMAIN || "")

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "",
  reactStrictMode: true,
  images: {
    unoptimized: apiLocal,
    // loader: "cloudinary" só funciona no next/legacy/image; no next/image é preciso um loader próprio
    loader: "custom",
    loaderFile: "./src/utils/cloudinaryLoader.js",
  },
  allowedDevOrigins: ["127.0.0.1"],
}

module.exports = nextConfig
