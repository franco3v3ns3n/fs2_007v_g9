import { httpClient } from '../api/httpClient'

export async function listarProductos(signal) {
  const response = await httpClient.get('/productos', { signal })
  return response.data
}

export async function crearProducto(datos) {
  const response = await httpClient.post('/productos', datos, { validateStatus: (status) => status === 201 })
  return response.data
}
