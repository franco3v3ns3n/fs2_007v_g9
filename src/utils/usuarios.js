import { validarCorreo, validarPassword, validarTelefono } from './validaciones'

export function normalizarCorreo(correo) {
  return correo.trim().toLowerCase()
}

export function validarUsuario(valores, { editar = false, registroPublico = false } = {}) {
  const errores = {}
  const correo = normalizarCorreo(valores.correo)
  if (!valores.nombre.trim()) errores.nombre = 'Ingresa el nombre.'
  if (!valores.apellido.trim()) errores.apellido = 'Ingresa el apellido.'
  if (!correo) errores.correo = 'Ingresa el correo electrónico.'
  else if (validarCorreo(correo)) errores.correo = 'Ingresa un correo electrónico válido.'
  if (!valores.telefono.trim()) errores.telefono = 'Ingresa el teléfono.'
  else if (validarTelefono(valores.telefono)) errores.telefono = 'Ingresa un teléfono válido de 9 dígitos.'
  if (!editar) {
    if (!registroPublico && !valores.direccion.trim()) errores.direccion = 'Ingresa la dirección.'
    const errorPassword = typeof valores.password === 'string' && valores.password !== ''
      ? validarPassword(valores.password)
      : 'Ingresa la contraseña.'
    if (errorPassword) errores.password = errorPassword
  }
  if (registroPublico) {
    if (!valores.confirmar) errores.confirmar = 'Confirma tu contraseña.'
    else if (valores.confirmar !== valores.password) errores.confirmar = 'Las contraseñas no coinciden.'
  }
  return errores
}
