import { httpClient } from '../api/httpClient'

export async function listarProductos(signal) {
  const response = await httpClient.get('/productos', { signal })
  return response.data
}

export async function crearProducto(datos) {
  const response = await httpClient.post('/productos', datos, { validateStatus: (status) => status === 201 })
  return response.data
}

export async function actualizarProducto(id, datos) {
  const response = await httpClient.put(`/productos/${id}`, datos, { validateStatus: (status) => status === 200 })
  return response.data
}

export async function eliminarProducto(id) {
  await httpClient.delete(`/productos/${id}`, { validateStatus: (status) => status === 204 })
}
