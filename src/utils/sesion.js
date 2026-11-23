import { administradorDemo } from '../data/administradorDemo'
import { normalizarCorreo } from './usuarios'

const claveSesion = 'huertohogar-sesion-v1'

export function autenticar(tipo, valores, usuarios) {
  const correo = normalizarCorreo(valores.correo)
  if (tipo === 'administrador') {
    return correo === administradorDemo.correo && valores.password === administradorDemo.password
      ? { tipo, id: administradorDemo.correo }
      : null
  }
  if (tipo !== 'cliente') return null

  const usuario = usuarios.find((item) => normalizarCorreo(item.correo) === correo && item.password === valores.password)
  return usuario ? { tipo, id: usuario.id } : null
}

export function cargarSesion(usuarios) {
  try {
    const sesion = JSON.parse(sessionStorage.getItem(claveSesion))
    if (!sesion || typeof sesion !== 'object' || Object.keys(sesion).length !== 2) return null

    const { tipo, id } = sesion
    if (tipo === 'administrador' && id === administradorDemo.correo) return { tipo, id }
    if (tipo === 'cliente' && usuarios.some((usuario) => usuario.id === id)) return { tipo, id }
  } catch {
    // Una sesión ilegible o un almacenamiento bloqueado dejan la aplicación como visitante.
  }
  return null
}

export function guardarSesion(sesion) {
  try {
    const guardado = sessionStorage.getItem(claveSesion)
    if (sesion) {
      const serializado = JSON.stringify({ tipo: sesion.tipo, id: sesion.id })
      if (guardado !== serializado) sessionStorage.setItem(claveSesion, serializado)
    } else if (guardado !== null) {
      sessionStorage.removeItem(claveSesion)
    }
  } catch {
    // La sesión activa sigue disponible en memoria si falla el almacenamiento.
  }
}
