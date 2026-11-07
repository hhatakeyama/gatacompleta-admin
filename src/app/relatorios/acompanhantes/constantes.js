// Cores das séries (validadas para daltonismo nos temas claro e escuro)
export const CORES_SERIES = {
  light: { whatsapp: "#1baf7a", telefone: "#2a78d6" },
  dark: { whatsapp: "#199e70", telefone: "#3987e5" },
}

export const SITUACOES = {
  ativa: { label: "Ativa", color: "teal" },
  pendente: { label: "Aguardando aprovação", color: "yellow" },
  pausada: { label: "Pausada", color: "gray" },
  desativada: { label: "Desativada", color: "red" },
  exclusao_agendada: { label: "Exclusão agendada", color: "red" },
}

export const numero = valor => new Intl.NumberFormat("pt-BR").format(valor || 0)

// Variação percentual em relação ao período anterior (null quando não há base de comparação)
export const variacao = (atual, anterior) => {
  if (!anterior) return null
  return ((atual - anterior) / anterior) * 100
}
