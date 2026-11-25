import { httpClient } from '../api/httpClient'

export async function iniciarSesion({ correo, password }, signal) {
  const response = await httpClient.post('/auth/login', { correo, password }, { signal, validateStatus: (status) => status === 200 })
  return response.data
}

export async function registrarUsuario({ nombre, apellido, correo, telefono, password, confirmar }) {
  await httpClient.post('/usuarios/registro', { nombre, apellido, correo, telefono, password, confirmar }, { validateStatus: (status) => status === 201 })
}
