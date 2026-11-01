import axios from "axios"

import { getCookie, removeCookie } from "@/utils"

const cookieTokenString = "gatacompleta-cms-token"
const loginPath = "/accounts/login"
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_DOMAIN}`,
})

api.interceptors.request.use(
  config => {
    const { token } = getCookie(cookieTokenString) || {}

    if (
      token &&
      config.headers &&
      !config.headers?.Authorization
    ) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error),
)

api.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    // Token inválido, expirado ou revogado: encerra a sessão local e volta para o login
    // (rotas de autenticação tratam o próprio 401)
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/authentication/") &&
      typeof window !== "undefined"
    ) {
      removeCookie(cookieTokenString)
      const { pathname } = window.location
      // Recarrega a página (e não router.push) para zerar o estado do AuthProvider e o cache do SWR
      if (pathname !== loginPath)
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = `${loginPath}?redirectCallback=${encodeURIComponent(pathname)}`
    }
    return Promise.reject(error)
  },
)

export default api
