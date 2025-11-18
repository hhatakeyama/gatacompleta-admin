import React from "react"

export default function TipoAnuncio({ status }) {
  const tipos = {
    1: { label: "Anúncio grande home 1" },
    2: { label: "Anúncio grande home 2" },
    3: { label: "Anúncio pequeno home 1" },
    4: { label: "Anúncio pequeno home 2" },
    5: { label: "Anúncio pequeno home 3" },
  }
  return <>{tipos[status].label}</>
}
