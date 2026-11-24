import { httpClient } from '../api/httpClient'

export async function listarProductos(signal) {
  const response = await httpClient.get('/productos', { signal })
  return response.data
}
