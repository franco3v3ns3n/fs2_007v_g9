import { configuracionAutorizada, httpClient } from '../api/httpClient'

export async function listarProductos(signal) {
  const response = await httpClient.get('/productos', { signal })
  return response.data
}

export async function crearProducto(datos, accessToken) {
  const response = await httpClient.post('/productos', datos, configuracionAutorizada(accessToken, 201))
  return response.data
}

export async function actualizarProducto(id, datos, accessToken) {
  const response = await httpClient.put(`/productos/${id}`, datos, configuracionAutorizada(accessToken, 200))
  return response.data
}

export async function eliminarProducto(id, accessToken) {
  await httpClient.delete(`/productos/${id}`, configuracionAutorizada(accessToken, 204))
}
