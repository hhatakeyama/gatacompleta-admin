// Áreas com layout próprio (sem o menu lateral e o cabeçalho do painel administrativo)
export const isAreaAcompanhante = pathname =>
  !!pathname && (pathname.startsWith("/minha-conta") || pathname.startsWith("/cadastro"))
