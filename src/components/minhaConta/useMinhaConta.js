import { useFetch } from "@/hooks"
import { useAuth } from "@/providers/AuthProvider"

/**
 * Dados da conta da acompanhante logada (GET /api/minha-conta).
 * Todas as telas da área usam a mesma chave do SWR, então um mutate() atualiza tudo.
 */
export default function useMinhaConta() {
  const { isAuthenticated } = useAuth()
  const { data, error, mutate } = useFetch([isAuthenticated === true ? "/minha-conta" : null])

  return { conta: data, error, isLoading: !data && !error, mutate }
}
