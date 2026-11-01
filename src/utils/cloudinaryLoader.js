// Loader do next/image: entrega as imagens pelo Cloudinary (image/fetch),
// que baixa a partir da URL pública e devolve redimensionada e otimizada
export default function cloudinaryLoader({ src, width, quality }) {
  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`]
  return `https://res.cloudinary.com/gatacompleta/image/fetch/${params.join(",")}/${src}`
}
