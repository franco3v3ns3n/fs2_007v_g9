import { configuracionAutorizada, httpClient } from '../api/httpClient'
import { normalizarCorreo } from '../utils/usuarios'

function comprobarCliente(usuario, id) {
  if (!Number.isSafeInteger(usuario?.id) || usuario.id <= 0 || usuario.rol !== 'CLIENTE'
      || (id !== undefined && usuario.id !== id)
      || !['nombre', 'apellido', 'correo', 'telefono', 'direccion'].every((campo) => typeof usuario[campo] === 'string')) {
    throw new Error('El servidor no devolvió un cliente válido.')
  }
  const { nombre, apellido, correo, telefono, direccion, rol } = usuario
  return { id: usuario.id, nombre, apellido, correo, telefono, direccion, rol }
}

function datosCliente({ nombre, apellido, correo, telefono, direccion }) {
  return {
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    correo: normalizarCorreo(correo),
    telefono: telefono.trim(),
    direccion: direccion.trim(),
  }
}

export async function listarUsuarios(accessToken, signal) {
  const { data } = await httpClient.get('/usuarios', { ...configuracionAutorizada(accessToken, 200), signal })
  if (!Array.isArray(data)) throw new Error('El servidor no devolvió un listado de clientes válido.')
  return data.map((usuario) => comprobarCliente(usuario))
}

export async function buscarUsuario(id, accessToken, signal) {
  const { data } = await httpClient.get(`/usuarios/${id}`, { ...configuracionAutorizada(accessToken, 200), signal })
  return comprobarCliente(data, id)
}

export async function crearUsuario(datos, accessToken) {
  const solicitud = { ...datosCliente(datos), password: datos.password }
  const { data } = await httpClient.post('/usuarios', solicitud, configuracionAutorizada(accessToken, 201))
  return comprobarCliente(data)
}

export async function actualizarUsuario(id, datos, accessToken) {
  const { data } = await httpClient.put(`/usuarios/${id}`, datosCliente(datos), configuracionAutorizada(accessToken, 200))
  return comprobarCliente(data, id)
}

export async function eliminarUsuario(id, accessToken) {
  await httpClient.delete(`/usuarios/${id}`, configuracionAutorizada(accessToken, 204))
}
