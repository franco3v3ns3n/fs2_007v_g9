import { validarCorreo, validarTelefono } from './validaciones'

export function normalizarCorreo(correo) {
  return correo.trim().toLowerCase()
}

export function validarUsuario(valores, usuarios = [], idOriginal) {
  const errores = {}
  const correo = normalizarCorreo(valores.correo)
  if (!valores.nombre.trim()) errores.nombre = 'Ingresa el nombre.'
  if (!valores.apellido.trim()) errores.apellido = 'Ingresa el apellido.'
  if (!correo) errores.correo = 'Ingresa el correo electrónico.'
  else if (validarCorreo(correo)) errores.correo = 'Ingresa un correo electrónico válido.'
  else if (usuarios.some((usuario) => normalizarCorreo(usuario.correo) === correo && usuario.id !== idOriginal)) {
    errores.correo = 'Ya existe un usuario con este correo electrónico.'
  }
  if (!valores.telefono.trim()) errores.telefono = 'Ingresa el teléfono.'
  else if (validarTelefono(valores.telefono)) errores.telefono = 'Ingresa un teléfono válido de 9 dígitos.'
  if (!valores.direccion.trim()) errores.direccion = 'Ingresa la dirección.'
  return errores
}

export function generarIdUsuario(usuarios) {
  let id = 1
  while (usuarios.some((usuario) => usuario.id === id)) id += 1
  return id
}

export function esConjuntoUsuariosValido(usuarios) {
  if (!Array.isArray(usuarios)) return false
  const ids = new Set()
  const correos = new Set()
  const campos = ['id', 'nombre', 'apellido', 'correo', 'telefono', 'direccion']
  return usuarios.every((usuario) => {
    if (!usuario || typeof usuario !== 'object') return false
    if (Object.keys(usuario).length !== campos.length || !Object.keys(usuario).every((campo) => campos.includes(campo))) return false
    if (!Number.isSafeInteger(usuario.id) || usuario.id <= 0 || ids.has(usuario.id)) return false
    if (!campos.slice(1).every((campo) => typeof usuario[campo] === 'string')) return false
    if (!usuario.nombre.trim() || !usuario.apellido.trim()) return false
    const correo = normalizarCorreo(usuario.correo)
    if (validarCorreo(correo) || correos.has(correo) || validarTelefono(usuario.telefono)) return false
    ids.add(usuario.id)
    correos.add(correo)
    return true
  })
}
