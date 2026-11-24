export function getErrorMessage(error) {
  const mensaje = error?.response?.data?.message
  if (typeof mensaje === 'string' && mensaje.trim()) return mensaje
  if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') return 'El servidor tardó demasiado en responder.'
  if (error?.response) return `No se pudo consultar el catálogo (HTTP ${error.response.status}).`
  return 'No se pudo conectar con el servidor del catálogo.'
}
