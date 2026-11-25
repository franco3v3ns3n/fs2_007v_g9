import axios from 'axios'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
})

export function configuracionAutorizada(accessToken, statusEsperado) {
  return {
    headers: { Authorization: `Bearer ${accessToken}` },
    validateStatus: (status) => status === statusEsperado,
  }
}
