import { notifications } from "@mantine/notifications"

// Contato da equipe (mesmo número da página "Anuncie" do site)
export const whatsappSuporte = "5517997234485"
export const linkSuporte = (texto = "Olá, preciso de ajuda com minha conta no Gata Completa") =>
  `https://api.whatsapp.com/send?phone=${whatsappSuporte}&text=${encodeURIComponent(texto)}`

export const urlMidia = (path, nome, prefixo = "") =>
  `${process.env.NEXT_PUBLIC_API_DOMAIN}${path}/${prefixo}${nome}`

// "2026-11-02" -> "02/11/2026" (sem converter fuso horário)
export const dataBr = data => (data ? data.slice(0, 10).split("-").reverse().join("/") : "")

/**
 * Mensagem amigável para erros da API: usa a mensagem enviada pelo servidor
 * (validação, limite, conta em exclusão...) ou um texto genérico.
 */
export function mensagemErro(error, padrao = "Não foi possível concluir. Tente novamente.") {
  const { status, data } = error?.response || {}
  if (!error?.response) return "Sem conexão com a internet. Verifique sua conexão e tente novamente."
  if (status === 429) return "Muitas tentativas seguidas. Aguarde um minuto e tente de novo."
  const primeiroErro = data?.errors && Object.values(data.errors)[0]?.[0]
  return primeiroErro || data?.message || padrao
}

// Erros de validação (422) no formato do Mantine form: { campo: "mensagem" }
export function errosDoFormulario(error) {
  const errors = error?.response?.data?.errors || {}
  return Object.fromEntries(Object.entries(errors).map(([campo, msgs]) => [campo, msgs?.[0]]))
}

/**
 * Executa uma chamada à API mostrando o resultado para a acompanhante.
 * Retorna true se deu certo.
 */
export async function executar(chamada, { sucesso, erro, onErro } = {}) {
  try {
    const response = await chamada()
    notifications.show({
      color: "green",
      title: "Pronto!",
      message: sucesso || response?.data?.message || "Alteração salva.",
    })
    return true
  } catch (error) {
    notifications.show({ color: "red", title: "Ops!", message: mensagemErro(error, erro) })
    onErro?.(error)
    return false
  }
}
